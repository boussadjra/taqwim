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
import { formatHijriDate, toHijri } from '@taqwim/core'

const today = toHijri(new Date())!
const calendarDate = ref()
const calendarLocale = ref<'en' | 'ar'>('en')
</script>

<template>
  <div class="theme-page">
    <header class="theme-header">
      <h1>🎨 Default Theme</h1>
      <p>Clean and professional design with subtle gradients and modern typography</p>
    </header>

    <section class="theme-demo">
      <div class="calendar-preview">
        <h2>Default Theme Preview</h2>
        <div class="locale-controls">
          <button @click="calendarLocale = 'en'" :class="{ active: calendarLocale === 'en' }" class="locale-btn">
            English
          </button>
          <button @click="calendarLocale = 'ar'" :class="{ active: calendarLocale === 'ar' }" class="locale-btn">
            العربية
          </button>
        </div>

        <div class="preview-container hijri-calendar-default">
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
        <h3>🎨 Default Theme Features</h3>
        <ul class="features-list">
          <li>Clean white background with subtle shadows</li>
          <li>Professional blue color scheme (#667eea)</li>
          <li>Smooth hover transitions</li>
          <li>Clear typography hierarchy</li>
          <li>Responsive grid layout</li>
          <li>Accessible color contrast</li>
        </ul>

        <div class="color-palette">
          <h4>Color Palette</h4>
          <div class="colors">
            <div class="color-item">
              <div class="color-swatch" style="background: #667eea"></div>
              <span>Primary: #667eea</span>
            </div>
            <div class="color-item">
              <div class="color-swatch" style="background: #f7fafc"></div>
              <span>Background: #f7fafc</span>
            </div>
            <div class="color-item">
              <div class="color-swatch" style="background: #2d3748"></div>
              <span>Text: #2d3748</span>
            </div>
            <div class="color-item">
              <div class="color-swatch" style="background: #e2e8f0"></div>
              <span>Border: #e2e8f0</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Import the default theme */
@import 'taqwim-vue/hijri-calendar-default.css';

.theme-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.theme-header {
  text-align: center;
  margin-bottom: 40px;
}

.theme-header h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 10px;
}

.theme-header p {
  font-size: 1.2rem;
  color: #4a5568;
}

.theme-demo {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  margin-bottom: 60px;
}

.calendar-preview {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.calendar-preview h2 {
  text-align: center;
  color: #667eea;
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
  border: 2px solid #e2e8f0;
  background: white;
  color: #4a5568;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.locale-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.locale-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* Calendar styling for the real components */
.hijri-calendar-default .calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.nav-button {
  background: var(--hc-primary-color, #667eea);
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
}

.nav-button:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.heading {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--hc-text-color, #2d3748);
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
  color: var(--hc-text-color, #2d3748);
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
  color: var(--hc-text-color, #2d3748);
  transition: all 0.2s ease;
}

.day-button:hover {
  background: var(--hc-hover-bg, #f7fafc);
}

.day-button[data-selected='true'] {
  background: var(--hc-selected-bg, #667eea);
  color: var(--hc-selected-color, #ffffff);
  font-weight: 600;
}

.day-button[data-today='true'] {
  background: var(--hc-today-bg, #edf2f7);
  color: var(--hc-today-color, #667eea);
  font-weight: 600;
}

.day-button[data-outside-month='true'] {
  opacity: 0.4;
}

/* RTL Support */
[dir='rtl'] .calendar-header {
  direction: rtl;
}

[dir='rtl'] .weekdays-row,
[dir='rtl'] .week-row {
  direction: rtl;
}

.selected-info {
  margin-top: 20px;
  padding: 15px;
  background: #f7fafc;
  border-radius: 8px;
  text-align: center;
}

.selected-info p {
  margin: 5px 0;
  color: #2d3748;
}

.theme-info {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
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
