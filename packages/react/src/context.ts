import type { CalendarState, CalendarStore } from '@taqwim/calendar-core'
import { createContext, useContext } from 'react'

export interface HijriCalendarContextValue {
  store: CalendarStore
  state: CalendarState
}

const HijriCalendarContext = createContext<HijriCalendarContextValue | null>(null)

export const HijriCalendarProvider = HijriCalendarContext.Provider

export function useHijriCalendarContext(): HijriCalendarContextValue {
  const context = useContext(HijriCalendarContext)

  if (!context) {
    throw new Error('Taqwim calendar parts must be rendered inside <HijriCalendarRoot>')
  }

  return context
}
