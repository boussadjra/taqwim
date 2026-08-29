<script lang="ts">
import type {
  CalendarMonth,
  CalendarState,
  CalendarStore,
  Direction,
  Matcher,
  WeekDayFormat,
  WeekStartsOn,
} from '@taqwim/calendar-core'
import type { HijriDateObject } from '@taqwim/core'

export type { Direction, Matcher, WeekDayFormat, WeekStartsOn }

export interface HijriCalendarRootProps {
  /** The default selection, for uncontrolled use */
  defaultValue?: HijriDateObject | HijriDateObject[]
  /** The default placeholder date, for uncontrolled use */
  defaultPlaceholder?: HijriDateObject
  /** The placeholder date, which determines which month is displayed when no date is selected */
  placeholder?: HijriDateObject
  /** Navigate by the number of months displayed at once, rather than one month */
  pagedNavigation?: boolean
  /** Prevent the user from deselecting a date without selecting another first */
  preventDeselect?: boolean
  /** The day of the week to start the calendar on */
  weekStartsOn?: WeekStartsOn
  /** The format to use for the weekday labels */
  weekdayFormat?: WeekDayFormat
  /** The accessible label for the calendar */
  calendarLabel?: string
  /** Always display six week rows, so the calendar's height never shifts */
  fixedWeeks?: boolean
  /** The maximum date that can be selected */
  maxValue?: HijriDateObject
  /** The minimum date that can be selected */
  minValue?: HijriDateObject
  /** The locale to use for formatting dates */
  locale?: string
  /** Show the corresponding Gregorian date alongside Hijri dates. @default false */
  showGregorian?: boolean
  /** Which calendar is visually primary when both are shown. @default 'hijri' */
  dateEmphasis?: import('@taqwim/calendar-core').DateEmphasis
  /** Locale for Gregorian formatting. Defaults to `locale`. */
  gregorianLocale?: string
  /** The number of months to display at once */
  numberOfMonths?: number
  /** Whether the calendar is disabled */
  disabled?: boolean
  /** Whether the calendar is readonly */
  readonly?: boolean
  /** Focus the selected day, today, or the first day of the month when the calendar mounts */
  initialFocus?: boolean
  /** A function that returns whether or not a date is disabled */
  isDateDisabled?: Matcher
  /** A function that returns whether or not a date is unavailable */
  isDateUnavailable?: Matcher
  /** The reading direction of the calendar. Defaults to LTR */
  dir?: Direction
  /** Returns the next page of the calendar, given the current placeholder */
  nextPage?: (placeholder: HijriDateObject) => HijriDateObject
  /** Returns the previous page of the calendar, given the current placeholder */
  prevPage?: (placeholder: HijriDateObject) => HijriDateObject
  /** The controlled selection */
  modelValue?: HijriDateObject | HijriDateObject[] | undefined
  /** Whether multiple dates can be selected */
  multiple?: boolean
  /** Disable days belonging to the adjacent months */
  disableDaysOutsideCurrentView?: boolean
}

export interface HijriCalendarRootSlot {
  default?: (props: {
    /** The visible months, one entry per `numberOfMonths` */
    months: CalendarMonth[]
    /** The current placeholder date */
    date: HijriDateObject
    /** The weekday labels, already rotated to match `weekStartsOn` */
    weekDays: string[]
    /** The day of the week the grid starts on */
    weekStartsOn: WeekStartsOn
    /** The calendar locale */
    locale: string
    /** Whether six week rows are always rendered */
    fixedWeeks: boolean
    /** The current selection */
    modelValue: HijriDateObject | HijriDateObject[] | undefined
    /** Selection converted to Gregorian via `toGregorian`. */
    gregorianValue: Date | Date[] | undefined
    /** The full snapshot, for anything the props above do not cover */
    state: CalendarState
    /** The store itself, for custom headers and other markup the primitives do not cover */
    store: CalendarStore
  }) => unknown
}

export { injectHijriCalendarRootContext, provideHijriCalendarRootContext } from './context'
</script>

<script setup lang="ts">
import type { CalendarOptions } from '@taqwim/calendar-core'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { provideHijriCalendarRootContext } from './context'
import { useCalendar } from './useCalendar'

const props = withDefaults(defineProps<HijriCalendarRootProps>(), {
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
  disableDaysOutsideCurrentView: false,
  dir: 'ltr',
  locale: 'en',
})

