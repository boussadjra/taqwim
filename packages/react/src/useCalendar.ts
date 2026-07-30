import type { CalendarOptions, CalendarState, CalendarStore } from '@taqwim/calendar-core'
import { createCalendar } from '@taqwim/calendar-core'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

export interface UseCalendarReturn {
  store: CalendarStore
  state: CalendarState
}

/**
 * Binds a `@taqwim/calendar-core` store to React.
 *
 * `useSyncExternalStore` is the right primitive here rather than mirroring the
 * snapshot into state: the store already caches its snapshot and returns a
 * stable reference between changes, which is exactly the contract
 * `getSnapshot` has to satisfy — an unstable one loops forever.
 */
export function useCalendar(options: CalendarOptions = {}): UseCalendarReturn {
  // Created once. Subsequent option changes are pushed in below rather than
  // rebuilding the store, so focus and internal state survive a re-render.
  const [store] = useState(() => createCalendar(options))
  const latest = useRef(options)
  latest.current = options

  /*
   * Options are merged during the commit phase, not during render: `setOptions`
   * notifies subscribers, and notifying while rendering is a React no-no.
   */
  useEffect(() => {
    store.setOptions(latest.current)
  })

  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)

  return { store, state }
}
