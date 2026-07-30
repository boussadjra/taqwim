import type { CalendarState, CalendarStore } from '@taqwim/calendar-core'
import type { ShallowRef } from 'vue'
import { createContext } from '../shared'

export interface HijriCalendarRootContext {
  store: CalendarStore
  state: ShallowRef<CalendarState>
}

export const [injectHijriCalendarRootContext, provideHijriCalendarRootContext] =
  createContext<HijriCalendarRootContext>('HijriCalendarRoot')
