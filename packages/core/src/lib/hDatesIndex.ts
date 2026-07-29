import { hDatesTable, type hDates } from './hDates'

/**
 * Indexed views over {@link hDatesTable}, built once at module load.
 *
 * The table is a sorted list of Hijri years, each carrying the Gregorian date
 * its 1 Muharram falls on and a 12-bit `dpm` mask of 30- vs 29-day months.
 * Every lookup in this package used to scan it linearly — and several
 * allocated a `Date` per row while doing so — which made conversion O(n) with
 * ~159 allocations per call on a table of 159 years. These indexes make year
 * lookups O(1) and date lookups O(log n) with no allocation.
 */

const MS_PER_DAY = 86_400_000

/** Days since the Unix epoch for a Gregorian calendar date, timezone-independent. */
export function toEpochDay(year: number, month: number, day: number): number {
  return Math.floor(Date.UTC(year, month - 1, day) / MS_PER_DAY)
}

/** Epoch day of a `Date`, read in its local calendar (so "which day is it" matches the user's clock). */
export function epochDayOf(date: Date): number {
  return toEpochDay(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

/** Local midnight of the given epoch day. */
export function epochDayToDate(epochDay: number): Date {
  const utc = new Date(epochDay * MS_PER_DAY)
  return new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate())
}

/** Day of week for an epoch day: 0 = Sunday .. 6 = Saturday. (Epoch day 0 was a Thursday.) */
export function dayOfWeekFromEpochDay(epochDay: number): number {
  return (((epochDay + 4) % 7) + 7) % 7
}

/** Number of days in a Hijri year, from its packed month-length mask. */
export function daysInHijriYear(dpm: number): number {
  let total = 0
  for (let i = 0; i < 12; i++) {
    total += (dpm >> i) & 1 ? 30 : 29
  }
  return total
}

/** Number of days in a Hijri month (1-12), from its packed month-length mask. */
export function daysInHijriMonth(dpm: number, hijriMonth: number): number {
  return (dpm >> (hijriMonth - 1)) & 1 ? 30 : 29
}

const byYear = new Map<number, hDates>()
const yearStartEpochDays: number[] = []

for (const record of hDatesTable) {
  byYear.set(record.hy, record)
  yearStartEpochDays.push(toEpochDay(record.gy, record.gm, record.gd))
}

/** Earliest Hijri year the Umm al-Qura table covers. */
export const MIN_HIJRI_YEAR = hDatesTable[0].hy

/** Latest Hijri year the Umm al-Qura table covers. */
export const MAX_HIJRI_YEAR = hDatesTable[hDatesTable.length - 1].hy

/** First Gregorian date the table covers (1 Muharram of {@link MIN_HIJRI_YEAR}), at local midnight. */
export const MIN_GREGORIAN_DATE = epochDayToDate(yearStartEpochDays[0])

const lastRecord = hDatesTable[hDatesTable.length - 1]
const maxEpochDay = yearStartEpochDays[yearStartEpochDays.length - 1] + daysInHijriYear(lastRecord.dpm) - 1

/** Last Gregorian date the table covers (last day of {@link MAX_HIJRI_YEAR}), at local midnight. */
export const MAX_GREGORIAN_DATE = epochDayToDate(maxEpochDay)

/** The table's Gregorian coverage as epoch days, inclusive. */
export const EPOCH_DAY_RANGE = { min: yearStartEpochDays[0], max: maxEpochDay } as const

/** O(1) lookup of a Hijri year's table record. */
export function recordForHijriYear(hijriYear: number): hDates | undefined {
  return byYear.get(hijriYear)
}

/** Epoch day on which the given Hijri year begins, or `undefined` if out of range. */
export function hijriYearStartEpochDay(hijriYear: number): number | undefined {
  const index = hijriYear - MIN_HIJRI_YEAR
  return index >= 0 && index < yearStartEpochDays.length ? yearStartEpochDays[index] : undefined
}

/**
 * The table record for the Hijri year containing `epochDay`, plus that year's
 * start, via binary search. Returns `undefined` outside the table's coverage.
 */
export function recordForEpochDay(epochDay: number): { record: hDates; startEpochDay: number } | undefined {
  if (epochDay < EPOCH_DAY_RANGE.min || epochDay > EPOCH_DAY_RANGE.max) {
    return undefined
  }

  // Last index whose year-start is <= epochDay.
  let low = 0
  let high = yearStartEpochDays.length - 1
  while (low < high) {
    const mid = (low + high + 1) >> 1
    if (yearStartEpochDays[mid] <= epochDay) {
      low = mid
    } else {
      high = mid - 1
    }
  }

  return { record: hDatesTable[low], startEpochDay: yearStartEpochDays[low] }
}
