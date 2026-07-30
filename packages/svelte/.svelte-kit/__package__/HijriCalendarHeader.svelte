<script lang="ts">
  import { getHijriCalendarContext } from './context'
  import type { DivProps } from './types'
  import type { Snippet } from 'svelte'

  let { children, ...rest }: DivProps & { children?: Snippet } = $props()

  const calendar = getHijriCalendarContext()
</script>

<div role="group" aria-label={calendar.state.fullCalendarLabel} data-taqwim-calendar-header="" {...rest}>
  {@render children?.()}
</div>
