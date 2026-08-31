import { isValidHijriDate, type HijriCalendarSystemOptions, type HijriDateObject } from '.'
import { resolveCalendarSystem, shiftWithCalendar } from './calendarSystem'

/**
 * Add the specified number of days to the given date.
 *
 * @category Day Helpers
 *
 * @param date - The date to be changed
 * @param amount - The amount of days to be added.
 *
 * @returns The new date with the days added
 *
 * @example
 * // Add 10 days to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
 * const result = addHijriDays(
 *  { hy: 1445, hm: 9, hd: 1 },
 * , 10)
 * //=> { hy: 1445, hm: 10, hd: 11 }
 */

export function addHijriDays(
  date: HijriDateObject,
  amount: number,
  options?: HijriCalendarSystemOptions,
): HijriDateObject | null {
  if (date && isValidHijriDate(date, options)) {
    return shiftWithCalendar(date, amount, resolveCalendarSystem(options))
  }
  return null
}
