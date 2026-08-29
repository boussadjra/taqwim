<script lang="ts">
import type { CalendarDay } from '@taqwim/calendar-core'

export interface HijriCalendarCellProps {
  /** The day this grid cell holds */
  day: CalendarDay
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { injectHijriCalendarRootContext } from './context'

const props = defineProps<HijriCalendarCellProps>()

defineOptions({ name: 'HijriCalendarCell' })

const { store, state } = injectHijriCalendarRootContext()

const cellProps = computed(() => {
  void state.value
  return store.getCellProps(props.day)
})
</script>

<template>
  <div
    role="gridcell"
    :aria-selected="day.isSelected || undefined"
    :aria-disabled="day.isDisabled || day.isUnavailable || undefined"
    :data-taqwim-calendar-cell="cellProps['data-taqwim-calendar-cell']"
    :data-tooltip="cellProps['data-tooltip']"
    :title="cellProps['data-tooltip']"
    :data-disabled="day.isDisabled ? '' : undefined"
    :data-outside-month="day.isOutsideMonth ? '' : undefined"
  >
    <slot />
  </div>
</template>
