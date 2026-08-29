import { describe, expect, it } from 'vitest'
import { createCalendar } from '../src/store'
import {
  deriveGregorianValue,
  formatGregorianIsoDate,
  gregorianMonthRange,
  gregorianShortDate,
  toGregorianDate,
} from '../src/gregorian'
import { createFormatter } from '../src/formatter'

const RAMADAN_1447_DAY_9 = { hy: 1447, hm: 9, hd: 9 }
const RAMADAN_1447_START = { hy: 1447, hm: 9, hd: 1 }

describe('deriveGregorianValue', () => {
  it('derives undefined from an empty selection', () => {
    expect(deriveGregorianValue(undefined)).toBeUndefined()
  })

  it('derives a single Date from one Hijri date', () => {
    const value = deriveGregorianValue(RAMADAN_1447_DAY_9)
    expect(value).toBeInstanceOf(Date)
    expect(formatGregorianIsoDate(value as Date)).toBe(formatGregorianIsoDate(toGregorianDate(RAMADAN_1447_DAY_9)))
  })

  it('derives an ordered array for multiple selection', () => {
    const dates = [
      { hy: 1448, hm: 3, hd: 10 },
      { hy: 1448, hm: 3, hd: 12 },
    ]
    const value = deriveGregorianValue(dates)
    expect(Array.isArray(value)).toBe(true)
    expect((value as Date[]).map(formatGregorianIsoDate)).toEqual(
      dates.map(d => formatGregorianIsoDate(toGregorianDate(d))),
    )
  })
})

describe('gregorianMonthRange', () => {
  const formatter = createFormatter('en', 'en')

  it('shows the exact Gregorian boundary dates when the Hijri month fits inside one Gregorian month', () => {
    const range = gregorianMonthRange({ hy: 1446, hm: 6, hd: 1 }, 'en')

    expect(range).toContain('December')
    expect(range).toContain('2024')
    expect(range).toMatch(/2.*31/)
  })

  it('spans two Gregorian months within the same year', () => {
    const range = formatter.gregorianMonthRange(RAMADAN_1447_START)

    expect(range).toContain('February')
    expect(range).toContain('March')
    expect(range).toContain('2026')
    expect(range).toMatch(/18.*19/)
  })

  it('spans a Gregorian year boundary', () => {
    const range = gregorianMonthRange({ hy: 1447, hm: 7, hd: 1 }, 'en')

    expect(range).toContain('December')
    expect(range).toContain('2025')
    expect(range).toContain('January')
    expect(range).toContain('2026')
  })
})

describe('createCalendar dual presentation', () => {
  it('defaults to Hijri-only presentation', () => {
    const store = createCalendar({ defaultPlaceholder: RAMADAN_1447_START })
    const state = store.getSnapshot()

    expect(state.showGregorian).toBe(false)
    expect(state.dateEmphasis).toBe('hijri')
    expect(state.gregorianLocale).toBe('en')
    expect(state.secondaryHeadingValue).toBeUndefined()
    expect(state.gregorianValue).toBeUndefined()
  })

  it('exposes derived Gregorian selection', () => {
    const store = createCalendar({ defaultPlaceholder: RAMADAN_1447_START })
    store.select(RAMADAN_1447_DAY_9)

    const state = store.getSnapshot()
    expect(state.gregorianValue).toBeInstanceOf(Date)
    expect(formatGregorianIsoDate(state.gregorianValue as Date)).toBe(
      formatGregorianIsoDate(toGregorianDate(RAMADAN_1447_DAY_9)),
    )
  })

  it('adds gregorianDate to every calendar day', () => {
    const store = createCalendar({ defaultPlaceholder: RAMADAN_1447_START, showGregorian: true })
    const day = store
      .getSnapshot()
      .months[0]!.weeks.flat()
      .find(d => d.date.hd === 9)!

    expect(day.gregorianDate).toBeInstanceOf(Date)
    expect(gregorianShortDate(day.gregorianDate, 'en')).toMatch(/26.*Feb|Feb.*26/)
  })

  it('swaps heading emphasis when dateEmphasis is gregorian', () => {
    const store = createCalendar({
      defaultPlaceholder: RAMADAN_1447_START,
      showGregorian: true,
      dateEmphasis: 'gregorian',
    })
    const state = store.getSnapshot()

    expect(state.headingValue).toContain('February')
    expect(state.headingValue).toContain('18')
    expect(state.headingValue).toContain('March')
    expect(state.headingValue).toContain('19')
    expect(state.headingValue).toContain('2026')
    expect(state.secondaryHeadingValue).toContain('1447')
  })

  it('respects gregorianLocale independently from locale', () => {
    const store = createCalendar({
      defaultPlaceholder: RAMADAN_1447_START,
      showGregorian: true,
      locale: 'ar',
      gregorianLocale: 'en',
    })

    const secondaryLabel = store.getSnapshot().months[0]!.secondaryLabel!
    expect(secondaryLabel).toContain('February')
    expect(secondaryLabel).toContain('18')
    expect(secondaryLabel).toContain('March')
    expect(secondaryLabel).toContain('19')
    expect(secondaryLabel).toContain('2026')
  })

  it('emits presentation data attributes on the root', () => {
    const store = createCalendar({ defaultPlaceholder: RAMADAN_1447_START, showGregorian: true })
    expect(store.getRootProps()['data-show-gregorian']).toBe('')
    expect(store.getRootProps()['data-date-emphasis']).toBe('hijri')
  })

  it('adds data-gregorian-value on cells when showGregorian is enabled', () => {
    const store = createCalendar({ defaultPlaceholder: RAMADAN_1447_START, showGregorian: true })
    const day = store
      .getSnapshot()
      .months[0]!.weeks.flat()
      .find(d => d.date.hd === 9)!
    expect(store.getCellTriggerProps(day)['data-gregorian-value']).toBe(
      formatGregorianIsoDate(toGregorianDate(day.date)),
    )
    expect(store.getCellTriggerProps(day)['data-tooltip']).toContain('1447')
    expect(store.getCellTriggerProps(day)['data-tooltip']).toMatch(/2026|March/i)
  })

  it('keeps a stable snapshot when equivalent options are pushed again', () => {
    const store = createCalendar({ defaultPlaceholder: RAMADAN_1447_START, showGregorian: true })
    const before = store.getSnapshot()
    store.setOptions({ showGregorian: true, locale: 'en' })
    expect(store.getSnapshot()).toBe(before)
  })

  it('rebuilds when showGregorian toggles', () => {
    const store = createCalendar({ defaultPlaceholder: RAMADAN_1447_START })
    const before = store.getSnapshot()
    store.setOptions({ showGregorian: true })
    expect(store.getSnapshot()).not.toBe(before)
    expect(store.getSnapshot().showGregorian).toBe(true)
  })
})

describe('gregorian calendar semantics', () => {
  it('forces the Gregorian calendar through Intl', () => {
    const formatter = createFormatter('ar', 'ar')
    const date = { hy: 1447, hm: 9, hd: 9 }
    // Arabic locale with explicit Gregorian calendar — not Islamic/Umm al-Qura.
    expect(formatter.gregorianFullDate(date)).toMatch(/٢٠٢٦|2026/)
    expect(formatter.gregorianFullDate(date)).not.toMatch(/١٤٤٧/)
  })
})
