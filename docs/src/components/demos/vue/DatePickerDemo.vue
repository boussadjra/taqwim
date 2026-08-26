<script setup lang="ts">
/**
 * The live date picker, Vue. One of four — see the sibling `demos/*`
 * directories, and `CalendarDemo.vue` for why they are duplicated.
 */
import type { HijriDateObject } from '@taqwim/core'
import { HijriDatePicker, type HijriCalendarTheme } from '@taqwim/vue-styled'
import { computed, ref, watch } from 'vue'

const FORMATS = ['iYYYY-iMM-iDD', 'iDD/iMM/iYYYY', 'iD iMMMM iYYYY', 'iEEEE, iD iMMMM iYYYY']

const theme = ref<HijriCalendarTheme>('islamic')
const format = ref(FORMATS[0])
const locale = ref('en')
const dir = ref<'ltr' | 'rtl'>('ltr')
const editable = ref(true)
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
        Format
        <select v-model="format">
          <option v-for="pattern in FORMATS" :key="pattern" :value="pattern">{{ pattern }}</option>
        </select>
      </label>

      <label class="demo-control">
        Locale
        <select v-model="locale">
          <option value="en">en</option>
          <option value="ar">ar</option>
          <option value="fr">fr</option>
        </select>
      </label>

      <label class="demo-control"> <input v-model="editable" type="checkbox" /> editable </label>
    </div>

    <div class="demo-stage" data-tall>
      <HijriDatePicker
        v-model="value"
        :theme="theme"
        :format="format"
        :locale="locale"
        :dir="dir"
        :editable="editable"
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
