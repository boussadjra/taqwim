import type { CalendarOptions, CalendarState, CalendarStore } from '@taqwim/calendar-core'
import { createCalendar } from '@taqwim/calendar-core'
import { onScopeDispose, shallowRef, watch, type ShallowRef } from 'vue'

export interface UseCalendarReturn {
  store: CalendarStore
  /**
   * The store's snapshot, mirrored into a ref.
   *
   * `shallowRef` is deliberate: the store already rebuilds the whole snapshot
   * on every change and hands back a new object, so deep reactivity would only
   * pay to proxy a tree that is replaced wholesale.
   */
  state: ShallowRef<CalendarState>
}

/**
 * Binds a `@taqwim/calendar-core` store to Vue's reactivity.
 *
 * All calendar behaviour — grid layout, selection, paging, keyboard
 * navigation, accessibility props — lives in the store. This composable only
 * pushes reactive options in and pulls snapshots out, which is why the same
 * behaviour can be reproduced exactly in React, Svelte, Solid and Angular.
 *
 * `options` is a getter so that prop changes flow into the store; pass
 * `() => ({ ... })` and read your props inside it.
 */
export function useCalendar(options: () => CalendarOptions): UseCalendarReturn {
  const store = createCalendar(options())
  const state = shallowRef(store.getSnapshot())

  const unsubscribe = store.subscribe(() => {
    state.value = store.getSnapshot()
  })
  onScopeDispose(unsubscribe)

  // The getter allocates a fresh object each run, so this fires whenever any
  // reactive value read inside it changes — which is the intent.
  watch(options, next => store.setOptions(next), { flush: 'sync' })

  return { store, state }
}
