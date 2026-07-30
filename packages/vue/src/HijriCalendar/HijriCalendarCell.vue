<script lang="ts">
import type { CalendarDay } from '@taqwim/calendar-core'

export interface HijriCalendarCellProps {
  /** The day this grid cell holds */
  day: CalendarDay
}
</script>

<script setup lang="ts">
defineProps<HijriCalendarCellProps>()

defineOptions({ name: 'HijriCalendarCell' })
</script>

<template>
  <div
    role="gridcell"
    :aria-selected="day.isSelected || undefined"
    :aria-disabled="day.isDisabled || day.isUnavailable || undefined"
    :data-taqwim-calendar-cell="''"
    :data-disabled="day.isDisabled ? '' : undefined"
    :data-outside-month="day.isOutsideMonth ? '' : undefined"
  >
    <slot />
  </div>
</template>
