import { resolveCalendarSystem } from './calendarSystem'
import type { HijriCalendarSystemOptions, HijriDateObject } from './types'

/**
 * Returns the length of a month in the Hijri calendar.
 * Overload to support HijriDateObject as a single parameter.
 * @param hyOrHijriDate A Hijri year, or a HijriDateObject specifying the year and month.
 * @returns The length of the month in days. Returns -1 if the month is invalid.
 */
export function getDaysLengthInMonth(hyOrHijriDate: HijriDateObject, options?: HijriCalendarSystemOptions): number
export function getDaysLengthInMonth(hyOrHijriDate: number, hm: number, options?: HijriCalendarSystemOptions): number

export function getDaysLengthInMonth(
  hyOrHijriDate: number | HijriDateObject,
  hmOrOptions?: number | HijriCalendarSystemOptions,
  options?: HijriCalendarSystemOptions,
): number {
  let hy: number
  let hmActual: number

  if (typeof hyOrHijriDate === 'object') {
    hy = hyOrHijriDate.hy
    hmActual = hyOrHijriDate.hm
  } else {
    hy = hyOrHijriDate
    hmActual = hmOrOptions as number
  }

  if (hmActual < 1 || hmActual > 12) {
    return -1
  }
  const calendarOptions = typeof hmOrOptions === 'object' ? hmOrOptions : options
  return resolveCalendarSystem(calendarOptions).daysInMonth(hy, hmActual)
}
