import { getDaysLengthInMonth, isValidHijriDate, type HijriCalendarSystemOptions, type HijriDateObject } from '.'

/**
 * Adds a specified number of years to a Hijri date.
 *
 * @param date - The Hijri date object to add years to.
 * @param amount - The number of years to add.
 * @returns The resulting Hijri date object after adding the specified number of years, or `null` if the input date is invalid.
 *
 * @example
 * // Add 10 years to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
 * const result = addHijriYears(
 * { hy: 1445, hm: 9, hd: 1 },
 * 10
 * );
 * //=> { hy: 1455, hm: 9, hd: 1 }
 *
 * @example
 * // Add 1 year to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 30 }) and adjust the month
 * const result = addHijriYears(
 * { hy: 1445, hm: 9, hd: 30 },
 * 1
 * );
 * //=> { hy: 1446, hm: 10, hd: 29 }
 */
export function addHijriYears(
  date: HijriDateObject,
  amount: number,
  options?: HijriCalendarSystemOptions,
): HijriDateObject | null {
  if (date && isValidHijriDate(date, options)) {
    const newDate = { ...date }
    newDate.hy += amount
    const daysInMonth = getDaysLengthInMonth(newDate.hy, newDate.hm, options)
    if (daysInMonth < 0) return null
    newDate.hd = Math.min(newDate.hd, daysInMonth)
    return newDate
  }
  return null
}
