import type { CalendarState, CalendarStore } from '@taqwim/calendar-core'
export interface HijriCalendarContextValue {
  store: CalendarStore
  readonly state: CalendarState
}
export declare function setHijriCalendarContext(value: HijriCalendarContextValue): void
export declare function getHijriCalendarContext(): HijriCalendarContextValue
