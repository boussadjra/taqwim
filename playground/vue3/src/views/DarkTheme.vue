<script setup lang="ts">
import { ref } from 'vue'
import {
  HijriCalendarRoot,
  HijriCalendarHeader,
  HijriCalendarHeading,
  HijriCalendarGrid,
  HijriCalendarGridHead,
  HijriCalendarGridBody,
  HijriCalendarGridRow,
  HijriCalendarCell,
  HijriCalendarCellTrigger,
  HijriCalendarHeadCell,
  HijriCalendarPrev,
  HijriCalendarNext,
} from 'taqwim-vue'
import { formatHijriDate, toHijri } from 'taqwim-core-utils'

const today = toHijri(new Date())!
const calendarDate = ref()
const calendarLocale = ref<'en' | 'ar'>('en')
</script>

<template>
  <div class="theme-page">
    <header class="theme-header">
      <h1>🌙 Dark Theme</h1>
      <p>Elegant dark design perfect for low-light environments</p>
    </header>

    <section class="theme-demo">
      <div class="calendar-preview">
        <h2>Dark Theme Preview</h2>
        <div class="locale-controls">
          <button @click="calendarLocale = 'en'" :class="{ active: calendarLocale === 'en' }" class="locale-btn">
            English
          </button>
          <button @click="calendarLocale = 'ar'" :class="{ active: calendarLocale === 'ar' }" class="locale-btn">
            العربية
          </button>
        </div>

        <div class="preview-container hijri-calendar-dark">
          <HijriCalendarRoot
            v-model="calendarDate"
            :locale="calendarLocale"
            :dir="calendarLocale === 'ar' ? 'rtl' : 'ltr'"
          >
            <template #default="{ grid, weekDays }">
              <div class="calendar-header">
                <HijriCalendarPrev class="nav-button">
                  {{ calendarLocale === 'ar' ? '→' : '←' }}
                </HijriCalendarPrev>
                <HijriCalendarHeading class="heading" />
                <HijriCalendarNext class="nav-button">
                  {{ calendarLocale === 'ar' ? '←' : '→' }}
                </HijriCalendarNext>
              </div>

              <HijriCalendarGrid class="calendar-grid">
                <HijriCalendarGridHead>
                  <HijriCalendarGridRow class="weekdays-row">
                    <HijriCalendarHeadCell v-for="day in weekDays" :key="day" class="weekday-cell">
                      {{ day }}
                    </HijriCalendarHeadCell>
                  </HijriCalendarGridRow>
                </HijriCalendarGridHead>

                <HijriCalendarGridBody>
                  <HijriCalendarGridRow v-for="(week, index) in grid" :key="index" class="week-row">
                    <HijriCalendarCell
                      v-for="day in week"
                      :key="`${day.date.hy}-${day.date.hm}-${day.date.hd}`"
                      :date="day.date"
                      class="day-cell"
                    >
                      <HijriCalendarCellTrigger :day="day.date" :month="day.date" class="day-button">
                        {{ day.dayInMonth }}
                      </HijriCalendarCellTrigger>
                    </HijriCalendarCell>
                  </HijriCalendarGridRow>
                </HijriCalendarGridBody>
              </HijriCalendarGrid>
            </template>
          </HijriCalendarRoot>
        </div>

        <div class="selected-info">
          <p><strong>Today:</strong> {{ formatHijriDate(today, 'iYYYY/iMM/iDD', 'en') }}</p>
          <p>
            <strong>Selected:</strong>
            {{ calendarDate ? formatHijriDate(calendarDate, 'iYYYY/iMM/iDD', calendarLocale) : 'None' }}
          </p>
          <p><strong>Arabic:</strong> {{ formatHijriDate(today, 'iEEEE', 'ar') }}</p>
        </div>
      </div>

      <div class="theme-info">
        <h3>🌙 Dark Theme Features</h3>
        <ul class="features-list">
          <li>Dark background reduces eye strain</li>
          <li>High contrast for better readability</li>
          <li>Purple accent colors (#8b5cf6)</li>
          <li>Subtle glow effects</li>
          <li>Perfect for night usage</li>
          <li>Energy efficient on OLED displays</li>
        </ul>

        <div class="color-palette">
          <h4>Color Palette</h4>
          <div class="colors">
            <div class="color-item">
              <div class="color-swatch" style="background: #8b5cf6"></div>
              <span>Primary: #8b5cf6</span>
            </div>
            <div class="color-item">
              <div class="color-swatch" style="background: #1f2937"></div>
              <span>Background: #1f2937</span>
            </div>
            <div class="color-item">
              <div class="color-swatch" style="background: #f9fafb"></div>
              <span>Text: #f9fafb</span>
            </div>
            <div class="color-item">
              <div class="color-swatch" style="background: #374151"></div>
              <span>Border: #374151</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Import the dark theme */
@import 'taqwim-vue/hijri-calendar-dark.css';

.theme-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  min-height: 100vh;
  color: #f9fafb;
}

