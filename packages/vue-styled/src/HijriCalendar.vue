<script lang="ts">
import type { CalendarDay, HijriCalendarRootProps } from '@taqwim/vue'
import type { HijriDateObject } from '@taqwim/core'
import type { Component } from 'vue'

export type HijriCalendarTheme =
  | 'default'
  | 'dark'
  | 'modern'
  | 'islamic'
  | 'minimal'
  | 'minimalist'
  | 'neon'
  | 'ocean'
  | 'sunset'
  | 'cyberpunk'
  | 'nature'
  | 'luxurious'
  | 'material'

export type HijriCalendarSize = 'compact' | 'default' | 'large'

export interface HijriCalendarProps extends HijriCalendarRootProps {
  /**
   * Which bundled theme to render with.
   *
   * Applied as `data-taqwim-theme`, so it can also be set on any ancestor to
   * theme a whole subtree, and changed at runtime without swapping stylesheets.
   * @default 'default'
   */
  theme?: HijriCalendarTheme
  /** @default 'default' */
  size?: HijriCalendarSize
  /** Show the previous/next paging buttons. @default true */
  showNavigation?: boolean
  /** Show the weekday label row. @default true */
  showWeekdays?: boolean
  /** Let the heading open month and year pickers. @default true */
  selectableHeading?: boolean
  /** Replace the default chevrons. */
  navigationIcons?: { prev?: Component; next?: Component }
}

export interface HijriCalendarSlots {
  /** Replaces the whole header, including navigation. */
  header?: (props: { heading: string; prevPage: () => void; nextPage: () => void }) => unknown
  'prev-button'?: (props: { disabled: boolean }) => unknown
  'next-button'?: (props: { disabled: boolean }) => unknown
  weekday?: (props: { weekday: string; index: number }) => unknown
  /** Replaces the contents of a day cell. */
  cell?: (props: { dayValue: string; day: CalendarDay }) => unknown
}
</script>

<script setup lang="ts">
import { getLocaleData, MAX_HIJRI_YEAR, MIN_HIJRI_YEAR } from '@taqwim/core'
import {
  HijriCalendarCell,
  HijriCalendarCellTrigger,
  HijriCalendarGrid,
  HijriCalendarGridBody,
  HijriCalendarGridHead,
  HijriCalendarGridRow,
  HijriCalendarHeadCell,
  HijriCalendarHeader,
  HijriCalendarHeading,
  HijriCalendarNext,
  HijriCalendarPrev,
  HijriCalendarRoot,
} from '@taqwim/vue'
import { computed, ref } from 'vue'
import ArrowLeft from './icons/ArrowLeft.vue'
import ArrowRight from './icons/ArrowRight.vue'

const props = withDefaults(defineProps<HijriCalendarProps>(), {
  theme: 'default',
  size: 'default',
  showNavigation: true,
  showWeekdays: true,
  selectableHeading: true,
})

defineSlots<HijriCalendarSlots>()

defineOptions({ name: 'HijriCalendar' })

const modelValue = defineModel<HijriDateObject | HijriDateObject[] | undefined>({ default: undefined })
const placeholder = defineModel<HijriDateObject | undefined>('placeholder', { default: undefined })

type Picker = 'month' | 'year' | null
const picker = ref<Picker>(null)

const months = computed(() => getLocaleData(props.locale ?? 'en', 'monthsLong') as string[])

/*
 * Bounded by what the Umm al-Qura table actually covers, rather than the
 * `new Date().getFullYear() + 579` approximation the previous version used —
 * that offered years the calendar cannot convert.
 */
const years = computed(() => Array.from({ length: MAX_HIJRI_YEAR - MIN_HIJRI_YEAR + 1 }, (_, i) => MIN_HIJRI_YEAR + i))

/*
 * Only the headless props are forwarded. The presentational ones are this
 * component's own, and `modelValue` / `placeholder` already flow through their
 * `v-model` bindings — spreading them again would shadow those bindings.
 */
const rootProps = computed(() => {
  const {
    theme: _theme,
    size: _size,
    showNavigation: _showNavigation,
    showWeekdays: _showWeekdays,
    selectableHeading: _selectableHeading,
    navigationIcons: _navigationIcons,
    modelValue: _modelValue,
    placeholder: _placeholder,
    ...rest
  } = props
  return rest
})

