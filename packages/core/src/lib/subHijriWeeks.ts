import { subHijriDays, isValidHijriDate, type HijriCalendarSystemOptions, type HijriDateObject } from '.'

/**
 * Substracts a specified number of weeks from a Hijri date.
 *
 * @param date - The Hijri date object to sub weeks to.
 * @param amount - The number of weeks to sub.
 * @returns The resulting Hijri date object after subing the specified number of weeks, or `null` if the input date is invalid.
 *
 * @example
 * // Substract 10 weeks from 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
 * const result = subHijriWeeks(
 * {  hy: 1445, hm: 11, hd: 12 },
 * 10
 * );
 * //=> { hy: 1445, hm: 9, hd: 1 }
 */
export function subHijriWeeks(
  date: HijriDateObject,
  amount: number,
  options?: HijriCalendarSystemOptions,
): HijriDateObject | null {
  if (date && isValidHijriDate(date, options)) {
    return subHijriDays(date, amount * 7, options)
  }
  return null
}
