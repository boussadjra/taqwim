<script lang="ts">
import type { HijriDateObject, ValidHijriDate, MonthDay } from 'taqwim-core-utils'
import type { Ref } from 'vue'
import type { WeekDayFormat, MonthFormat } from '../DatePicker/types'
import { createContext } from '../shared'

export type Direction = 'ltr' | 'rtl'
export type Matcher = (date: HijriDateObject) => boolean

type HijriCalendarRootContext = {
  locale: Ref<string>
  modelValue: Ref<HijriDateObject | HijriDateObject[] | undefined>
  placeholder: Ref<HijriDateObject>
  pagedNavigation: Ref<boolean>
  preventDeselect: Ref<boolean>
  grid: Ref<MonthDay[][]>
  weekDays: Ref<string[]>
  weekStartsOn: Ref<0 | 1 | 2 | 3 | 4 | 5 | 6>
  weekdayFormat: Ref<WeekDayFormat>
  fixedWeeks: Ref<boolean>
  multiple: Ref<boolean>
  numberOfMonths: Ref<number>
  disabled: Ref<boolean>
  readonly: Ref<boolean>
  initialFocus: Ref<boolean>
  onDateChange: (date: HijriDateObject) => void
  onPlaceholderChange: (date: HijriDateObject) => void
  fullCalendarLabel: Ref<string>
  parentElement: Ref<HTMLElement | undefined>
  headingValue: Ref<string>
  isInvalid: Ref<boolean>
  isDateDisabled: Matcher
  isDateSelected: Matcher
  isDateUnavailable?: Matcher
  isOutsideVisibleView: (date: HijriDateObject) => boolean
  prevPage: (prevPageFunc?: (date: HijriDateObject) => HijriDateObject) => void
  nextPage: (nextPageFunc?: (date: HijriDateObject) => HijriDateObject) => void
  isNextButtonDisabled: (nextPageFunc?: (date: HijriDateObject) => HijriDateObject) => boolean
  isPrevButtonDisabled: (prevPageFunc?: (date: HijriDateObject) => HijriDateObject) => boolean
  formatter: any // TODO: Define proper Hijri formatter type
  dir: Ref<Direction>
  disableDaysOutsideCurrentView: Ref<boolean>
}

export interface HijriCalendarRootProps {
  /** The default value for the calendar */
  defaultValue?: HijriDateObject
  /** The default placeholder date */
  defaultPlaceholder?: HijriDateObject
  /** The placeholder date, which is used to determine what month to display when no date is selected */
  placeholder?: HijriDateObject
  /** This property causes the previous and next buttons to navigate by the number of months displayed at once, rather than one month */
  pagedNavigation?: boolean
  /** Whether or not to prevent the user from deselecting a date without selecting another date first */
  preventDeselect?: boolean
  /** The day of the week to start the calendar on */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /** The format to use for the weekday strings provided via the weekdays slot prop */
  weekdayFormat?: WeekDayFormat
  /** The accessible label for the calendar */
  calendarLabel?: string
  /** Whether or not to always display 6 weeks in the calendar */
  fixedWeeks?: boolean
  /** The maximum date that can be selected */
  maxValue?: HijriDateObject
  /** The minimum date that can be selected */
  minValue?: HijriDateObject
  /** The locale to use for formatting dates */
  locale?: string
  /** The number of months to display at once */
  numberOfMonths?: number
  /** Whether the calendar is disabled */
  disabled?: boolean
  /** Whether the calendar is readonly */
  readonly?: boolean
  /** If true, the calendar will focus the selected day, today, or the first day of the month depending on what is visible when the calendar is mounted */
  initialFocus?: boolean
  /** A function that returns whether or not a date is disabled */
  isDateDisabled?: Matcher
  /** A function that returns whether or not a date is unavailable */
  isDateUnavailable?: Matcher
  /** The reading direction of the calendar when applicable. <br> If omitted, inherits globally from `ConfigProvider` or assumes LTR (left-to-right) reading mode. */
  dir?: Direction
  /** A function that returns the next page of the calendar. It receives the current placeholder as an argument inside the component. */
  nextPage?: (placeholder: HijriDateObject) => HijriDateObject
  /** A function that returns the previous page of the calendar. It receives the current placeholder as an argument inside the component. */
  prevPage?: (placeholder: HijriDateObject) => HijriDateObject
  /** The controlled checked state of the calendar */
  modelValue?: HijriDateObject | HijriDateObject[] | undefined
  /** Whether multiple dates can be selected */
  multiple?: boolean
  /** Whether or not to disable days outside the current view. */
  disableDaysOutsideCurrentView?: boolean
}

