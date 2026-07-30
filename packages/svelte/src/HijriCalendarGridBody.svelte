<script lang="ts">
  import type { DivProps } from './types'
  import type { Snippet } from 'svelte'

  let { children, ...rest }: DivProps & { children?: Snippet } = $props()
</script>

<div data-taqwim-calendar-grid-body="" {...rest}>
  {@render children?.()}
</div>
