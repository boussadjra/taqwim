import type { CalendarState, CalendarStore } from '@taqwim/calendar-core'
import { createContext, useContext, type Accessor } from 'solid-js'

export interface HijriCalendarContextValue {
  store: CalendarStore
  state: Accessor<CalendarState>
}

const HijriCalendarContext = createContext<HijriCalendarContextValue>()

export { HijriCalendarContext }

export function useHijriCalendarContext(): HijriCalendarContextValue {
  const context = useContext(HijriCalendarContext)

  if (!context) {
    throw new Error('Taqwim calendar parts must be rendered inside <HijriCalendarRoot>')
  }

  return context
}
