export {
  HijriCalendarCell,
  HijriCalendarCellTrigger,
  HijriCalendarGrid,
  HijriCalendarGridBody,
  HijriCalendarGridHead,
  HijriCalendarGridRow,
  HijriCalendarHeadCell,
  HijriCalendarHeader,
  HijriCalendarHeading,
  HijriCalendarNext,
  HijriCalendarPrev,
  HijriCalendarRoot,
} from './HijriCalendar'
export { useHijriCalendarContext, type HijriCalendarContextValue } from './context'
export type { HijriCalendarRenderProps, HijriCalendarRootOptions, HijriCalendarRootProps } from './types'
export { createCalendarStore, type UseCalendarReturn } from './useCalendar'

// Re-exported so consumers can type render props and store callbacks without
// taking a direct dependency on the state machine package.
export type {
  CalendarDay,
  CalendarFormatter,
  CalendarMonth,
  CalendarOptions,
  CalendarState,
  CalendarStore,
  Direction,
  Matcher,
  WeekDayFormat,
  WeekStartsOn,
} from '@taqwim/calendar-core'
