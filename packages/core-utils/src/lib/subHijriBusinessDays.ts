import { subBusinessDays } from 'date-fns'
import { toHijri, toGregorian, isValidHijriDate, type HijriDateObject } from '.'

/**
 * @name subHijriBusinessDays
 * @category Day Helpers
 * @summary Substract the specified number of business days from the given date.
 *
 * @description
 * Substract the specified number of business days from the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of business days to be substracted.
 *
 * @returns The new date with the business days substracted
 *
 * @example
 * // Substract 10 business days from 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
 * const result = subHijriBusinessDays(
 *  { hy: 1445, hm: 9, hd: 1 },
 * , 10)
 * //=> { hy: 1445, hm: 8, hd: 19 }
 */

export function subHijriBusinessDays(date: HijriDateObject, amount: number): HijriDateObject | null {
  if (date && isValidHijriDate(date)) {
    const gregorianDate = toGregorian(date)
    if (gregorianDate) {
      const newGregorianDate = subBusinessDays(gregorianDate, amount)
      return toHijri(newGregorianDate)
    }
  }
  return null
}
