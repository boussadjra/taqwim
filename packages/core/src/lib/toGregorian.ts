import { HijriRangeError } from './errors'
import {
  daysInHijriMonth,
  epochDayToDate,
  hijriYearStartEpochDay,
  MAX_HIJRI_YEAR,
  MIN_HIJRI_YEAR,
  recordForHijriYear,
} from './hDatesIndex'
import { isValidHijriDate } from './isValidHijriDate'
import type { HijriDateObject } from './types'

export function toGregorian(date: HijriDateObject): Date | null
export function toGregorian(hy: number, hm: number, hd: number): Date | null
/**
 * Converts a Hijri date to a Gregorian date.
 * @param dateOrHy - The Hijri date object or the Hijri year.
 * @param hm - The Hijri month (optional, required if `dateOrHy` is a number).
 * @param hd - The Hijri day (optional, required if `dateOrHy` is a number).
 * @returns The corresponding Gregorian date, at local midnight.
 * @throws {Error} If the arguments are incomplete or the Hijri date is not a real date.
 * @throws {HijriRangeError} If the Hijri year falls outside the Umm al-Qura table's coverage.
 */
export function toGregorian(dateOrHy: HijriDateObject | number, hm?: number, hd?: number): Date | null {
  let hijriYear: number
  let hijriMonth: number
  let hijriDay: number

  if (typeof dateOrHy === 'number') {
    if (hm === undefined || hd === undefined) {
      throw new Error('Invalid arguments')
    }
    hijriYear = dateOrHy
    hijriMonth = hm
    hijriDay = hd
  } else {
    hijriYear = dateOrHy.hy
    hijriMonth = dateOrHy.hm
    hijriDay = dateOrHy.hd
  }

  // Distinguish "outside the table" from "not a real date", so callers can
  // tell an unsupported year from a typo like 30 Ramadan in a 29-day year.
  if (hijriYear < MIN_HIJRI_YEAR || hijriYear > MAX_HIJRI_YEAR) {
    throw HijriRangeError.forHijriYear(hijriYear)
  }

  if (!isValidHijriDate(hijriYear, hijriMonth, hijriDay)) {
    throw new Error('Invalid Hijri date')
  }

  const record = recordForHijriYear(hijriYear)
  const yearStart = hijriYearStartEpochDay(hijriYear)

  if (!record || yearStart === undefined) {
    return null
  }

  let daysIntoYear = hijriDay - 1
  for (let i = 1; i < hijriMonth; i++) {
    daysIntoYear += daysInHijriMonth(record.dpm, i)
  }

  return epochDayToDate(yearStart + daysIntoYear)
}
