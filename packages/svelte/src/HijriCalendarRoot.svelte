<script lang="ts">
  import type { HijriDateObject } from '@taqwim/core'
  import { onMount, tick } from 'svelte'
  import { setHijriCalendarContext } from './context'
  import { splitCalendarProps, type HijriCalendarRootProps } from './types'
  import { createCalendarState } from './useCalendar.svelte'

  let { children, initialFocus = false, ...rest }: HijriCalendarRootProps = $props()

  let rootElement = $state<HTMLDivElement>()
  // Set by the store when the roving focus moves; consumed after the DOM updates.
  let pendingFocus: string | undefined

  const split = $derived(splitCalendarProps(rest as Record<string, unknown>))

  const calendar = createCalendarState(() => ({
    ...split.options,
    onFocusedDateChange: (date: HijriDateObject | undefined) => {
      pendingFocus = date ? calendar.store.formatter.isoDate(date) : undefined
    },
  }))

  const { store } = calendar
  setHijriCalendarContext(calendar)

  /*
   * The store owns which date has focus; the adapter owns the DOM. Waiting for
   * the next tick means the target cell exists even when the move paged the
   * calendar into a month that was not rendered a moment ago.
   */
  $effect(() => {
    // Read the state so this re-runs on every change.
    void calendar.state
    if (!pendingFocus) return

    const value = pendingFocus
    pendingFocus = undefined

    void tick().then(() => {
      rootElement?.querySelector<HTMLElement>(`[data-taqwim-calendar-cell-trigger][data-value="${value}"]`)?.focus()
    })
  })

  onMount(() => {
    if (initialFocus) store.focusInitial()
  })

  function onkeydown(event: KeyboardEvent) {
    if (store.handleKeydown(event)) event.preventDefault()
  }
</script>

<div bind:this={rootElement} {...store.getRootProps()} {...split.domProps} {onkeydown}>
  {@render children?.({
    months: calendar.state.months,
    weekDays: calendar.state.weekDays,
    modelValue: calendar.state.value,
    gregorianValue: calendar.state.gregorianValue,
    state: calendar.state,
    store,
  })}

  <!-- Inlined rather than classed: the headless package must not require a stylesheet. -->
  <div
    style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0"
  >
    <div role="heading" aria-level="2">{calendar.state.fullCalendarLabel}</div>
  </div>
</div>
