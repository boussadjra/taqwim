import type { CalendarState, CalendarStore } from '@taqwim/calendar-core'
import { getContext, setContext } from 'svelte'

export interface HijriCalendarContextValue {
  store: CalendarStore
  readonly state: CalendarState
}

const KEY = Symbol('taqwim-calendar')

export function setHijriCalendarContext(value: HijriCalendarContextValue): void {
  setContext(KEY, value)
}

export function getHijriCalendarContext(): HijriCalendarContextValue {
  const context = getContext<HijriCalendarContextValue | undefined>(KEY)

  if (!context) {
    throw new Error('Taqwim calendar parts must be rendered inside <HijriCalendarRoot>')
  }

  return context
}
