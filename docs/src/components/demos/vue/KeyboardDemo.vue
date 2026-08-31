<script setup lang="ts">
/**
 * What the calendar does with each key you press.
 *
 * Written once rather than once per framework: the keyboard model lives in
 * `@taqwim/calendar-core`'s `handleKeydown`, and every adapter forwards to it
 * unchanged. Four copies would suggest the answer differs by framework.
 *
 * "Consumed" is not guessed from a key list — the adapters call
 * `preventDefault()` exactly when `store.handleKeydown` returns `true`, so a
 * bubble-phase listener reading `defaultPrevented` reports what the store
 * actually did. A key the store declines shows up unmarked, still doing
 * whatever the browser does with it.
 */
import type { HijriCalendarId, HijriDateObject } from '@taqwim/core'
import { HijriCalendar } from '@taqwim/vue-styled'
import { computed, ref } from 'vue'
import { HIJRI_CALENDAR_OPTIONS, HIJRI_CALENDAR_SYSTEMS } from '../calendarSystems'

const value = ref<HijriDateObject | undefined>()
const calendarSystemId = ref<HijriCalendarId>('islamic-umalqura')
const calendarSystem = computed(() => HIJRI_CALENDAR_SYSTEMS[calendarSystemId.value])
const log = ref<{ id: number; label: string; consumed: boolean }[]>([])

let nextId = 0

function label(event: KeyboardEvent): string {
  const key = event.key === ' ' ? 'Space' : event.key
  return event.shiftKey && key !== 'Shift' ? `Shift + ${key}` : key
}

function onKeydown(event: KeyboardEvent) {
  // Modifier presses on their own are noise, not navigation.
  if (['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) return

  log.value = [...log.value.slice(-11), { id: nextId++, label: label(event), consumed: event.defaultPrevented }]
}
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
    </div>

    <!-- Bubble phase, so the adapter's own handler has already run. -->
    <div class="demo-stage" @keydown="onKeydown">
      <HijriCalendar v-model="value" :calendar-system="calendarSystem" theme="islamic" />
    </div>

    <div class="demo-keys" aria-live="polite">
      <span v-if="!log.length" class="demo-keys-empty">
        Tab into the grid and press a key — teal means the calendar handled it.
      </span>
      <kbd v-for="entry in log" :key="entry.id" :data-consumed="entry.consumed ? '' : undefined">
        {{ entry.label }}
      </kbd>
    </div>

    <p class="demo-caption">
      Only one cell is tabbable at a time — a roving <code>tabindex</code> — so <kbd>Tab</kbd> enters and leaves the
      grid rather than walking every day of the month. <kbd>PageUp</kbd>/<kbd>PageDown</kbd> page by month,
      <kbd>Shift</kbd> with them by year.
    </p>
  </div>
</template>
