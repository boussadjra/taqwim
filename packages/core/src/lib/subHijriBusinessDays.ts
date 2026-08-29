import { addHijriBusinessDays } from './addHijriBusinessDays'
import type { HijriDateObject } from './types'
import type { BusinessDayOptions } from './weekend'

/**
 * Subtract the specified number of business days from the given date, skipping
 * weekend days. The weekend defaults to Friday/Saturday — the working week
 * across most of the Arab world — and is configurable.
 *
 * @category Day Helpers
 *
 * @param date - The date to be changed
 * @param amount - The amount of business days to be subtracted.
 * @param options - Business-day options, e.g. `{ weekend: [6, 0] }` for a Sat/Sun weekend.
 *
 * @returns The new date with the business days subtracted, or `null` if `date` is invalid.
 *
 * @example
 * // Subtract 10 business days from 1 Ramadan 1445
 * subHijriBusinessDays({ hy: 1445, hm: 9, hd: 1 }, 10)
 * //=> { hy: 1445, hm: 8, hd: 16 }
 */
export function subHijriBusinessDays(
  date: HijriDateObject,
  amount: number,
  options: BusinessDayOptions = {},
): HijriDateObject | null {
  return addHijriBusinessDays(date, -amount, options)
}
