import { bench, describe } from 'vitest'
import { differenceInDays, set, startOfDay, toDate } from 'date-fns'
import { hDatesTable, type hDates } from '../src/lib/hDates'
import { toHijri } from '../src/lib/toHijri'

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
    const currDate = startOfDay(set(new Date(), { year: curr.gy, month: curr.gm - 1, date: curr.gd }))
    if (currDate <= inputDate && currDate > prev) {
      return toDate(currDate)
    }
    return prev
  }, new Date(0))

  const correspondingHijriYear = hDatesTable.find((date: hDates) => {
    const dt = startOfDay(set(new Date(), { year: date.gy, month: date.gm - 1, date: date.gd }))
    return toDate(dt).getTime() === closestDate.getTime()
  })

  if (!correspondingHijriYear) return null

  let remainingDays = Math.round(differenceInDays(inputDate, startOfDay(closestDate)))
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
