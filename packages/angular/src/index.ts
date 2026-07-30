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
  TAQWIM_CALENDAR,
} from './calendar'
export { TaqwimCalendarService } from './calendar.service'
export type { HijriCalendarInputs, Matcher, WeekDayFormat, WeekStartsOn } from './types'

// Re-exported so consumers can type template bindings and store callbacks
// without taking a direct dependency on the state machine package.
export type {
  CalendarDay,
  CalendarFormatter,
  CalendarMonth,
  CalendarOptions,
  CalendarState,
  CalendarStore,
  Direction,
} from '@taqwim/calendar-core'