defineSlots<HijriCalendarRootSlot>()

defineOptions({
  name: 'HijriCalendarRoot',
  inheritAttrs: false,
})

/*
 * `defineModel` gives controlled and uncontrolled use in one binding: with a
 * `v-model` the parent owns the value, without one the ref is local state.
 * Either way the store is fed the current value as a controlled option and
 * writes back through its callbacks, so there is exactly one source of truth.
 */
const modelValue = defineModel<HijriDateObject | HijriDateObject[] | undefined>({
  default: undefined,
})
const placeholder = defineModel<HijriDateObject | undefined>('placeholder', {
  default: undefined,
})

const rootElement = ref<HTMLElement>()

// Set by the store when the roving focus moves; consumed after the DOM updates.
let pendingFocus: string | undefined

const { store, state } = useCalendar(
  (): CalendarOptions => ({
    value: modelValue.value,
    defaultValue: props.defaultValue,
    placeholder: placeholder.value,
    defaultPlaceholder: props.defaultPlaceholder,
    weekStartsOn: props.weekStartsOn,
    weekdayFormat: props.weekdayFormat,
    fixedWeeks: props.fixedWeeks,
    numberOfMonths: props.numberOfMonths,
    pagedNavigation: props.pagedNavigation,
    multiple: props.multiple,
    preventDeselect: props.preventDeselect,
    disableDaysOutsideCurrentView: props.disableDaysOutsideCurrentView,
    disabled: props.disabled,
    readonly: props.readonly,
    minValue: props.minValue,
    maxValue: props.maxValue,
    locale: props.locale,
    showGregorian: props.showGregorian,
    dateEmphasis: props.dateEmphasis,
    gregorianLocale: props.gregorianLocale,
    dir: props.dir,
    calendarLabel: props.calendarLabel,
    isDateDisabled: props.isDateDisabled,
    isDateUnavailable: props.isDateUnavailable,
    nextPage: props.nextPage,
    prevPage: props.prevPage,
    onValueChange: value => {
      modelValue.value = value
    },
    onPlaceholderChange: value => {
      placeholder.value = value
    },
    onFocusedDateChange: date => {
      pendingFocus = date ? store.formatter.isoDate(date) : undefined
    },
  }),
)

provideHijriCalendarRootContext({ store, state })

/*
 * The store decides *which* date holds focus; the adapter owns the DOM. Moving
 * focus after the render keeps the two in step even when the move paged the
 * calendar and the target cell did not exist a tick earlier.
 */
watch(state, async () => {
  if (!pendingFocus) return
  await nextTick()

  /*
   * Read the target *after* the await, not before. Two focus moves in the same
   * tick otherwise resolve in scheduling order, and the older one wins by
   * calling `.focus()` last — which drags the store back to the stale date
   * through the cell's own focus handler.
   */
  const value = pendingFocus
  pendingFocus = undefined
  if (!value) return

  const cell = rootElement.value?.querySelector<HTMLElement>(
    `[data-taqwim-calendar-cell-trigger][data-value="${value}"]`,
  )
  cell?.focus()
})

onMounted(() => {
  if (props.initialFocus) store.focusInitial()
})

// Recomputed on every snapshot: the store folds disabled/readonly/invalid into
// these, so they cannot be derived from props alone.
const rootProps = computed(() => {
  void state.value
  return store.getRootProps()
})

function onKeydown(event: KeyboardEvent) {
  if (store.handleKeydown(event)) event.preventDefault()
}
</script>

<template>
  <div ref="rootElement" v-bind="{ ...rootProps, ...$attrs }" @keydown="onKeydown">
    <slot
      :months="state.months"
      :date="state.placeholder"
      :week-days="state.weekDays"
      :week-starts-on="state.weekStartsOn"
      :locale="state.locale"
      :fixed-weeks="state.fixedWeeks"
      :model-value="state.value"
      :gregorian-value="state.gregorianValue"
      :state="state"
      :store="store"
    />
    <!-- Inlined rather than classed: the headless package must not require a stylesheet. -->
    <div
      style="
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
        border: 0;
      "
    >
      <div role="heading" aria-level="2">
        {{ state.fullCalendarLabel }}
      </div>
    </div>
  </div>
</template>
