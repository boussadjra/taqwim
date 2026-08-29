import type { HijriDateObject } from '@taqwim/core'

export type Direction = 'ltr' | 'rtl'

/** Which calendar system's information is visually primary when both are shown. */
export type DateEmphasis = 'hijri' | 'gregorian'

/** Predicate over a Hijri date, used for the `isDateDisabled` / `isDateUnavailable` hooks. */
export type Matcher = (date: HijriDateObject) => boolean

/** Which set of weekday labels to render in the grid header. */
export type WeekDayFormat = 'weekDaysShort' | 'weekDaysMedium' | 'weekDaysLong'

/** Day of the week the grid starts on: 0 = Sunday .. 6 = Saturday. */
export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6

/** Formats a Hijri date with the calendar's active locale. */
export interface CalendarFormatter {
  /** Format with an explicit pattern, e.g. `'iD iMMMM iYYYY'`. */
  custom: (date: HijriDateObject, pattern: string) => string
  /** Day of month only, e.g. `'9'`. */
  dayOfMonth: (date: HijriDateObject) => string
  /** Month and year, e.g. `'Ramadan 1445'`. */
  monthYear: (date: HijriDateObject) => string
  /** Full accessible date, e.g. `'Monday, 09 Ramadan 1445'`. */
  fullDate: (date: HijriDateObject) => string
  /** Machine-readable `iYYYY-iMM-iDD`, used for `data-value`. */
  isoDate: (date: HijriDateObject) => string
  /** Gregorian day of month for a Hijri date, e.g. `'18'`. */
  gregorianDayOfMonth: (date: HijriDateObject) => string
  /** Compact Gregorian label, e.g. `'18 Mar'`. */
  gregorianShortDate: (date: HijriDateObject) => string
  /** Full Gregorian date, e.g. `'Monday, 18 March 2027'`. */
  gregorianFullDate: (date: HijriDateObject) => string
  /** Compact Hijri label for secondary display, e.g. `'9 Ramadan'`. */
  hijriShortDate: (date: HijriDateObject) => string
  /** Exact Gregorian span of a Hijri month, e.g. `'February 18 – March 19, 2026'`. */
  gregorianMonthRange: (month: HijriDateObject) => string
  /** Accessible label with both calendars when Gregorian display is enabled. */
  dualFullDate: (date: HijriDateObject) => string
}

export interface CalendarDay {
  date: HijriDateObject
  /** Corresponding Gregorian date, derived via `toGregorian`. */
  gregorianDate: Date
  /** Day number within its own Hijri month. */
  dayInMonth: number
  /** 0 = Sunday .. 6 = Saturday. */
  dayOfWeek: number
  /** True for the leading/trailing days borrowed from the adjacent months. */
  isOutsideMonth: boolean
  isToday: boolean
  isSelected: boolean
  isDisabled: boolean
  isUnavailable: boolean
  isFocused: boolean
  /**
   * Whether this is the one cell reachable with Tab.
   *
   * Distinct from `isFocused`: before the calendar has ever been focused
   * nothing is focused, but exactly one cell must still be tabbable or a
   * keyboard user cannot enter the grid at all.
   */
  isTabbable: boolean
}

export interface CalendarMonth {
  /** First day of the month this grid represents. */
  value: HijriDateObject
  /** Primary localised heading for this month grid. */
  label: string
  /** Secondary heading when `showGregorian` is enabled. */
  secondaryLabel?: string
  /** Rows of seven days, ordered by `weekStartsOn`. */
  weeks: CalendarDay[][]
}

export interface CalendarState {
  /** Which month the calendar is scrolled to. */
  placeholder: HijriDateObject
  value: HijriDateObject | HijriDateObject[] | undefined
  /** Selection converted to Gregorian via `toGregorian`, in the same order. */
  gregorianValue: Date | Date[] | undefined
  /** The roving-focus target. `undefined` until the calendar is focused. */
  focusedDate: HijriDateObject | undefined
  /** One entry per `numberOfMonths`. */
  months: CalendarMonth[]
  /** Weekday labels, already rotated to match `weekStartsOn`. */
  weekDays: string[]
  /** Primary heading for the first visible month. */
  headingValue: string
  /** Secondary heading when `showGregorian` is enabled. */
  secondaryHeadingValue?: string
  /** Accessible label for the calendar as a whole. */
  fullCalendarLabel: string
  /** Whether corresponding Gregorian dates are shown in the grid. */
  showGregorian: boolean
  /** Which calendar is visually primary when both are shown. */
  dateEmphasis: DateEmphasis
  /** Locale used for Gregorian formatting. */
  gregorianLocale: string
  /** True when the current value falls outside `minValue`/`maxValue`. */
  isInvalid: boolean
  isNextDisabled: boolean
  isPrevDisabled: boolean
  dir: Direction
  locale: string
  disabled: boolean
  readonly: boolean
  weekStartsOn: WeekStartsOn
  fixedWeeks: boolean
  multiple: boolean
}

