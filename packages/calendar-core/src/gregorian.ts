import {
  getDaysLengthInMonth,
  islamicUmmAlQura,
  toGregorian,
  type HijriCalendarSystem,
  type HijriDateObject,
} from '@taqwim/core'
import { startOfMonth } from './dateUtils'

export type DateEmphasis = 'hijri' | 'gregorian'

/** Default `Intl.DateTimeFormatOptions` for DatePicker Gregorian input (~`YYYY-MM-DD`). */
export const DEFAULT_GREGORIAN_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  calendar: 'gregory',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}

const GREGORY: Intl.DateTimeFormatOptions = { calendar: 'gregory' }

function gregorianFormatter(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(locale, { ...GREGORY, ...options })
}

/** ISO-like `YYYY-MM-DD` in local calendar parts — deterministic for tests. */
export function formatGregorianIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatGregorianDate(
  date: Date,
  locale: string,
  options: Intl.DateTimeFormatOptions = DEFAULT_GREGORIAN_FORMAT_OPTIONS,
): string {
  return gregorianFormatter(locale, options).format(date)
}

export function gregorianDayOfMonth(date: Date, locale: string): string {
  return gregorianFormatter(locale, { day: 'numeric' }).format(date)
}

/** Compact secondary label, e.g. `18 Mar`. */
export function gregorianShortDate(date: Date, locale: string): string {
  return gregorianFormatter(locale, { day: 'numeric', month: 'short' }).format(date)
}

export function gregorianFullDate(date: Date, locale: string): string {
  return gregorianFormatter(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/**
 * Gregorian period spanned by a Hijri month.
 *
 * A Hijri month often crosses two Gregorian months (or years), so the range is
 * derived from the first and last day of the Hijri month — never from day 1 alone.
 * Including both boundary days makes the secondary day numbers in the grid
 * understandable without squeezing month names into every cell.
 */
export function gregorianMonthRange(
  month: HijriDateObject,
  locale: string,
  calendarSystem: HijriCalendarSystem = islamicUmmAlQura,
): string {
  const first = startOfMonth(month)
  const daysInMonth = getDaysLengthInMonth(month.hy, month.hm, { calendarSystem })
  const last: HijriDateObject = { hy: month.hy, hm: month.hm, hd: daysInMonth }

  const start = toGregorian(first, { calendarSystem })!
  const end = toGregorian(last, { calendarSystem })!

  return gregorianFormatter(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).formatRange(start, end)
}

export function toGregorianDate(hijri: HijriDateObject, calendarSystem: HijriCalendarSystem = islamicUmmAlQura): Date {
  return toGregorian(hijri, { calendarSystem })!
}

export function deriveGregorianValue(
  value: HijriDateObject | HijriDateObject[] | undefined,
  calendarSystem: HijriCalendarSystem = islamicUmmAlQura,
): Date | Date[] | undefined {
  if (value === undefined) return undefined
  try {
    if (Array.isArray(value)) return value.map(date => toGregorianDate(date, calendarSystem))
    return toGregorianDate(value, calendarSystem)
  } catch {
    // Controlled Hijri fields are preserved when a runtime strategy switch
    // makes them invalid; there is no corresponding absolute date to expose.
    return undefined
  }
}
