<script setup lang="ts">
import { ref } from 'vue'
import { HijriCalendar, type HijriCalendarTheme, type HijriCalendarSize } from 'taqwim-vue'
import type { HijriDateObject } from 'taqwim-core-utils'

// Reactive state
const selectedDate = ref<HijriDateObject>({ hy: 1446, hm: 2, hd: 15 })
const currentTheme = ref<HijriCalendarTheme>('default')
const currentSize = ref<HijriCalendarSize>('default')
const isStyled = ref(true)
const showNavigation = ref(true)
const showWeekdays = ref(true)

// Available options
const themes: HijriCalendarTheme[] = ['default', 'dark', 'modern', 'islamic', 'minimal', 'custom']
const sizes: HijriCalendarSize[] = ['compact', 'default', 'large']

// Event handlers
function onDateChange(date: HijriDateObject | HijriDateObject[] | undefined) {
  console.log('Date changed:', date)
  if (date && !Array.isArray(date)) {
    selectedDate.value = date
  }
}

function onPlaceholderChange(date: HijriDateObject) {
  console.log('Placeholder changed:', date)
}
</script>

<template>
  <div class="hijri-calendar-demo">
    <h1>Taqwim Hijri Calendar Component</h1>

    <!-- Controls -->
    <div class="demo-controls">
      <h2>Configuration</h2>

      <div class="control-group">
        <label for="theme-select">Theme:</label>
        <select id="theme-select" v-model="currentTheme">
          <option v-for="theme in themes" :key="theme" :value="theme">
            {{ theme }}
          </option>
        </select>
      </div>

      <div class="control-group">
        <label for="size-select">Size:</label>
        <select id="size-select" v-model="currentSize">
          <option v-for="size in sizes" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>

      <div class="control-group">
        <label>
          <input type="checkbox" v-model="isStyled" />
          Include default styling
        </label>
      </div>

      <div class="control-group">
        <label>
          <input type="checkbox" v-model="showNavigation" />
          Show navigation arrows
        </label>
      </div>

      <div class="control-group">
        <label>
          <input type="checkbox" v-model="showWeekdays" />
          Show weekday headers
        </label>
      </div>
    </div>

    <!-- Current State -->
    <div class="demo-state">
      <h2>Current State</h2>
      <pre>{{ JSON.stringify({ selectedDate, currentTheme, currentSize, isStyled }, null, 2) }}</pre>
    </div>

    <!-- Calendar Examples -->
    <div class="demo-calendars">
      <h2>Examples</h2>

      <!-- Pre-built Styled Calendar -->
      <div class="calendar-example">
        <h3>Pre-built Styled Calendar</h3>
        <HijriCalendar
          v-model="selectedDate"
          :theme="currentTheme"
          :size="currentSize"
          :styled="isStyled"
          :show-navigation="showNavigation"
          :show-weekdays="showWeekdays"
          @update:model-value="onDateChange"
          @update:placeholder="onPlaceholderChange"
        />
      </div>

      <!-- Unstyled/Headless Calendar -->
      <div class="calendar-example">
        <h3>Unstyled/Headless Calendar</h3>
        <HijriCalendar
          v-model="selectedDate"
          :styled="false"
          class="custom-unstyled-calendar"
          @update:model-value="onDateChange"
        />
      </div>

      <!-- Custom Styled Calendar -->
      <div class="calendar-example">
        <h3>Custom Styled Calendar with CSS Variables</h3>
        <HijriCalendar
          v-model="selectedDate"
          theme="custom"
          class="custom-themed-calendar"
          @update:model-value="onDateChange"
        />
      </div>

      <!-- Calendar with Custom Slots -->
      <div class="calendar-example">
        <h3>Calendar with Custom Slots</h3>
        <HijriCalendar v-model="selectedDate" :theme="currentTheme" @update:model-value="onDateChange">
          <template #prev-button="{ disabled }">
            <span :class="{ disabled }">⬅️</span>
          </template>

          <template #next-button="{ disabled }">
            <span :class="{ disabled }">➡️</span>
          </template>

          <template #weekday="{ weekday, index }">
            <strong>{{ weekday.charAt(0) }}</strong>
          </template>

          <template #cell="{ dayValue, today, selected, outsideView }">
            <span
              :class="{
                'custom-day': true,
                'custom-today': today,
                'custom-selected': selected,
                'custom-outside': outsideView,
              }"
            >
              {{ dayValue }}
            </span>
          </template>
        </HijriCalendar>
      </div>

      <!-- Completely Custom Calendar -->
      <div class="calendar-example">
        <h3>Completely Custom Calendar (Full Control)</h3>
        <HijriCalendar v-model="selectedDate">
          <template #default>
            <div class="my-custom-calendar">
              <div class="my-header">
                <button @click="console.log('Previous')">Previous</button>
                <h3>Custom Header</h3>
                <button @click="console.log('Next')">Next</button>
              </div>
              <div class="my-content">
                This is a completely custom calendar implementation. You have full control over the rendering while
                still getting all the calendar logic from the headless components.
              </div>
            </div>
          </template>
        </HijriCalendar>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hijri-calendar-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, sans-serif;
}

.demo-controls {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
}

.control-group {
  margin-bottom: 1rem;
}

.control-group label {
  display: inline-block;
  min-width: 200px;
  font-weight: 500;
}

.control-group select {
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #ddd;
}

.demo-state {
  background: #f1f3f4;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
}

.demo-state pre {
  background: white;
  padding: 1rem;
  border-radius: 0.25rem;
  overflow: auto;
}

.demo-calendars {
  display: grid;
  gap: 2rem;
}

.calendar-example {
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
}

.calendar-example h3 {
  margin: 0 0 1rem 0;
  color: #374151;
}

/* Custom styling for unstyled calendar */
.custom-unstyled-calendar {
  border: 2px dashed #ccc;
  padding: 1rem;
  border-radius: 0.5rem;
}

.custom-unstyled-calendar .hijri-calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.custom-unstyled-calendar .hijri-calendar-grid-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  margin-bottom: 0.25rem;
}

.custom-unstyled-calendar .hijri-calendar-cell-trigger {
  padding: 0.5rem;
  text-align: center;
  border: 1px solid #eee;
  background: none;
  cursor: pointer;
}

.custom-unstyled-calendar .hijri-calendar-cell-trigger:hover {
  background: #f0f0f0;
}

/* Custom themed calendar with CSS variables */
.custom-themed-calendar {
  --hijri-calendar-background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --hijri-calendar-foreground: white;
  --hijri-calendar-border: none;
  --hijri-calendar-primary: #fbbf24;
  --hijri-calendar-selected: #fbbf24;
  --hijri-calendar-cell-border-radius: 50%;
}

/* Custom slot styles */
.custom-day {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.custom-today {
  background: orange;
  color: white;
  border-radius: 50%;
}

.custom-selected {
  background: blue;
  color: white;
  border-radius: 50%;
}

.custom-outside {
  opacity: 0.5;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Completely custom calendar */
.my-custom-calendar {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
}

.my-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.my-header button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.my-header button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.my-content {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 0.5rem;
  backdrop-filter: blur(10px);
}
</style>
