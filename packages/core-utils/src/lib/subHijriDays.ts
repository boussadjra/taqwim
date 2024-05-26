import { subDays } from "date-fns";
import {
  toHijri,
  toGregorian,
  isValidHijriDate,
  type HijriDateObject,
} from ".";

/**
 * @name subHijriDays
 * @category Day Helpers
 * @summary Add the specified number of days to the given date.
 *
 * @description
 * Add the specified number of days to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
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

export function subHijriDays(
  date: HijriDateObject,
  amount: number
): HijriDateObject | null {
  if (date && isValidHijriDate(date)) {
    const gregorianDate = toGregorian(date);
    if (gregorianDate) {
      const newGregorianDate = subDays(gregorianDate, amount);
      return toHijri(newGregorianDate);
    }
  }
  return null;
}
