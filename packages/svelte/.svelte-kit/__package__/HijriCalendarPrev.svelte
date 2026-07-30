<script lang="ts">
  import { getHijriCalendarContext } from './context'
  import type { ButtonProps } from './types'
  import type { Snippet } from 'svelte'

  let { children, ...rest }: ButtonProps & { children?: Snippet<[boolean]> } = $props()

  const calendar = getHijriCalendarContext()
</script>

<button
  {...calendar.store.getPrevButtonProps()}
  {...rest}
  disabled={calendar.state.isPrevDisabled}
  onclick={() => calendar.store.prevPage()}
>
  {@render children?.(calendar.state.isPrevDisabled)}
</button>
