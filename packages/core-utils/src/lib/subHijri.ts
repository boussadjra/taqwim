import { subHijriDays, subHijriMonths, subHijriWeeks, subHijriYears, type HijriDateObject, type HijriDuration } from '.'

/**
 * Substracts a Hijri duration from a given Hijri date.
 * @param date The Hijri date to which the duration will be substracted.
 * @param duration The Hijri duration to sub.
 * @returns The new Hijri date after subing the duration.
 *
 * @example
 * // Substract 10 days from 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
 * const result = subHijri(
 * { hy: 1445, hm: 9, hd: 1 },
 * { years: 0, months: 0, weeks: 0, days: 10 }
 * )
 * //=> { hy: 1445, hm: 8, hd: 21 }
 *
 * @example
 * // Substract 1 year, 2 months, 3 weeks, and 4 days from 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
 * const result = subHijri(
 * { hy: 1445, hm: 9, hd: 1 },
 * { years: 1, months: 2, weeks: 3, days: 4 }
 * )
 * //=> { hy: 1444, hm: 6, hd: 5 }
 */
export function subHijri(date: HijriDateObject, duration: HijriDuration) {
  const { years = 0, months = 0, days = 0, weeks = 0 } = duration
  let newDate: HijriDateObject | null = date

  const operations = [
    { condition: years, func: subHijriYears },
    { condition: months, func: subHijriMonths },
    { condition: weeks, func: subHijriWeeks },
    { condition: days, func: subHijriDays },
  ]

  for (const { condition, func } of operations) {
    if (condition && newDate) {
      newDate = func(newDate, condition)
    }
  }

  return newDate
}
