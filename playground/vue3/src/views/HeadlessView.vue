<script setup lang="ts">
/**
 * The primitives with no stylesheet at all.
 *
 * Everything visible here is styled by this file. It exists to prove
 * `@taqwim/vue` ships no CSS of its own and that the `data-*` attributes the
 * store emits are enough to build a look from scratch.
 */
import type { HijriCalendarId, HijriDateObject } from '@taqwim/core'
import {
  HijriCalendarCell,
  HijriCalendarCellTrigger,
  HijriCalendarGrid,
  HijriCalendarGridBody,
  HijriCalendarGridHead,
  HijriCalendarGridRow,
  HijriCalendarHeadCell,
  HijriCalendarHeader,
  HijriCalendarHeading,
  HijriCalendarNext,
  HijriCalendarPrev,
  HijriCalendarRoot,
} from '@taqwim/vue'
import { computed, ref } from 'vue'
import { calendarSystemIdFromSearch, HIJRI_CALENDAR_OPTIONS, HIJRI_CALENDAR_SYSTEMS } from '../calendarSystems'

const value = ref<HijriDateObject>()
const calendarSystemId = ref<HijriCalendarId>(calendarSystemIdFromSearch(window.location.search))
const calendarSystem = computed(() => HIJRI_CALENDAR_SYSTEMS[calendarSystemId.value])
</script>

<template>
  <div class="pg">
    <aside class="pg-controls">
      <fieldset class="pg-group">
        <legend>Calendar</legend>
        <label class="pg-field">
          Hijri calendar
          <select v-model="calendarSystemId" data-calendar-system-select>
            <option v-for="option in HIJRI_CALENDAR_OPTIONS" :key="option.id" :value="option.id">
              {{ option.label }}
            </option>
          </select>
        </label>
      </fieldset>
    </aside>

    <section class="pg-stage">
      <div class="bare">
        <HijriCalendarRoot
          v-model="value"
          :calendar-system="calendarSystem"
          initial-focus
          v-slot="{ months, weekDays }"
        >
          <HijriCalendarHeader class="row">
            <HijriCalendarPrev>←</HijriCalendarPrev>
            <HijriCalendarHeading />
            <HijriCalendarNext>→</HijriCalendarNext>
          </HijriCalendarHeader>

          <HijriCalendarGrid v-for="month in months" :key="month.label" :month="month">
            <HijriCalendarGridHead>
              <HijriCalendarGridRow class="row">
                <HijriCalendarHeadCell v-for="day in weekDays" :key="day">{{ day }}</HijriCalendarHeadCell>
              </HijriCalendarGridRow>
            </HijriCalendarGridHead>

            <HijriCalendarGridBody>
              <HijriCalendarGridRow v-for="(week, index) in month.weeks" :key="index" class="row">
                <HijriCalendarCell v-for="day in week" :key="`${day.date.hm}-${day.date.hd}`" :day="day">
                  <HijriCalendarCellTrigger :day="day" />
                </HijriCalendarCell>
              </HijriCalendarGridRow>
            </HijriCalendarGridBody>
          </HijriCalendarGrid>
        </HijriCalendarRoot>

        <pre>{{ value ?? 'null' }}</pre>
      </div>
    </section>
  </div>
</template>

<style scoped>
.bare {
  display: inline-block;
  font-family: ui-monospace, monospace;
}

.row {
  display: flex;
  gap: 0.125rem;
}

.row > * {
  width: 2rem;
  text-align: center;
}

:deep([data-taqwim-calendar-cell-trigger]) {
  width: 100%;
  border: none;
  background: none;
  font: inherit;
  cursor: pointer;
}

:deep([data-outside-month]) {
  opacity: 0.35;
}

:deep([data-today]) {
  text-decoration: underline;
}

:deep([data-selected]) {
  background: #111;
  color: #fff;
}

:deep([data-disabled]) {
  cursor: not-allowed;
  opacity: 0.3;
}

pre {
  font-size: 0.75rem;
}
</style>
