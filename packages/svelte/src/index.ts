export { default as HijriCalendarCell } from './HijriCalendarCell.svelte'
export { default as HijriCalendarCellTrigger } from './HijriCalendarCellTrigger.svelte'
export { default as HijriCalendarGrid } from './HijriCalendarGrid.svelte'
export { default as HijriCalendarGridBody } from './HijriCalendarGridBody.svelte'
export { default as HijriCalendarGridHead } from './HijriCalendarGridHead.svelte'
export { default as HijriCalendarGridRow } from './HijriCalendarGridRow.svelte'
export { default as HijriCalendarHeadCell } from './HijriCalendarHeadCell.svelte'
export { default as HijriCalendarHeader } from './HijriCalendarHeader.svelte'
export { default as HijriCalendarHeading } from './HijriCalendarHeading.svelte'
export { default as HijriCalendarNext } from './HijriCalendarNext.svelte'
export { default as HijriCalendarPrev } from './HijriCalendarPrev.svelte'
export { default as HijriCalendarRoot } from './HijriCalendarRoot.svelte'

export { getHijriCalendarContext, type HijriCalendarContextValue } from './context'
export type {
  HijriCalendarCellProps,
  HijriCalendarCellTriggerProps,
  HijriCalendarGridProps,
  HijriCalendarRenderProps,
  HijriCalendarRootOptions,
  HijriCalendarRootProps,
} from './types'
export { createCalendarState, type UseCalendarReturn } from './useCalendar.svelte'

// Re-exported so consumers can type snippet props and store callbacks without
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
