import { daysInHijriMonth, recordForHijriYear } from './hDatesIndex'
import type { HijriDateObject } from './types'

/**
 * Returns the length of a month in the Hijri calendar.
 * Overload to support HijriDateObject as a single parameter.
 * @param hyOrHijriDate A Hijri year, or a HijriDateObject specifying the year and month.
 * @returns The length of the month in days. Returns -1 if the month is invalid.
 */
export function getDaysLengthInMonth(hyOrHijriDate: HijriDateObject): number
export function getDaysLengthInMonth(hyOrHijriDate: number | HijriDateObject, hm?: number): number

export function getDaysLengthInMonth(hyOrHijriDate: number | HijriDateObject, hm?: number): number {
  let hy: number
  let hmActual: number

  if (typeof hyOrHijriDate === 'object') {
    hy = hyOrHijriDate.hy
    hmActual = hyOrHijriDate.hm
  } else {
    hy = hyOrHijriDate
    hmActual = hm!
  }

  if (hmActual < 1 || hmActual > 12) {
    return -1
  }
  const hijriYearRecord = recordForHijriYear(hy)
  if (hijriYearRecord) {
    return daysInHijriMonth(hijriYearRecord.dpm, hmActual)
  }

  return -1
}
