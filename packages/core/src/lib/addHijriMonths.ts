import { getDaysLengthInMonth, isValidHijriDate, type HijriCalendarSystemOptions, type HijriDateObject } from '.'

/**
 * Adds a specified number of Months to a Hijri date.
 *
 * @param date - The Hijri date object to add Months to.
 * @param amount - The number of Months to add.
 * @returns The resulting Hijri date object after adding the specified number of Months, or `null` if the input date is invalid.
 *
 * @example
 * // Add 10 Months to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
 * const result = addHijriMonths(
 * { hy: 1445, hm: 9, hd: 1 },
 * 10
 * );
 * //=> { hy: 1445, hm: 11, hd: 12 }
 *
 * @example
 * // Add 1 Month to 30 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 30 })
 * const result = addHijriMonths(
 * { hy: 1445, hm: 9, hd: 30 },
 * 1
 * );
 * //=> { hy: 1445, hm: 10, hd: 29 }
 *
 * @example
 * // Add 26 Months to 30 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 30 })
 * const result = addHijriMonths(
 * { hy: 1445, hm: 9, hd: 30 },
 * 26
 * );
 * //=> { hy: 1447, hm: 12, hd: 29 }
 */
export function addHijriMonths(
  date: HijriDateObject,
  amount: number,
  options?: HijriCalendarSystemOptions,
): HijriDateObject | null {
  if (date && isValidHijriDate(date, options)) {
    const absolute = date.hy * 12 + date.hm - 1 + amount
    const hy = Math.floor(absolute / 12)
    const hm = (((absolute % 12) + 12) % 12) + 1
    const daysInMonth = getDaysLengthInMonth(hy, hm, options)
    return daysInMonth < 0 ? null : { hy, hm, hd: Math.min(date.hd, daysInMonth) }
  }
  return null
}
