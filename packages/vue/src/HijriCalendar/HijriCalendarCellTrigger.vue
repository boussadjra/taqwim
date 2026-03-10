<script lang="ts">
import type { HijriDateObject } from 'taqwim-core-utils'
import type { Ref } from 'vue'

export interface HijriCalendarCellTriggerProps {
  /** The date value provided to the cell trigger */
  day: HijriDateObject
  /** The month in which the cell is rendered */
  month: HijriDateObject
  /** Additional HTML attributes */
  [key: string]: any
}

export interface HijriCalendarCellTriggerSlot {
  default?: (props: {
    /** Current day */
    dayValue: string
    /** Current disable state */
    disabled: boolean
    /** Current selected state */
    selected: boolean
    /** Current today state */
    today: boolean
    /** Current outside view state */
    outsideView: boolean
    /** Current outside visible view state */
    outsideVisibleView: boolean
    /** Current unavailable state */
    unavailable: boolean
  }) => any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { toHijri, isEqual, formatHijriDate } from 'taqwim-core-utils'
import { injectHijriCalendarRootContext } from './HijriCalendarRoot.vue'

const props = defineProps<HijriCalendarCellTriggerProps>()
defineSlots<HijriCalendarCellTriggerSlot>()

const rootContext = injectHijriCalendarRootContext()

const today = computed(() => {
  const todayHijri = toHijri(new Date())
  return todayHijri ? isEqual(props.day, todayHijri) : false
})

const disabled = computed(
  () =>
    rootContext.disabled.value ||
    rootContext.isDateDisabled(props.day) ||
    (rootContext.disableDaysOutsideCurrentView.value && outsideView.value),
)

const selected = computed(() => rootContext.isDateSelected(props.day))

const outsideView = computed(() => rootContext.isOutsideVisibleView(props.day))

const outsideVisibleView = computed(() => props.day.hm !== props.month.hm || props.day.hy !== props.month.hy)

const unavailable = computed(() => rootContext.isDateUnavailable?.(props.day) ?? false)

const dayValue = computed(() => formatHijriDate(props.day, 'iD', rootContext.locale.value))

function handleClick() {
  if (disabled.value || unavailable.value) return
  rootContext.onDateChange(props.day)
}
</script>

<template>
  <button
    type="button"
    role="button"
    :tabindex="disabled ? -1 : 0"
    :data-value="formatHijriDate(props.day, 'iYYYY-iMM-iDD', rootContext.locale.value)"
    :data-disabled="disabled ? '' : undefined"
    :data-selected="selected ? '' : undefined"
    :data-today="today ? '' : undefined"
    :data-outside-view="outsideView ? '' : undefined"
    :data-outside-visible-view="outsideVisibleView ? '' : undefined"
    :data-unavailable="unavailable ? '' : undefined"
    :data-taqwim-calendar-cell-trigger="''"
    :aria-label="formatHijriDate(props.day, 'iEEEE, iDD iMMMM iYYYY', rootContext.locale.value)"
    :aria-selected="selected"
    :aria-disabled="disabled || unavailable"
    @click="handleClick"
    v-bind="$attrs"
  >
    <slot
      :day-value="dayValue"
      :disabled="disabled"
      :selected="selected"
      :today="today"
      :outside-view="outsideView"
      :outside-visible-view="outsideVisibleView"
      :unavailable="unavailable"
    >
      {{ dayValue }}
    </slot>
  </button>
</template>
