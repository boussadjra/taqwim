import { addWeeks } from "date-fns";
import {
  toHijri,
  toGregorian,
  isValidHijriDate,
  type HijriDateObject,
} from ".";

/**
 * Adds a specified number of weeks to a Hijri date.
 *
 * @param date - The Hijri date object to add weeks to.
 * @param amount - The number of weeks to add.
 * @returns The resulting Hijri date object after adding the specified number of weeks, or `null` if the input date is invalid.
 *
 * @example
 * // Add 10 weeks to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
 * const result = addHijriWeeks(
 * { hy: 1445, hm: 9, hd: 1 },
 * 10
 * );
 * //=> { hy: 1445, hm: 11, hd: 12 }
 */
export function addHijriWeeks(
  date: HijriDateObject,
  amount: number
): HijriDateObject | null {
  if (date && isValidHijriDate(date)) {
    const gregorianDate = toGregorian(date);
    if (gregorianDate) {
      const newGregorianDate = addWeeks(gregorianDate, amount);
      return toHijri(newGregorianDate);
    }
  }
  return null;
}
