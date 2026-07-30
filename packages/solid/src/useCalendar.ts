import type { CalendarOptions, CalendarState, CalendarStore } from '@taqwim/calendar-core'
import { createCalendar } from '@taqwim/calendar-core'
import { createRenderEffect, createSignal, onCleanup, type Accessor } from 'solid-js'

export interface UseCalendarReturn {
  store: CalendarStore
  state: Accessor<CalendarState>
}

/**
 * Binds a `@taqwim/calendar-core` store to Solid's reactivity.
 *
 * `options` is an accessor so that reading props inside it registers them as
 * dependencies of the effect below — Solid props are getters, so destructuring
 * them here would freeze the calendar at its initial configuration.
 */
export function createCalendarStore(options: Accessor<CalendarOptions>): UseCalendarReturn {
  const store = createCalendar(options())
  const [state, setState] = createSignal(store.getSnapshot())

  onCleanup(
    store.subscribe(() => {
      setState(store.getSnapshot())
    }),
  )

  /*
   * A render effect, not a plain effect: options have to reach the store
   * before the components read the snapshot for this render. With
   * `createEffect` the push lands after the DOM is written, so a controlled
   * `value` handed back through `onValueChange` shows up one interaction late.
   *
   * Safe to run on every dependency change — the store compares the state it
   * builds and stays quiet when nothing observable moved, so this cannot feed
   * back into itself.
   */
  createRenderEffect(() => {
    store.setOptions(options())
  })

  return { store, state }
}
