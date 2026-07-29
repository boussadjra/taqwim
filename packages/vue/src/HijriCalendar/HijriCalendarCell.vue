<script lang="ts">
import type { HijriDateObject } from '@taqwim/core'

export interface HijriCalendarCellProps {
  /** The date value for the cell */
  date: HijriDateObject
  /** Additional HTML attributes */
  [key: string]: any
}
</script>

<script setup lang="ts">
import { injectHijriCalendarRootContext } from './HijriCalendarRoot.vue'

const props = defineProps<HijriCalendarCellProps>()
const rootContext = injectHijriCalendarRootContext()
</script>

<template>
  <div
    role="gridcell"
    :aria-selected="rootContext.isDateSelected(props.date) ? true : undefined"
    :aria-disabled="
      rootContext.isDateDisabled(props.date) ||
      rootContext.isDateUnavailable?.(props.date) ||
      rootContext.disableDaysOutsideCurrentView.value
    "
    :data-disabled="
      rootContext.isDateDisabled(props.date) || rootContext.disableDaysOutsideCurrentView.value ? '' : undefined
    "
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
