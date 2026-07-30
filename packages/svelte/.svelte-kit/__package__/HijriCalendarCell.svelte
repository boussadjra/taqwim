<script lang="ts">
  import type { HijriCalendarCellProps } from './types'

  let { day, children, ...rest }: HijriCalendarCellProps = $props()
</script>

<div
  role="gridcell"
  aria-selected={day.isSelected || undefined}
  aria-disabled={day.isDisabled || day.isUnavailable || undefined}
  data-taqwim-calendar-cell=""
  data-disabled={day.isDisabled ? '' : undefined}
  data-outside-month={day.isOutsideMonth ? '' : undefined}
  {...rest}
>
  {@render children?.()}
</div>
