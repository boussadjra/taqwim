<script lang="ts">
  import type { HijriCalendarCellProps } from './types'
  import { getHijriCalendarContext } from './context'

  let { day, children, ...rest }: HijriCalendarCellProps = $props()

  const calendar = getHijriCalendarContext()
  const cellProps = $derived.by(() => {
    void calendar.state
    return calendar.store.getCellProps(day)
  })
</script>

<div
  role="gridcell"
  aria-selected={day.isSelected || undefined}
  aria-disabled={day.isDisabled || day.isUnavailable || undefined}
  data-taqwim-calendar-cell={cellProps['data-taqwim-calendar-cell']}
  data-tooltip={cellProps['data-tooltip']}
  title={cellProps['data-tooltip']}
  data-disabled={day.isDisabled ? '' : undefined}
  data-outside-month={day.isOutsideMonth ? '' : undefined}
  {...rest}
>
  {@render children?.()}
</div>
