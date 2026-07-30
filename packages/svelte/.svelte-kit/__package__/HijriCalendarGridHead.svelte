<script lang="ts">
  import { getHijriCalendarContext } from './context'
  import type { DivProps } from './types'
  import type { Snippet } from 'svelte'

  let { children, ...rest }: DivProps & { children?: Snippet<[string[]]> } = $props()

  const calendar = getHijriCalendarContext()
</script>

<!-- The weekday row duplicates each cell's accessible label, so it is hidden
     from assistive technology rather than read out twice. -->
<div aria-hidden="true" data-taqwim-calendar-grid-head="" {...rest}>
  {@render children?.(calendar.state.weekDays)}
</div>
