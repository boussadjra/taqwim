import type { ValidHijriDate } from '.'
import { normalizeHijriDate } from '.'
import { dayOfWeekWithCalendar, resolveCalendarSystem } from './calendarSystem'
import type { HijriCalendarSystemOptions } from './types'

/**
 * Returns the day of the week for a given Hijri date.
 *
 * @param hijriDate - The Hijri date to get the day of the week for.
 * @returns The day of the week as a number (0-6), where 0 represents Sunday, 1 represents Monday, and so on.
 *          Returns `undefined` if the provided Hijri date is invalid.
 */
export const getDayInWeek = (hijriDate: ValidHijriDate, options?: HijriCalendarSystemOptions): number | undefined => {
  const normalizedHijriDate = normalizeHijriDate(hijriDate)
  return dayOfWeekWithCalendar(normalizedHijriDate, resolveCalendarSystem(options))
}