export interface CalendarOptions {
  /** Initial selection for uncontrolled use. */
  defaultValue?: HijriDateObject | HijriDateObject[]
  /** Controlled selection. When set, the store will not mutate it directly. */
  value?: HijriDateObject | HijriDateObject[] | undefined
  /** Month to display when nothing is selected. Defaults to today. */
  defaultPlaceholder?: HijriDateObject
  placeholder?: HijriDateObject
  /** @default 0 (Sunday) */
  weekStartsOn?: WeekStartsOn
  /** @default 'weekDaysMedium' */
  weekdayFormat?: WeekDayFormat
  /** Always render six week rows, so the calendar's height never shifts. @default false */
  fixedWeeks?: boolean
  /** How many months to render side by side. @default 1 */
  numberOfMonths?: number
  /** Page by `numberOfMonths` rather than one month at a time. @default false */
  pagedNavigation?: boolean
  /** Allow selecting several dates. @default false */
  multiple?: boolean
  /** Require a selection once one exists. @default false */
  preventDeselect?: boolean
  /** Grey out and block days from the adjacent months. @default false */
  disableDaysOutsideCurrentView?: boolean
  disabled?: boolean
  readonly?: boolean
  minValue?: HijriDateObject
  maxValue?: HijriDateObject
  /** @default 'en' */
  locale?: string
  /** Show the corresponding Gregorian date alongside Hijri dates. @default false */
  showGregorian?: boolean
  /** Which calendar is visually primary when both are shown. @default 'hijri' */
  dateEmphasis?: DateEmphasis
  /** Locale for Gregorian formatting. @default `locale` */
  gregorianLocale?: string
  /** @default 'ltr' */
  dir?: Direction
  /** Accessible label for the calendar. Defaults to the visible month and year. */
  calendarLabel?: string
  isDateDisabled?: Matcher
  isDateUnavailable?: Matcher
  /** Custom paging, e.g. to move a year at a time. */
  nextPage?: (placeholder: HijriDateObject) => HijriDateObject
  prevPage?: (placeholder: HijriDateObject) => HijriDateObject
  /** Called whenever the selection changes. */
  onValueChange?: (value: HijriDateObject | HijriDateObject[] | undefined) => void
  /** Called whenever the visible month changes. */
  onPlaceholderChange?: (placeholder: HijriDateObject) => void
  /**
   * Called when the roving focus moves, so adapters can call `.focus()` on the
   * matching cell. The store owns *which* date has focus; the adapter owns the DOM.
   */
  onFocusedDateChange?: (date: HijriDateObject | undefined) => void
}

/** Attributes an adapter should spread onto the calendar root element. */
export interface RootProps {
  role: 'application'
  'aria-label': string
  dir: Direction
  'data-taqwim-calendar': ''
  'data-show-gregorian'?: ''
  'data-date-emphasis'?: DateEmphasis
  'data-disabled'?: ''
  'data-readonly'?: ''
  'data-invalid'?: ''
}

/** Attributes an adapter should spread onto a month's grid element. */
export interface GridProps {
  role: 'grid'
  'aria-label': string
  'aria-readonly'?: 'true'
  'aria-disabled'?: 'true'
  'data-taqwim-calendar-grid': ''
  'data-disabled'?: ''
  'data-readonly'?: ''
}

/** Attributes an adapter should spread onto a day's trigger element. */
export interface CellTriggerProps {
  role: 'button'
  type: 'button'
  tabindex: 0 | -1
  'aria-label': string
  /*
   * No `aria-selected` here: it is not a valid attribute on `role="button"`,
   * and in a date grid the selected state belongs on the enclosing
   * `role="gridcell"` — which every adapter's Cell part already sets.
   */
  'aria-disabled': boolean
  'data-value': string
  'data-gregorian-value'?: string
  'data-taqwim-calendar-cell-trigger': ''
  'data-selected'?: ''
  'data-disabled'?: ''
  'data-unavailable'?: ''
  'data-today'?: ''
  'data-outside-month'?: ''
  'data-focused'?: ''
}

/** Attributes for the previous/next paging buttons. */
export interface PageButtonProps {
  role: 'button'
  type: 'button'
  'aria-label': string
  'aria-disabled': boolean
  'data-disabled'?: ''
}

export interface CalendarStore {
  /** Register for change notifications. Returns an unsubscribe function. */
  subscribe: (listener: () => void) => () => void
  /**
   * Current state. The reference is stable between changes, so it can be used
   * directly with React's `useSyncExternalStore` and equivalents.
   */
  getSnapshot: () => CalendarState
  /** Merge new options in, e.g. when a framework component's props change. */
  setOptions: (options: Partial<CalendarOptions>) => void

  select: (date: HijriDateObject) => void
  setPlaceholder: (date: HijriDateObject) => void
  nextPage: () => void
  prevPage: () => void
  /** Move the roving focus. Pages the calendar if the date is not visible. */
  focusDate: (date: HijriDateObject | undefined) => void
  /** Focus the selected date, else today, else the first of the visible month. */
  focusInitial: () => void
  /**
   * Handle a keydown on the grid. Returns `true` if the event was consumed,
   * so adapters know whether to call `preventDefault()`.
   */
  handleKeydown: (event: Pick<KeyboardEvent, 'key' | 'shiftKey'>) => boolean

  formatter: CalendarFormatter
  getRootProps: () => RootProps
  getGridProps: (month: CalendarMonth) => GridProps
  getCellTriggerProps: (day: CalendarDay) => CellTriggerProps
  getPrevButtonProps: () => PageButtonProps
  getNextButtonProps: () => PageButtonProps
}
