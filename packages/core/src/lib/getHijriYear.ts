import type { hDates } from './hDates'
import { epochDayOf, hijriYearStartEpochDay, recordForEpochDay } from './hDatesIndex'

/**
 * Returns the Umm al-Qura table record whose Hijri year *starts* on the given
 * Gregorian date, or `undefined` if no Hijri year begins on that day.
 */
export function getHijriYear(closestDate: Date): hDates | undefined {
  const epochDay = epochDayOf(closestDate)
  const found = recordForEpochDay(epochDay)

  if (!found) {
    return undefined
  }

  return hijriYearStartEpochDay(found.record.hy) === epochDay ? found.record : undefined
}
