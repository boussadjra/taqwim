<script setup lang="ts">
/**
 * Every option the calendar accepts, exercisable live.
 *
 * This doubles as the manual-verification surface: each control below drives a
 * prop that the pre-1.0 component accepted and silently ignored.
 */
import { getDayInWeek, type HijriDateObject } from '@taqwim/core'
import { HijriCalendar, type HijriCalendarSize, type HijriCalendarTheme } from '@taqwim/vue-styled'
import { computed, ref } from 'vue'

const THEMES: HijriCalendarTheme[] = [
  'default',
  'dark',
  'modern',
  'islamic',
  'minimal',
  'minimalist',
  'neon',
  'ocean',
  'sunset',
  'cyberpunk',
  'nature',
  'luxurious',
  'material',
]

const theme = ref<HijriCalendarTheme>('default')
const size = ref<HijriCalendarSize>('default')
const locale = ref('en')
const dir = ref<'ltr' | 'rtl'>('ltr')

const weekStartsOn = ref<0 | 1 | 2 | 3 | 4 | 5 | 6>(0)
const numberOfMonths = ref(1)
const fixedWeeks = ref(false)
const pagedNavigation = ref(false)
const multiple = ref(false)
const preventDeselect = ref(false)
const disableDaysOutsideCurrentView = ref(false)
const disabled = ref(false)
const readonly = ref(false)
const initialFocus = ref(false)
const bounded = ref(false)
const noFridays = ref(false)

const value = ref<HijriDateObject | HijriDateObject[] | undefined>()

const minValue = computed(() => (bounded.value ? { hy: 1446, hm: 1, hd: 5 } : undefined))
const maxValue = computed(() => (bounded.value ? { hy: 1446, hm: 3, hd: 20 } : undefined))

// Fridays are the Jumu'ah holiday in much of the Muslim world — a realistic
// `isDateUnavailable`, and a check that the matcher runs for keyboard
// selection too, not only clicks.
const isDateUnavailable = computed(() =>
  noFridays.value ? (date: HijriDateObject) => getDayInWeek(date) === 5 : undefined,
)

const selection = computed(() => JSON.stringify(value.value ?? null))
</script>

<template>
  <div class="layout">
    <aside class="controls">
      <label>
        Theme
        <select v-model="theme">
          <option v-for="name in THEMES" :key="name" :value="name">{{ name }}</option>
        </select>
      </label>

      <label>
        Size
        <select v-model="size">
          <option value="compact">compact</option>
          <option value="default">default</option>
          <option value="large">large</option>
        </select>
      </label>

      <label>
        Locale
        <select v-model="locale">
          <option value="en">en</option>
          <option value="ar">ar</option>
          <option value="fr">fr</option>
        </select>
      </label>

      <label>
        Direction
        <select v-model="dir">
          <option value="ltr">ltr</option>
          <option value="rtl">rtl</option>
        </select>
      </label>

      <label>
        Week starts on
        <select v-model.number="weekStartsOn">
          <option v-for="day in 7" :key="day" :value="day - 1">{{ day - 1 }}</option>
        </select>
      </label>

      <label>
        Months
        <input v-model.number="numberOfMonths" type="number" min="1" max="4" />
      </label>

      <label><input v-model="fixedWeeks" type="checkbox" /> fixedWeeks</label>
      <label><input v-model="pagedNavigation" type="checkbox" /> pagedNavigation</label>
      <label><input v-model="multiple" type="checkbox" /> multiple</label>
      <label><input v-model="preventDeselect" type="checkbox" /> preventDeselect</label>
      <label><input v-model="disableDaysOutsideCurrentView" type="checkbox" /> disableDaysOutsideCurrentView</label>
      <label><input v-model="disabled" type="checkbox" /> disabled</label>
      <label><input v-model="readonly" type="checkbox" /> readonly</label>
      <label><input v-model="initialFocus" type="checkbox" /> initialFocus</label>
      <label><input v-model="bounded" type="checkbox" /> min/max (1446-01-05 … 1446-03-20)</label>
      <label><input v-model="noFridays" type="checkbox" /> isDateUnavailable (Fridays)</label>

      <output>{{ selection }}</output>
    </aside>

    <section>
      <HijriCalendar
        :key="`${initialFocus}`"
        v-model="value"
        :theme="theme"
        :size="size"
        :locale="locale"
        :dir="dir"
        :week-starts-on="weekStartsOn"
        :number-of-months="numberOfMonths"
        :fixed-weeks="fixedWeeks"
        :paged-navigation="pagedNavigation"
        :multiple="multiple"
        :prevent-deselect="preventDeselect"
        :disable-days-outside-current-view="disableDaysOutsideCurrentView"
        :disabled="disabled"
        :readonly="readonly"
        :initial-focus="initialFocus"
        :min-value="minValue"
        :max-value="maxValue"
        :is-date-unavailable="isDateUnavailable"
      />

      <p class="hint">
        Tab into the grid, then use the arrow keys, Home/End, PageUp/PageDown (Shift for years) and Enter to select.
        Under <code>dir="rtl"</code> the horizontal keys mirror.
      </p>
    </section>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: flex-start;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 16rem;
  font-size: 0.875rem;
}

.controls label {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  align-items: center;
}

output {
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  background: #f4f4f5;
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
  word-break: break-all;
}

.hint {
  max-width: 32rem;
  margin-top: 1rem;
  font-size: 0.8125rem;
  opacity: 0.75;
}
</style>
