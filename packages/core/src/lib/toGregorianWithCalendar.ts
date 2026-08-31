import { islamicUmmAlQura } from './calendars/islamic-umalqura'
import type { HijriCalendarSystem } from './calendars/types'
import { HijriRangeError } from './errors'
import { epochDayToDate, MAX_HIJRI_YEAR, MIN_HIJRI_YEAR } from './hDatesIndex'
import type { HijriDateObject } from './types'

/** Convert validated date parts with one explicit calendar strategy. */
export function toGregorianWithCalendar(date: HijriDateObject, calendarSystem: HijriCalendarSystem): Date | null {
  if (calendarSystem === islamicUmmAlQura && (date.hy < MIN_HIJRI_YEAR || date.hy > MAX_HIJRI_YEAR)) {
    throw HijriRangeError.forHijriYear(date.hy)
  }

  const epochDay = calendarSystem.toEpochDay(date)
  if (epochDay === null) {
    throw new Error('Invalid Hijri date')
  }

  if (epochDay < -100_000_000 || epochDay > 100_000_000) return null
  return epochDayToDate(epochDay)
}
