import { addHijriMonths, type HijriCalendarSystemOptions, type HijriDateObject } from '.'

/**
 * Substracts a specified number of Months from a Hijri date.
 *
 * @param date - The Hijri date object to sub Months to.
 * @param amount - The number of Months to sub.
 * @returns The resulting Hijri date object after subing the specified number of Months, or `null` if the input date is invalid.
 *
 * @example
 * // Substract 10 Months to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
 * const result = subHijriMonths(
 * { hy: 1445, hm: 9, hd: 1 },
 * 10
 * );
 * //=> { hy: 1444, hm: 11, hd: 1 }
 *
 * @example
 * // Substract 1 Month from 30 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 30 })
 * const result = subHijriMonths(
 * { hy: 1445, hm: 9, hd: 30 },
 * 1
 * );
 * //=> { hy: 1445, hm: 8, hd: 29 }
 *
 * @example
 * // Substract 26 Months from 30 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 30 })
 * const result = subHijriMonths(
 * {  hy: 1447, hm: 12, hd: 29 },
 * 26
 * );
 * //=> { hy: 1445, hm: 9, hd: 30 }
 */
export function subHijriMonths(
  date: HijriDateObject,
  amount: number,
  options?: HijriCalendarSystemOptions,
): HijriDateObject | null {
  return addHijriMonths(date, -amount, options)
}