function jumpTo(part: Partial<HijriDateObject>, current: HijriDateObject) {
  // Day 1 keeps the jump inside the target month regardless of its length.
  placeholder.value = { ...current, ...part, hd: 1 }
  picker.value = null
}
</script>

<template>
  <HijriCalendarRoot
    v-model="modelValue"
    v-model:placeholder="placeholder"
    v-bind="rootProps"
    :data-taqwim-theme="theme"
    :data-taqwim-size="size === 'default' ? undefined : size"
    v-slot="{ months: visibleMonths, weekDays, state, store }"
  >
    <slot name="header" :heading="state.headingValue" :prev-page="store.prevPage" :next-page="store.nextPage">
      <HijriCalendarHeader class="taqwim-calendar-header">
        <HijriCalendarPrev v-if="showNavigation" class="taqwim-calendar-nav-button" v-slot="{ disabled }">
          <slot name="prev-button" :disabled="disabled">
            <component :is="navigationIcons?.prev ?? ArrowLeft" aria-hidden="true" />
          </slot>
        </HijriCalendarPrev>

        <HijriCalendarHeading
          class="taqwim-calendar-heading"
          :role="selectableHeading ? 'button' : undefined"
          :tabindex="selectableHeading ? 0 : undefined"
          @click="selectableHeading && (picker = picker === 'month' ? null : 'month')"
          @keydown.enter.prevent="selectableHeading && (picker = picker === 'month' ? null : 'month')"
        />

        <HijriCalendarNext v-if="showNavigation" class="taqwim-calendar-nav-button" v-slot="{ disabled }">
          <slot name="next-button" :disabled="disabled">
            <component :is="navigationIcons?.next ?? ArrowRight" aria-hidden="true" />
          </slot>
        </HijriCalendarNext>
      </HijriCalendarHeader>
    </slot>

    <!--
      Rendered inline rather than teleported to <body>: the theme lives on this
      element's ancestors, so a teleported panel would lose it.
    -->
    <div v-if="picker" class="taqwim-calendar-picker">
      <div class="taqwim-calendar-picker-tabs">
        <button type="button" :data-active="picker === 'month' ? '' : undefined" @click="picker = 'month'">
          {{ state.headingValue.split(' ')[0] }}
        </button>
        <button type="button" :data-active="picker === 'year' ? '' : undefined" @click="picker = 'year'">
          {{ state.placeholder.hy }}
        </button>
      </div>

      <div class="taqwim-calendar-picker-grid">
        <template v-if="picker === 'month'">
          <button
            v-for="(month, index) in months"
            :key="month"
            type="button"
            :data-selected="state.placeholder.hm === index + 1 ? '' : undefined"
            @click="jumpTo({ hm: index + 1 }, state.placeholder)"
          >
            {{ month }}
          </button>
        </template>
        <template v-else>
          <button
            v-for="year in years"
            :key="year"
            type="button"
            :data-selected="state.placeholder.hy === year ? '' : undefined"
            @click="jumpTo({ hy: year }, state.placeholder)"
          >
            {{ year }}
          </button>
        </template>
      </div>
    </div>

    <div v-else class="taqwim-calendar-months">
      <HijriCalendarGrid v-for="month in visibleMonths" :key="month.label" :month="month">
        <HijriCalendarGridHead v-if="showWeekdays">
          <HijriCalendarGridRow>
            <HijriCalendarHeadCell v-for="(weekday, index) in weekDays" :key="weekday" class="taqwim-calendar-weekday">
              <slot name="weekday" :weekday="weekday" :index="index">{{ weekday }}</slot>
            </HijriCalendarHeadCell>
          </HijriCalendarGridRow>
        </HijriCalendarGridHead>

        <HijriCalendarGridBody>
          <HijriCalendarGridRow v-for="(week, index) in month.weeks" :key="index">
            <HijriCalendarCell v-for="day in week" :key="`${day.date.hy}-${day.date.hm}-${day.date.hd}`" :day="day">
              <HijriCalendarCellTrigger :day="day" v-slot="{ dayValue }">
                <slot name="cell" :day-value="dayValue" :day="day">{{ dayValue }}</slot>
              </HijriCalendarCellTrigger>
            </HijriCalendarCell>
          </HijriCalendarGridRow>
        </HijriCalendarGridBody>
      </HijriCalendarGrid>
    </div>
  </HijriCalendarRoot>
</template>
