<script setup lang="ts">
/**
 * Every bundled theme, live.
 *
 * Written once rather than once per framework, deliberately: what it
 * demonstrates is `@taqwim/themes` and the `data-taqwim-theme` attribute,
 * which are framework-free. Rendering it four times would suggest theming
 * differs between the adapters, and it does not.
 */
import type { HijriDateObject } from '@taqwim/core'
import { layoutNames, themeNames } from '@taqwim/themes/names'
import {
  HijriCalendar,
  type HijriCalendarLayout,
  type HijriCalendarSize,
  type HijriCalendarTheme,
} from '@taqwim/vue-styled'
import { onMounted, ref } from 'vue'

const theme = ref<HijriCalendarTheme>('islamic')
const size = ref<HijriCalendarSize>('default')
const layout = ref<HijriCalendarLayout>('default')
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
        {{ name }}
      </button>
    </div>

    <div class="demo-bar">
      <label class="demo-control">
        Size
        <select v-model="size">
          <option value="compact">compact</option>
          <option value="default">default</option>
          <option value="large">large</option>
        </select>
      </label>

      <label class="demo-control">
        Layout
        <select v-model="layout">
          <option v-for="name in layoutNames" :key="name" :value="name">{{ name }}</option>
        </select>
      </label>
    </div>

    <div class="demo-stage">
      <HijriCalendar v-model="value" :theme="theme" :size="size" :layout="layout" />
    </div>

    <div class="demo-readout">
      <span>Markup</span>
      <code>&lt;div data-taqwim-theme="{{ theme }}" data-taqwim-size="{{ size }}"&gt;</code>
    </div>

    <p class="demo-caption">
      One stylesheet is loaded, not thirty-three: switching theme here changes an attribute, which is why several themes
      can coexist on a page and why the same CSS serves all five adapters. <code>size</code> and <code>layout</code> are
      orthogonal to it — a theme sets colours, a size sets metrics, a layout sets arrangement.
    </p>
  </div>
</template>
