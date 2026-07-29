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
const calendarLocale = ref<'en' | 'ar'>('ar')

// Week days for mock calendar
const weekDaysAr = ['أح', 'إث', 'ث', 'أر', 'خ', 'ج', 'س']

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

// Convert to Arabic numerals
const convertToArabicNumerals = (num: number): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
  return num
    .toString()
    .split('')
    .map(digit => arabicNumerals[parseInt(digit)])
    .join('')
}
</script>
<template>
  <div class="theme-page">
    <header class="theme-header">
      <h1>🕌 Islamic Theme</h1>
      <p>Traditional Islamic design with Arabic calligraphy and geometric patterns</p>
    </header>

    <section class="theme-demo">
      <div class="calendar-preview">
        <h2>Islamic Theme Preview</h2>

        <div class="locale-controls">
          <button @click="calendarLocale = 'en'" :class="{ active: calendarLocale === 'en' }" class="locale-btn">
            English
          </button>
          <button @click="calendarLocale = 'ar'" :class="{ active: calendarLocale === 'ar' }" class="locale-btn">
            العربية
          </button>
        </div>

        <!-- Real Taqwim Calendar Component -->
        <div class="preview-container hijri-calendar-islamic">
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
                        {{ calendarLocale === 'ar' ? convertToArabicNumerals(day.dayInMonth) : day.dayInMonth }}
                      </HijriCalendarCellTrigger>
                    </HijriCalendarCell>
                  </HijriCalendarGridRow>
                </HijriCalendarGridBody>
              </HijriCalendarGrid>
            </template>
          </HijriCalendarRoot>
        </div>

        <div class="selected-info">
          <p><strong>اليوم:</strong> {{ formatHijriDate(today, 'iEEEE، iDD iMMMM iYYYY', 'ar') }}</p>
          <p><strong>Today:</strong> {{ formatHijriDate(today, 'iYYYY/iMM/iDD', 'en') }}</p>
          <p>
            <strong>Selected:</strong>
            {{ calendarDate ? formatHijriDate(calendarDate, 'iYYYY/iMM/iDD', calendarLocale) : 'None' }}
          </p>
        </div>
      </div>

      <div class="theme-info">
        <h3>🕌 Islamic Theme Features</h3>
        <ul class="features-list">
          <li>Traditional Islamic color palette</li>
          <li>Arabic typography support</li>
          <li>Geometric pattern backgrounds</li>
          <li>Gold accent colors (#d4af37)</li>
          <li>RTL (Right-to-left) text support</li>
          <li>Culturally appropriate design</li>
        </ul>

        <div class="color-palette">
          <h4>Color Palette</h4>
          <div class="colors">
            <div class="color-item">
              <div class="color-swatch" style="background: #d4af37"></div>
              <span>Gold: #d4af37</span>
            </div>
            <div class="color-item">
              <div class="color-swatch" style="background: #0d4f3c"></div>
              <span>Green: #0d4f3c</span>
            </div>
            <div class="color-item">
              <div class="color-swatch" style="background: #f7f3e9"></div>
              <span>Background: #f7f3e9</span>
            </div>
            <div class="color-item">
              <div class="color-swatch" style="background: #2d3748"></div>
              <span>Text: #2d3748</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Arabic Calendar Section -->
    <section class="arabic-calendar">
      <div class="islamic-pattern">
        <h2>التقويم الهجري</h2>
        <div class="calendar-preview" dir="rtl">
          <div class="preview-container hijri-calendar-islamic">
            <div class="calendar-mockup arabic-layout">
              <div class="islamic-header">
                <div class="bismillah">بسم الله الرحمن الرحيم</div>
                <div class="calendar-title">التقويم الهجري ١٤٤٦</div>
              </div>

              <div class="calendar-header">
                <button class="nav-btn">‹</button>
                <span class="month-title">محرم ١٤٤٦</span>
                <button class="nav-btn">›</button>
              </div>

              <div class="calendar-grid">
                <div class="weekday-header">
                  <span v-for="day in weekDaysAr" :key="day" class="weekday">{{ day }}</span>
                </div>

                <div class="days-grid">
                  <span v-for="day in daysGrid" :key="day.key" :class="['day', day.class]">
                    {{ convertToArabicNumerals(day.number) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<style scoped>
/* Islamic theme styles with softer colors */
.hijri-calendar-islamic {
  --hc-bg-color: #f8fbf9;
  --hc-border-color: #e6c18a;
  --hc-text-color: #1a1a1a;
  --hc-primary-color: #e6c18a;
  --hc-hover-bg: #f0f5f1;
  --hc-selected-bg: #e6c18a;
  --hc-selected-color: #ffffff;
  --hc-today-bg: #2d5a4a;
  --hc-today-color: #ffffff;
  --hc-other-month-color: #a0aec0;
}

.theme-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #f8fbf9 0%, #e8f1ea 100%);
  min-height: 100vh;
  color: #2d3748;
  position: relative;
}

.theme-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(230, 193, 138, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(45, 90, 74, 0.1) 0%, transparent 50%);
  background-size: 100px 100px;
  pointer-events: none;
}

.theme-header {
  text-align: center;
  margin-bottom: 40px;
  background: rgba(230, 193, 138, 0.1);
  padding: 30px;
  border-radius: 20px;
  border: 2px solid #e6c18a;
  position: relative;
  z-index: 1;
}

.theme-header::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border: 1px solid rgba(230, 193, 138, 0.3);
  border-radius: 15px;
}

