import type { Matcher, WeekDayFormat, WeekStartsOn } from '@taqwim/calendar-core'
import type { HijriDateObject } from '@taqwim/core'

export type { Matcher, WeekDayFormat, WeekStartsOn }

/**
 * Deliberately the same names as the Vue, React, Solid and Svelte adapters.
 *
 * Parity is a hard requirement — the shared end-to-end suite runs one spec file
 * against every framework — so the surfaces differ only where the host
 * framework forces it (`@Output` events instead of callback props).
 */
export interface HijriCalendarInputs {
  defaultValue?: HijriDateObject | HijriDateObject[]
  value?: HijriDateObject | HijriDateObject[]
  defaultPlaceholder?: HijriDateObject
  placeholder?: HijriDateObject
  weekStartsOn?: WeekStartsOn
  weekdayFormat?: WeekDayFormat
  calendarLabel?: string
  fixedWeeks?: boolean
  numberOfMonths?: number
  pagedNavigation?: boolean
  multiple?: boolean
  preventDeselect?: boolean
  disableDaysOutsideCurrentView?: boolean
  disabled?: boolean
  readonly?: boolean
  minValue?: HijriDateObject
  maxValue?: HijriDateObject
  locale?: string
  showGregorian?: boolean
  dateEmphasis?: import('@taqwim/calendar-core').DateEmphasis
  gregorianLocale?: string
  dir?: 'ltr' | 'rtl'
  isDateDisabled?: Matcher
  isDateUnavailable?: Matcher
  nextPage?: (placeholder: HijriDateObject) => HijriDateObject
  prevPage?: (placeholder: HijriDateObject) => HijriDateObject
  initialFocus?: boolean
}
