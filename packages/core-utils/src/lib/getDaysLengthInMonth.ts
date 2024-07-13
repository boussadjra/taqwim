import { hDatesTable } from '.'
import type { HijriDateObject } from '.'

/**
 * Returns the length of a month in the Hijri calendar.
 * Overload to support HijriDateObject as a single parameter.
 * @param hijriDate A HijriDateObject specifying the year and month.
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
  const hijriYearRecord = hDatesTable.find(record => record.hy === hy)
  if (hijriYearRecord) {
    return (hijriYearRecord.dpm >> (hmActual - 1)) & 1 ? 30 : 29
  }

  return -1
}
