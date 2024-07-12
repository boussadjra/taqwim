<script lang="ts">
import { getLocaleData, getDaysLengthInMonth, type HijriDateObject, type TripleNumberFormat } from 'taqwim-core-utils'
import { createContext } from '../shared'
import { toRefs } from 'vue'
export interface DatePickerProps {
  disabled: boolean
  nextIcon: string
  prevIcon: string
  modeIcon: string
  text: string
  viewMode: 'month' | 'months' | 'year'
  hideWeekdays: boolean
  multiple: 'single' | 'range' | 'multiple'
  locale: string
  modelValue: HijriDateObject | HijriDateObject[] | TripleNumberFormat | TripleNumberFormat[]
  title: string
}

export interface DatePickerEmits {
  (event: 'update:modelValue', value: HijriDateObject | HijriDateObject[]): boolean
}

export type DatePickerContext = {
  disabled: boolean
  nextIcon: string
  prevIcon: string
  modeIcon: string
  text: string
  viewMode: 'month' | 'months' | 'year'
  hideWeekdays: boolean
  multiple: 'single' | 'range' | 'multiple'
  locale: string
  modelValue: HijriDateObject | HijriDateObject[]
}

export const [injectDatePickerContext, provideDatePickerContext] = createContext<DatePickerContext>('DatePicker')
</script>
<script setup lang="ts">
const props = withDefaults(defineProps<DatePickerProps>(), {
  disabled: false,
  nextIcon: '>',
  prevIcon: '<',
  modeIcon: 'M',
  text: 'Select Date',
  viewMode: 'month',
  hideWeekdays: false,
  multiple: 'single',
  locale: 'en',
  modelValue: {},
  title: 'Select Date',
})

const emit = defineEmits<DatePickerEmits>()

const { modelValue, locale, disabled, hideWeekdays, nextIcon, prevIcon, modeIcon, text, viewMode, multiple } =
  toRefs(props)

provideDatePickerContext({
  modelValue: modelValue.value,
  locale: locale.value,
  disabled: disabled.value,
  hideWeekdays: hideWeekdays.value,
  nextIcon: nextIcon.value,
  prevIcon: prevIcon.value,
  modeIcon: modeIcon.value,
  text: text.value,
  viewMode: viewMode.value,
  multiple: multiple.value,
})

const changeMode = () => {}

const prevMonth = () => {}

const nextMonth = () => {}

const weekdays = getLocaleData(props.locale, 'weekDaysMedium')
const days = Array.from({ length: 30 }, (_, i) => i + 1)
</script>
<template>
  <div>
    <div>
      <slot name="title">
        <div>{{ title }}</div>
      </slot>

      <slot name="header">
        <!-- TODO : Put formatted selected date here -->
      </slot>

      <slot name="controls">
        <slot name="mode">
          <button @click="changeMode">{{ modeIcon }}</button>
        </slot>
        <slot name="prev">
          <button @click="prevMonth">{{ prevIcon }}</button>
        </slot>
        <slot name="next">
          <button @click="nextMonth">{{ nextIcon }}</button>
        </slot>
      </slot>
    </div>
    <div>
      <slot name="weekdays">
        <div v-if="!hideWeekdays">
          <div v-for="day in weekdays" :key="day">{{ day }}</div>
        </div>
      </slot>
      <slot name="days">
        <div>
          <div v-for="day in days" :key="day">{{ day }}</div>
        </div>
      </slot>
    </div>
  </div>
</template>
