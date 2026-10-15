<script lang="ts">
  import { getHijriCalendarContext } from './context'
  import type { HijriCalendarGridProps } from './types'

  let { month, children, ...rest }: HijriCalendarGridProps = $props()

  const calendar = getHijriCalendarContext()
  const resolved = $derived(month ?? calendar.state.months[0])
  const gridProps = $derived.by(() => {
    void calendar.state
    return calendar.store.getGridProps(resolved)
  })
</script>

<div tabindex="-1" {...gridProps} {...rest}>
  {@render children?.(resolved)}
</div>
