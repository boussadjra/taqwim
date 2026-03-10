<template>
  <div class="theme-page">
    <header class="theme-header">
      <h1>✨ Modern Theme</h1>
      <p>Contemporary design with vibrant colors and glassmorphism effects</p>
    </header>

    <section class="theme-demo">
      <div class="calendar-preview">
        <h2>Modern Theme Preview</h2>

        <div class="locale-controls">
          <button @click="calendarLocale = 'en'" :class="{ active: calendarLocale === 'en' }" class="locale-btn">
            English
          </button>
          <button @click="calendarLocale = 'ar'" :class="{ active: calendarLocale === 'ar' }" class="locale-btn">
            العربية
          </button>
        </div>

        <!-- Real Taqwim Calendar Component -->
        <div class="preview-container hijri-calendar-modern">
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
          <p><strong>Arabic:</strong> {{ formatHijriDate(today, 'iEEEE، iDD iMMMM iYYYY', 'ar') }}</p>
          <p>
            <strong>Selected:</strong>
            {{ calendarDate ? formatHijriDate(calendarDate, 'iYYYY/iMM/iDD', calendarLocale) : 'None' }}
          </p>
        </div>
      </div>

      <div class="theme-info">
        <h3>✨ Modern Theme Features</h3>
        <ul class="features-list">
          <li>Vibrant gradient backgrounds</li>
          <li>Glassmorphism effects with blur</li>
          <li>Bright accent colors (#06d6a0)</li>
          <li>Smooth animations and transitions</li>
          <li>Contemporary typography</li>
          <li>Interactive hover states</li>
        </ul>

        <div class="color-palette">
          <h4>Color Palette</h4>
          <div class="colors">
            <div class="color-item">
              <div class="color-swatch" style="background: #06d6a0"></div>
              <span>Primary: #06d6a0</span>
            </div>
            <div class="color-item">
              <div class="color-swatch" style="background: #f8fafc"></div>
              <span>Background: #f8fafc</span>
            </div>
            <div class="color-item">
              <div class="color-swatch" style="background: #1a202c"></div>
              <span>Text: #1a202c</span>
            </div>
            <div class="color-item">
              <div class="color-swatch" style="background: #06d6a0"></div>
              <span>Accent: #06d6a0</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

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

// Week days for mock calendar
const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

// Mock calendar grid for preview
const daysGrid = [
  // Previous month days
  { number: 28, class: 'other-month', key: 'p28' },
  { number: 29, class: 'other-month', key: 'p29' },
  { number: 30, class: 'other-month', key: 'p30' },
  // Current month days
  ...Array.from({ length: 30 }, (_, i) => ({
    number: i + 1,
    class: i + 1 === today.hd ? 'today' : i + 1 === 15 ? 'selected' : 'current-month',
    key: `c${i + 1}`,
  })),
  // Next month days
  { number: 1, class: 'other-month', key: 'n1' },
  { number: 2, class: 'other-month', key: 'n2' },
  { number: 3, class: 'other-month', key: 'n3' },
]
</script>

<style scoped>
/* Modern theme styles */
.hijri-calendar-modern {
  --hc-bg-color: rgba(248, 250, 252, 0.8);
  --hc-border-color: rgba(6, 214, 160, 0.2);
  --hc-text-color: #1a202c;
  --hc-primary-color: #06d6a0;
  --hc-hover-bg: rgba(6, 214, 160, 0.1);
  --hc-selected-bg: linear-gradient(135deg, #06d6a0 0%, #f72585 100%);
  --hc-selected-color: #ffffff;
  --hc-today-bg: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  --hc-today-color: #ffffff;
  --hc-other-month-color: #a0aec0;
}

.theme-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 30%, #06d6a0 100%);
  min-height: 100vh;
  color: #1a202c;
}

.theme-header {
  text-align: center;
  margin-bottom: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.theme-header h1 {
  font-size: 2.5rem;
  color: #ffffff;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.theme-header p {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
}

.theme-demo {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  margin-bottom: 60px;
}

.calendar-preview {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.calendar-preview h2 {
  text-align: center;
  color: #ffffff;
  margin-bottom: 20px;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.locale-controls {
  text-align: center;
  margin-bottom: 20px;
}

.locale-btn {
  padding: 8px 16px;
  margin: 0 5px;
  border: 2px solid rgba(6, 214, 160, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.locale-btn:hover {
  border-color: #06d6a0;
  background: rgba(6, 214, 160, 0.2);
}

.locale-btn.active {
  background: linear-gradient(135deg, #06d6a0 0%, #4ecdc4 100%);
  color: white;
  border-color: #06d6a0;
}

.preview-container {
  max-width: 400px;
  margin: 0 auto;
}

/* Calendar Component Styles */
.hijri-calendar-modern .calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.nav-button {
  background: linear-gradient(135deg, #06d6a0 0%, #4ecdc4 100%);
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(6, 214, 160, 0.3);
}

.nav-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(6, 214, 160, 0.4);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.heading {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--hc-text-color);
  background: linear-gradient(135deg, #06d6a0, #f72585);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.calendar-grid {
  width: 100%;
  background: var(--hc-bg-color);
  backdrop-filter: blur(10px);
  border: 1px solid var(--hc-border-color);
  border-radius: 16px;
  padding: 15px;
  box-shadow: 0 4px 20px rgba(6, 214, 160, 0.1);
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
  color: var(--hc-text-color);
  padding: 8px 4px;
  text-transform: uppercase;
  background: linear-gradient(135deg, #06d6a0, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--hc-text-color);
  transition: all 0.3s ease;
  position: relative;
}

.day-button:hover {
  background: var(--hc-hover-bg);
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(6, 214, 160, 0.2);
}

.day-button[data-selected='true'] {
  background: var(--hc-selected-bg);
  color: var(--hc-selected-color);
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(247, 37, 133, 0.4);
  transform: scale(1.05);
}

.day-button[data-today='true'] {
  background: var(--hc-today-bg);
  color: var(--hc-today-color);
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(78, 205, 196, 0.4);
  transform: scale(1.05);
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

.calendar-mockup {
  background: var(--hc-bg-color);
  backdrop-filter: blur(10px);
  border: 1px solid var(--hc-border-color);
  border-radius: 16px;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-shadow: 0 4px 20px rgba(6, 214, 160, 0.1);
}

.selected-info {
  margin-top: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.selected-info p {
  margin: 5px 0;
  color: #ffffff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.theme-info {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  color: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.theme-info h3 {
  margin-bottom: 20px;
  font-size: 1.3rem;
  background: linear-gradient(135deg, #06d6a0, #f72585);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  content: '✨';
  position: absolute;
  left: 0;
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
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
