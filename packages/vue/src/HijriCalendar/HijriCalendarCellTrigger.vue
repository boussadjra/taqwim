<script lang="ts">
import type { CalendarDay } from '@taqwim/calendar-core'

export interface HijriCalendarCellTriggerProps {
  /** The day to render, as produced by the calendar grid */
  day: CalendarDay
}

export interface HijriCalendarCellTriggerSlot {
  default?: (props: {
    /** The localised day number */
    dayValue: string
    /** The day, with all of its state flags */
    day: CalendarDay
    disabled: boolean
    selected: boolean
    today: boolean
    outsideMonth: boolean
    unavailable: boolean
    focused: boolean
  }) => unknown
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { injectHijriCalendarRootContext } from './context'

const props = defineProps<HijriCalendarCellTriggerProps>()
defineSlots<HijriCalendarCellTriggerSlot>()

defineOptions({
  name: 'HijriCalendarCellTrigger',
  inheritAttrs: false,
})

const { store, state } = injectHijriCalendarRootContext()

/*
 * Every `data-*` and `aria-*` attribute comes from the store, so the markup
 * this emits is identical across all five framework adapters — which is what
 * lets `@taqwim/themes` and the shared e2e suite target a single contract.
 */
const triggerProps = computed(() => {
  void state.value
  return store.getCellTriggerProps(props.day)
})

const dayValue = computed(() => store.formatter.dayOfMonth(props.day.date))

function onClick() {
  // `select` re-checks disabled/unavailable/readonly itself; this only avoids
  // the pointless call.
  if (props.day.isDisabled || props.day.isUnavailable) return
  store.select(props.day.date)
}

function onFocus() {
  // Tabbing or clicking into a cell makes it the roving-focus target, so the
  // keyboard picks up where the pointer left off. Re-reporting a date the
  // store already holds would echo the store's own programmatic `.focus()`
  // back at it, so that case is skipped.
  if (props.day.isDisabled || props.day.isFocused) return
  store.focusDate(props.day.date)
}
</script>

<template>
  <button v-bind="{ ...triggerProps, ...$attrs }" @click="onClick" @focus="onFocus">
    <slot
      :day-value="dayValue"
      :day="day"
      :disabled="day.isDisabled"
      :selected="day.isSelected"
      :today="day.isToday"
      :outside-month="day.isOutsideMonth"
      :unavailable="day.isUnavailable"
      :focused="day.isFocused"
    >
      {{ dayValue }}
    </slot>
  </button>
</template>
