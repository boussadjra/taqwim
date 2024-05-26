import { addHijriYears, type HijriDateObject } from ".";

/**
 * Adds a specified number of years to a Hijri date.
 *
 * @param date - The Hijri date object to substract years to.
 * @param amount - The number of years to sub.
 * @returns The resulting Hijri date object after subing the specified number of years, or `null` if the input date is invalid.
 *
 * @example
 * // Substract 10 years from 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
 * const result = subHijriYears(
 * { hy: 1445, hm: 9, hd: 1 },
 * 10
 * );
 * //=> { hy: 1435, hm: 9, hd: 1 }
 *
 * @example
 * // Substract 1 year to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 30 }) and adjust the month
 * const result = subHijriYears(
 * { hy: 1445, hm: 9, hd: 30 },
 * 1
 * );
 * //=> { hy: 1444, hm: 9, hd: 29 }
 */
export function subHijriYears(
  date: HijriDateObject,
  amount: number
): HijriDateObject | null {
  return addHijriYears(date, -amount);
}
