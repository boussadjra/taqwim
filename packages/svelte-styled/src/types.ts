import type { CalendarDay, HijriCalendarRootOptions } from '@taqwim/svelte'
import type { Component, Snippet } from 'svelte'

export type HijriCalendarTheme =
  | 'default'
  | 'dark'
  | 'modern'
  | 'islamic'
  | 'minimal'
  | 'minimalist'
  | 'neon'
  | 'ocean'
  | 'sunset'
  | 'cyberpunk'
  | 'nature'
  | 'luxurious'
  | 'material'

export type HijriCalendarSize = 'compact' | 'default' | 'large'

export interface HijriCalendarProps extends HijriCalendarRootOptions {
  /**
   * Which bundled theme to render with.
   *
   * Applied as `data-taqwim-theme`, so it can also be set on any ancestor to
   * theme a whole subtree, and changed at runtime without swapping stylesheets.
   * @default 'default'
   */
  theme?: HijriCalendarTheme
  /** @default 'default' */
  size?: HijriCalendarSize
  /** Show the previous/next paging buttons. @default true */
  showNavigation?: boolean
  /** Show the weekday label row. @default true */
  showWeekdays?: boolean
  /** Let the heading open month and year pickers. @default true */
  selectableHeading?: boolean
  /** Replace the default chevrons. */
  navigationIcons?: { prev?: Component; next?: Component }
  /** Replaces the contents of a day cell. */
  cell?: Snippet<[{ dayValue: string; day: CalendarDay }]>
  /** Replaces a weekday label. */
  weekday?: Snippet<[{ weekday: string; index: number }]>
}

export interface HijriDatePickerProps extends Omit<HijriCalendarProps, 'value' | 'onValueChange' | 'multiple'> {
  /** Controlled selection. */
  value?: import('@taqwim/core').HijriDateObject
  onValueChange?: (value: import('@taqwim/core').HijriDateObject | undefined) => void
  /** Pattern used for the input's text, e.g. `'iD iMMMM iYYYY'`. @default 'iYYYY-iMM-iDD' */
  format?: string
  /** Placeholder text for the empty input. */
  inputPlaceholder?: string
  /** Accessible label for the input. @default 'Hijri date' */
  label?: string
  /** Let the user type a date as well as pick one. @default true */
  editable?: boolean
}
