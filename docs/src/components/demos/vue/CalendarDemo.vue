<script setup lang="ts">
/**
 * The live calendar, Vue.
 *
 * One of four near-identical files — see `demos/react`, `demos/svelte` and
 * `demos/solid`. They are duplicated rather than abstracted for the same
 * reason the unit suites are: a reader on the React tab should be looking at
 * idiomatic React, and a difference between the four should mean a difference
 * in the adapters rather than in a shared wrapper.
 */
import type { DateEmphasis } from '@taqwim/calendar-core'
import type { HijriCalendarId, HijriDateObject } from '@taqwim/core'
import { themeNames } from '@taqwim/themes/names'
import { HijriCalendar, type HijriCalendarSize, type HijriCalendarTheme } from '@taqwim/vue-styled'
import { computed, ref, watch } from 'vue'
import { HIJRI_CALENDAR_OPTIONS, HIJRI_CALENDAR_SYSTEMS } from '../calendarSystems'
import { DATE_EMPHASIS_OPTIONS, DIRECTION_OPTIONS, LANGUAGE_OPTIONS, presetLabel, SIZE_OPTIONS } from '../demoOptions'

const props = withDefaults(defineProps<{ theme?: HijriCalendarTheme; multiple?: boolean }>(), {
  theme: 'default',
  multiple: false,
})

const theme = ref<HijriCalendarTheme>(props.theme)
const size = ref<HijriCalendarSize>('default')
const locale = ref('en')
const dir = ref<'ltr' | 'rtl'>('ltr')
const multiple = ref(props.multiple)
const showGregorian = ref(false)
const dateEmphasis = ref<DateEmphasis>('hijri')
const calendarSystemId = ref<HijriCalendarId>('islamic-umalqura')
const calendarSystem = computed(() => HIJRI_CALENDAR_SYSTEMS[calendarSystemId.value])
const value = ref<HijriDateObject | HijriDateObject[] | undefined>()

// Arabic reads right to left and its week starts on Saturday, so picking it
// shows the RTL case rather than leaving it as something to configure.
const weekStartsOn = computed<0 | 6>(() => (locale.value === 'ar' ? 6 : 0))
watch(locale, next => (dir.value = next === 'ar' ? 'rtl' : 'ltr'))

// Switching between one date and a list leaves the old shape behind.
watch(multiple, () => (value.value = undefined))

const selected = computed(() => {
  const list = Array.isArray(value.value) ? value.value : value.value ? [value.value] : []
  return list.map(d => `${d.hy}-${String(d.hm).padStart(2, '0')}-${String(d.hd).padStart(2, '0')}`).join(', ')
})
</script>

<template>
  <div class="demo not-content">
    <div class="demo-bar">
      <label class="demo-control">
        Theme
        <select v-model="theme">
          <option v-for="name in themeNames" :key="name" :value="name">{{ presetLabel(name) }}</option>
        </select>
      </label>

      <label class="demo-control">
        Hijri calendar
        <select v-model="calendarSystemId" data-calendar-system-select>
          <option v-for="option in HIJRI_CALENDAR_OPTIONS" :key="option.id" :value="option.id">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="demo-control">
        Size
        <select v-model="size">
          <option v-for="option in SIZE_OPTIONS" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
      </label>

      <label class="demo-control">
        Language
        <select v-model="locale">
          <option v-for="option in LANGUAGE_OPTIONS" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="demo-control">
        Text direction
        <select v-model="dir">
          <option v-for="option in DIRECTION_OPTIONS" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="demo-control"> <input v-model="multiple" type="checkbox" /> Select multiple dates </label>

      <label class="demo-control"> <input v-model="showGregorian" type="checkbox" /> Show Gregorian date </label>

      <label class="demo-control">
        Emphasize
        <select v-model="dateEmphasis" :disabled="!showGregorian">
          <option v-for="option in DATE_EMPHASIS_OPTIONS" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>

    <div class="demo-stage">
      <HijriCalendar
        v-model="value"
        :calendar-system="calendarSystem"
        :theme="theme"
        :size="size"
        :locale="locale"
        :dir="dir"
        :week-starts-on="weekStartsOn"
        :multiple="multiple"
        :show-gregorian="showGregorian"
        :date-emphasis="dateEmphasis"
      />
    </div>

    <div class="demo-readout">
      <span>Selected</span>
      <code :data-empty="selected ? undefined : ''">{{ selected || 'nothing yet' }}</code>
    </div>

    <p class="demo-caption">
      Tab into the grid, then use the arrow keys, <kbd>Home</kbd>/<kbd>End</kbd>, <kbd>PageUp</kbd>/<kbd>PageDown</kbd>
      (with <kbd>Shift</kbd> for years) and <kbd>Enter</kbd> to select. Under <code>dir="rtl"</code> the horizontal keys
      mirror.
    </p>
  </div>
</template>
