import type { CalendarOptions, CalendarState, CalendarStore } from '@taqwim/calendar-core'
export interface UseCalendarReturn {
  store: CalendarStore
  readonly state: CalendarState
}
/**
 * Binds a `@taqwim/calendar-core` store to Svelte 5's runes.
 *
 * `getOptions` is a function rather than a value so that reading props inside
 * it registers them with the effect below — passing the object directly would
 * freeze the calendar at its initial configuration.
 *
 * Lives in a `.svelte.ts` module because runes are only compiled there.
 */
export declare function createCalendarState(getOptions: () => CalendarOptions): UseCalendarReturn