export type HijriCalendarRootEmits = {
  /** Event handler called whenever the model value changes */
  'update:modelValue': [date: HijriDateObject | HijriDateObject[] | undefined]
  /** Event handler called whenever the placeholder value changes */
  'update:placeholder': [date: HijriDateObject]
}

export const [injectHijriCalendarRootContext, provideHijriCalendarRootContext] =
  createContext<HijriCalendarRootContext>('HijriCalendarRoot')
</script>

<script setup lang="ts">
import { computed, onMounted, ref, toRefs, watch, watchEffect } from 'vue'
import { useDirection, useLocale } from '../shared'
import {
  getLocaleData,
  getDaysLengthInMonth,
  getDayInWeek,
  getMonthAdjacentDays,
  addHijriMonths,
  subHijriMonths,
  formatHijriDate,
  toHijri,
  isEqual,
} from 'taqwim-core-utils'

// Simple useVModel implementation
function useVModel<T>(props: any, key: string, emit: any, options: { defaultValue?: T; passive?: boolean } = {}) {
  return computed({
    get() {
      return props[key] ?? options.defaultValue
    },
    set(value) {
      emit(`update:${key}`, value)
    },
  })
}

const props = withDefaults(defineProps<HijriCalendarRootProps>(), {
  defaultValue: undefined,
  pagedNavigation: false,
  preventDeselect: false,
  weekStartsOn: 0,
  weekdayFormat: 'weekDaysMedium',
  fixedWeeks: false,
  multiple: false,
  numberOfMonths: 1,
  disabled: false,
  readonly: false,
  initialFocus: false,
  placeholder: undefined,
  isDateDisabled: undefined,
  isDateUnavailable: undefined,
  disableDaysOutsideCurrentView: false,
})

const emits = defineEmits<HijriCalendarRootEmits>()

defineSlots<{
  default?: (props: {
    /** The current date of the placeholder */
    date: HijriDateObject
    /** The grid of dates */
    grid: MonthDay[][]
    /** The days of the week */
    weekDays: string[]
    /** The start of the week */
    weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6
    /** The calendar locale */
    locale: string
    /** Whether or not to always display 6 weeks in the calendar */
    fixedWeeks: boolean
    /** The current date of the calendar */
    modelValue: HijriDateObject | HijriDateObject[] | undefined
  }) => any
}>()

defineOptions({
  name: 'HijriCalendarRoot',
})

const {
  disabled,
  readonly,
  initialFocus,
  pagedNavigation,
  weekStartsOn,
  weekdayFormat,
  fixedWeeks,
  multiple,
  minValue,
  maxValue,
  numberOfMonths,
  preventDeselect,
  isDateDisabled: propsIsDateDisabled,
  isDateUnavailable: propsIsDateUnavailable,
  calendarLabel,
  defaultValue,
  nextPage: propsNextPage,
  prevPage: propsPrevPage,
  dir: propDir,
  locale: propLocale,
  disableDaysOutsideCurrentView,
} = toRefs(props)

const parentElement = ref<HTMLElement>()
const locale = useLocale(propLocale)
const dir = useDirection(propDir)

const modelValue = useVModel(props, 'modelValue', emits, {
  defaultValue: defaultValue.value,
  passive: false,
}) as Ref<HijriDateObject | HijriDateObject[] | undefined>

const placeholder = defineModel('placeholder', {
  type: Object as () => HijriDateObject,
  default: () => {
    return toHijri(new Date())!
  },
})

