import { HijriRangeError } from './errors'
import { daysInHijriMonth, epochDayOf, recordForEpochDay } from './hDatesIndex'
import { parseIsoDate } from './parseIsoDate'
import type { HijriDateObject } from './types'

interface DateObject {
  year: number
  month: number
  day: number
}

export function toHijri(date: DateObject | Date): HijriDateObject | null
export function toHijri(year: number, month: number, day: number): HijriDateObject | null
export function toHijri(date: string): HijriDateObject | null

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
  month?: number,
  day?: number,
): HijriDateObject | null {
  let gregorianDate: Date

  if (dateOrYear === null) {
    throw new Error('Invalid Gregorian date')
  }
  if (typeof dateOrYear === 'string') {
    gregorianDate = parseIsoDate(dateOrYear)
  } else if (typeof dateOrYear === 'number') {
    if (month === undefined || day === undefined) {
      throw new Error('Invalid arguments')
    }
    gregorianDate = new Date(dateOrYear, month - 1, day)
  } else if (dateOrYear instanceof Date) {
    gregorianDate = dateOrYear
  } else {
    gregorianDate = new Date(dateOrYear.year, dateOrYear.month - 1, dateOrYear.day)
  }

  if (!(gregorianDate instanceof Date) || Number.isNaN(gregorianDate.getTime())) {
    throw new Error('Invalid Gregorian date')
  }

  const epochDay = epochDayOf(gregorianDate)
  const found = recordForEpochDay(epochDay)

  if (!found) {
    throw HijriRangeError.forGregorianDate(gregorianDate)
  }

  const { record, startEpochDay } = found
  let remainingDays = epochDay - startEpochDay
  let hijriMonth = 12

  for (let i = 0; i < 12; i++) {
    const daysThisMonth = daysInHijriMonth(record.dpm, i + 1)
    if (remainingDays < daysThisMonth) {
      hijriMonth = i + 1
      break
    }
    remainingDays -= daysThisMonth
  }

  return { hy: record.hy, hm: hijriMonth, hd: remainingDays + 1 }
}
