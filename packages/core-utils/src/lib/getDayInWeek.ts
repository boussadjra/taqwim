import { toGregorian, ValidHijriDate, normalizeHijriDate } from '.'

/**
 * Returns the day of the week for a given Hijri date.
 *
 * @param hijriDate - The Hijri date to get the day of the week for.
 * @returns The day of the week as a number (0-6), where 0 represents Sunday, 1 represents Monday, and so on.
 *          Returns `undefined` if the provided Hijri date is invalid.
 */
export const getDayInWeek = (hijriDate: ValidHijriDate): number | undefined => {
  const normalizedHijriDate = normalizeHijriDate(hijriDate)
  const gregorianDate = toGregorian(normalizedHijriDate)
  return gregorianDate?.getDay()
}
