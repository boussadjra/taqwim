<script setup lang="ts">
/**
 * The live date picker, Vue. One of four — see the sibling `demos/*`
 * directories, and `CalendarDemo.vue` for why they are duplicated.
 */
import type { DateEmphasis, DatePickerInputDisplay } from '@taqwim/calendar-core'
import type { HijriCalendarId, HijriDateObject } from '@taqwim/core'
import { HijriDatePicker, type HijriCalendarTheme } from '@taqwim/vue-styled'
import { computed, ref, watch } from 'vue'
import { HIJRI_CALENDAR_OPTIONS, HIJRI_CALENDAR_SYSTEMS } from '../calendarSystems'
import { DATE_EMPHASIS_OPTIONS, INPUT_DISPLAY_OPTIONS, LANGUAGE_OPTIONS } from '../demoOptions'

const FORMATS = ['iYYYY-iMM-iDD', 'iDD/iMM/iYYYY', 'iD iMMMM iYYYY', 'iEEEE, iD iMMMM iYYYY']

const theme = ref<HijriCalendarTheme>('islamic')
const format = ref(FORMATS[0])
const locale = ref('en')
const dir = ref<'ltr' | 'rtl'>('ltr')
const editable = ref(true)
const showGregorian = ref(true)
const dateEmphasis = ref<DateEmphasis>('hijri')
const inputDisplay = ref<DatePickerInputDisplay>('hijri')
const calendarSystemId = ref<HijriCalendarId>('islamic-umalqura')
const calendarSystem = computed(() => HIJRI_CALENDAR_SYSTEMS[calendarSystemId.value])
const value = ref<HijriDateObject | undefined>()

watch(locale, next => (dir.value = next === 'ar' ? 'rtl' : 'ltr'))

const selected = computed(() =>
  value.value
    ? `${value.value.hy}-${String(value.value.hm).padStart(2, '0')}-${String(value.value.hd).padStart(2, '0')}`
    : '',
)
</script>

<template>
  <div class="demo not-content">
    <div class="demo-bar">
      <label class="demo-control">
        Hijri calendar
        <select v-model="calendarSystemId" data-calendar-system-select>
          <option v-for="option in HIJRI_CALENDAR_OPTIONS" :key="option.id" :value="option.id">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="demo-control">
        Date format
        <select v-model="format">
          <option v-for="pattern in FORMATS" :key="pattern" :value="pattern">{{ pattern }}</option>
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

      <label class="demo-control"> <input v-model="editable" type="checkbox" /> Allow typing </label>

      <label class="demo-control"> <input v-model="showGregorian" type="checkbox" /> Show Gregorian date </label>

      <label class="demo-control">
        Emphasize
        <select v-model="dateEmphasis" :disabled="!showGregorian">
          <option v-for="option in DATE_EMPHASIS_OPTIONS" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="demo-control">
        Input shows
        <select v-model="inputDisplay">
          <option v-for="option in INPUT_DISPLAY_OPTIONS" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>

    <div class="demo-stage" data-tall>
      <HijriDatePicker
        v-model="value"
        :calendar-system="calendarSystem"
        :theme="theme"
        :format="format"
        :locale="locale"
        :dir="dir"
        :editable="editable"
        :show-gregorian="showGregorian"
        :date-emphasis="dateEmphasis"
        :input-display="inputDisplay"
        label="Appointment date"
      />
    </div>

    <div class="demo-readout">
      <span>Selected</span>
      <code :data-empty="selected ? undefined : ''">{{ selected || 'nothing yet' }}</code>
    </div>

    <p class="demo-caption">
      With <code>editable</code> on, the input accepts <code>1446-09-01</code> or <code>01/09/1446</code>. Text it
      cannot parse reverts to the last good value rather than clearing the selection. The trigger is a
      <code>combobox</code>: <kbd>Enter</kbd> opens the popup, <kbd>Escape</kbd> closes it and returns focus.
    </p>
  </div>
</template>
