import { resolveCalendarSystem } from './calendarSystem'
import type { HijriCalendarSystemOptions, HijriDateObject } from './types'
import { toGregorianWithCalendar } from './toGregorianWithCalendar'

export function toGregorian(date: HijriDateObject, options?: HijriCalendarSystemOptions): Date | null
export function toGregorian(hy: number, hm: number, hd: number, options?: HijriCalendarSystemOptions): Date | null
/**
 * Converts a Hijri date to a Gregorian date.
 * @param dateOrHy - The Hijri date object or the Hijri year.
 * @param hm - The Hijri month (optional, required if `dateOrHy` is a number).
 * @param hd - The Hijri day (optional, required if `dateOrHy` is a number).
 * @returns The corresponding Gregorian date, at local midnight.
 * @throws {Error} If the arguments are incomplete or the Hijri date is not a real date.
 * @throws {HijriRangeError} If the Hijri year falls outside the Umm al-Qura table's coverage.
 */
export function toGregorian(
  dateOrHy: HijriDateObject | number,
  hmOrOptions?: number | HijriCalendarSystemOptions,
  hd?: number,
  options?: HijriCalendarSystemOptions,
): Date | null {
  let hijriYear: number
  let hijriMonth: number
  let hijriDay: number

  if (typeof dateOrHy === 'number') {
    if (typeof hmOrOptions !== 'number' || hd === undefined) {
      throw new Error('Invalid arguments')
    }
    hijriYear = dateOrHy
    hijriMonth = hmOrOptions
    hijriDay = hd
  } else {
    hijriYear = dateOrHy.hy
    hijriMonth = dateOrHy.hm
    hijriDay = dateOrHy.hd
  }
  const calendarOptions = typeof hmOrOptions === 'object' ? hmOrOptions : options
  return toGregorianWithCalendar(
    { hy: hijriYear, hm: hijriMonth, hd: hijriDay },
    resolveCalendarSystem(calendarOptions),
  )
}
