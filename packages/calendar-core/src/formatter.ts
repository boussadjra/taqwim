import { formatHijriDate, type HijriDateObject } from '@taqwim/core'
import type { CalendarFormatter } from './types'

/**
 * Locale-bound formatting helpers.
 *
 * Replaces the previous untyped `formatter: any` context value, and gives
 * every framework adapter the same label and `data-value` strings — which is
 * what lets one shared e2e suite run against all of them.
 */
export function createFormatter(locale: string): CalendarFormatter {
  const format = (date: HijriDateObject, pattern: string) => formatHijriDate(date, pattern, locale)

  return {
    custom: format,
    dayOfMonth: date => format(date, 'iD'),
    /*
     * The full month name, not the abbreviation. `iMMM` rendered the Arabic
     * heading as "ربيع1 1448" — the abbreviations are built for narrow columns,
     * and a calendar heading has the whole width of the calendar.
     */
    monthYear: date => format(date, 'iMMMM iYYYY'),
    fullDate: date => format(date, 'iEEEE, iDD iMMMM iYYYY'),
    isoDate: date => format(date, 'iYYYY-iMM-iDD'),
  }
}
