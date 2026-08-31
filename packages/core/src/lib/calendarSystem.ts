import { islamicUmmAlQura } from './calendars/islamic-umalqura'
import type { HijriCalendarSystem, HijriCalendarSystemOptions } from './calendars/types'
import { HijriRangeError } from './errors'
import { epochDayToDate } from './hDatesIndex'
import type { HijriDateObject } from './types'

export function resolveCalendarSystem(options?: HijriCalendarSystemOptions): HijriCalendarSystem {
  return options?.calendarSystem ?? islamicUmmAlQura
}

export function shiftWithCalendar(
  date: HijriDateObject,
  amount: number,
  calendarSystem: HijriCalendarSystem,
): HijriDateObject | null {
  const epochDay = calendarSystem.toEpochDay(date)
  if (epochDay === null) return null

  const targetEpochDay = epochDay + amount
  const shifted = calendarSystem.fromEpochDay(targetEpochDay)
  if (shifted === null && calendarSystem.id === 'islamic-umalqura') {
    throw HijriRangeError.forGregorianDate(epochDayToDate(targetEpochDay))
  }

  return shifted
}

export function dayOfWeekWithCalendar(date: HijriDateObject, calendarSystem: HijriCalendarSystem): number | undefined {
  const epochDay = calendarSystem.toEpochDay(date)
  return epochDay === null ? undefined : (((epochDay + 4) % 7) + 7) % 7
}
