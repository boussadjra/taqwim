import { resolveCalendarSystem } from './calendarSystem'
import { isValidHijriDate } from './isValidHijriDate'
import type { HijriDateObject } from './types'
import { DEFAULT_WEEKEND, shiftBusinessDays, type BusinessDayOptions } from './weekend'

/**
 * Add the specified number of business days to the given date, skipping
 * weekend days. The weekend defaults to Friday/Saturday — the working week
 * across most of the Arab world — and is configurable.
 *
 * @category Day Helpers
 *
 * @param date - The date to be changed
 * @param amount - The amount of business days to be added.
 * @param options - Business-day options, e.g. `{ weekend: [6, 0] }` for a Sat/Sun weekend.
 *
 * @returns The new date with the business days added, or `null` if `date` is invalid.
 *
 * @example
 * // Add 20 business days to 1 Ramadan 1445
 * addHijriBusinessDays({ hy: 1445, hm: 9, hd: 1 }, 20)
 * //=> { hy: 1445, hm: 9, hd: 29 }
 *
 * @example
 * // Western Saturday/Sunday weekend
 * addHijriBusinessDays({ hy: 1445, hm: 9, hd: 1 }, 5, { weekend: [6, 0] })
 */
export function addHijriBusinessDays(
  date: HijriDateObject,
  amount: number,
  options: BusinessDayOptions = {},
): HijriDateObject | null {
  if (!date || !isValidHijriDate(date, options)) {
    return null
  }

  const calendarSystem = resolveCalendarSystem(options)
  const epochDay = calendarSystem.toEpochDay(date)
  if (epochDay === null) {
    return null
  }

  const shifted = shiftBusinessDays(epochDay, amount, options.weekend ?? DEFAULT_WEEKEND)
  return calendarSystem.fromEpochDay(shifted)
}
