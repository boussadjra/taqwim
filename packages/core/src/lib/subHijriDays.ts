import { isValidHijriDate, type HijriDateObject } from '.'
import { shiftHijriDays } from './hijriEpoch'

/**
 * Subtract the specified number of days from the given date.
 *
 * @category Day Helpers
 *
 * @param date - The date to be changed
 * @param amount - The amount of days to be substracted.
 *
 * @returns The new date with the days substracted
 *
 * @example
 * // Add 10 days to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
 * const result = subHijriDays(
 *  { hy: 1445, hm: 9, hd: 1 },
 * , 10)
 * //=> { hy: 1445, hm: 10, hd: 11 }
 */

export function subHijriDays(date: HijriDateObject, amount: number): HijriDateObject | null {
  if (date && isValidHijriDate(date)) {
    return shiftHijriDays(date, -amount)
  }
  return null
}
