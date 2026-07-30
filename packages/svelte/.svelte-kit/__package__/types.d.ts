import type {
  CalendarDay,
  CalendarMonth,
  CalendarState,
  CalendarStore,
  Matcher,
  WeekDayFormat,
  WeekStartsOn,
} from '@taqwim/calendar-core'
import type { HijriDateObject } from '@taqwim/core'
import type { Snippet } from 'svelte'
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements'
/**
 * Deliberately the same names as the Vue, React and Solid adapters.
 *
 * Parity is a hard requirement — the shared end-to-end suite runs one spec file
 * against every framework — so the surfaces differ only where the host
 * framework forces it (snippets instead of slots, callbacks instead of events).
 */
export interface HijriCalendarRootOptions {
  /** Initial selection, for uncontrolled use. */
  defaultValue?: HijriDateObject | HijriDateObject[]
  /** Controlled selection. Bindable. */
  value?: HijriDateObject | HijriDateObject[] | undefined
  onValueChange?: (value: HijriDateObject | HijriDateObject[] | undefined) => void
  /** Month to display when nothing is selected. */
  defaultPlaceholder?: HijriDateObject
  /** Controlled placeholder. Bindable. */
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
  Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'dir'> & {
    children?: Snippet<[HijriCalendarRenderProps]>
  }
export type DivProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>
export type ButtonProps = Omit<HTMLButtonAttributes, 'children' | 'onclick' | 'type'>
export type HijriCalendarCellProps = DivProps & {
  day: CalendarDay
  children?: Snippet
}
export type HijriCalendarCellTriggerProps = ButtonProps & {
  day: CalendarDay
  children?: Snippet<
    [
      {
        dayValue: string
        day: CalendarDay
      },
    ]
  >
}
export type HijriCalendarGridProps = DivProps & {
  /** Optional for the single-month case, where it defaults to the only month. */
  month?: CalendarMonth
  children?: Snippet<[CalendarMonth]>
}
/** The option names, so the root can tell them from DOM attributes. */
export declare const OPTION_KEYS: Set<string>
export declare function splitCalendarProps(props: Record<string, unknown>): {
  options: Record<string, unknown>
  domProps: Record<string, unknown>
}
