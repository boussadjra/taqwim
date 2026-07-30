<script lang="ts">
import type { CalendarMonth } from '@taqwim/calendar-core'

export interface HijriCalendarGridProps {
  /**
   * The month this grid renders. Optional for the common single-month case,
   * where it defaults to the only visible month.
   */
  month?: CalendarMonth
}

export interface HijriCalendarGridSlot {
  default?: (props: { month: CalendarMonth }) => unknown
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { injectHijriCalendarRootContext } from './context'

const props = defineProps<HijriCalendarGridProps>()
defineSlots<HijriCalendarGridSlot>()

defineOptions({
  name: 'HijriCalendarGrid',
  inheritAttrs: false,
})

const { store, state } = injectHijriCalendarRootContext()

const month = computed(() => props.month ?? state.value.months[0])

const gridProps = computed(() => store.getGridProps(month.value))
</script>

<template>
  <div tabindex="-1" v-bind="{ ...gridProps, ...$attrs }">
    <slot :month="month" />
  </div>
</template>
