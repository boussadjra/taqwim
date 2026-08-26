<script setup lang="ts">
/**
 * Every option the calendar accepts, exercisable live.
 *
 * This doubles as the manual-verification surface: each control below drives a
 * prop that the pre-1.0 component accepted and silently ignored.
 */
import { getDayInWeek, type HijriDateObject } from '@taqwim/core'
import { layoutNames, themeNames } from '@taqwim/themes/names'
import {
  HijriCalendar,
  type HijriCalendarLayout,
  type HijriCalendarSize,
  type HijriCalendarTheme,
  type WeekStartsOn,
} from '@taqwim/vue-styled'
import { computed, ref, watch } from 'vue'

// Both generated from the stylesheets, so a new preset or layout appears
// here on its own.
const THEMES: readonly HijriCalendarTheme[] = themeNames
const LAYOUTS: readonly HijriCalendarLayout[] = layoutNames

const theme = ref<HijriCalendarTheme>('default')
const layout = ref<HijriCalendarLayout>('default')
const size = ref<HijriCalendarSize>('default')
const locale = ref('en')
const dir = ref<'ltr' | 'rtl'>('ltr')

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
  noFridays.value ? (date: HijriDateObject) => getDayInWeek(date) === 5 : undefined,
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
            <option v-for="name in THEMES" :key="name" :value="name">{{ name }}</option>
          </select>
        </label>

        <label class="pg-field">
          Layout
          <select v-model="layout">
            <option v-for="name in LAYOUTS" :key="name" :value="name">{{ name }}</option>
          </select>
        </label>

        <label class="pg-field">
          Size
          <select v-model="size">
            <option value="compact">compact</option>
            <option value="default">default</option>
            <option value="large">large</option>
          </select>
        </label>
      </fieldset>

      <fieldset class="pg-group">
        <legend>Locale</legend>

        <label class="pg-field">
          Locale
          <select v-model="locale">
            <option value="en">en</option>
            <option value="ar">ar</option>
            <option value="fr">fr</option>
          </select>
        </label>

        <label class="pg-field">
          Direction
          <select v-model="dir">
            <option value="ltr">ltr</option>
            <option value="rtl">rtl</option>
          </select>
        </label>

        <label class="pg-field">
          Week starts on
          <select v-model.number="weekStartsOn">
            <option v-for="day in 7" :key="day" :value="day - 1">{{ day - 1 }}</option>
          </select>
        </label>
      </fieldset>

      <fieldset class="pg-group">
        <legend>Grid</legend>

        <label class="pg-field">
          Months
          <input v-model.number="numberOfMonths" type="number" min="1" max="4" />
        </label>

        <label class="pg-check"><input v-model="fixedWeeks" type="checkbox" /> <code>fixedWeeks</code></label>
        <label class="pg-check"><input v-model="pagedNavigation" type="checkbox" /> <code>pagedNavigation</code></label>
        <label class="pg-check">
          <input v-model="disableDaysOutsideCurrentView" type="checkbox" />
          <code>disableDaysOutsideCurrentView</code>
        </label>
      </fieldset>

      <fieldset class="pg-group">
        <legend>Selection</legend>

        <label class="pg-check"><input v-model="multiple" type="checkbox" /> <code>multiple</code></label>
        <label class="pg-check"><input v-model="preventDeselect" type="checkbox" /> <code>preventDeselect</code></label>
        <label class="pg-check"><input v-model="initialFocus" type="checkbox" /> <code>initialFocus</code></label>
      </fieldset>

      <fieldset class="pg-group">
        <legend>Constraints</legend>

        <label class="pg-check"><input v-model="disabled" type="checkbox" /> <code>disabled</code></label>
        <label class="pg-check"><input v-model="readonly" type="checkbox" /> <code>readonly</code></label>
        <label class="pg-check">
          <input v-model="bounded" type="checkbox" />
          min/max (1446-01-05 … 1446-03-20)
        </label>
        <label class="pg-check">
          <input v-model="noFridays" type="checkbox" />
          <code>isDateUnavailable</code> (Fridays)
        </label>
      </fieldset>
    </aside>

    <section class="pg-stage">
      <div class="pg-preview">
        <HijriCalendar
          :key="`${initialFocus}`"
          v-model="value"
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
