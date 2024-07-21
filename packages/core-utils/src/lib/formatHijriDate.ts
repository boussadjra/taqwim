import { format, getDay, set } from 'date-fns'
import { getLocaleData, toGregorian } from '.'
import { availablelocales } from './locales/availableLocales'
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
): string {
  const hmMedium = getLocaleData(locale, 'monthsMedium')
  const hmLong = getLocaleData(locale, 'monthsLong')
  const hwShort = getLocaleData(locale, 'weekDaysShort')
  const hwLong = getLocaleData(locale, 'weekDaysLong')
  const hwNumeric = [0, 1, 2, 3, 4, 5, 6]
  const gregorianDate = toGregorian(hijriDate) ?? new Date()

  if (!Object.prototype.hasOwnProperty.call(availablelocales, locale)) {
    throw new Error(`The locale "${locale}" is not supported.`)
  }

  return formatStr.replace(
    /\biYYYY\b|\biYY\b|\biMM\b|\biM\b|\biMMM\b|\biMMMM\b|\biDD\b|\biD\b|\biE\b|\biEEE\b|\biEEEE\b|\byyyy\b|\byy\b|\bMM\b|\bM\b|\bMo\b|\bMMM\b|\bMMMM\b|\bdd\b|\bd\b|\bE\b|\bEEE\b|\bEEEE\b|\bG\b|\bGG\b|\bGGG\b|\bGGGG\b|\bGGGGG\b|\by\b|\byo\b|\byyy\b|\byyyyy\b|\bY\b|\bYo\b|\bYY\b|\bYYY\b|\bYYYY\b|\bYYYYY\b|\bR\b|\bRR\b|\bRRR\b|\bRRRR\b|\bRRRRR\b|\bu\b|\buu\b|\buuu\b|\buuuu\b|\buuuuu\b|\bQ\b|\bQo\b|\bQQ\b|\bQQQ\b|\bQQQQ\b|\bQQQQQ\b|\bq\b|\bqo\b|\bqq\b|\bqqq\b|\bqqqq\b|\bqqqqq\b|\bL\b|\bLo\b|\bLL\b|\bLLL\b|\bLLLL\b|\bLLLLL\b|\bw\b|\bwo\b|\bww\b|\bI\b|\bIo\b|\bII\b|\bD\b|\bDo\b|\bDD\b|\bDDD\b|\bDDDD\b|\be\b|\beo\b|\bee\b|\beee\b|\beeee\b|\beeeee\b|\beeeeee\b|\bc\b|\bco\b|\bcc\b|\bccc\b|\bcccc\b|\b[HHhmsaiozZ]+\b/g,
    match => {
      const simulatedGregDate = set(new Date(), {
        year: hijriDate.hy,
        month: hijriDate.hm - 1,
        date: hijriDate.hd,
      })

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
          return String(hwNumeric[getDay(gregorianDate)])
        case 'iEEE':
          return hwShort[getDay(gregorianDate)]
        case 'iEEEE':
          return hwLong[getDay(gregorianDate)]

        // the following patterns are the same for Gregorian only

        case 'yyyy':
        case 'yy':
        case 'MM':
        case 'M':
        case 'Mo':
        case 'MMM':
        case 'MMMM':
        case 'dd':
        case 'd':
        case 'E':
        case 'EEE':
        case 'EEEE':
        case 'G':
        case 'GG':
        case 'GGG':
        case 'GGGG':
        case 'GGGGG':
        case 'y':
        case 'yo':
        case 'yyy':
        case 'yyyyy':
        case 'Y':
        case 'Yo':
        case 'YY':
        case 'YYY':
        case 'YYYY':
        case 'YYYYY':
        case 'R':
        case 'RR':
        case 'RRR':
        case 'RRRR':
        case 'RRRRR':
        case 'u':
        case 'uu':
        case 'uuu':
        case 'uuuu':
        case 'uuuuu':
        case 'Q':
        case 'Qo':
        case 'QQ':
        case 'QQQ':
        case 'QQQQ':
        case 'QQQQQ':
        case 'q':
        case 'qo':
        case 'qq':
        case 'qqq':
        case 'qqqq':
        case 'qqqqq':
        case 'L':
        case 'Lo':
        case 'LL':
        case 'LLL':
        case 'LLLL':
        case 'LLLLL':
        case 'w':
        case 'wo':
        case 'ww':
        case 'I':
        case 'Io':
        case 'II':
        case 'D':
        case 'Do':
        case 'DD':
        case 'DDD':
        case 'DDDD':
        case 'e':
        case 'eo':
        case 'ee':
        case 'eee':
        case 'eeee':
        case 'eeeee':
        case 'eeeeee':
        case 'c':
        case 'co':
        case 'cc':
        case 'ccc':
        case 'cccc':
          // get the corresponding Gregorian date
          if (!gregorianDate) return ''
          return format(gregorianDate, match, {
            locale: availablelocales[locale],
          })

        // The following patterns are the same for both Gregorian and Hijri
        case 'HH':
        case 'H':
        case 'hh':
        case 'h':
        case 'mm':
        case 'm':
        case 'ss':
        case 's':
        case 'a':
        case 'iooo':
        case 'ioooo':
        case 'z':
        case 'zz':
        case 'Z':
          return format(simulatedGregDate, match)
        default:
          return match
      }
    },
  )
}
