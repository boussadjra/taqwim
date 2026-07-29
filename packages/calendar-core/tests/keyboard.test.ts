import { describe, it, expect, vi } from 'vitest'
import { getDayInWeek } from '@taqwim/core'
import { createCalendar } from '../src/store'
import type { CalendarOptions, WeekStartsOn } from '../src/types'

const MID_MONTH = { hy: 1446, hm: 3, hd: 15 }

// `defaultPlaceholder` (uncontrolled) so the store owns the visible month;
// with a controlled `placeholder` the adapter would have to push it back.
function calendarFocusedAt(date = MID_MONTH, options: CalendarOptions = {}) {
  const store = createCalendar({ defaultPlaceholder: date, ...options })
  store.focusDate(date)
  return store
}

const press = (key: string, shiftKey = false) => ({ key, shiftKey })

/**
 * Roving-focus keyboard navigation. None of this existed previously:
 * `initialFocus` resolved to a TODO and no arrow handling was implemented,
 * so the calendar could not be operated without a mouse.
 */
describe('keyboard navigation', () => {
  describe('arrow keys', () => {
    it('moves one day with Left/Right in LTR', () => {
      const store = calendarFocusedAt()

      store.handleKeydown(press('ArrowRight'))
      expect(store.getSnapshot().focusedDate).toEqual({ hy: 1446, hm: 3, hd: 16 })

      store.handleKeydown(press('ArrowLeft'))
      expect(store.getSnapshot().focusedDate).toEqual(MID_MONTH)
    })

    it('mirrors Left/Right in RTL', () => {
      // Arabic is the library's primary locale, so this must be mirrored.
      const store = calendarFocusedAt(MID_MONTH, { dir: 'rtl' })

      store.handleKeydown(press('ArrowRight'))
      expect(store.getSnapshot().focusedDate).toEqual({ hy: 1446, hm: 3, hd: 14 })

      store.handleKeydown(press('ArrowLeft'))
      expect(store.getSnapshot().focusedDate).toEqual(MID_MONTH)
    })

    it('moves one week with Up/Down', () => {
      const store = calendarFocusedAt()

      store.handleKeydown(press('ArrowDown'))
      expect(store.getSnapshot().focusedDate).toEqual({ hy: 1446, hm: 3, hd: 22 })

      store.handleKeydown(press('ArrowUp'))
      expect(store.getSnapshot().focusedDate).toEqual(MID_MONTH)
    })

    it('does not mirror Up/Down in RTL', () => {
      const store = calendarFocusedAt(MID_MONTH, { dir: 'rtl' })

      store.handleKeydown(press('ArrowDown'))
      expect(store.getSnapshot().focusedDate).toEqual({ hy: 1446, hm: 3, hd: 22 })
    })
  })

  describe('Home and End', () => {
    it.each([0, 1, 5, 6] as WeekStartsOn[])('moves to the week edges for weekStartsOn=%i', weekStartsOn => {
      const store = calendarFocusedAt(MID_MONTH, { weekStartsOn })

      store.handleKeydown(press('Home'))
      expect(getDayInWeek(store.getSnapshot().focusedDate!)).toBe(weekStartsOn)

      store.handleKeydown(press('End'))
      expect(getDayInWeek(store.getSnapshot().focusedDate!)).toBe((weekStartsOn + 6) % 7)
    })
  })

  describe('paging keys', () => {
    it('moves a month with PageUp/PageDown', () => {
      const store = calendarFocusedAt()

      store.handleKeydown(press('PageDown'))
      expect(store.getSnapshot().focusedDate).toMatchObject({ hy: 1446, hm: 4 })

      store.handleKeydown(press('PageUp'))
      expect(store.getSnapshot().focusedDate).toMatchObject({ hy: 1446, hm: 3 })
    })

    it('moves a year with Shift+PageUp/PageDown', () => {
      const store = calendarFocusedAt()

      store.handleKeydown(press('PageDown', true))
      expect(store.getSnapshot().focusedDate).toMatchObject({ hy: 1447, hm: 3 })

      store.handleKeydown(press('PageUp', true))
      expect(store.getSnapshot().focusedDate).toMatchObject({ hy: 1446, hm: 3 })
    })

    it('scrolls the visible month to follow the focus', () => {
      const store = calendarFocusedAt()
      expect(store.getSnapshot().placeholder.hm).toBe(3)

      store.handleKeydown(press('PageDown'))
      expect(store.getSnapshot().placeholder.hm).toBe(4)
    })

    it('pages when arrowing off the end of the visible month', () => {
      const store = calendarFocusedAt({ hy: 1446, hm: 3, hd: 1 })

      store.handleKeydown(press('ArrowLeft'))

      const state = store.getSnapshot()
      expect(state.focusedDate!.hm).toBe(2)
      expect(state.placeholder.hm).toBe(2)
    })
  })

  describe('selection keys', () => {
    it.each(['Enter', ' '])('selects the focused date with %s', key => {
      const onValueChange = vi.fn()
      const store = calendarFocusedAt(MID_MONTH, { onValueChange })

      store.handleKeydown(press(key))

      expect(onValueChange).toHaveBeenCalledWith(MID_MONTH)
      expect(store.getSnapshot().value).toEqual(MID_MONTH)
    })

    it('does nothing when no date has focus', () => {
      const onValueChange = vi.fn()
      const store = createCalendar({ placeholder: MID_MONTH, onValueChange })

      store.handleKeydown(press('Enter'))

      expect(onValueChange).not.toHaveBeenCalled()
    })
  })

  it('reports whether it consumed the event, so adapters know when to preventDefault', () => {
    const store = calendarFocusedAt()

    expect(store.handleKeydown(press('ArrowLeft'))).toBe(true)
    expect(store.handleKeydown(press('a'))).toBe(false)
    expect(store.handleKeydown(press('Tab'))).toBe(false)
  })

  it('ignores keys entirely when disabled', () => {
    const store = calendarFocusedAt(MID_MONTH, { disabled: true })

    expect(store.handleKeydown(press('ArrowRight'))).toBe(false)
    expect(store.getSnapshot().focusedDate).toEqual(MID_MONTH)
  })

  it('will not move focus past minValue or maxValue', () => {
    const store = calendarFocusedAt(MID_MONTH, { minValue: { hy: 1446, hm: 3, hd: 15 } })

    store.handleKeydown(press('ArrowLeft'))
    expect(store.getSnapshot().focusedDate).toEqual(MID_MONTH)
  })

  describe('focusInitial', () => {
    it('prefers the selected date', () => {
      const selected = { hy: 1446, hm: 3, hd: 7 }
      const store = createCalendar({ placeholder: MID_MONTH, value: selected })

      store.focusInitial()
      expect(store.getSnapshot().focusedDate).toEqual(selected)
    })

    it('falls back to the first of the visible month when today is elsewhere', () => {
      const store = createCalendar({ placeholder: { hy: 1400, hm: 5, hd: 1 } })

      store.focusInitial()
      expect(store.getSnapshot().focusedDate).toEqual({ hy: 1400, hm: 5, hd: 1 })
    })
  })

  describe('controlled vs uncontrolled placeholder', () => {
    it('moves the visible month itself when uncontrolled', () => {
      const store = createCalendar({ defaultPlaceholder: MID_MONTH })
      store.focusDate(MID_MONTH)

      store.handleKeydown(press('PageDown'))
      expect(store.getSnapshot().placeholder.hm).toBe(4)
    })

    it('defers to the caller when controlled, but still reports the change', () => {
      const onPlaceholderChange = vi.fn()
      const store = createCalendar({ placeholder: MID_MONTH, onPlaceholderChange })
      store.focusDate(MID_MONTH)

      store.handleKeydown(press('PageDown'))

      // The controlled value wins until the caller pushes a new one back.
      expect(store.getSnapshot().placeholder.hm).toBe(3)
      expect(onPlaceholderChange).toHaveBeenCalledWith({ hy: 1446, hm: 4, hd: 1 })

      store.setOptions({ placeholder: { hy: 1446, hm: 4, hd: 1 } })
      expect(store.getSnapshot().placeholder.hm).toBe(4)
    })
  })

  it('notifies the adapter so it can move DOM focus', () => {
    const onFocusedDateChange = vi.fn()
    const store = calendarFocusedAt(MID_MONTH, { onFocusedDateChange })

    store.handleKeydown(press('ArrowRight'))

    expect(onFocusedDateChange).toHaveBeenLastCalledWith({ hy: 1446, hm: 3, hd: 16 })
  })
})
