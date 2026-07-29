import { describe, it, expect, vi } from 'vitest'
import { createCalendar } from '../src/store'

const DAY = { hy: 1446, hm: 3, hd: 10 }

describe('store contract', () => {
  it('returns a stable snapshot reference between changes', () => {
    // Required by React's useSyncExternalStore and the Solid/Svelte equivalents:
    // a fresh object each call would loop forever.
    const store = createCalendar({ defaultPlaceholder: DAY })

    expect(store.getSnapshot()).toBe(store.getSnapshot())
  })

  it('produces a new snapshot after a change', () => {
    const store = createCalendar({ defaultPlaceholder: DAY })
    const before = store.getSnapshot()

    store.select(DAY)

    expect(store.getSnapshot()).not.toBe(before)
  })

  it('notifies subscribers on change', () => {
    const store = createCalendar({ defaultPlaceholder: DAY })
    const listener = vi.fn()
    store.subscribe(listener)

    store.select(DAY)

    expect(listener).toHaveBeenCalled()
  })

  it('stops notifying after unsubscribe', () => {
    const store = createCalendar({ defaultPlaceholder: DAY })
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)

    unsubscribe()
    store.select(DAY)

    expect(listener).not.toHaveBeenCalled()
  })

  it('rebuilds when options change', () => {
    const store = createCalendar({ defaultPlaceholder: DAY, locale: 'en' })
    const englishHeading = store.getSnapshot().headingValue

    store.setOptions({ locale: 'ar' })

    expect(store.getSnapshot().headingValue).not.toBe(englishHeading)
  })
})

describe('paging', () => {
  it('moves one month at a time by default', () => {
    const store = createCalendar({ defaultPlaceholder: DAY })

    store.nextPage()
    expect(store.getSnapshot().placeholder.hm).toBe(4)

    store.prevPage()
    expect(store.getSnapshot().placeholder.hm).toBe(3)
  })

  it('moves by numberOfMonths when pagedNavigation is set', () => {
    const store = createCalendar({ defaultPlaceholder: DAY, numberOfMonths: 3, pagedNavigation: true })

    store.nextPage()
    expect(store.getSnapshot().placeholder.hm).toBe(6)
  })

  it('still moves one month when pagedNavigation is off', () => {
    const store = createCalendar({ defaultPlaceholder: DAY, numberOfMonths: 3 })

    store.nextPage()
    expect(store.getSnapshot().placeholder.hm).toBe(4)
  })

  it('disables the buttons at the min/max bounds', () => {
    const store = createCalendar({
      defaultPlaceholder: DAY,
      minValue: { hy: 1446, hm: 3, hd: 1 },
      maxValue: { hy: 1446, hm: 3, hd: 30 },
    })
    const state = store.getSnapshot()

    expect(state.isPrevDisabled).toBe(true)
    expect(state.isNextDisabled).toBe(true)
  })

  it('honours custom paging functions', () => {
    const store = createCalendar({
      defaultPlaceholder: DAY,
      nextPage: date => ({ ...date, hy: date.hy + 1 }),
    })

    store.nextPage()
    expect(store.getSnapshot().placeholder.hy).toBe(1447)
  })

  it('refuses to page when disabled', () => {
    const store = createCalendar({ defaultPlaceholder: DAY, disabled: true })

    store.nextPage()
    expect(store.getSnapshot().placeholder.hm).toBe(3)
  })
})

