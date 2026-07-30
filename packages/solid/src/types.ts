import type {
  CalendarMonth,
  CalendarState,
  CalendarStore,
  Matcher,
  WeekDayFormat,
  WeekStartsOn,
} from '@taqwim/calendar-core'
import type { HijriDateObject } from '@taqwim/core'
import type { JSX } from 'solid-js'

/**
 * Deliberately the same names as the Vue and React adapters.
 *
 * Parity is a hard requirement — the shared end-to-end suite runs one spec file
 * against every framework — so the surfaces differ only where the host
 * framework forces it.
 */
export interface HijriCalendarRootOptions {
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
}

export interface HijriCalendarRenderProps {
  months: CalendarMonth[]
  weekDays: string[]
  state: CalendarState
  store: CalendarStore
}

export type HijriCalendarRootProps = HijriCalendarRootOptions &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children' | 'dir'> & {
    /** A render function is the Solid equivalent of Vue's scoped slot. */
    children?: JSX.Element | ((props: HijriCalendarRenderProps) => JSX.Element)
  }

/** The option names, so the root can tell them from DOM attributes. */
export const OPTION_KEYS = [
  'defaultValue',
  'value',
  'onValueChange',
  'defaultPlaceholder',
  'placeholder',
  'onPlaceholderChange',
  'weekStartsOn',
  'weekdayFormat',
  'calendarLabel',
  'fixedWeeks',
  'numberOfMonths',
  'pagedNavigation',
  'multiple',
  'preventDeselect',
  'disableDaysOutsideCurrentView',
  'disabled',
  'readonly',
  'minValue',
  'maxValue',
  'locale',
  'dir',
  'isDateDisabled',
  'isDateUnavailable',
  'nextPage',
  'prevPage',
] as const
