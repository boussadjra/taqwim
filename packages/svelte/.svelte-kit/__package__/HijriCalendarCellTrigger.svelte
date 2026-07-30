<script lang="ts">
  import { getHijriCalendarContext } from './context'
  import type { HijriCalendarCellTriggerProps } from './types'

  let { day, children, ...rest }: HijriCalendarCellTriggerProps = $props()

  const calendar = getHijriCalendarContext()
  const dayValue = $derived(calendar.store.formatter.dayOfMonth(day.date))

  function onclick() {
    // `select` re-checks these itself; this only avoids the pointless call.
    if (day.isDisabled || day.isUnavailable) return
    calendar.store.select(day.date)
  }

  function onfocus() {
    // Tabbing or clicking into a cell makes it the roving-focus target.
    // Re-reporting a date the store already holds would echo its own
    // programmatic `.focus()` back at it, so that case is skipped.
    if (day.isDisabled || day.isFocused) return
    calendar.store.focusDate(day.date)
  }
</script>

<button {...calendar.store.getCellTriggerProps(day)} {...rest} {onclick} {onfocus}>
  {#if children}{@render children({ dayValue, day })}{:else}{dayValue}{/if}
</button>
