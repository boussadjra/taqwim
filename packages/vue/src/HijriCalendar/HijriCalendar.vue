<script lang="ts">
import type { HijriDateObject, ValidHijriDate, MonthDay } from 'taqwim-core-utils'
import type { Ref } from 'vue'
import type { WeekDayFormat, MonthFormat } from '../DatePicker/types'
import type { Direction, Matcher, HijriCalendarRootProps, HijriCalendarRootEmits } from './HijriCalendarRoot.vue'

export type HijriCalendarTheme =
  | 'default'
  | 'dark'
  | 'modern'
  | 'islamic'
  | 'minimal'
  | 'neon'
  | 'ocean'
  | 'sunset'
  | 'cyberpunk'
  | 'nature'
  | 'minimalist'
  | 'luxurious'
  | 'material'
  | 'custom'
export type HijriCalendarSize = 'compact' | 'default' | 'large'

export interface HijriCalendarProps extends Omit<HijriCalendarRootProps, 'class' | 'modelValue'> {
  /**
   * The selected date(s)
   */
  modelValue?: HijriDateObject | HijriDateObject[]

  /**
   * Pre-built theme to apply to the calendar
   * @default 'default'
   */
  theme?: HijriCalendarTheme

  /**
   * Size variant of the calendar
   * @default 'default'
   */
  size?: HijriCalendarSize

  /**
   * Whether to include default styling
   * Set to false for completely unstyled (headless) usage
   * @default true
   */
  styled?: boolean

  /**
   * Custom CSS class to apply to the calendar root
   */
  class?: string

  /**
   * Show navigation arrows
   * @default true
   */
  showNavigation?: boolean

  /**
   * Show weekday headers
   * @default true
   */
  showWeekdays?: boolean

  /**
   * Custom navigation icons
   */
  navigationIcons?: {
    prev?: any
    next?: any
  }

  /**
   * Additional HTML attributes
   */
  [key: string]: any
}

export type HijriCalendarEmits = {
  /** Event handler called whenever the model value changes */
  'update:modelValue': [date: HijriDateObject | HijriDateObject[] | undefined]
  /** Event handler called whenever the placeholder value changes */
  'update:placeholder': [date: HijriDateObject]
}

export interface HijriCalendarSlots {
  /**
   * Custom content for the calendar header
   */
  header?: (props: {
    /** Current month/year heading */
    heading: string
    /** Previous page function */
    prevPage: () => void
    /** Next page function */
    nextPage: () => void
    /** Whether prev button is disabled */
    isPrevDisabled: boolean
    /** Whether next button is disabled */
    isNextDisabled: boolean
  }) => any

  /**
   * Custom content for navigation buttons
   */
  'prev-button'?: (props: { disabled: boolean }) => any
  'next-button'?: (props: { disabled: boolean }) => any

  /**
   * Custom content for weekday headers
   */
  weekday?: (props: {
    /** Weekday name */
    weekday: string
    /** Weekday index (0-6) */
    index: number
  }) => any

