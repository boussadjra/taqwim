<script setup lang="ts">
/**
 * The Vue end of the shared end-to-end harness.
 *
 * Configuration comes from the query string so one Playwright spec can put
 * every framework's adapter into the same state. See `e2e/harness.ts`.
 */
import type { HijriDateObject } from '@taqwim/core'
import { HijriCalendar, type HijriCalendarSize, type HijriCalendarTheme } from '@taqwim/vue-styled'
import { ref } from 'vue'
import { formatSelection, readConfig } from '../harness'

const config = readConfig(window.location.search)

const theme = ref(config.theme as HijriCalendarTheme)
const value = ref<HijriDateObject | HijriDateObject[] | undefined>(config.value)
</script>

<template>
  <select v-model="theme" data-testid="theme">
    <option v-for="name in ['default', 'dark', 'islamic', 'neon', 'ocean']" :key="name" :value="name">
      {{ name }}
    </option>
  </select>

  <HijriCalendar
    v-model="value"
    :theme="theme"
    :size="config.size as HijriCalendarSize"
    :locale="config.locale"
    :dir="config.dir"
    :week-starts-on="config.weekStartsOn as 0"
    :number-of-months="config.numberOfMonths"
    :fixed-weeks="config.fixedWeeks"
    :multiple="config.multiple"
    :prevent-deselect="config.preventDeselect"
    :disable-days-outside-current-view="config.disableDaysOutsideCurrentView"
    :disabled="config.disabled"
    :readonly="config.readonly"
    :initial-focus="config.initialFocus"
    :show-gregorian="config.showGregorian"
    :date-emphasis="config.dateEmphasis"
    :gregorian-locale="config.gregorianLocale"
    :default-placeholder="config.placeholder"
    :min-value="config.min"
    :max-value="config.max"
  />

  <output data-testid="selection">{{ formatSelection(value) }}</output>
</template>