function onPlaceholderChange(value: HijriDateObject) {
  placeholder.value = { ...value }
}

// Calendar state computations
const weekdays = computed(() => {
  return getLocaleData(locale.value, weekdayFormat.value) as string[]
})

const fullCalendarLabel = computed(() => {
  return calendarLabel?.value || `Calendar for ${formatHijriDate(placeholder.value, 'iMMM iYYYY', locale.value)}`
})

const headingValue = computed(() => {
  return formatHijriDate(placeholder.value, 'iMMM iYYYY', locale.value)
})

const daysInMonth = computed(() => {
  return getDaysLengthInMonth(placeholder.value.hy, placeholder.value.hm)
})

const currentMonthDays = computed(() => {
  const days: MonthDay[] = []
  for (let i = 1; i <= daysInMonth.value; i++) {
    days.push({
      dayInMonth: i,
      dayInWeek: getDayInWeek({ hy: placeholder.value.hy, hm: placeholder.value.hm, hd: i }) ?? 0,
      date: {
        hy: placeholder.value.hy,
        hm: placeholder.value.hm,
        hd: i,
      },
    })
  }
  return days
})

const grid = computed(() => {
  const days = currentMonthDays.value
  const { prevMonthDays, nextMonthDays } = getMonthAdjacentDays(placeholder.value)

  const allDays = [
    ...prevMonthDays.map(day => ({ ...day, isAdjacent: true })),
    ...days.map(day => ({ ...day, isAdjacent: false })),
    ...nextMonthDays.map(day => ({ ...day, isAdjacent: true })),
  ]

  // Group days into weeks
  const weeks: MonthDay[][] = []
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7))
  }

  return weeks
})

const isInvalid = computed(() => {
  return false // TODO: Implement validation logic
})

const isDateDisabled = (date: HijriDateObject): boolean => {
  if (propsIsDateDisabled?.value) {
    return propsIsDateDisabled.value(date)
  }
  return false
}

const isDateSelected = (date: HijriDateObject): boolean => {
  if (!modelValue.value) return false

  if (Array.isArray(modelValue.value)) {
    return modelValue.value.some(selectedDate => isEqual(selectedDate, date))
  }

  return isEqual(modelValue.value, date)
}

const isDateUnavailable = (date: HijriDateObject): boolean => {
  if (propsIsDateUnavailable?.value) {
    return propsIsDateUnavailable.value(date)
  }
  return false
}

const isOutsideVisibleView = (date: HijriDateObject): boolean => {
  return date.hm !== placeholder.value.hm || date.hy !== placeholder.value.hy
}

const prevPage = (prevPageFunc?: (date: HijriDateObject) => HijriDateObject) => {
  if (prevPageFunc) {
    const newDate = prevPageFunc(placeholder.value)
    onPlaceholderChange(newDate)
  } else {
    const newDate = subHijriMonths(placeholder.value, numberOfMonths.value)
    if (newDate) {
      onPlaceholderChange(newDate)
    }
  }
}

const nextPage = (nextPageFunc?: (date: HijriDateObject) => HijriDateObject) => {
  console.log('HijriCalendarRoot nextPage called with nextPageFunc:', nextPageFunc)
  console.log('Current placeholder:', placeholder.value)
  console.log('Number of months to navigate:', numberOfMonths.value)
  if (nextPageFunc) {
    const newDate = nextPageFunc(placeholder.value)
    console.log('New date from nextPageFunc:', newDate)
    onPlaceholderChange(newDate)
  } else {
    console.log('No nextPageFunc provided, using default navigation')
    const newDate = addHijriMonths(placeholder.value, numberOfMonths.value)
    console.log('New date from default navigation:', newDate)
    if (newDate) {
      onPlaceholderChange(newDate)
    }
  }
}

const isNextButtonDisabled = (nextPageFunc?: (date: HijriDateObject) => HijriDateObject): boolean => {
  if (maxValue?.value) {
    const nextDate = nextPageFunc
      ? nextPageFunc(placeholder.value)
      : addHijriMonths(placeholder.value, numberOfMonths.value)
    if (nextDate) {
      return nextDate.hy > maxValue.value.hy || (nextDate.hy === maxValue.value.hy && nextDate.hm > maxValue.value.hm)
    }
  }
  return false
}

