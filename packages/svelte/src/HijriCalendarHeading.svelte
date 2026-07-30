<script lang="ts">
  import { getHijriCalendarContext } from './context'
  import type { DivProps } from './types'
  import type { Snippet } from 'svelte'

  let { children, ...rest }: DivProps & { children?: Snippet<[string]> } = $props()

  const calendar = getHijriCalendarContext()
</script>

<div
  data-taqwim-calendar-heading=""
  data-disabled={calendar.state.disabled ? '' : undefined}
  {...rest}
>
  {#if children}{@render children(calendar.state.headingValue)}{:else}{calendar.state.headingValue}{/if}
</div>
