<script setup lang="ts">
/**
 * Every bundled theme, live.
 *
 * Written once rather than once per framework, deliberately: what it
 * demonstrates is `@taqwim/themes` and the `data-taqwim-theme` attribute,
 * which are framework-free. Rendering it four times would suggest theming
 * differs between the adapters, and it does not.
 */
import type { HijriCalendarId, HijriDateObject } from '@taqwim/core'
import { layoutNames, themeNames } from '@taqwim/themes/names'
import {
  HijriCalendar,
  type HijriCalendarLayout,
  type HijriCalendarSize,
  type HijriCalendarTheme,
} from '@taqwim/vue-styled'
import { computed, onMounted, ref } from 'vue'
import { HIJRI_CALENDAR_OPTIONS, HIJRI_CALENDAR_SYSTEMS } from '../calendarSystems'
import { presetLabel, SIZE_OPTIONS } from '../demoOptions'

const theme = ref<HijriCalendarTheme>('islamic')
const size = ref<HijriCalendarSize>('default')
const layout = ref<HijriCalendarLayout>('default')
const calendarSystemId = ref<HijriCalendarId>('islamic-umalqura')
const calendarSystem = computed(() => HIJRI_CALENDAR_SYSTEMS[calendarSystemId.value])
const value = ref<HijriDateObject | undefined>()

/*
 * Each swatch's dot is the theme's own `--hc-primary`, read back out of the
 * cascade rather than listed here — a hand-kept colour table would be wrong
 * the first time a theme is retuned. One probe element carries each theme
 * attribute in turn and its computed value is read off it.
 */
const swatches = ref<Record<string, string>>({})

onMounted(() => {
  const probe = document.createElement('div')
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none'
  document.body.append(probe)

  const read: Record<string, string> = {}
  for (const name of themeNames) {
    probe.dataset.taqwimTheme = name
    read[name] = getComputedStyle(probe).getPropertyValue('--hc-primary').trim()
  }

  probe.remove()
  swatches.value = read
})
</script>

<template>
  <div class="demo not-content">
    <div class="demo-swatches" role="group" aria-label="Theme">
      <button
        v-for="name in themeNames"
        :key="name"
        type="button"
        class="demo-swatch"
        :aria-pressed="theme === name"
        :style="{ '--swatch': swatches[name] || undefined }"
        @click="theme = name"
      >
        <span class="demo-swatch-dot" aria-hidden="true" />
        {{ presetLabel(name) }}
      </button>
    </div>

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
        Size
        <select v-model="size">
          <option v-for="option in SIZE_OPTIONS" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
      </label>

      <label class="demo-control">
        Layout
        <select v-model="layout">
          <option v-for="name in layoutNames" :key="name" :value="name">{{ presetLabel(name) }}</option>
        </select>
      </label>
    </div>

    <div class="demo-stage">
      <HijriCalendar v-model="value" :calendar-system="calendarSystem" :theme="theme" :size="size" :layout="layout" />
    </div>

    <div class="demo-readout">
      <span>Markup</span>
      <code>&lt;div data-taqwim-theme="{{ theme }}" data-taqwim-size="{{ size }}"&gt;</code>
    </div>

    <p class="demo-caption">
      One stylesheet is loaded, not thirty-three: switching theme here changes an attribute, which is why several themes
      can coexist on a page and why the same CSS serves all five adapters.
      <code>size</code> and <code>layout</code> are orthogonal to it — a theme sets colours, a size sets metrics, a
      layout sets arrangement.
    </p>
  </div>
</template>
