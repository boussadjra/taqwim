import {
  daysInHijriMonth,
  EPOCH_DAY_RANGE,
  epochDayOf,
  epochDayToDate,
  hijriYearStartEpochDay,
  recordForEpochDay,
  recordForHijriYear,
} from './hDatesIndex'
import { HijriRangeError } from './errors'
import type { HijriDateObject } from './types'

/** Epoch day for a Hijri date that already passed table validation. */
export function hijriToEpochDay(hijriYear: number, hijriMonth: number, hijriDay: number): number | undefined {
  const record = recordForHijriYear(hijriYear)
  const yearStart = hijriYearStartEpochDay(hijriYear)

  if (!record || yearStart === undefined) {
    return undefined
  }

  let daysIntoYear = hijriDay - 1
  for (let month = 1; month < hijriMonth; month++) {
    daysIntoYear += daysInHijriMonth(record.dpm, month)
  }

  return yearStart + daysIntoYear
}

/** Hijri date for an epoch day inside the Umm al-Qura table. */
export function epochDayToHijri(epochDay: number): HijriDateObject | null {
  const found = recordForEpochDay(epochDay)
  if (!found) {
    return null
  }

  const { record, startEpochDay } = found
  let remainingDays = epochDay - startEpochDay
  let hijriMonth = 12

  for (let month = 1; month <= 12; month++) {
    const daysThisMonth = daysInHijriMonth(record.dpm, month)
    if (remainingDays < daysThisMonth) {
      hijriMonth = month
      break
    }
    remainingDays -= daysThisMonth
  }

  return { hy: record.hy, hm: hijriMonth, hd: remainingDays + 1 }
}

/** Shift a valid Hijri date by a number of calendar days via epoch-day arithmetic. */
export function shiftHijriDays(date: HijriDateObject, amount: number): HijriDateObject | null {
  const epochDay = hijriToEpochDay(date.hy, date.hm, date.hd)
  if (epochDay === undefined) {
    return null
  }

  const targetEpochDay = epochDay + amount
  if (targetEpochDay < EPOCH_DAY_RANGE.min || targetEpochDay > EPOCH_DAY_RANGE.max) {
    throw HijriRangeError.forGregorianDate(epochDayToDate(targetEpochDay))
  }

  return epochDayToHijri(targetEpochDay)
}

/** Day of week (0 = Sunday) for a Hijri date, without allocating a `Date`. */
export function dayOfWeekForHijriDate(date: HijriDateObject): number | undefined {
  const epochDay = hijriToEpochDay(date.hy, date.hm, date.hd)
  if (epochDay === undefined) {
    return undefined
  }

  return (((epochDay + 4) % 7) + 7) % 7
}

/** Day of week (0 = Sunday) for a Gregorian `Date`. */
export function dayOfWeekForGregorianDate(date: Date): number {
  return (((epochDayOf(date) + 4) % 7) + 7) % 7
}

/** Gregorian year/month/day parts at local midnight. */
export function gregorianPartsFromDate(date: Date): { year: number; month: number; day: number } {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  }
}
