import { describe, expect, it } from 'vitest'
import { getDaysLengthInMonth, isValidHijriDate, islamicUmmAlQura, toGregorian, toHijri } from '../src'
import { islamicCivil } from '../src/lib/calendars/islamic-civil'
import { islamicTbla } from '../src/lib/calendars/islamic-tbla'

describe.each([islamicUmmAlQura, islamicCivil, islamicTbla])('$id input validation', calendarSystem => {
  it.each([
    { hy: 1445, hm: 9.5, hd: 1 },
    { hy: 1445, hm: 9, hd: 1.5 },
    { hy: 1445, hm: Number.NaN, hd: 1 },
    { hy: 1445, hm: 9, hd: Number.NaN },
  ])('rejects non-integer Hijri fields: %j', date => {
    expect(isValidHijriDate(date, { calendarSystem })).toBe(false)
    expect(calendarSystem.toEpochDay(date)).toBeNull()
    expect(() => toGregorian(date, { calendarSystem })).toThrow('Invalid Hijri date')
  })

  it.each([Number.NaN, Number.POSITIVE_INFINITY, 1.5])('rejects invalid epoch days: %s', epochDay => {
    expect(calendarSystem.fromEpochDay(epochDay)).toBeNull()
  })

  it('rejects fractional month lengths', () => {
    expect(getDaysLengthInMonth(1445, 9.5, { calendarSystem })).toBe(-1)
  })
})

describe('Gregorian input overloads', () => {
  it.each([
    [2024, 2, 30],
    [2023, 2, 29],
    [2024, 13, 1],
    [2024, 1, 0],
    [2024, 1, 1.5],
  ])('rejects impossible numeric and object dates: %i-%i-%i', (year, month, day) => {
    expect(() => toHijri(year, month, day)).toThrow('Invalid Gregorian date')
    expect(() => toHijri({ year, month, day })).toThrow('Invalid Gregorian date')
  })

  it.each([0, 1, 42, 99])('preserves Gregorian year %i across every overload', year => {
    const options = { calendarSystem: islamicCivil }
    const date = new Date(0)
    date.setFullYear(year, 1, 28)
    date.setHours(0, 0, 0, 0)
    const expected = islamicCivil.fromEpochDay(
      Math.floor(Date.parse(`${String(year).padStart(4, '0')}-02-28T00:00:00Z`) / 86_400_000),
    )

    expect(toHijri(date, options)).toEqual(expected)
    expect(toHijri(year, 2, 28, options)).toEqual(expected)
    expect(toHijri({ year, month: 2, day: 28 }, options)).toEqual(expected)
    expect(toHijri(`${String(year).padStart(4, '0')}-02-28`, options)).toEqual(expected)
    expect(toGregorian(expected!, options)).toEqual(date)
  })
})
