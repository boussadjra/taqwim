<script lang="ts">
  import type { DivProps } from './types'
  import type { Snippet } from 'svelte'

  let { children, ...rest }: DivProps & { children?: Snippet } = $props()
</script>

<div role="row" data-taqwim-calendar-grid-row="" {...rest}>
  {@render children?.()}
</div>
