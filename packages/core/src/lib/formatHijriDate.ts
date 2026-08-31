import { getLocaleData } from '.'
import { resolveCalendarSystem } from './calendarSystem'
import { formatGregorianToken } from './formatGregorian'
import { isSupportedLocale } from './locales/availableLocales'
import { toGregorianWithCalendar } from './toGregorianWithCalendar'
import type { HijriCalendarSystemOptions } from './types'

const FORMAT_TOKEN =
  /\biYYYY\b|\biYY\b|\biMM\b|\biM\b|\biMMM\b|\biMMMM\b|\biDD\b|\biD\b|\biE\b|\biEEE\b|\biEEEE\b|\byyyy\b|\byy\b|\by\b|\bMM\b|\bM\b|\bMMM\b|\bMMMM\b|\bdd\b|\bd\b|\bE\b|\bEEE\b|\bEEEE\b/g

/**
 * Formats a Hijri date based on the provided format string.
 * @param hijriDate - The Hijri date object containing the year, month, and day.
 * @param formatStr - The format string specifying how the Hijri date should be formatted.
 * @param locale - The locale to use for formatting the date. Defaults to "en".
 * @returns The formatted Hijri date as a string.
 *
 * @example
 * formatHijriDate({ hy: 1443, hm: 3, hd: 10 }, "iYYYY/iMM/iDD", "ar");
 * //=> "1443/03/10"
 *
 * @example
 * formatHijriDate({ hy: 1443, hm: 3, hd: 10 }, "iD iMMM, iYYYY", "en");
 * //=> "10 Rabiʻ II, 1443"
 *
 * @example
 * formatHijriDate({ hy: 1443, hm: 3, hd: 10 }, "iEEEE, iD iMMMM iYYYY", "ar");
 * //=> "الأحد, 10 جمادى الثاني 1443"
 *
 * @example
 * formatHijriDate({ hy: 1443, hm: 3, hd: 10 }, "iE, iD iMMM iYYYY", "en");
 * //=> "7, 10 Rabiʻ II 1443"
 *
 * @example
 * formatHijriDate({ hy: 1443, hm: 3, hd: 10 }, "iD iMMM, iYYYY", "fr");
 * //=> "10 Rabiʻ II, 1443"
 *
 * @example
 * formatHijriDate({ hy: 1443, hm: 3, hd: 10 }, "iD iMMM, iYYYY", "ar");
 * //=> "10 ربيع الثاني, 1443"
 *
 * @example
 * formatHijriDate({ hy: 1443, hm: 3, hd: 10 }, "iD iMMM, iYYYY", "en");
 * //=> "10 Rabiʻ II, 1443"
 */
export function formatHijriDate(
  hijriDate: { hy: number; hm: number; hd: number },
  formatStr: string,
  locale = 'en',
  options?: HijriCalendarSystemOptions,
): string {
  if (!isSupportedLocale(locale)) {
    throw new Error(`The locale "${locale}" is not supported.`)
  }

  const gregorianDate = toGregorianWithCalendar(hijriDate, resolveCalendarSystem(options))
  if (!gregorianDate) {
    throw new Error('Invalid Hijri date')
  }

  const hmMedium = getLocaleData(locale, 'monthsMedium')
  const hmLong = getLocaleData(locale, 'monthsLong')
  const hwShort = getLocaleData(locale, 'weekDaysShort')
  const hwLong = getLocaleData(locale, 'weekDaysLong')
  const hwNumeric = [0, 1, 2, 3, 4, 5, 6]
  const dayOfWeek = gregorianDate.getDay()

  return formatStr.replace(FORMAT_TOKEN, match => {
    switch (match) {
      case 'iYYYY':
        return String(hijriDate.hy).padStart(4, '0')
      case 'iYY':
        return String(hijriDate.hy % 100).padStart(2, '0')
      case 'iMM':
        return String(hijriDate.hm).padStart(2, '0')
      case 'iM':
        return String(hijriDate.hm)
      case 'iMMM':
        return hmMedium[hijriDate.hm - 1]
      case 'iMMMM':
        return hmLong[hijriDate.hm - 1]
      case 'iDD':
        return String(hijriDate.hd).padStart(2, '0')
      case 'iD':
        return String(hijriDate.hd)
      case 'iE':
        return String(hwNumeric[dayOfWeek])
      case 'iEEE':
        return hwShort[dayOfWeek]
      case 'iEEEE':
        return hwLong[dayOfWeek]
      default:
        return formatGregorianToken(gregorianDate, match, locale)
    }
  })
}
