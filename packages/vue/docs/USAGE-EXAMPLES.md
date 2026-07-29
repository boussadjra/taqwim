# HijriCalendar Usage Examples

This document provides comprehensive examples of how to use the HijriCalendar components in different scenarios.

## Table of Contents

1. [Basic Usage](#basic-usage)
2. [Theme Integration](#theme-integration)
3. [Multiple Date Selection](#multiple-date-selection)
4. [Custom Validation](#custom-validation)
5. [Range Selection](#range-selection)
6. [Multi-Month Display](#multi-month-display)
7. [Custom Styling](#custom-styling)
8. [Internationalization](#internationalization)
9. [Integration with Forms](#integration-with-forms)
10. [Event Handling](#event-handling)

## Basic Usage

### Simple Calendar

```vue
<template>
  <HijriCalendarRoot v-model="selectedDate" locale="ar">
    <template #default="{ grid, weekDays }">
      <div class="calendar-header">
        <HijriCalendarPrev>←</HijriCalendarPrev>
        <HijriCalendarHeading />
        <HijriCalendarNext>→</HijriCalendarNext>
      </div>

      <HijriCalendarGrid>
        <HijriCalendarGridHead>
          <HijriCalendarGridRow>
            <HijriCalendarHeadCell v-for="day in weekDays" :key="day">
              {{ day }}
            </HijriCalendarHeadCell>
          </HijriCalendarGridRow>
        </HijriCalendarGridHead>

        <HijriCalendarGridBody>
          <HijriCalendarGridRow v-for="(week, index) in grid" :key="index">
            <HijriCalendarCell
              v-for="day in week"
              :key="`${day.date.hy}-${day.date.hm}-${day.date.hd}`"
              :date="day.date"
            >
              <HijriCalendarCellTrigger :day="day.date" :month="day.date">
                {{ day.dayInMonth }}
              </HijriCalendarCellTrigger>
            </HijriCalendarCell>
          </HijriCalendarGridRow>
        </HijriCalendarGridBody>
      </HijriCalendarGrid>
    </template>
  </HijriCalendarRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { HijriDateObject } from '@taqwim/core'

const selectedDate = ref<HijriDateObject>()
</script>
```

### With CSS Styling

```vue
<template>
  <div class="calendar-container">
    <HijriCalendarRoot v-model="selectedDate" class="my-calendar" locale="ar">
      <!-- calendar content -->
    </HijriCalendarRoot>
  </div>
</template>

<style>
@import 'taqwim-vue/style/hijri-calendar-default.css';

.calendar-container {
  max-width: 400px;
  margin: 0 auto;
}

.my-calendar {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
}
</style>
```

## Theme Integration

### Using Default Theme

```vue
<template>
  <HijriCalendarRoot v-model="date" class="hijri-calendar">
    <!-- content -->
  </HijriCalendarRoot>
</template>

<style>
@import 'taqwim-vue/style/hijri-calendar-default.css';
</style>
```

### Using Dark Theme

```vue
<template>
  <HijriCalendarRoot v-model="date" class="hijri-calendar-dark">
    <!-- content -->
  </HijriCalendarRoot>
</template>

<style>
@import 'taqwim-vue/style/hijri-calendar-dark.css';
</style>
```

### Using Modern Theme

```vue
<template>
  <HijriCalendarRoot v-model="date" class="hijri-calendar-modern">
    <!-- content -->
  </HijriCalendarRoot>
</template>

<style>
@import 'taqwim-vue/style/hijri-calendar-modern.css';
</style>
```

### Using Islamic Theme with RTL

```vue
<template>
  <HijriCalendarRoot v-model="date" class="hijri-calendar-islamic" dir="rtl" locale="ar">
    <template #default="{ grid, weekDays }">
      <div class="calendar-header">
        <HijriCalendarPrev>→</HijriCalendarPrev>
        <HijriCalendarHeading />
        <HijriCalendarNext>←</HijriCalendarNext>
      </div>
      <!-- rest of content -->
    </template>
  </HijriCalendarRoot>
</template>

<style>
@import 'taqwim-vue/style/hijri-calendar-islamic.css';
</style>
```

### Dynamic Theme Switching

```vue
<template>
  <div>
    <select v-model="currentTheme">
      <option value="default">Default</option>
      <option value="dark">Dark</option>
      <option value="modern">Modern</option>
      <option value="islamic">Islamic</option>
    </select>

    <HijriCalendarRoot
      v-model="date"
      :class="getThemeClass()"
      :dir="currentTheme === 'islamic' ? 'rtl' : 'ltr'"
      :locale="currentTheme === 'islamic' ? 'ar' : 'en'"
    >
      <!-- content -->
    </HijriCalendarRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const currentTheme = ref('default')

const getThemeClass = () => {
  const themeMap = {
    default: 'hijri-calendar',
    dark: 'hijri-calendar-dark',
    modern: 'hijri-calendar-modern',
    islamic: 'hijri-calendar-islamic',
  }
  return themeMap[currentTheme.value] || 'hijri-calendar'
}
</script>

<style>
@import 'taqwim-vue/style/hijri-calendar-default.css';
@import 'taqwim-vue/style/hijri-calendar-dark.css';
@import 'taqwim-vue/style/hijri-calendar-modern.css';
@import 'taqwim-vue/style/hijri-calendar-islamic.css';
</style>
```

## Multiple Date Selection

### Basic Multiple Selection

```vue
<template>
  <HijriCalendarRoot v-model="selectedDates" :multiple="true" locale="ar">
    <!-- calendar content -->
  </HijriCalendarRoot>

  <div v-if="selectedDates?.length">
    <h3>Selected Dates:</h3>
    <ul>
      <li v-for="date in selectedDates" :key="`${date.hy}-${date.hm}-${date.hd}`">
        {{ formatHijriDate(date, 'ar') }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatHijriDate } from '@taqwim/core'
import type { HijriDateObject } from '@taqwim/core'

const selectedDates = ref<HijriDateObject[]>([])
</script>
```

### Limited Multiple Selection

```vue
<template>
  <HijriCalendarRoot v-model="selectedDates" :multiple="true" locale="ar" @update:model-value="handleSelectionChange">
    <!-- calendar content -->
  </HijriCalendarRoot>

  <p>Selected {{ selectedDates?.length || 0 }} of 3 dates maximum</p>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { HijriDateObject } from '@taqwim/core'

const selectedDates = ref<HijriDateObject[]>([])
const maxSelection = 3

const handleSelectionChange = (dates: HijriDateObject[]) => {
  if (dates.length <= maxSelection) {
    selectedDates.value = dates
  } else {
    // Prevent selection beyond limit
    selectedDates.value = dates.slice(0, maxSelection)
  }
}
</script>
```

## Custom Validation

### Weekend Restriction

```vue
<template>
  <HijriCalendarRoot v-model="selectedDate" :is-date-disabled="isWeekend" locale="en">
    <!-- calendar content -->
  </HijriCalendarRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getDayInWeek } from '@taqwim/core'
import type { HijriDateObject } from '@taqwim/core'

const selectedDate = ref<HijriDateObject>()

const isWeekend = (date: HijriDateObject) => {
  const dayInWeek = getDayInWeek(date)
  return dayInWeek === 5 || dayInWeek === 6 // Friday and Saturday
}
</script>
```

### Holiday Marking

```vue
<template>
  <HijriCalendarRoot v-model="selectedDate" :is-date-unavailable="isHoliday" locale="ar">
    <!-- calendar content -->
  </HijriCalendarRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { HijriDateObject } from '@taqwim/core'

const selectedDate = ref<HijriDateObject>()

const holidays = [
  { month: 1, day: 1 }, // Muharram 1 - New Year
  { month: 3, day: 12 }, // Rabi' al-awwal 12 - Mawlid
  { month: 9, day: 1 }, // Ramadan 1 - Start of Ramadan
  { month: 10, day: 1 }, // Shawwal 1 - Eid al-Fitr
  { month: 12, day: 10 }, // Dhu al-Hijjah 10 - Eid al-Adha
]

const isHoliday = (date: HijriDateObject) => {
  return holidays.some(holiday => holiday.month === date.hm && holiday.day === date.hd)
}
</script>
```

### Date Range Restriction

```vue
<template>
  <HijriCalendarRoot v-model="selectedDate" :min-value="minDate" :max-value="maxDate" locale="ar">
    <!-- calendar content -->
  </HijriCalendarRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { toHijri, addHijriMonths } from '@taqwim/core'
import type { HijriDateObject } from '@taqwim/core'

const selectedDate = ref<HijriDateObject>()

// Only allow selection within next 3 months
const now = new Date()
const minDate = toHijri(now)
const maxDate = addHijriMonths(minDate, 3)
</script>
```

## Range Selection

### Basic Date Range

```vue
<template>
  <HijriCalendarRoot v-model="selectedRange" :multiple="true" locale="ar" @update:model-value="handleRangeSelection">
    <!-- calendar content -->
  </HijriCalendarRoot>

  <div v-if="selectedRange?.length === 2">
    <p>Start: {{ formatHijriDate(selectedRange[0], 'ar') }}</p>
    <p>End: {{ formatHijriDate(selectedRange[1], 'ar') }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatHijriDate, isGreaterThan } from '@taqwim/core'
import type { HijriDateObject } from '@taqwim/core'

const selectedRange = ref<HijriDateObject[]>([])

const handleRangeSelection = (dates: HijriDateObject[]) => {
  if (dates.length === 0) {
    selectedRange.value = []
  } else if (dates.length === 1) {
    selectedRange.value = [dates[0]]
  } else if (dates.length === 2) {
    // Ensure proper order (start < end)
    const [first, second] = dates
    if (isGreaterThan(first, second)) {
      selectedRange.value = [second, first]
    } else {
      selectedRange.value = [first, second]
    }
  } else {
    // Start new range with the last selected date
    selectedRange.value = [dates[dates.length - 1]]
  }
}
</script>
```

### Range with Validation

```vue
<template>
  <HijriCalendarRoot
    v-model="selectedRange"
    :multiple="true"
    :is-date-disabled="isDateDisabled"
    locale="ar"
    @update:model-value="handleRangeSelection"
  >
    <!-- calendar content -->
  </HijriCalendarRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getDayInWeek, subHijriDays, addHijriDays } from '@taqwim/core'
import type { HijriDateObject } from '@taqwim/core'

const selectedRange = ref<HijriDateObject[]>([])

const isDateDisabled = (date: HijriDateObject) => {
  // Disable weekends
  const dayInWeek = getDayInWeek(date)
  if (dayInWeek === 5 || dayInWeek === 6) return true

  // If we have a start date, disable dates that would create invalid ranges
  if (selectedRange.value.length === 1) {
    const startDate = selectedRange.value[0]
    const maxRangeDays = 30
    const minAllowed = subHijriDays(startDate, maxRangeDays)
    const maxAllowed = addHijriDays(startDate, maxRangeDays)

    return date < minAllowed || date > maxAllowed
  }

  return false
}

const handleRangeSelection = (dates: HijriDateObject[]) => {
  selectedRange.value = dates.slice(0, 2) // Maximum 2 dates for range
}
</script>
```

## Multi-Month Display

### Three Month View

```vue
<template>
  <HijriCalendarRoot v-model="selectedDate" :number-of-months="3" :paged-navigation="true" locale="ar" dir="rtl">
    <!-- calendar content -->
  </HijriCalendarRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { HijriDateObject } from '@taqwim/core'

const selectedDate = ref<HijriDateObject>()
</script>

<style>
.hijri-calendar {
  display: flex;
  gap: 20px;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .hijri-calendar {
    flex-direction: column;
  }
}
</style>
```

### Responsive Multi-Month

```vue
<template>
  <HijriCalendarRoot v-model="selectedDate" :number-of-months="monthsToShow" :paged-navigation="true" locale="ar">
    <!-- calendar content -->
  </HijriCalendarRoot>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { HijriDateObject } from '@taqwim/core'

const selectedDate = ref<HijriDateObject>()
const windowWidth = ref(window.innerWidth)

const monthsToShow = computed(() => {
  if (windowWidth.value < 768) return 1
  if (windowWidth.value < 1024) return 2
  return 3
})

const updateWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})
</script>
```

## Custom Styling

### Custom Theme

```vue
<template>
  <HijriCalendarRoot v-model="selectedDate" class="custom-calendar" locale="ar">
    <!-- calendar content -->
  </HijriCalendarRoot>
</template>

<style>
.custom-calendar {
  --calendar-bg: #f8fafc;
  --calendar-border: #e2e8f0;
  --cell-hover-bg: #edf2f7;
  --cell-selected-bg: #4299e1;
  --cell-selected-color: white;
  --cell-today-bg: #fed7d7;
  --cell-today-color: #c53030;

  background: var(--calendar-bg);
  border: 1px solid var(--calendar-border);
  border-radius: 12px;
  padding: 16px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.custom-calendar [data-selected] {
  background: var(--cell-selected-bg);
  color: var(--cell-selected-color);
  border-radius: 50%;
}

.custom-calendar [data-today] {
  background: var(--cell-today-bg);
  color: var(--cell-today-color);
  font-weight: bold;
}

.custom-calendar .day-button:hover {
  background: var(--cell-hover-bg);
}
</style>
```

### Gradient Theme

```vue
<template>
  <HijriCalendarRoot v-model="selectedDate" class="gradient-calendar" locale="ar">
    <!-- calendar content -->
  </HijriCalendarRoot>
</template>

<style>
.gradient-calendar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.gradient-calendar .calendar-header {
  margin-bottom: 20px;
}

.gradient-calendar .heading {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
}

.gradient-calendar .nav-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.gradient-calendar .nav-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.gradient-calendar .weekday-cell {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.gradient-calendar .day-button {
  color: white;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.gradient-calendar [data-selected] {
  background: white;
  color: #667eea;
  font-weight: bold;
}

.gradient-calendar [data-today] {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
}

.gradient-calendar .day-button:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
```

## Internationalization

### Multi-Language Support

```vue
<template>
  <div>
    <select v-model="currentLocale">
      <option value="ar">العربية</option>
      <option value="en">English</option>
      <option value="fr">Français</option>
    </select>

    <HijriCalendarRoot v-model="selectedDate" :locale="currentLocale" :dir="currentLocale === 'ar' ? 'rtl' : 'ltr'">
      <template #default="{ grid, weekDays }">
        <div class="calendar-header">
          <HijriCalendarPrev>
            {{ currentLocale === 'ar' ? '→' : '←' }}
          </HijriCalendarPrev>
          <HijriCalendarHeading />
          <HijriCalendarNext>
            {{ currentLocale === 'ar' ? '←' : '→' }}
          </HijriCalendarNext>
        </div>
        <!-- rest of calendar -->
      </template>
    </HijriCalendarRoot>

    <div v-if="selectedDate">
      <p>{{ formatHijriDate(selectedDate, currentLocale) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatHijriDate } from '@taqwim/core'
import type { HijriDateObject } from '@taqwim/core'

const selectedDate = ref<HijriDateObject>()
const currentLocale = ref<'ar' | 'en' | 'fr'>('ar')
</script>
```

### Custom Weekday Format

```vue
<template>
  <HijriCalendarRoot v-model="selectedDate" locale="ar" :weekday-format="weekdayFormat">
    <!-- calendar content -->
  </HijriCalendarRoot>

  <div class="format-controls">
    <label>
      <input type="radio" v-model="weekdayFormat" value="weekDaysShort" />
      Short (ج، خ، ...)
    </label>
    <label>
      <input type="radio" v-model="weekdayFormat" value="weekDaysMedium" />
      Medium (جمعة، خميس، ...)
    </label>
    <label>
      <input type="radio" v-model="weekdayFormat" value="weekDaysLong" />
      Long (الجمعة، الخميس، ...)
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { HijriDateObject, WeekDayFormat } from '@taqwim/core'

const selectedDate = ref<HijriDateObject>()
const weekdayFormat = ref<WeekDayFormat>('weekDaysMedium')
</script>
```

## Integration with Forms

### Vue Form Integration

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="birthdate">تاريخ الميلاد</label>
      <HijriCalendarRoot v-model="formData.birthDate" locale="ar" :is-date-disabled="isDateDisabled">
        <!-- calendar content -->
      </HijriCalendarRoot>
      <div v-if="errors.birthDate" class="error">
        {{ errors.birthDate }}
      </div>
    </div>

    <div class="form-group">
      <label for="event-dates">تواريخ الأحداث</label>
      <HijriCalendarRoot v-model="formData.eventDates" :multiple="true" locale="ar">
        <!-- calendar content -->
      </HijriCalendarRoot>
    </div>

    <button type="submit" :disabled="!isFormValid">إرسال</button>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { isGreaterThan, toHijri } from '@taqwim/core'
import type { HijriDateObject } from '@taqwim/core'

interface FormData {
  birthDate?: HijriDateObject
  eventDates: HijriDateObject[]
}

const formData = ref<FormData>({
  birthDate: undefined,
  eventDates: [],
})

const errors = ref<Record<string, string>>({})

const isDateDisabled = (date: HijriDateObject) => {
  // Disable future dates for birth date
  const today = toHijri(new Date())
  return isGreaterThan(date, today)
}

const isFormValid = computed(() => {
  return formData.value.birthDate && Object.keys(errors.value).length === 0
})

const validateForm = () => {
  errors.value = {}

  if (!formData.value.birthDate) {
    errors.value.birthDate = 'تاريخ الميلاد مطلوب'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (validateForm()) {
    console.log('Form data:', formData.value)
    // Submit form
  }
}
</script>
```

### Validation with VeeValidate

```vue
<template>
  <Form @submit="onSubmit" :validation-schema="schema">
    <Field name="startDate" v-slot="{ field, errors }">
      <label>Start Date</label>
      <HijriCalendarRoot v-model="field.value" locale="en" @update:model-value="field.onChange">
        <!-- calendar content -->
      </HijriCalendarRoot>
      <div v-if="errors.length" class="error">{{ errors[0] }}</div>
    </Field>

    <Field name="endDate" v-slot="{ field, errors }">
      <label>End Date</label>
      <HijriCalendarRoot v-model="field.value" locale="en" :min-value="startDate" @update:model-value="field.onChange">
        <!-- calendar content -->
      </HijriCalendarRoot>
      <div v-if="errors.length" class="error">{{ errors[0] }}</div>
    </Field>

    <button type="submit">Submit</button>
  </Form>
</template>

<script setup lang="ts">
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { isGreaterThan } from '@taqwim/core'

const schema = yup.object({
  startDate: yup.object().required('Start date is required'),
  endDate: yup
    .object()
    .required('End date is required')
    .test('after-start', 'End date must be after start date', function (value) {
      const { startDate } = this.parent
      if (!startDate || !value) return true
      return isGreaterThan(value, startDate)
    }),
})

const onSubmit = (values: any) => {
  console.log('Submitted:', values)
}
</script>
```

## Event Handling

### Advanced Event Handling

```vue
<template>
  <HijriCalendarRoot
    v-model="selectedDate"
    locale="ar"
    @update:model-value="onDateSelect"
    @update:placeholder="onMonthChange"
  >
    <!-- calendar content -->
  </HijriCalendarRoot>

  <div class="event-log">
    <h3>Event Log:</h3>
    <ul>
      <li v-for="(event, index) in eventLog" :key="index">
        {{ event }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatHijriDate } from '@taqwim/core'
import type { HijriDateObject } from '@taqwim/core'

const selectedDate = ref<HijriDateObject>()
const eventLog = ref<string[]>([])

const onDateSelect = (date: HijriDateObject | undefined) => {
  if (date) {
    const formatted = formatHijriDate(date, 'ar')
    eventLog.value.unshift(`Date selected: ${formatted}`)
  } else {
    eventLog.value.unshift('Date deselected')
  }

  // Keep only last 10 events
  if (eventLog.value.length > 10) {
    eventLog.value = eventLog.value.slice(0, 10)
  }
}

const onMonthChange = (date: HijriDateObject) => {
  const formatted = formatHijriDate(date, 'ar')
  eventLog.value.unshift(`Month changed to: ${formatted}`)
}
</script>
```

### Custom Cell Interaction

```vue
<template>
  <HijriCalendarRoot v-model="selectedDate" locale="ar">
    <template #default="{ grid, weekDays }">
      <!-- header content -->

      <HijriCalendarGrid>
        <!-- head content -->

        <HijriCalendarGridBody>
          <HijriCalendarGridRow v-for="(week, index) in grid" :key="index">
            <HijriCalendarCell
              v-for="day in week"
              :key="`${day.date.hy}-${day.date.hm}-${day.date.hd}`"
              :date="day.date"
            >
              <HijriCalendarCellTrigger
                :day="day.date"
                :month="day.date"
                @click="onCellClick(day.date, $event)"
                @mouseenter="onCellHover(day.date)"
                @mouseleave="onCellLeave(day.date)"
              >
                <div class="day-content">
                  <span class="day-number">{{ day.dayInMonth }}</span>
                  <span v-if="hasEvents(day.date)" class="event-indicator">•</span>
                </div>
              </HijriCalendarCellTrigger>
            </HijriCalendarCell>
          </HijriCalendarGridRow>
        </HijriCalendarGridBody>
      </HijriCalendarGrid>
    </template>
  </HijriCalendarRoot>

  <div v-if="hoveredDate" class="date-tooltip">Hovering: {{ formatHijriDate(hoveredDate, 'ar') }}</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatHijriDate, isEqual } from '@taqwim/core'
import type { HijriDateObject } from '@taqwim/core'

const selectedDate = ref<HijriDateObject>()
const hoveredDate = ref<HijriDateObject>()

// Sample events data
const events = ref([
  { date: { hy: 1446, hm: 1, hd: 15 }, title: 'Meeting' },
  { date: { hy: 1446, hm: 1, hd: 20 }, title: 'Appointment' },
])

const hasEvents = (date: HijriDateObject) => {
  return events.value.some(event => isEqual(event.date, date))
}

const onCellClick = (date: HijriDateObject, event: MouseEvent) => {
  console.log('Cell clicked:', date, event)
  if (event.shiftKey) {
    // Handle shift-click for range selection
    console.log('Shift-click detected')
  }
}

const onCellHover = (date: HijriDateObject) => {
  hoveredDate.value = date
}

const onCellLeave = (date: HijriDateObject) => {
  hoveredDate.value = undefined
}
</script>

<style>
.day-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.day-number {
  font-size: 14px;
}

.event-indicator {
  color: #3b82f6;
  font-size: 18px;
  line-height: 1;
  margin-top: -2px;
}

.date-tooltip {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: #1f2937;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
}
</style>
```

These examples demonstrate the flexibility and power of the HijriCalendar components. You can mix and match these patterns to create exactly the calendar experience you need for your application.