  /**
   * Custom content for calendar cells
   */
  cell?: (props: {
    /** Day value */
    dayValue: string
    /** Current date object */
    date: HijriDateObject
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

  /**
   * Default slot for completely custom content
   */
  default?: () => any
}
</script>

<script setup lang="ts">
import { computed, ref, inject } from 'vue'
import type { HijriCalendarRoot } from './index'
import {
  HijriCalendarHeader,
  HijriCalendarHeading,
  HijriCalendarPrev,
  HijriCalendarNext,
  HijriCalendarGrid,
  HijriCalendarGridHead,
  HijriCalendarGridBody,
  HijriCalendarGridRow,
  HijriCalendarHeadCell,
  HijriCalendarCell,
  HijriCalendarCellTrigger,
} from './index'
import ArrowLeft from '../icons/ArrowLeft.vue'
import ArrowRight from '../icons/ArrowRight.vue'
import { formatHijriDate } from 'taqwim-core-utils'
import { useHijriLocale } from '../composables/useHijriLocale'

const props = withDefaults(defineProps<HijriCalendarProps>(), {
  theme: 'default',
  size: 'default',
  styled: true,
  showNavigation: true,
  showWeekdays: true,
  fixedWeeks: false,
  multiple: false,
  pagedNavigation: false,
  preventDeselect: false,
  disabled: false,
  readonly: false,
  disableDaysOutsideCurrentView: false,
})

const emits = defineEmits<HijriCalendarEmits>()

defineSlots<HijriCalendarSlots>()

// Define model for v-model binding
const modelValue = defineModel<HijriDateObject | HijriDateObject[] | undefined>({
  default: undefined,
})

// Use the improved locale management
const { localeData, direction } = useHijriLocale(computed(() => props.locale || 'en'))

// Year and Month selection state
const showYearSelector = ref(false)
const showMonthSelector = ref(false)
const selectorType = ref<'year' | 'month'>('year')

// Calendar root reference to access context
const calendarRootRef = ref<InstanceType<typeof HijriCalendarRoot>>()

// Close selectors when clicking outside
function closeSelectors() {
  showYearSelector.value = false
  showMonthSelector.value = false
}

// Generate years array (current year ± 50)
const availableYears = computed(() => {
  const currentYear = new Date().getFullYear() + 579 // Approximate Hijri year
  const years = []
  for (let i = currentYear - 50; i <= currentYear + 50; i++) {
    years.push(i)
  }
  return years
})

// Use locale data for months instead of hardcoded values
const hijriMonths = computed(() => {
  const monthsLong = localeData.value.monthsLong
  const monthsMedium = localeData.value.monthsMedium

  return monthsLong.map((longName, index) => ({
    name: longName,
    short: monthsMedium[index],
    value: index + 1,
  }))
})

// Compute theme classes
const themeClasses = computed(() => {
  if (!props.styled) return ''

  const classes = ['hijri-calendar']

  // Add theme class
  if (props.theme !== 'default') {
    classes.push(`hijri-calendar-${props.theme}`)
  }

  // Add size class
  if (props.size !== 'default') {
    classes.push(`hijri-calendar--${props.size}`)
  }

  return classes.join(' ')
})

// Compute final class
const finalClass = computed(() => {
  const classes = [themeClasses.value, props.class].filter(Boolean)
  return classes.join(' ')
})

// Compute props to pass to HijriCalendarRoot (exclude modelValue since we handle it separately)
const rootProps = computed(() => {
  const { modelValue: _, class: __, ...restProps } = props
  return restProps
})

// Direction for RTL support
const directionAttr = computed(() => {
  return props.dir || direction.value
})

// Get current date for selectors
const currentDate = computed(() => {
  return modelValue.value || { hy: 1446, hm: 1, hd: 1 }
})

defineOptions({
  name: 'HijriCalendar',
})
</script>

<template>
  <HijriCalendarRoot
    ref="calendarRootRef"
    v-model="modelValue"
    v-bind="rootProps"
    :class="finalClass"
    :dir="directionAttr"
    v-slot="{ date, grid, weekDays, locale }"
  >
    <!-- Custom slot content takes precedence -->
    <slot v-if="$slots.default" />

    <!-- Default calendar structure -->
    <template v-else>
      <!-- Default header -->
      <HijriCalendarHeader :class="styled ? 'hijri-calendar-header' : ''" style="position: relative">
        <!-- Previous navigation -->
        <HijriCalendarPrev v-if="showNavigation" :class="styled ? 'hijri-calendar-nav-button' : ''">
          <slot name="prev-button" :disabled="false">
            <component :is="navigationIcons?.prev || ArrowLeft" aria-hidden="true" />
          </slot>
        </HijriCalendarPrev>

        <!-- Heading -->
        <HijriCalendarHeading
          :class="styled ? 'hijri-calendar-heading' : ''"
          @click="
            () => {
              selectorType = 'year'
              showYearSelector = !showYearSelector
              showMonthSelector = false
            }
          "
        />

        <!-- Next navigation -->
        <HijriCalendarNext v-if="showNavigation" :class="styled ? 'hijri-calendar-nav-button' : ''">
          <slot name="next-button" :disabled="false">
            <component :is="navigationIcons?.next || ArrowRight" aria-hidden="true" />
          </slot>
        </HijriCalendarNext>

        <!-- Month selector button -->
        <button
          v-if="styled"
          @click="
            () => {
              selectorType = 'month'
              showMonthSelector = !showMonthSelector
              showYearSelector = false
            }
          "
          :class="styled ? 'hijri-calendar-nav-button' : ''"
          type="button"
          :title="props.locale === 'ar' ? 'اختر الشهر' : 'Select Month'"
          :aria-label="props.locale === 'ar' ? 'اختر الشهر' : 'Select Month'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path d="M16 1V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8 1V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M3 9H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </HijriCalendarHeader>

      <!-- Calendar Grid -->
      <HijriCalendarGrid :class="styled ? 'hijri-calendar-grid' : ''">
        <!-- Weekday headers -->
        <HijriCalendarGridHead v-if="showWeekdays" :class="styled ? 'hijri-calendar-grid-head' : ''">
          <HijriCalendarGridRow :class="styled ? 'hijri-calendar-grid-row' : ''">
            <HijriCalendarHeadCell
              v-for="(weekday, index) in weekDays"
              :key="weekday"
              :class="styled ? 'hijri-calendar-head-cell' : ''"
            >
              <slot name="weekday" :weekday="weekday" :index="index">
                {{ weekday }}
              </slot>
            </HijriCalendarHeadCell>
          </HijriCalendarGridRow>
        </HijriCalendarGridHead>

        <!-- Calendar body -->
        <HijriCalendarGridBody :class="styled ? 'hijri-calendar-grid-body' : ''">
          <HijriCalendarGridRow
            v-for="(week, weekIndex) in grid"
            :key="weekIndex"
            :class="styled ? 'hijri-calendar-grid-row' : ''"
          >
            <HijriCalendarCell
              v-for="(day, dayIndex) in week"
              :key="dayIndex"
              :date="day.date"
              :class="styled ? 'hijri-calendar-cell' : ''"
            >
              <HijriCalendarCellTrigger
                :day="day.date"
                :month="date"
                :class="styled ? 'hijri-calendar-cell-trigger' : ''"
              >
                <slot
                  name="cell"
                  :day-value="day.dayInMonth.toString()"
                  :date="day.date"
                  :disabled="false"
                  :selected="false"
                  :today="day.isToday || false"
                  :outside-view="day.isAdjacent || false"
                  :outside-visible-view="day.date.hm !== date.hm || day.date.hy !== date.hy"
                  :unavailable="false"
                />
              </HijriCalendarCellTrigger>
            </HijriCalendarCell>
          </HijriCalendarGridRow>
        </HijriCalendarGridBody>
      </HijriCalendarGrid>
    </template>

    <!-- Overlay to close selectors when clicking outside -->
    <div
      v-if="showYearSelector || showMonthSelector"
      @click="closeSelectors"
      style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999; background: rgba(0, 0, 0, 0.1)"
      aria-hidden="true"
    />
  </HijriCalendarRoot>

  <!-- Year/Month Selectors as Teleports -->
  <Teleport to="body">
    <!-- Year Selector -->
    <div v-if="showYearSelector && selectorType === 'year'" :class="styled ? 'year-month-selector' : ''" @click.stop>
      <div :class="styled ? 'selector-header' : ''">
        <span :class="styled ? 'selector-title' : ''">
          {{ localeData.year }}
        </span>
        <button :class="styled ? 'selector-close' : ''" @click="closeSelectors" type="button">×</button>
      </div>
      <div :class="styled ? 'selector-grid' : ''">
        <button
          v-for="year in availableYears"
          :key="year"
          :class="[
            styled ? 'selector-item' : '',
            (Array.isArray(currentDate) ? currentDate[0]?.hy : currentDate.hy) === year && styled ? 'selected' : '',
          ]"
          @click="
            () => {
              const baseDate = Array.isArray(currentDate) ? currentDate[0] || { hy: 1446, hm: 1, hd: 1 } : currentDate
              emits('update:placeholder', { ...baseDate, hy: year })
              closeSelectors()
            }
          "
          type="button"
        >
          {{ year }}
        </button>
      </div>
    </div>

