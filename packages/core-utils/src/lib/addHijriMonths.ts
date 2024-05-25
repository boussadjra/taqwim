import {
  isValidHijriDate,
  hDatesTable,
  type HijriDateObject,
  getDaysLengthInMonth,
} from ".";

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
  amount: number
): HijriDateObject | null {
  if (date && isValidHijriDate(date)) {
    const newDate = { ...date };
    newDate.hm += amount;
    while (newDate.hm > 12) {
      newDate.hy++;
      newDate.hm -= 12;
    }

    const hijriYearRecord = hDatesTable.find(
      (record) => record.hy === newDate.hy
    );
    if (hijriYearRecord) {
      const daysInMonth = getDaysLengthInMonth(hijriYearRecord.hy, newDate.hm);
      if (newDate.hd > daysInMonth) {
        newDate.hd = daysInMonth;
      }
    }
    return newDate;
  }
  return null;
}
