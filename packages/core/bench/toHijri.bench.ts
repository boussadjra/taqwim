import { bench, describe } from 'vitest'
import { hDatesTable, type hDates } from '../src/lib/hDates'
import { toHijri } from '../src/lib/toHijri'
import { toGregorian } from '../src/lib/toGregorian'
import { islamicCivil } from '../src/lib/calendars/islamic-civil'
import { islamicTbla } from '../src/lib/calendars/islamic-tbla'

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function tableDate(date: hDates): Date {
  const result = new Date()
  result.setFullYear(date.gy, date.gm - 1, date.gd)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * The pre-1.0 implementation, kept here only as a benchmark baseline.
 *
 * It reduced over the whole table allocating a `Date` per row, then called
 * `getHijriYear` which scanned and allocated all over again — roughly 2n Date
 * allocations per conversion on a 159-row table.
 */
function legacyToHijri(input: Date): { hy: number; hm: number; hd: number } | null {
  const inputDate = startOfDay(input)

  const closestDate = hDatesTable.reduce((prev: Date, curr: hDates) => {
    const currDate = tableDate(curr)
    if (currDate <= inputDate && currDate > prev) {
      return new Date(currDate)
    }
    return prev
  }, new Date(0))

  const correspondingHijriYear = hDatesTable.find((date: hDates) => {
    return tableDate(date).getTime() === closestDate.getTime()
  })

  if (!correspondingHijriYear) return null

  let remainingDays = Math.round((inputDate.getTime() - startOfDay(closestDate).getTime()) / 86_400_000)
  let hijriMonth = 0

  for (let i = 0; i < 12; i++) {
    const daysInThisMonth = (correspondingHijriYear.dpm >> i) & 1 ? 30 : 29
    if (remainingDays < daysInThisMonth) {
      hijriMonth = i + 1
      break
    }
    remainingDays -= daysInThisMonth
  }

  return { hy: correspondingHijriYear.hy, hm: hijriMonth, hd: remainingDays + 1 }
}

// A month's worth of cells, which is what one calendar render costs.
const calendarMonth = Array.from({ length: 42 }, (_, i) => new Date(2024, 2, 1 + i))

describe('toHijri: single conversion', () => {
  const date = new Date(2024, 2, 11)

  bench('binary search (current)', () => {
    toHijri(date)
  })

  bench('linear scan (legacy)', () => {
    legacyToHijri(date)
  })
})

describe('toHijri: one 42-cell calendar grid', () => {
  bench('binary search (current)', () => {
    for (const date of calendarMonth) toHijri(date)
  })

  bench('linear scan (legacy)', () => {
    for (const date of calendarMonth) legacyToHijri(date)
  })
})

describe('calendar strategy conversions', () => {
  const gregorian = new Date(2026, 7, 30)
  const hijri = { hy: 1448, hm: 3, hd: 16 }

  bench('Umm al-Qura Gregorian to Hijri', () => toHijri(gregorian))
  bench('Umm al-Qura Hijri to Gregorian', () => toGregorian(hijri))
  bench('Civil Gregorian to Hijri', () => toHijri(gregorian, { calendarSystem: islamicCivil }))
  bench('Civil Hijri to Gregorian', () => toGregorian(hijri, { calendarSystem: islamicCivil }))
  bench('TBLA Gregorian to Hijri', () => toHijri(gregorian, { calendarSystem: islamicTbla }))
  bench('TBLA Hijri to Gregorian', () => toGregorian(hijri, { calendarSystem: islamicTbla }))
})
