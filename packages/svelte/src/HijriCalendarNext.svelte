<script lang="ts">
  import { getHijriCalendarContext } from './context'
  import type { ButtonProps } from './types'
  import type { Snippet } from 'svelte'

  let { children, ...rest }: ButtonProps & { children?: Snippet<[boolean]> } = $props()

  const calendar = getHijriCalendarContext()
</script>

<button
  {...calendar.store.getNextButtonProps()}
  {...rest}
  disabled={calendar.state.isNextDisabled}
  onclick={() => calendar.store.nextPage()}
>
  {@render children?.(calendar.state.isNextDisabled)}
</button>