.theme-header {
  text-align: center;
  margin-bottom: 40px;
}

.theme-header h1 {
  font-size: 2.5rem;
  color: #f9fafb;
  margin-bottom: 10px;
}

.theme-header p {
  font-size: 1.2rem;
  color: #d1d5db;
}

.theme-demo {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  margin-bottom: 60px;
}

.calendar-preview {
  background: #374151;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.calendar-preview h2 {
  text-align: center;
  color: #8b5cf6;
  margin-bottom: 20px;
}

.preview-container {
  max-width: 400px;
  margin: 0 auto;
}

.locale-controls {
  text-align: center;
  margin-bottom: 20px;
}

.locale-btn {
  padding: 8px 16px;
  margin: 0 5px;
  border: 2px solid #374151;
  background: #1f2937;
  color: #f9fafb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.locale-btn:hover {
  border-color: #8b5cf6;
  color: #8b5cf6;
}

.locale-btn.active {
  background: #8b5cf6;
  color: white;
  border-color: #8b5cf6;
}

/* Calendar styling for the real components */
.hijri-calendar-dark .calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.nav-button {
  background: var(--hc-primary-color, #8b5cf6);
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
}

.nav-button:hover {
  opacity: 0.8;
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.5);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.heading {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--hc-text-color, #f9fafb);
}

.calendar-grid {
  width: 100%;
}

.weekdays-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 8px;
}

.weekday-cell {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--hc-text-color, #f9fafb);
  padding: 8px 4px;
  text-transform: uppercase;
}

.week-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 2px;
}

.day-cell {
  aspect-ratio: 1;
}

.day-button {
  width: 100%;
  height: 100%;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--hc-text-color, #f9fafb);
  transition: all 0.2s ease;
}

.day-button:hover {
  background: var(--hc-hover-bg, #374151);
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.2);
}

.day-button[data-selected='true'] {
  background: var(--hc-selected-bg, #8b5cf6);
  color: var(--hc-selected-color, #ffffff);
  font-weight: 600;
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.4);
}

.day-button[data-today='true'] {
  background: var(--hc-today-bg, #6366f1);
  color: var(--hc-today-color, #ffffff);
  font-weight: 600;
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
}

.day-button[data-outside-month='true'] {
  opacity: 0.4;
  color: var(--hc-other-month-color, #6b7280);
}

/* RTL Support */
[dir='rtl'] .calendar-header {
  direction: rtl;
}

[dir='rtl'] .weekdays-row,
[dir='rtl'] .week-row {
  direction: rtl;
}

.theme-info {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

.theme-info h3 {
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.features-list {
  list-style: none;
  padding: 0;
  margin-bottom: 30px;
}

.features-list li {
  padding: 8px 0;
  padding-left: 20px;
  position: relative;
}

.features-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #a3f7bf;
  font-weight: bold;
}

.color-palette h4 {
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.colors {
  display: grid;
  gap: 10px;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-swatch {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

/* Responsive */
@media (max-width: 1024px) {
  .theme-demo {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .theme-header h1 {
    font-size: 2rem;
  }

  .calendar-preview {
    padding: 20px;
  }
}
</style>
