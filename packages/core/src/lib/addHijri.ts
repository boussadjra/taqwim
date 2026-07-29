import { addHijriDays, addHijriMonths, addHijriWeeks, addHijriYears, type HijriDateObject, type HijriDuration } from '.'

/**
 * Adds a Hijri duration to a given Hijri date.
 * @param date The Hijri date to which the duration will be added.
 * @param duration The Hijri duration to add.
 * @returns The new Hijri date after adding the duration.
 *
 * @example
 * // Add 10 days to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
 * const result = addHijri(
 * { hy: 1445, hm: 9, hd: 1 },
 * { years: 0, months: 0, weeks: 0, days: 10 }
 * )
 * //=> { hy: 1445, hm: 9, hd: 11 }
 *
 * @example
 * // Add 1 year, 2 months, 3 weeks, and 4 days to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
 * const result = addHijri(
 * { hy: 1445, hm: 9, hd: 1 },
 * { years: 1, months: 2, weeks: 3, days: 4 }
 * )
 * //=> { hy: 1446, hm: 11, hd: 25 }
 */
export function addHijri(date: HijriDateObject, duration: HijriDuration) {
  const { years = 0, months = 0, days = 0, weeks = 0 } = duration
  let newDate: HijriDateObject | null = date

  const operations = [
    { condition: years, func: addHijriYears },
    { condition: months, func: addHijriMonths },
    { condition: weeks, func: addHijriWeeks },
    { condition: days, func: addHijriDays },
  ]

  for (const { condition, func } of operations) {
    if (condition && newDate) {
      newDate = func(newDate, condition)
    }
  }

  return newDate
}