describe('accessibility props', () => {
  it('describes the root', () => {
    const props = createCalendar({ defaultPlaceholder: DAY }).getRootProps()

    expect(props.role).toBe('application')
    expect(props['aria-label']).toContain('Calendar for')
    expect(props.dir).toBe('ltr')
  })

  it('flags disabled, readonly and invalid state on the root', () => {
    const props = createCalendar({
      defaultPlaceholder: DAY,
      disabled: true,
      readonly: true,
      value: { hy: 1446, hm: 1, hd: 1 },
      minValue: DAY,
    }).getRootProps()

    expect(props['data-disabled']).toBe('')
    expect(props['data-readonly']).toBe('')
    expect(props['data-invalid']).toBe('')
  })

  it('uses a custom calendar label when given', () => {
    const props = createCalendar({ defaultPlaceholder: DAY, calendarLabel: 'Booking dates' }).getRootProps()

    expect(props['aria-label']).toBe('Booking dates')
  })

  it('describes a grid', () => {
    const store = createCalendar({ defaultPlaceholder: DAY })
    const props = store.getGridProps(store.getSnapshot().months[0])

    expect(props.role).toBe('grid')
    expect(props['aria-label']).toBe(store.getSnapshot().months[0].label)
  })

  describe('cell triggers', () => {
    it('emits the shared data-* contract every adapter renders', () => {
      const store = createCalendar({ defaultPlaceholder: DAY, defaultValue: DAY })
      const day = store
        .getSnapshot()
        .months[0].weeks.flat()
        .find(d => d.isSelected)!
      const props = store.getCellTriggerProps(day)

      expect(props['data-taqwim-calendar-cell-trigger']).toBe('')
      expect(props['data-value']).toBe('1446-03-10')
      expect(props['data-selected']).toBe('')
      expect(props['aria-selected']).toBe(true)
      expect(props['aria-label']).toContain('1446')
    })

    it('marks disabled and unavailable days', () => {
      const store = createCalendar({
        defaultPlaceholder: DAY,
        isDateDisabled: d => d.hd === 10,
        isDateUnavailable: d => d.hd === 11,
      })
      const days = store.getSnapshot().months[0].weeks.flat()

      const disabled = store.getCellTriggerProps(days.find(d => d.date.hd === 10 && !d.isOutsideMonth)!)
      expect(disabled['data-disabled']).toBe('')
      expect(disabled['aria-disabled']).toBe(true)

      const unavailable = store.getCellTriggerProps(days.find(d => d.date.hd === 11 && !d.isOutsideMonth)!)
      expect(unavailable['data-unavailable']).toBe('')
      expect(unavailable['aria-disabled']).toBe(true)
    })

    it('gives exactly one cell a tabindex of 0 (roving focus)', () => {
      const store = createCalendar({ defaultPlaceholder: DAY })
      store.focusDate(DAY)

      const tabbable = store
        .getSnapshot()
        .months[0].weeks.flat()
        .map(day => store.getCellTriggerProps(day))
        .filter(props => props.tabindex === 0)

      expect(tabbable).toHaveLength(1)
      expect(tabbable[0]['data-value']).toBe('1446-03-10')
    })

    it('marks outside-month days', () => {
      const store = createCalendar({ defaultPlaceholder: DAY, fixedWeeks: true })
      const outside = store
        .getSnapshot()
        .months[0].weeks.flat()
        .find(d => d.isOutsideMonth)!

      expect(store.getCellTriggerProps(outside)['data-outside-month']).toBe('')
    })
  })

  it('describes the paging buttons', () => {
    const store = createCalendar({ defaultPlaceholder: DAY, maxValue: { hy: 1446, hm: 3, hd: 30 } })

    expect(store.getPrevButtonProps()['aria-disabled']).toBe(false)
    expect(store.getNextButtonProps()['aria-disabled']).toBe(true)
    expect(store.getNextButtonProps()['data-disabled']).toBe('')
  })
})

describe('formatter', () => {
  it('is typed and locale-bound', () => {
    // Replaces the previous `formatter: any // TODO` context value.
    const store = createCalendar({ defaultPlaceholder: DAY, locale: 'en' })

    expect(store.formatter.isoDate(DAY)).toBe('1446-03-10')
    expect(store.formatter.dayOfMonth(DAY)).toBe('10')
    expect(store.formatter.monthYear(DAY)).toContain('1446')
    expect(store.formatter.custom(DAY, 'iYYYY')).toBe('1446')
  })

  it('follows the active locale', () => {
    const arabic = createCalendar({ defaultPlaceholder: DAY, locale: 'ar' })

    expect(arabic.formatter.monthYear(DAY)).not.toBe(
      createCalendar({ defaultPlaceholder: DAY, locale: 'en' }).formatter.monthYear(DAY),
    )
  })
})
