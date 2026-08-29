export const SUPPORTED_LOCALES = ['en', 'ar', 'fr'] as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

const localeSet = new Set<string>(SUPPORTED_LOCALES)

/** Locales bundled with `@taqwim/core` for Hijri month/weekday names and Gregorian formatting. */
export const availablelocales: Record<SupportedLocale, true> = {
  en: true,
  ar: true,
  fr: true,
}

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return localeSet.has(locale)
}
