import { type HijriDateObject, subHijriMonths, isValidHijriDate } from ".";

/**
 * Substracts a specified number of Hijri quarters from a given Hijri date.
 * @param date - The Hijri date object to which the quarters will be substracted.
 * @param amount - The number of quarters to sub. Positive values will substract quarters in the future, while negative values will subtract quarters from the date.
 * @returns A new Hijri date object that is the result of subing the specified number of quarters to the given date. Returns null if the input date is invalid.
 * @example
 * // Substract 2 quarters from 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
 * const result = subHijriQuarters(
 * { hy: 1445, hm: 9, hd: 1 },
 * 2
 * );
 * //=> { hy: 1445, hm: 3, hd: 1 }
 * @example
 * // Substract 1 quarter from 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 30 }) and adjust the month
 * const result = subHijriQuarters(
 * { hy: 1445, hm: 9, hd: 30 },
 * 1
 * );
 * //=> { hy: 1444, hm: 9, hd: 29 };
 */
export function subHijriQuarters(
  date: HijriDateObject,
  amount: number
): HijriDateObject | null {
  if (date && isValidHijriDate(date)) {
    return subHijriMonths(date, amount * 3);
  }
  return null;
}
