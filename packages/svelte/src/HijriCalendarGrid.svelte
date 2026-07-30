<script lang="ts">
  import { getHijriCalendarContext } from './context'
  import type { HijriCalendarGridProps } from './types'

  let { month, children, ...rest }: HijriCalendarGridProps = $props()

  const calendar = getHijriCalendarContext()
  const resolved = $derived(month ?? calendar.state.months[0])
</script>

<div tabindex="-1" {...calendar.store.getGridProps(resolved)} {...rest}>
  {@render children?.(resolved)}
</div>
