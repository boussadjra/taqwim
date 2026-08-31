import { HijriRangeError } from './errors'
import { epochDayOf } from './hDatesIndex'
import { parseIsoDate } from './parseIsoDate'
import { resolveCalendarSystem } from './calendarSystem'
import type { HijriCalendarSystemOptions, HijriDateObject } from './types'

interface DateObject {
  year: number
  month: number
  day: number
}

export function toHijri(date: DateObject | Date, options?: HijriCalendarSystemOptions): HijriDateObject | null
export function toHijri(
  year: number,
  month: number,
  day: number,
  options?: HijriCalendarSystemOptions,
): HijriDateObject | null
export function toHijri(date: string, options?: HijriCalendarSystemOptions): HijriDateObject | null

/**
 * Converts a Gregorian date to Hijri (Islamic) date.
 * @param dateOrYear - The Gregorian date or year to convert.
 * @param month - The month of the Gregorian date (optional, required if `dateOrYear` is a number).
 * @param day - The day of the Gregorian date (optional, required if `dateOrYear` is a number).
 * @returns An object representing the Hijri date in the format `{ hy: number; hm: number; hd: number }`.
 * @throws {Error} If the input is not a usable Gregorian date.
 * @throws {HijriRangeError} If the date falls outside the Umm al-Qura table's coverage.
 */
export function toHijri(
  dateOrYear: DateObject | Date | string | number | null,
  monthOrOptions?: number | HijriCalendarSystemOptions,
  day?: number,
  options?: HijriCalendarSystemOptions,
): HijriDateObject | null {
  let gregorianDate: Date
  const calendarOptions = typeof monthOrOptions === 'object' ? monthOrOptions : options

  if (dateOrYear === null) {
    throw new Error('Invalid Gregorian date')
  }
  if (typeof dateOrYear === 'string') {
    gregorianDate = parseIsoDate(dateOrYear)
  } else if (typeof dateOrYear === 'number') {
    if (typeof monthOrOptions !== 'number' || day === undefined) {
      throw new Error('Invalid arguments')
    }
    gregorianDate = new Date(dateOrYear, monthOrOptions - 1, day)
  } else if (dateOrYear instanceof Date) {
    gregorianDate = dateOrYear
  } else {
    gregorianDate = new Date(dateOrYear.year, dateOrYear.month - 1, dateOrYear.day)
  }

  if (!(gregorianDate instanceof Date) || Number.isNaN(gregorianDate.getTime())) {
    throw new Error('Invalid Gregorian date')
  }

  const epochDay = epochDayOf(gregorianDate)
  const result = resolveCalendarSystem(calendarOptions).fromEpochDay(epochDay)

  if (!result) {
    throw HijriRangeError.forGregorianDate(gregorianDate)
  }
  return result
}
