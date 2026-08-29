import { dayOfWeekForGregorianDate, gregorianPartsFromDate } from './hijriEpoch'

const BCP47_LOCALES: Record<string, string> = {
  en: 'en-US',
  ar: 'ar',
  fr: 'fr',
}

const intlCache = new Map<string, Intl.DateTimeFormat>()

function intlLocale(locale: string): string {
  return BCP47_LOCALES[locale] ?? locale
}

function getFormatter(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale}:${JSON.stringify(options)}`
  let formatter = intlCache.get(key)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(intlLocale(locale), { calendar: 'gregory', ...options })
    intlCache.set(key, formatter)
  }
  return formatter
}

/** Format a Gregorian calendar field with explicit `gregory` semantics. */
export function formatGregorianToken(date: Date, token: string, locale: string): string {
  const { year, month, day } = gregorianPartsFromDate(date)
  const dayOfWeek = dayOfWeekForGregorianDate(date)

  switch (token) {
    case 'yyyy':
      return String(year)
    case 'yy':
      return String(year % 100).padStart(2, '0')
    case 'y':
      return String(year)
    case 'MM':
      return String(month).padStart(2, '0')
    case 'M':
      return String(month)
    case 'dd':
      return String(day).padStart(2, '0')
    case 'd':
      return String(day)
    case 'MMM':
      return getFormatter(locale, { month: 'short' }).format(date)
    case 'MMMM':
      return getFormatter(locale, { month: 'long' }).format(date)
    case 'E':
      return String(dayOfWeek)
    case 'EEE':
      return getFormatter(locale, { weekday: 'short' }).format(date)
    case 'EEEE':
      return getFormatter(locale, { weekday: 'long' }).format(date)
    default:
      return token
  }
}