.theme-header h1 {
  font-size: 2.5rem;
  color: #2d5a4a;
  margin-bottom: 10px;
  font-family: 'Amiri', 'Times New Roman', serif;
}

.theme-header p {
  font-size: 1.2rem;
  color: #2d3748;
}

.theme-demo {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  margin-bottom: 60px;
  position: relative;
  z-index: 1;
}

.calendar-preview {
  background: rgba(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(230, 193, 138, 0.2);
  border: 2px solid rgba(230, 193, 138, 0.3);
}

.calendar-preview h2 {
  text-align: center;
  color: #2d5a4a;
  margin-bottom: 20px;
  font-family: 'Amiri', 'Times New Roman', serif;
}

.locale-controls {
  text-align: center;
  margin-bottom: 20px;
}

.locale-btn {
  padding: 8px 16px;
  margin: 0 5px;
  border: 2px solid #e6c18a;
  background: white;
  color: #2d5a4a;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Amiri', serif;
}

.locale-btn:hover {
  border-color: #d4af37;
  color: #d4af37;
}

.locale-btn.active {
  background: #d4af37;
  color: white;
  border-color: #d4af37;
}

.preview-container {
  max-width: 400px;
  margin: 0 auto;
}

/* Calendar Component Styles */
.hijri-calendar-islamic .calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.nav-button {
  background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
}

.nav-button:hover {
  background: linear-gradient(135deg, #b8941f 0%, #d4af37 100%);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
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
  color: #0d4f3c;
  font-family: 'Amiri', serif;
}

.calendar-grid {
  width: 100%;
  background: var(--hc-bg-color);
  border: 2px solid var(--hc-border-color);
  border-radius: 15px;
  padding: 15px;
  box-shadow: inset 0 2px 4px rgba(212, 175, 55, 0.1);
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
  color: #0d4f3c;
  padding: 8px 4px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 4px;
  font-family: 'Amiri', serif;
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
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--hc-text-color);
  transition: all 0.2s ease;
  font-family: 'Amiri', serif;
}

.day-button:hover {
  background: var(--hc-hover-bg);
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.2);
}

.day-button[data-selected='true'] {
  background: var(--hc-selected-bg);
  color: var(--hc-selected-color);
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
}

.day-button[data-today='true'] {
  background: var(--hc-today-bg);
  color: var(--hc-today-color);
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(13, 79, 60, 0.3);
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
  border: 2px solid var(--hc-border-color);
  border-radius: 15px;
  padding: 20px;
  font-family: 'Amiri', 'Noto Sans Arabic', serif;
  box-shadow: inset 0 2px 4px rgba(212, 175, 55, 0.1);
}

.islamic-header {
  text-align: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.3);
}

.bismillah {
  font-size: 0.9rem;
  color: #0d4f3c;
  margin-bottom: 5px;
  font-family: 'Amiri', serif;
}

.calendar-title {
  font-size: 1rem;
  color: #d4af37;
  font-weight: 600;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 0 10px;
}

.nav-btn {
  background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
  border: none;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
}

.nav-btn:hover {
  background: linear-gradient(135deg, #b8941f 0%, #d4af37 100%);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
}

.month-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0d4f3c;
  font-family: 'Amiri', serif;
}

.calendar-grid {
  width: 100%;
}

.weekday-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 5px;
}

.weekday {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #0d4f3c;
  padding: 8px 4px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 4px;
  font-family: 'Amiri', serif;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.day {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 auto;
  font-family: 'Amiri', serif;
}

.day.current-month {
  color: var(--hc-text-color);
}

.day.current-month:hover {
  background: var(--hc-hover-bg);
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.2);
}

.day.today {
  background: var(--hc-today-bg);
  color: var(--hc-today-color);
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(13, 79, 60, 0.3);
}

.day.selected {
  background: var(--hc-selected-bg);
  color: var(--hc-selected-color);
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
}

.day.other-month {
  color: var(--hc-other-month-color);
}

.selected-info {
  margin-top: 20px;
  padding: 15px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 12px;
  text-align: center;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.selected-info p {
  margin: 5px 0;
  color: #2d3748;
  font-family: 'Amiri', serif;
}

.theme-info {
  background: linear-gradient(135deg, #0d4f3c 0%, #2d5a27 100%);
  color: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(13, 79, 60, 0.3);
  border: 2px solid rgba(212, 175, 55, 0.3);
}

.theme-info h3 {
  margin-bottom: 20px;
  font-size: 1.3rem;
  color: #d4af37;
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
  color: #d4af37;
  font-weight: bold;
}

.color-palette h4 {
  margin-bottom: 15px;
  font-size: 1.1rem;
  color: #d4af37;
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
  border: 2px solid rgba(212, 175, 55, 0.3);
}

.arabic-calendar {
  margin-top: 60px;
  position: relative;
  z-index: 1;
}

.islamic-pattern {
  text-align: center;
  background: rgba(13, 79, 60, 0.05);
  padding: 40px;
  border-radius: 20px;
  border: 2px solid rgba(212, 175, 55, 0.2);
}

.islamic-pattern h2 {
  font-size: 2rem;
  color: #0d4f3c;
  margin-bottom: 30px;
  font-family: 'Amiri', serif;
}

.arabic-layout {
  direction: rtl;
  text-align: right;
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
