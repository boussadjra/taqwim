import { describe, expect, it } from 'vitest'
import { islamicCivil } from '../src/lib/calendars/islamic-civil'
import { islamicTbla } from '../src/lib/calendars/islamic-tbla'
import { formatHijriDate, getDayInWeek, toGregorian, toHijri } from '../src'

const LEAP_YEARS = new Set([2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29])

describe.each([
  ['islamic-civil', islamicCivil, -492_148],
  ['islamic-tbla', islamicTbla, -492_149],
] as const)('%s', (id, calendarSystem, epoch) => {
  it('uses the canonical epoch and first boundaries', () => {
    expect(calendarSystem.id).toBe(id)
    expect(calendarSystem.toEpochDay({ hy: 1, hm: 1, hd: 1 })).toBe(epoch)
    expect(calendarSystem.fromEpochDay(epoch)).toEqual({ hy: 1, hm: 1, hd: 1 })
    expect(calendarSystem.fromEpochDay(epoch + 29)).toEqual({ hy: 1, hm: 1, hd: 30 })
    expect(calendarSystem.fromEpochDay(epoch + 30)).toEqual({ hy: 1, hm: 2, hd: 1 })
    expect(calendarSystem.fromEpochDay(epoch + 354)).toEqual({ hy: 2, hm: 1, hd: 1 })
  })

  it('implements the complete 30-year leap cycle and month lengths', () => {
    for (let year = 1; year <= 30; year++) {
      expect(calendarSystem.daysInMonth(year, 12), `year ${year}`).toBe(LEAP_YEARS.has(year) ? 30 : 29)
      expect(Array.from({ length: 11 }, (_, index) => calendarSystem.daysInMonth(year, index + 1))).toEqual([
        30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30,
      ])
    }
  })

  it('round-trips every day across several complete cycles', () => {
    for (let epochDay = epoch - 2 * 10_631; epochDay <= epoch + 4 * 10_631; epochDay++) {
      const hijri = calendarSystem.fromEpochDay(epochDay)
      expect(hijri).not.toBeNull()
      expect(calendarSystem.toEpochDay(hijri!)).toBe(epochDay)
    }
  }, 15_000)

  it('round-trips Hijri fields across a broad proleptic range', () => {
    for (let year = -120; year <= 240; year++) {
      for (let month = 1; month <= 12; month++) {
        const last = calendarSystem.daysInMonth(year, month)
        for (const day of [1, last]) {
          const date = { hy: year, hm: month, hd: day }
          expect(calendarSystem.fromEpochDay(calendarSystem.toEpochDay(date)!)).toEqual(date)
        }
      }
    }
  })

  it('threads the strategy through public conversion, weekday and mixed formatting APIs', () => {
    const options = { calendarSystem }
    const gregorian = toGregorian({ hy: 1448, hm: 3, hd: 10 }, options)!
    expect(toHijri(gregorian, options)).toEqual({ hy: 1448, hm: 3, hd: 10 })
    expect(getDayInWeek({ hy: 1448, hm: 3, hd: 10 }, options)).toBe(gregorian.getDay())
    expect(formatHijriDate({ hy: 1448, hm: 3, hd: 10 }, 'iYYYY-iMM-iDD — yyyy-MM-dd', 'en', options)).toBe(
      `1448-03-10 — ${gregorian.getFullYear()}-${String(gregorian.getMonth() + 1).padStart(2, '0')}-${String(gregorian.getDate()).padStart(2, '0')}`,
    )
  })
})

it('keeps Civil and TBLA one absolute day apart', () => {
  const date = { hy: 1, hm: 1, hd: 1 }
  expect(islamicCivil.toEpochDay(date)! - islamicTbla.toEpochDay(date)!).toBe(1)
  expect(toHijri(622, 7, 18, { calendarSystem: islamicTbla })).toEqual(date)
  expect(toHijri(622, 7, 19, { calendarSystem: islamicCivil })).toEqual(date)
})

it('rejects invalid tabular dates and returns null beyond the JavaScript Date range', () => {
  expect(islamicCivil.toEpochDay({ hy: 2, hm: 12, hd: 30 })).not.toBeNull()
  expect(islamicCivil.toEpochDay({ hy: 3, hm: 12, hd: 30 })).toBeNull()
  expect(toGregorian({ hy: 1_000_000, hm: 1, hd: 1 }, { calendarSystem: islamicCivil })).toBeNull()
})
