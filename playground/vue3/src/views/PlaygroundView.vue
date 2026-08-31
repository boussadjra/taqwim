<script setup lang="ts">
/**
 * Every option the calendar accepts, exercisable live.
 *
 * This doubles as the manual-verification surface: each control below drives a
 * prop that the pre-1.0 component accepted and silently ignored.
 */
import { getDayInWeek, type HijriCalendarId, type HijriDateObject } from '@taqwim/core'
import { layoutNames, themeNames } from '@taqwim/themes/names'
import {
  HijriCalendar,
  type HijriCalendarLayout,
  type HijriCalendarSize,
  type HijriCalendarTheme,
  type WeekStartsOn,
} from '@taqwim/vue-styled'
import { computed, ref, watch } from 'vue'
import { calendarSystemIdFromSearch, HIJRI_CALENDAR_OPTIONS, HIJRI_CALENDAR_SYSTEMS } from '../calendarSystems'
import { DIRECTION_OPTIONS, LANGUAGE_OPTIONS, presetLabel, SIZE_OPTIONS, WEEKDAY_OPTIONS } from '../playgroundOptions'

// Both generated from the stylesheets, so a new preset or layout appears
// here on its own.
const THEMES: readonly HijriCalendarTheme[] = themeNames
const LAYOUTS: readonly HijriCalendarLayout[] = layoutNames

const theme = ref<HijriCalendarTheme>('default')
const layout = ref<HijriCalendarLayout>('default')
const size = ref<HijriCalendarSize>('default')
const locale = ref('en')
const dir = ref<'ltr' | 'rtl'>('ltr')
const calendarSystemId = ref<HijriCalendarId>(calendarSystemIdFromSearch(window.location.search))
const calendarSystem = computed(() => HIJRI_CALENDAR_SYSTEMS[calendarSystemId.value])

// The store's own union, rather than an inline copy or an `as 0` cast: a cast
// would have hidden the day the playground offered a day the calendar cannot
// take.
const weekStartsOn = ref<WeekStartsOn>(0)
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

/*
 * Arabic reads right to left and its week starts on Saturday. Following the
 * locale by default means the RTL case is what you see when you pick Arabic,
 * rather than something you have to remember to configure — both stay
 * overridable afterwards.
 */
watch(locale, next => {
  dir.value = next === 'ar' ? 'rtl' : 'ltr'
  weekStartsOn.value = next === 'ar' ? 6 : 0
})

const value = ref<HijriDateObject | HijriDateObject[] | undefined>()

const minValue = computed(() => (bounded.value ? { hy: 1446, hm: 1, hd: 5 } : undefined))
const maxValue = computed(() => (bounded.value ? { hy: 1446, hm: 3, hd: 20 } : undefined))

// Fridays are the Jumu'ah holiday in much of the Muslim world — a realistic
// `isDateUnavailable`, and a check that the matcher runs for keyboard
// selection too, not only clicks.
const isDateUnavailable = computed(() =>
  noFridays.value
    ? (date: HijriDateObject) => getDayInWeek(date, { calendarSystem: calendarSystem.value }) === 5
    : undefined,
)

const selection = computed(() => JSON.stringify(value.value ?? null, null, 2))
</script>

<template>
  <div class="pg">
    <aside class="pg-controls">
      <fieldset class="pg-group">
        <legend>Appearance</legend>

        <label class="pg-field">
          Theme
          <select v-model="theme">
            <option v-for="name in THEMES" :key="name" :value="name">{{ presetLabel(name) }}</option>
          </select>
        </label>

        <label class="pg-field">
          Hijri calendar
          <select v-model="calendarSystemId" data-calendar-system-select>
            <option v-for="option in HIJRI_CALENDAR_OPTIONS" :key="option.id" :value="option.id">
              {{ option.label }}
            </option>
          </select>
        </label>

        <label class="pg-field">
          Layout
          <select v-model="layout">
            <option v-for="name in LAYOUTS" :key="name" :value="name">{{ presetLabel(name) }}</option>
          </select>
        </label>

        <label class="pg-field">
          Size
          <select v-model="size">
            <option v-for="option in SIZE_OPTIONS" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </label>
      </fieldset>

      <fieldset class="pg-group">
        <legend>Language and direction</legend>

        <label class="pg-field">
          Language
          <select v-model="locale">
            <option v-for="option in LANGUAGE_OPTIONS" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </label>

        <label class="pg-field">
          Text direction
          <select v-model="dir">
            <option v-for="option in DIRECTION_OPTIONS" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </label>

        <label class="pg-field">
          Week starts on
          <select v-model.number="weekStartsOn">
            <option v-for="(label, day) in WEEKDAY_OPTIONS" :key="label" :value="day">{{ label }}</option>
          </select>
        </label>
      </fieldset>

      <fieldset class="pg-group">
        <legend>Grid</legend>

        <label class="pg-field">
          Months shown
          <input v-model.number="numberOfMonths" type="number" min="1" max="4" />
        </label>

        <label class="pg-check"><input v-model="fixedWeeks" type="checkbox" /> Always show six weeks</label>
        <label class="pg-check"><input v-model="pagedNavigation" type="checkbox" /> Move all months together</label>
        <label class="pg-check">
          <input v-model="disableDaysOutsideCurrentView" type="checkbox" />
          Disable dates outside visible months
        </label>
      </fieldset>

      <fieldset class="pg-group">
        <legend>Selection</legend>

        <label class="pg-check"><input v-model="multiple" type="checkbox" /> Select multiple dates</label>
        <label class="pg-check"
          ><input v-model="preventDeselect" type="checkbox" /> Keep at least one date selected</label
        >
        <label class="pg-check"><input v-model="initialFocus" type="checkbox" /> Focus calendar on load</label>
      </fieldset>

      <fieldset class="pg-group">
        <legend>Constraints</legend>

        <label class="pg-check"><input v-model="disabled" type="checkbox" /> Disable calendar</label>
        <label class="pg-check"><input v-model="readonly" type="checkbox" /> Read-only</label>
        <label class="pg-check">
          <input v-model="bounded" type="checkbox" />
          Limit dates to 1446-01-05–1446-03-20
        </label>
        <label class="pg-check">
          <input v-model="noFridays" type="checkbox" />
          Disable Fridays
        </label>
      </fieldset>
    </aside>

    <section class="pg-stage">
      <div class="pg-preview">
        <HijriCalendar
          :key="`${initialFocus}`"
          v-model="value"
          :calendar-system="calendarSystem"
          :theme="theme"
          :layout="layout"
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
      </div>

      <pre class="pg-output">{{ selection }}</pre>

      <p class="pg-hint">
        Tab into the grid, then use the arrow keys, <code>Home</code>/<code>End</code>, <code>PageUp</code>/<code
          >PageDown</code
        >
        (<code>Shift</code> for years) and <code>Enter</code> to select. Under <code>dir="rtl"</code> the horizontal
        keys mirror.
      </p>
    </section>
  </div>
</template>
