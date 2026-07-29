import { type HijriDateObject, addHijriMonths, isValidHijriDate } from '.'

/**
 * Adds a specified number of Hijri quarters to a given Hijri date.
 * @param date - The Hijri date object to which the quarters will be added.
 * @param amount - The number of quarters to add. Positive values will add quarters in the future, while negative values will subtract quarters from the date.
 * @returns A new Hijri date object that is the result of adding the specified number of quarters to the given date. Returns null if the input date is invalid.
 * @example
 * // Add 2 quarters to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
 * const result = addHijriQuarters(
 * { hy: 1445, hm: 9, hd: 1 },
 * 2
 * );
 * //=> { hy: 1446, hm: 3, hd: 1 }
 * @example
 * // Add 1 quarter to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 30 }) and adjust the month
 * const result = addHijriQuarters(
 * { hy: 1445, hm: 9, hd: 30 },
 * 1
 * );
 * //=> { hy: 1446, hm: 1, hd: 29 }
 */
export function addHijriQuarters(date: HijriDateObject, amount: number): HijriDateObject | null {
  if (date && isValidHijriDate(date)) {
    return addHijriMonths(date, amount * 3)
  }
  return null
}
