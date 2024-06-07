import { isValidHijriDate, hDatesTable, type HijriDateObject, getDaysLengthInMonth } from '.'

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
export function subHijriMonths(date: HijriDateObject, amount: number): HijriDateObject | null {
  if (date && isValidHijriDate(date)) {
    const newDate = { ...date }
    newDate.hm -= amount
    while (newDate.hm < 1) {
      newDate.hm += 12
      newDate.hy -= 1
    }
    const hijriYearRecord = hDatesTable.find(record => record.hy === newDate.hy)
    if (hijriYearRecord) {
      const daysInMonth = getDaysLengthInMonth(hijriYearRecord.hy, newDate.hm)
      if (newDate.hd > daysInMonth) {
        newDate.hd = daysInMonth
      }
    }
    return newDate
  }
  return null
}
