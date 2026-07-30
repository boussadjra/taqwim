import type {
  CalendarMonth,
  CalendarState,
  CalendarStore,
  Matcher,
  WeekDayFormat,
  WeekStartsOn,
} from '@taqwim/calendar-core'
import type { HijriDateObject } from '@taqwim/core'
import type { ReactNode } from 'react'

/**
 * Deliberately the same names as the Vue adapter's props.
 *
 * Parity is a hard requirement — the shared end-to-end suite runs one spec file
 * against every framework — so the two surfaces differ only where the host
 * framework forces it (`children` vs slots, `onValueChange` vs `v-model`).
 */
export interface HijriCalendarRootProps {
  /** Initial selection, for uncontrolled use. */
  defaultValue?: HijriDateObject | HijriDateObject[]
  /** Controlled selection. */
  value?: HijriDateObject | HijriDateObject[] | undefined
  onValueChange?: (value: HijriDateObject | HijriDateObject[] | undefined) => void

  /** Month to display when nothing is selected. */
  defaultPlaceholder?: HijriDateObject
  /** Controlled placeholder. */
  placeholder?: HijriDateObject
  onPlaceholderChange?: (placeholder: HijriDateObject) => void

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
  dir?: 'ltr' | 'rtl'
  isDateDisabled?: Matcher
  isDateUnavailable?: Matcher
  nextPage?: (placeholder: HijriDateObject) => HijriDateObject
  prevPage?: (placeholder: HijriDateObject) => HijriDateObject

  /** Focus the selected day, today, or the first of the month on mount. */
  initialFocus?: boolean

  /** Render-prop form of Vue's default slot. */
  children?: ReactNode | ((props: HijriCalendarRenderProps) => ReactNode)
}

export interface HijriCalendarRenderProps {
  months: CalendarMonth[]
  weekDays: string[]
  state: CalendarState
  store: CalendarStore
}
