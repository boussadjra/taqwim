<script lang="ts">
import { getLocaleData, toHijri, formatHijriDate, isEqual } from 'taqwim-core-utils'
import type { HijriDateObject } from 'taqwim-core-utils'
import type { DatePickerProps, DatePickerEmits, ViewMode } from './types'
import { useDate } from './useDate'
import { toRefs, ref, watchEffect } from 'vue'
import ArrowRight from '../icons/ArrowRight.vue'
import ArrowLeft from '../icons/ArrowLeft.vue'
</script>
<script setup lang="ts">
const props = withDefaults(defineProps<DatePickerProps>(), {
  disabled: false,

  hideWeekdays: false,
  multiple: 'single',
  locale: 'en',
  modelValue: () => {
    const date = new Date()
    return toHijri(date)!
  },
  title: 'Select Date',
  weekDayFormat: 'weekDaysMedium',
  monthFormat: 'monthsMedium',
  showAdjacentDays: true,
  format: 'iYYYY/iMM/iD',
})

const emit = defineEmits<DatePickerEmits>()

const { hideWeekdays, nextIcon, prevIcon } = toRefs(props)

const { monthDays, prevMonth, nextMonth, normalizedHijriDate, years } = useDate({
  initialDate: props.modelValue,
  showAdjacentDays: props.showAdjacentDays,
  monthFormat: props.monthFormat,
  locale: props.locale,
})

watchEffect(() => {
  emit('update:modelValue', normalizedHijriDate.value)

  console.log(props.format)
  emit(
    'update:formattedValue',
    formatHijriDate(normalizedHijriDate.value, props.format ?? 'iD iMMM, iYYYY', props.locale),
  )
})

const selectDay = (day: HijriDateObject) => {
  normalizedHijriDate.value = day
}

const weekdays = getLocaleData(props.locale, props.weekDayFormat)

const viewMode = ref('month')

const changeMode = (mode?: ViewMode) => {
  if (mode) {
    viewMode.value = mode
    return
  }
  viewMode.value = viewMode.value === 'month' ? 'years' : 'month'
}

const changeMonth = (month: number) => {
  normalizedHijriDate.value = { ...normalizedHijriDate.value, hm: month + 1 }
  viewMode.value = 'month'
}

const selectYear = (year: number) => {
  normalizedHijriDate.value = { hy: year, hm: 1, hd: 1 }
  viewMode.value = 'month'
}
</script>
<template>
  <div class="tq-date-picker">
    <div class="tq-date-picker__container">
      <slot name="title" class="tq-date-picker__title-slot">
        <div class="tq-date-picker__title">{{ title }}</div>
      </slot>

      <slot name="header" class="tq-date-picker__header-slot">
        <div class="tq-date-picker__header">{{ formatHijriDate(normalizedHijriDate, 'iDD iMMMM iYYYY', locale) }}</div>
      </slot>

      <slot name="controls" class="tq-date-picker__controls-slot">
        <slot name="month" class="tq-date-picker__month-slot">
          <button class="tq-date-picker__month-button" @click="changeMode('months')">
            {{ formatHijriDate(normalizedHijriDate, 'iMMMM iYYYY', locale) }}
          </button>
        </slot>
        <slot name="mode" class="tq-date-picker__mode-slot">
          <button class="tq-date-picker__mode-button" @click="changeMode()">
            {{ getLocaleData(locale, viewMode) }}
          </button>
        </slot>
        <slot name="prev" class="tq-date-picker__prev-slot">
          <button class="tq-date-picker__prev-button" @click="prevMonth">
            <ArrowLeft />
          </button>
        </slot>
        <slot name="next" class="tq-date-picker__next-slot">
          <button class="tq-date-picker__next-button" @click="nextMonth"><ArrowRight /></button>
        </slot>
      </slot>
    </div>
    <div v-if="viewMode === 'month'" class="tq-date-picker__month-view">
      <slot name="weekdays" class="tq-date-picker__weekdays-slot">
        <div v-if="!hideWeekdays" class="tq-date-picker__weekdays">
          <div v-for="day in weekdays" :key="day" class="tq-date-picker__weekday">{{ day }}</div>
        </div>
      </slot>
      <slot name="days" :days="monthDays" class="tq-date-picker__days-slot">
        <div class="tq-date-picker__days">
          <div
            v-for="day in monthDays"
            :key="`${day.date.hy}-${day.date.hm}-${day.date.hd}`"
            @click="selectDay(day.date)"
            class="tq-date-picker__day"
            :class="{
              'tq-date-picker__day--adjacent': day.isAdjacent,
              'tq-date-picker__day--today': day.isToday,
              'tq-date-picker__day--selected': isEqual(day.date, normalizedHijriDate),
            }"
          >
            {{ day.dayInMonth }}
          </div>
        </div>
      </slot>
    </div>
    <div v-else-if="viewMode === 'months'" class="tq-date-picker__months-view">
      <slot name="months" :months="getLocaleData(locale, monthFormat)" class="tq-date-picker__months-slot">
        <div class="tq-date-picker__months">
          <div
            v-for="(month, index) in getLocaleData(locale, monthFormat)"
            :key="month"
            @click="changeMonth(index)"
            class="tq-date-picker__month"
          >
            {{ month }}
          </div>
        </div>
      </slot>
    </div>
    <div v-else-if="viewMode === 'years'" class="tq-date-picker__years-view">
      <slot name="years" :years="years" class="tq-date-picker__years-slot">
        <div class="tq-date-picker__years">
          <div v-for="year in years" :key="year" @click="selectYear(year)" class="tq-date-picker__year">
            {{ year }}
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>
<style>
.tq-date-picker {
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  display: inline-block;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.87);
}

.tq-date-picker__container {
  padding-block: 16px;
  padding-inline: 8px;
}

.tq-date-picker__title,
.tq-date-picker__header {
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  margin: 8px 0;
  font-weight: 100;
  text-transform: uppercase;
}

.tq-date-picker__month-button,
.tq-date-picker__mode-button,
.tq-date-picker__prev-button,
.tq-date-picker__next-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #6f76d2;
  padding: 8px;
  font-size: 16px;
}

.tq-date-picker__month-button {
  min-width: 162px;
}

.tq-date-picker__prev-button,
.tq-date-picker__next-button {
  font-size: 18px;
}

.tq-date-picker[dir='rtl'] .tq-date-picker__prev-button svg,
.tq-date-picker[dir='rtl'] .tq-date-picker__next-button svg {
  transform: rotate(180deg);
}

.tq-date-picker__weekdays {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.tq-date-picker__weekday {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.54);
}

.tq-date-picker__days,
.tq-date-picker__months,
.tq-date-picker__years {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  padding: 8px 0;
}

.tq-date-picker__day,
.tq-date-picker__month,
.tq-date-picker__year {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.tq-date-picker__day:hover,
.tq-date-picker__month:hover,
.tq-date-picker__year:hover {
  background-color: #e3f2fd;
}

.tq-date-picker__day--adjacent {
  color: rgba(0, 0, 0, 0.38);
}

.tq-date-picker__day--today {
  background-color: #1976d2;
  color: #fff;
}

.tq-date-picker__day--selected {
  background-color: #0d47a1;
  color: #fff;
}
</style>
