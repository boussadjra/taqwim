<script setup lang="ts">
/**
 * The date picker with every prop it accepts, exercisable live.
 *
 * `HijriDatePicker` extends `HijriCalendarProps`, so everything the calendar
 * playground drives applies here too — plus the input's own text handling,
 * which is the part with the interesting failure modes.
 */
import type { HijriDateObject } from '@taqwim/core'
import { layoutNames, themeNames } from '@taqwim/themes/names'
import {
  HijriDatePicker,
  type HijriCalendarLayout,
  type HijriCalendarSize,
  type HijriCalendarTheme,
} from '@taqwim/vue-styled'
import { computed, ref, watch } from 'vue'

const THEMES: readonly HijriCalendarTheme[] = themeNames
const LAYOUTS: readonly HijriCalendarLayout[] = layoutNames

const FORMATS = ['iYYYY-iMM-iDD', 'iDD/iMM/iYYYY', 'iD iMMMM iYYYY', 'iEEEE, iD iMMMM iYYYY']

const theme = ref<HijriCalendarTheme>('default')
const layout = ref<HijriCalendarLayout>('default')
const size = ref<HijriCalendarSize>('default')
const locale = ref('en')
const dir = ref<'ltr' | 'rtl'>('ltr')
const format = ref(FORMATS[0])
const label = ref('Appointment date')
const inputPlaceholder = ref('')
const editable = ref(true)
const disabled = ref(false)
const readonly = ref(false)

// Arabic reads right to left; following the locale means the RTL case is what
// you see when you pick Arabic rather than something to remember to set.
watch(locale, next => {
  dir.value = next === 'ar' ? 'rtl' : 'ltr'
})

// The picker holds one date: `multiple` is not part of its surface in any
// adapter, because the input has room for a single formatted value.
const value = ref<HijriDateObject | undefined>()

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
        <legend>Input</legend>

        <label class="pg-field">
          Format
          <select v-model="format">
            <option v-for="pattern in FORMATS" :key="pattern" :value="pattern">{{ pattern }}</option>
          </select>
        </label>

        <label class="pg-field">
          Label
          <input v-model="label" type="text" />
        </label>

        <label class="pg-field">
          Placeholder
          <input v-model="inputPlaceholder" type="text" />
        </label>

        <label class="pg-check"><input v-model="editable" type="checkbox" /> <code>editable</code></label>
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
      </fieldset>

      <fieldset class="pg-group">
        <legend>State</legend>

        <label class="pg-check"><input v-model="disabled" type="checkbox" /> <code>disabled</code></label>
        <label class="pg-check"><input v-model="readonly" type="checkbox" /> <code>readonly</code></label>
      </fieldset>
    </aside>

    <section class="pg-stage">
      <div class="pg-preview">
        <HijriDatePicker
          v-model="value"
          :theme="theme"
          :layout="layout"
          :size="size"
          :locale="locale"
          :dir="dir"
          :format="format"
          :label="label"
          :input-placeholder="inputPlaceholder || undefined"
          :editable="editable"
          :disabled="disabled"
          :readonly="readonly"
        />
      </div>

      <pre class="pg-output">{{ selection }}</pre>

      <p class="pg-hint">
        With <code>editable</code> on, the input accepts <code>1446-09-01</code> or <code>01/09/1446</code>, with
        <code>/</code> or <code>-</code>. Text it cannot parse reverts to the last good value rather than clearing the
        selection. The trigger is a <code>combobox</code>: <code>Enter</code> or <code>ArrowDown</code> opens the popup,
        <code>Escape</code> closes it. Previous/next page the month; the heading is two buttons — month and year — that
        open their pickers.
      </p>
    </section>
  </div>
</template>
