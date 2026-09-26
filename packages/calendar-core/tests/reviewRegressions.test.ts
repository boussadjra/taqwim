import { describe, expect, it } from 'vitest'
import { islamicCivil } from '@taqwim/core/calendars/islamic-civil'
import {
  createCalendar,
  parseDatePickerDraft,
  formatDatePickerValues,
  DEFAULT_GREGORIAN_FORMAT_OPTIONS,
  type DatePickerDraftOptions,
} from '../src'

const START = { hy: 1445, hm: 9, hd: 1 }

function tabStops(store: ReturnType<typeof createCalendar>) {
  return store
    .getSnapshot()
    .months.flatMap(month => month.weeks.flat())
    .filter(day => store.getCellTriggerProps(day).tabindex === 0)
}

describe('calendar navigation regressions', () => {
  it('selects dates in every displayed month when adjacent days are disabled', () => {
    const store = createCalendar({ defaultPlaceholder: START, numberOfMonths: 2, disableDaysOutsideCurrentView: true })
    const date = { hy: 1445, hm: 10, hd: 15 }
    store.select(date)
    expect(store.getSnapshot().value).toEqual(date)
    store.select({ hy: 1445, hm: 11, hd: 1 })
    expect(store.getSnapshot().value).toEqual(date)
  })

  it('keeps the grid reachable after paging away from the focused date', () => {
    const store = createCalendar({ defaultPlaceholder: START })
    store.focusDate(START)
    store.nextPage()
    expect(tabStops(store)).toHaveLength(1)
    expect(tabStops(store)[0].date.hm).toBe(10)
  })

  it('skips unavailable dates for initial focus and the tab stop', () => {
    const store = createCalendar({
      defaultPlaceholder: START,
      defaultValue: START,
      isDateUnavailable: date => date.hd === 1,
    })
    expect(tabStops(store)).toHaveLength(1)
    store.focusInitial()
    expect(store.getSnapshot().focusedDate?.hd).not.toBe(1)
    expect(tabStops(store)).toHaveLength(1)
  })

  it('finds a tab stop in later months when the first month is disabled', () => {
    const store = createCalendar({
      defaultPlaceholder: START,
      numberOfMonths: 2,
      minValue: { hy: 1445, hm: 10, hd: 5 },
    })
    expect(tabStops(store)).toHaveLength(1)
    store.focusInitial()
    expect(store.getSnapshot().focusedDate).toEqual({ hy: 1445, hm: 10, hd: 5 })
  })

  it('replaces a tab stop that becomes disabled', () => {
    const store = createCalendar({ defaultPlaceholder: START })
    store.focusDate(START)
    store.setOptions({ isDateDisabled: date => date.hd === 1 })
    expect(tabStops(store)).toHaveLength(1)
    expect(tabStops(store)[0].date.hd).not.toBe(1)
  })

  it('pages across year zero with a proleptic strategy', () => {
    const store = createCalendar({ defaultPlaceholder: { hy: 0, hm: 1, hd: 1 }, calendarSystem: islamicCivil })
    store.prevPage()
    expect(store.getSnapshot().placeholder).toEqual({ hy: -1, hm: 12, hd: 1 })
    expect(store.getSnapshot().months[0].value.hm).toBe(12)
    store.nextPage()
    expect(store.getSnapshot().placeholder).toEqual({ hy: 0, hm: 1, hd: 1 })
  })

  it('renders only representable months at the end of the Umm al-Qura table', () => {
    const store = createCalendar({ defaultPlaceholder: { hy: 1500, hm: 12, hd: 1 }, numberOfMonths: 2 })
    expect(store.getSnapshot().months).toHaveLength(1)
    expect(store.getSnapshot().isNextDisabled).toBe(true)
  })
})

describe('manual Gregorian input', () => {
  it.each(['1900-01-01', '2100-01-01', '2024-02-30'])('returns invalid for %s without throwing', text => {
    expect(parseDatePickerDraft(text, 'gregorian')).toBeNull()
  })

  it('accepts an early Gregorian year with a proleptic strategy', () => {
    const expected = islamicCivil.fromEpochDay(Math.floor(Date.parse('0042-02-28T00:00:00Z') / 86_400_000))
    expect(parseDatePickerDraft('0042-02-28', 'gregorian', islamicCivil)).toEqual(expected)
  })
})

describe('manual input constraints', () => {
  it.each<DatePickerDraftOptions>([
    { minValue: { hy: 1445, hm: 9, hd: 10 } },
    { maxValue: { hy: 1445, hm: 8, hd: 29 } },
    { isDateDisabled: () => true },
    { isDateUnavailable: () => true },
    { disabled: true },
    { readonly: true },
    { editable: false },
  ])('rejects a date blocked by %j', options => {
    expect(parseDatePickerDraft('1445-09-01', 'hijri', undefined, options)).toBeNull()
    expect(parseDatePickerDraft('2024-03-11', 'gregorian', undefined, options)).toBeNull()
  })

  it('honours inclusive bounds and preventDeselect', () => {
    expect(parseDatePickerDraft('1445-09-01', 'hijri', undefined, { minValue: START, maxValue: START })).toEqual(START)
    expect(parseDatePickerDraft('', 'hijri', undefined, { preventDeselect: true })).toBeNull()
    expect(parseDatePickerDraft('', 'hijri')).toBe('empty')
  })

  it('does not crash when a controlled selection becomes invalid after a strategy switch', () => {
    expect(
      formatDatePickerValues(
        { hy: 1445, hm: 2, hd: 30 },
        {
          calendarSystem: islamicCivil,
          hijriFormat: 'iYYYY-iMM-iDD',
          gregorianFormat: DEFAULT_GREGORIAN_FORMAT_OPTIONS,
          locale: 'en',
          gregorianLocale: 'en',
          inputDisplay: 'both',
        },
      ),
    ).toEqual({ value: '', hijriValue: '', gregorianValue: '' })
  })
})
