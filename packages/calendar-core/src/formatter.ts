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
    monthYear: date => format(date, 'iMMM iYYYY'),
    fullDate: date => format(date, 'iEEEE, iDD iMMMM iYYYY'),
    isoDate: date => format(date, 'iYYYY-iMM-iDD'),
  }
}