    <!-- Month Selector -->
    <div v-if="showMonthSelector && selectorType === 'month'" :class="styled ? 'year-month-selector' : ''" @click.stop>
      <div :class="styled ? 'selector-header' : ''">
        <span :class="styled ? 'selector-title' : ''">
          {{ localeData.month }}
        </span>
        <button :class="styled ? 'selector-close' : ''" @click="closeSelectors" type="button">×</button>
      </div>
      <div :class="styled ? 'selector-grid' : ''">
        <button
          v-for="month in hijriMonths"
          :key="month.value"
          :class="[
            styled ? 'selector-item' : '',
            (Array.isArray(currentDate) ? currentDate[0]?.hm : currentDate.hm) === month.value && styled
              ? 'selected'
              : '',
          ]"
          @click="
            () => {
              const baseDate = Array.isArray(currentDate) ? currentDate[0] || { hy: 1446, hm: 1, hd: 1 } : currentDate
              emits('update:placeholder', { ...baseDate, hm: month.value })
              closeSelectors()
            }
          "
          type="button"
        >
          {{ month.name }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style>
/* Import CSS variables and base styles */
@import '../style/hijri-calendar-variables.css';
@import '../style/hijri-calendar.css';

/* Import all theme styles */
@import '../style/hijri-calendar-dark.css';
@import '../style/hijri-calendar-neon.css';
@import '../style/hijri-calendar-ocean.css';
@import '../style/hijri-calendar-sunset.css';
@import '../style/hijri-calendar-cyberpunk.css';
@import '../style/hijri-calendar-nature.css';
@import '../style/hijri-calendar-minimalist.css';
@import '../style/hijri-calendar-luxurious.css';
@import '../style/hijri-calendar-material.css';

/* Year/Month Selector Overlay Styles */
.year-month-selector {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--hijri-calendar-cell-bg);
  border: 1px solid var(--hijri-calendar-border);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  min-width: 300px;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 10000;
  padding: 16px;
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--hijri-calendar-border);
}

.selector-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--hijri-calendar-text);
}

.selector-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--hijri-calendar-text);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.selector-close:hover {
  background-color: var(--hijri-calendar-hover-bg);
}

.selector-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.selector-item {
  padding: 12px 8px;
  border: 1px solid var(--hijri-calendar-border);
  background: var(--hijri-calendar-cell-bg);
  color: var(--hijri-calendar-text);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.selector-item:hover {
  background: var(--hijri-calendar-hover-bg);
  border-color: var(--hijri-calendar-accent);
}

.selector-item.selected {
  background: var(--hijri-calendar-accent);
  color: var(--hijri-calendar-accent-text);
  border-color: var(--hijri-calendar-accent);
}
</style>
