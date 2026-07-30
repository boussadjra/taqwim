export { default as HijriCalendarCell, type HijriCalendarCellProps } from './HijriCalendarCell.vue'
export {
  default as HijriCalendarCellTrigger,
  type HijriCalendarCellTriggerProps,
  type HijriCalendarCellTriggerSlot,
} from './HijriCalendarCellTrigger.vue'
export {
  default as HijriCalendarGrid,
  type HijriCalendarGridProps,
  type HijriCalendarGridSlot,
} from './HijriCalendarGrid.vue'
export { default as HijriCalendarGridBody } from './HijriCalendarGridBody.vue'
export { default as HijriCalendarGridHead, type HijriCalendarGridHeadSlot } from './HijriCalendarGridHead.vue'
export { default as HijriCalendarGridRow } from './HijriCalendarGridRow.vue'
export { default as HijriCalendarHeadCell } from './HijriCalendarHeadCell.vue'
export { default as HijriCalendarHeader } from './HijriCalendarHeader.vue'
export { default as HijriCalendarHeading, type HijriCalendarHeadingSlot } from './HijriCalendarHeading.vue'
export { default as HijriCalendarNext, type HijriCalendarNextSlot } from './HijriCalendarNext.vue'
export { default as HijriCalendarPrev, type HijriCalendarPrevSlot } from './HijriCalendarPrev.vue'
export {
  default as HijriCalendarRoot,
  type Direction,
  type HijriCalendarRootProps,
  type HijriCalendarRootSlot,
  type Matcher,
  type WeekDayFormat,
  type WeekStartsOn,
} from './HijriCalendarRoot.vue'

export {
  injectHijriCalendarRootContext,
  provideHijriCalendarRootContext,
  type HijriCalendarRootContext,
} from './context'
export { useCalendar, type UseCalendarReturn } from './useCalendar'

// Re-exported so consumers can type slot props and store callbacks without
// taking a direct dependency on the state machine package.
export type {
  CalendarDay,
  CalendarFormatter,
  CalendarMonth,
  CalendarOptions,
  CalendarState,
  CalendarStore,
} from '@taqwim/calendar-core'
