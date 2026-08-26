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
import type { HijriDateObject } from '@taqwim/core'
import { themeNames } from '@taqwim/themes/names'
import { HijriCalendar, type HijriCalendarSize, type HijriCalendarTheme } from '@taqwim/vue-styled'
import { computed, ref, watch } from 'vue'

const props = withDefaults(defineProps<{ theme?: HijriCalendarTheme; multiple?: boolean }>(), {
  theme: 'default',
  multiple: false,
})

const theme = ref<HijriCalendarTheme>(props.theme)
const size = ref<HijriCalendarSize>('default')
const locale = ref('en')
const dir = ref<'ltr' | 'rtl'>('ltr')
const multiple = ref(props.multiple)
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
          <option v-for="name in themeNames" :key="name" :value="name">{{ name }}</option>
        </select>
      </label>

      <label class="demo-control">
        Size
        <select v-model="size">
          <option value="compact">compact</option>
          <option value="default">default</option>
          <option value="large">large</option>
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

      <label class="demo-control">
        Direction
        <select v-model="dir">
          <option value="ltr">ltr</option>
          <option value="rtl">rtl</option>
        </select>
      </label>

      <label class="demo-control"> <input v-model="multiple" type="checkbox" /> multiple </label>
    </div>

    <div class="demo-stage">
      <HijriCalendar
        v-model="value"
        :theme="theme"
        :size="size"
        :locale="locale"
        :dir="dir"
        :week-starts-on="weekStartsOn"
        :multiple="multiple"
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
