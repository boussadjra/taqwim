import type { HijriDateObject } from '@taqwim/core'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createCalendar } from '../src/store'
import type { CalendarState } from '../src/types'

const RAMADAN_1445: HijriDateObject = { hy: 1445, hm: 9, hd: 1 }

const days = (state: CalendarState) => state.months.flatMap(month => month.weeks.flat())
const tabbable = (state: CalendarState) => days(state).filter(day => day.isTabbable)

/** What an adapter would actually render, so the assertion matches the DOM. */
function tabStops(state: CalendarState, store: ReturnType<typeof createCalendar>) {
  return days(state).filter(day => store.getCellTriggerProps(day).tabindex === 0)
}

beforeEach(() => {
  vi.useFakeTimers()
  // Inside Ramadan 1445, so "today" is a live candidate for the tab stop.
  vi.setSystemTime(new Date(2024, 2, 20))
})

describe('roving tabindex', () => {
  /*
   * The tab stop used to be tied to `isFocused`, which is undefined until the
   * calendar is first focused — so every cell rendered `tabindex="-1"` and a
   * keyboard user could not reach the grid at all.
   */
  it('leaves exactly one tab stop before anything is focused', () => {
    const store = createCalendar({ defaultPlaceholder: RAMADAN_1445 })
    const state = store.getSnapshot()

    expect(state.focusedDate).toBeUndefined()
    expect(tabbable(state)).toHaveLength(1)
    expect(tabStops(state, store)).toHaveLength(1)
  })

  it('keeps exactly one tab stop once focus moves', () => {
    const store = createCalendar({ defaultPlaceholder: RAMADAN_1445 })
    store.focusInitial()
    store.handleKeydown({ key: 'ArrowRight', shiftKey: false })

    expect(tabbable(store.getSnapshot())).toHaveLength(1)
  })

  it('follows the focused date once there is one', () => {
    const store = createCalendar({ defaultPlaceholder: RAMADAN_1445 })
    store.focusDate({ hy: 1445, hm: 9, hd: 17 })

    expect(tabbable(store.getSnapshot())[0].date.hd).toBe(17)
  })

  it('prefers the selected date', () => {
    const store = createCalendar({
      defaultPlaceholder: RAMADAN_1445,
      defaultValue: { hy: 1445, hm: 9, hd: 12 },
    })

    expect(tabbable(store.getSnapshot())[0].date.hd).toBe(12)
  })

  it('falls back to today when nothing is selected', () => {
    const store = createCalendar({ defaultPlaceholder: RAMADAN_1445 })
    const stop = tabbable(store.getSnapshot())[0]

    expect(stop.isToday).toBe(true)
  })

  it('falls back to the first of the month when today is not in view', () => {
    const store = createCalendar({ defaultPlaceholder: { hy: 1440, hm: 5, hd: 1 } })

    expect(tabbable(store.getSnapshot())[0].date.hd).toBe(1)
  })

  it('skips disabled days so the grid stays reachable', () => {
    // minValue lands mid-month, so the first of the month cannot be the stop.
    const store = createCalendar({
      defaultPlaceholder: RAMADAN_1445,
      minValue: { hy: 1445, hm: 9, hd: 11 },
      maxValue: { hy: 1445, hm: 9, hd: 20 },
    })
    const state = store.getSnapshot()
    const stop = tabbable(state)[0]

    expect(stop).toBeDefined()
    expect(stop.isDisabled).toBe(false)
    expect(tabStops(state, store)).toHaveLength(1)
  })

  it('never puts the tab stop on an adjacent day', () => {
    const store = createCalendar({ defaultPlaceholder: RAMADAN_1445, fixedWeeks: true })

    expect(tabbable(store.getSnapshot())[0].isOutsideMonth).toBe(false)
  })

  it('keeps a single tab stop across several months', () => {
    const store = createCalendar({ defaultPlaceholder: RAMADAN_1445, numberOfMonths: 3 })

    expect(tabbable(store.getSnapshot())).toHaveLength(1)
  })
})
