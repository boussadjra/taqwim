<script setup lang="ts">
import { ref } from 'vue'
import { HijriCalendar } from 'taqwim-vue'
import type { HijriDateObject } from 'taqwim-core-utils'

// Simple example with different configurations
const selectedDate = ref<HijriDateObject>({ hy: 1446, hm: 2, hd: 15 })

function onDateChange(date: HijriDateObject | HijriDateObject[] | undefined) {
  console.log('Selected date:', date)
}
</script>

<template>
  <div class="calendar-examples">
    <h2>Hijri Calendar Examples</h2>

    <!-- Default Theme -->
    <div class="example">
      <h3>Default Theme</h3>
      <HijriCalendar v-model="selectedDate" theme="default" @update:model-value="onDateChange" />
    </div>

    <!-- Dark Theme -->
    <div class="example">
      <h3>Dark Theme</h3>
      <HijriCalendar v-model="selectedDate" theme="dark" @update:model-value="onDateChange" />
    </div>

    <!-- Modern Theme -->
    <div class="example">
      <h3>Modern Theme</h3>
      <HijriCalendar v-model="selectedDate" theme="modern" @update:model-value="onDateChange" />
    </div>

    <!-- Islamic Theme -->
    <div class="example">
      <h3>Islamic Theme</h3>
      <HijriCalendar v-model="selectedDate" theme="islamic" dir="rtl" locale="ar" @update:model-value="onDateChange" />
    </div>

    <!-- Compact Size -->
    <div class="example">
      <h3>Compact Size</h3>
      <HijriCalendar v-model="selectedDate" theme="default" size="compact" @update:model-value="onDateChange" />
    </div>

    <!-- Large Size -->
    <div class="example">
      <h3>Large Size</h3>
      <HijriCalendar v-model="selectedDate" theme="modern" size="large" @update:model-value="onDateChange" />
    </div>

    <!-- Unstyled -->
    <div class="example">
      <h3>Unstyled (Headless)</h3>
      <HijriCalendar
        v-model="selectedDate"
        :styled="false"
        class="custom-calendar"
        @update:model-value="onDateChange"
      />
    </div>

    <!-- With Custom Slots -->
    <div class="example">
      <h3>With Custom Slots</h3>
      <HijriCalendar v-model="selectedDate" theme="default" @update:model-value="onDateChange">
        <template #prev-button="{ disabled }">
          <span style="font-size: 1.2em; color: #007bff" :class="{ disabled }">←</span>
        </template>

        <template #next-button="{ disabled }">
          <span style="font-size: 1.2em; color: #007bff" :class="{ disabled }">→</span>
        </template>

        <template #weekday="{ weekday }">
          <strong style="color: #6c757d">{{ weekday.charAt(0) }}</strong>
        </template>

        <template #cell="{ dayValue, today, selected, outsideView }">
          <span
            :style="{
              color: today ? '#ff6b6b' : selected ? '#007bff' : outsideView ? '#999' : '#333',
              fontWeight: today || selected ? 'bold' : 'normal',
              textDecoration: today ? 'underline' : 'none',
            }"
          >
            {{ dayValue }}
          </span>
        </template>
      </HijriCalendar>
    </div>

    <!-- Current Selection -->
    <div class="selection-display">
      <h3>Current Selection</h3>
      <pre>{{ JSON.stringify(selectedDate, null, 2) }}</pre>
    </div>
  </div>
</template>

<style scoped>
.calendar-examples {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.example {
  margin-bottom: 3rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #fafafa;
}

.example h3 {
  margin: 0 0 1rem 0;
  color: #374151;
  font-size: 1.25rem;
}

.selection-display {
  background: #f1f3f4;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-top: 2rem;
}

.selection-display pre {
  background: white;
  padding: 1rem;
  border-radius: 0.25rem;
  border: 1px solid #ddd;
  overflow: auto;
}

/* Custom styling for unstyled calendar */
.custom-calendar {
  background: #fff3cd;
  border: 2px dashed #ffc107;
  padding: 1rem;
  border-radius: 0.5rem;
}

.custom-calendar :deep(.hijri-calendar-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #ffc107;
}

.custom-calendar :deep(.hijri-calendar-heading) {
  font-size: 1.25rem;
  font-weight: bold;
  color: #856404;
}

.custom-calendar :deep(.hijri-calendar-nav-button) {
  background: #ffc107;
  color: #856404;
  border: none;
  padding: 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: bold;
}

.custom-calendar :deep(.hijri-calendar-nav-button:hover) {
  background: #e0a800;
}

.custom-calendar :deep(.hijri-calendar-grid-row) {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  margin-bottom: 0.25rem;
}

.custom-calendar :deep(.hijri-calendar-head-cell) {
  padding: 0.5rem;
  text-align: center;
  font-weight: bold;
  color: #856404;
  background: #fff3cd;
  border-radius: 0.25rem;
}

.custom-calendar :deep(.hijri-calendar-cell-trigger) {
  padding: 0.5rem;
  text-align: center;
  border: 1px solid #ffc107;
  background: white;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.custom-calendar :deep(.hijri-calendar-cell-trigger:hover) {
  background: #fff3cd;
  transform: scale(1.05);
}

.custom-calendar :deep(.hijri-calendar-cell-trigger[data-selected]) {
  background: #ffc107;
  color: #856404;
  font-weight: bold;
}

.custom-calendar :deep(.hijri-calendar-cell-trigger[data-today]) {
  background: #28a745;
  color: white;
  font-weight: bold;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed !important;
}
</style>