const isPrevButtonDisabled = (prevPageFunc?: (date: HijriDateObject) => HijriDateObject): boolean => {
  if (minValue?.value) {
    const prevDate = prevPageFunc
      ? prevPageFunc(placeholder.value)
      : subHijriMonths(placeholder.value, numberOfMonths.value)
    if (prevDate) {
      return prevDate.hy < minValue.value.hy || (prevDate.hy === minValue.value.hy && prevDate.hm < minValue.value.hm)
    }
  }
  return false
}

const formatter = {
  // TODO: Implement proper Hijri formatter
  format: (date: HijriDateObject, format: string) => formatHijriDate(date, format, locale.value),
}

watch(modelValue, _modelValue => {
  if (Array.isArray(_modelValue) && _modelValue.length) {
    const lastValue = _modelValue[_modelValue.length - 1]
    if (lastValue && !isEqual(placeholder.value, lastValue)) onPlaceholderChange(lastValue)
  } else if (!Array.isArray(_modelValue) && _modelValue && !isEqual(placeholder.value, _modelValue)) {
    onPlaceholderChange(_modelValue)
  }
})

function onDateChange(value: HijriDateObject) {
  if (!multiple.value) {
    if (!modelValue.value) {
      modelValue.value = { ...value }
      return
    }

    if (!preventDeselect.value && isEqual(modelValue.value as HijriDateObject, value)) {
      placeholder.value = { ...value }
      modelValue.value = undefined
    } else {
      modelValue.value = { ...value }
    }
  } else if (!modelValue.value) {
    modelValue.value = [{ ...value }]
  } else if (Array.isArray(modelValue.value)) {
    const index = modelValue.value.findIndex(date => isEqual(date, value))
    if (index === -1) {
      modelValue.value = [...modelValue.value, value]
    } else if (!preventDeselect.value) {
      const next = modelValue.value.filter(date => !isEqual(date, value))
      if (!next.length) {
        placeholder.value = { ...value }
        modelValue.value = undefined
        return
      }
      modelValue.value = next.map(date => ({ ...date }))
    }
  }
}

onMounted(() => {
  if (initialFocus.value && parentElement.value) {
    // TODO: Implement focus logic for Hijri calendar
  }
})

provideHijriCalendarRootContext({
  isDateUnavailable,
  dir,
  isDateDisabled,
  locale,
  formatter,
  modelValue,
  placeholder,
  disabled,
  initialFocus,
  pagedNavigation,
  grid,
  weekDays: weekdays,
  weekStartsOn,
  weekdayFormat,
  fixedWeeks,
  multiple,
  numberOfMonths,
  readonly,
  preventDeselect,
  fullCalendarLabel,
  headingValue,
  isInvalid,
  isDateSelected,
  isNextButtonDisabled,
  isPrevButtonDisabled,
  isOutsideVisibleView,
  nextPage,
  prevPage,
  parentElement,
  onPlaceholderChange,
  onDateChange,
  disableDaysOutsideCurrentView,
})
</script>

<template>
  <div
    ref="parentElement"
    role="application"
    :aria-label="fullCalendarLabel"
    :data-readonly="readonly ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
    :data-invalid="isInvalid ? '' : undefined"
    :dir="dir"
  >
    <slot
      :date="placeholder"
      :grid="grid"
      :week-days="weekdays"
      :week-starts-on="weekStartsOn"
      :locale="locale"
      :fixed-weeks="fixedWeeks"
      :model-value="modelValue"
    />
    <div
      style="
        border: 0px;
        clip: rect(0px, 0px, 0px, 0px);
        clip-path: inset(50%);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0px;
        position: absolute;
        white-space: nowrap;
        width: 1px;
      "
    >
      <div role="heading" aria-level="2">
        {{ fullCalendarLabel }}
      </div>
    </div>
  </div>
</template>
