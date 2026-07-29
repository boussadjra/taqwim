import { computed, ref, type Ref } from 'vue'
import { getLocaleData } from '@taqwim/core'

export interface HijriLocaleData {
  monthsLong: string[]
  monthsMedium: string[]
  monthsShort: string[]
  weekDaysLong: string[]
  weekDaysMedium: string[]
  weekDaysShort: string[]
  today: string
  day: string
  days: string
  week: string
  weeks: string
  month: string
  months: string
  year: string
  years: string
  from: string
  to: string
}

export type SupportedLocale = 'en' | 'ar' | 'fr'

export const SUPPORTED_LOCALES: SupportedLocale[] = ['en', 'ar', 'fr']

/**
 * Composable for managing Hijri locale data
 * Provides locale-specific month names, weekdays, and other text
 */
export function useHijriLocale(locale?: Ref<string> | string) {
  const localeRef = ref(locale || 'en')

  // Computed locale data
  const localeData = computed<HijriLocaleData>(() => {
    const currentLocale = typeof localeRef.value === 'string' ? localeRef.value : localeRef.value

    return {
      monthsLong: getLocaleData(currentLocale, 'monthsLong') as string[],
      monthsMedium: getLocaleData(currentLocale, 'monthsMedium') as string[],
      monthsShort: getLocaleData(currentLocale, 'monthsShort') as string[],
      weekDaysLong: getLocaleData(currentLocale, 'weekDaysLong') as string[],
      weekDaysMedium: getLocaleData(currentLocale, 'weekDaysMedium') as string[],
      weekDaysShort: getLocaleData(currentLocale, 'weekDaysShort') as string[],
      today: getLocaleData(currentLocale, 'today') as string,
      day: getLocaleData(currentLocale, 'day') as string,
      days: getLocaleData(currentLocale, 'days') as string,
      week: getLocaleData(currentLocale, 'week') as string,
      weeks: getLocaleData(currentLocale, 'weeks') as string,
      month: getLocaleData(currentLocale, 'month') as string,
      months: getLocaleData(currentLocale, 'months') as string,
      year: getLocaleData(currentLocale, 'year') as string,
      years: getLocaleData(currentLocale, 'years') as string,
      from: getLocaleData(currentLocale, 'from') as string,
      to: getLocaleData(currentLocale, 'to') as string,
    }
  })

  // Helper to check if locale is RTL
  const isRtl = computed(() => {
    const currentLocale = typeof localeRef.value === 'string' ? localeRef.value : localeRef.value
    return currentLocale === 'ar'
  })

  // Helper to get direction
  const direction = computed(() => (isRtl.value ? 'rtl' : 'ltr'))

  // Helper to check if locale is supported
  const isLocaleSupported = (locale: string): locale is SupportedLocale => {
    return SUPPORTED_LOCALES.includes(locale as SupportedLocale)
  }

  // Method to set locale
  const setLocale = (newLocale: string) => {
    if (isLocaleSupported(newLocale)) {
      if (typeof localeRef.value === 'string') {
        localeRef.value = newLocale
      } else {
        localeRef.value = newLocale
      }
    } else {
      console.warn(`Locale "${newLocale}" is not supported. Using "en" as fallback.`)
      if (typeof localeRef.value === 'string') {
        localeRef.value = 'en'
      } else {
        localeRef.value = 'en'
      }
    }
  }

  return {
    locale: localeRef,
    localeData,
    isRtl,
    direction,
    isLocaleSupported,
    setLocale,
    SUPPORTED_LOCALES,
  }
}
