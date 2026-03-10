<script setup lang="ts">
import { ref, computed } from 'vue'

// Mock calendar data
const selectedDate = ref(null)
const currentMonth = ref(3) // Rabi' I
const currentYear = ref(1446)

const hijriMonths = [
  'Muharram',
  'Safar',
  "Rabi' I",
  "Rabi' II",
  'Jumada I',
  'Jumada II',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhu al-Qi'dah",
  'Dhu al-Hijjah',
]

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

// Generate calendar grid
const calendarGrid = computed(() => {
  const days = []
  // Previous month days
  for (let i = 0; i < 5; i++) {
    days.push({
      day: 26 + i,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
    })
  }

  // Current month days
  for (let i = 1; i <= 30; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
      isToday: i === 15, // Mock today
      isSelected: selectedDate.value === i,
    })
  }

  // Next month days to fill grid
  for (let i = 1; i <= 7; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
    })
  }

  // Group into weeks
  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return weeks
})

const currentMonthName = computed(() => hijriMonths[currentMonth.value - 1])

function selectDate(day: number, isCurrentMonth: boolean) {
  if (isCurrentMonth) {
    selectedDate.value = selectedDate.value === day ? null : day
  }
}

function previousMonth() {
  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value++
  } else {
    currentMonth.value++
  }
}
</script>

<template>
  <div class="interactive-calendar">
    <div class="calendar-container">
      <header class="calendar-header">
        <button @click="previousMonth" class="nav-button" aria-label="Previous month">←</button>
        <h3 class="month-title">{{ currentMonthName }} {{ currentYear }}</h3>
        <button @click="nextMonth" class="nav-button" aria-label="Next month">→</button>
      </header>

      <div class="calendar-grid">
        <div class="weekdays">
          <div v-for="day in weekDays" :key="day" class="weekday">
            {{ day }}
          </div>
        </div>

        <div class="weeks">
          <div v-for="(week, weekIndex) in calendarGrid" :key="weekIndex" class="week">
            <button
              v-for="(dayData, dayIndex) in week"
              :key="dayIndex"
              @click="selectDate(dayData.day, dayData.isCurrentMonth)"
              :class="[
                'day-cell',
                {
                  'current-month': dayData.isCurrentMonth,
                  'other-month': !dayData.isCurrentMonth,
                  today: dayData.isToday,
                  selected: dayData.isSelected,
                },
              ]"
              :aria-label="`${dayData.day} ${currentMonthName} ${currentYear}`"
            >
              {{ dayData.day }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="selectedDate" class="selected-date-info">
        <p>
          <strong>Selected:</strong>
          {{ selectedDate }} {{ currentMonthName }} {{ currentYear }}
        </p>
      </div>
    </div>

    <div class="calendar-info">
      <h4>🗓️ Interactive Hijri Calendar</h4>
      <ul>
        <li>✅ Navigate between months</li>
        <li>✅ Click to select dates</li>
        <li>✅ Responsive design</li>
        <li>✅ Accessibility support</li>
        <li>✅ Today indicator</li>
      </ul>

      <div class="code-preview">
        <h5>Basic Usage:</h5>
        <pre><code>&lt;HijriCalendarRoot v-model="selectedDate"&gt;
  &lt;HijriCalendarHeader&gt;
    &lt;HijriCalendarPrev /&gt;
    &lt;HijriCalendarHeading /&gt;
    &lt;HijriCalendarNext /&gt;
  &lt;/HijriCalendarHeader&gt;
  
  &lt;HijriCalendarGrid&gt;
    &lt;!-- Calendar content --&gt;
  &lt;/HijriCalendarGrid&gt;
&lt;/HijriCalendarRoot&gt;</code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.interactive-calendar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 2rem 0;
  padding: 2rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.calendar-container {
  background: var(--vp-c-bg);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
  max-width: 350px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.nav-button {
  background: var(--vp-c-brand-1);
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
  background: var(--vp-c-brand-2);
  transform: scale(1.05);
}

.month-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.calendar-grid {
  width: 100%;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  padding: 8px 4px;
  text-transform: uppercase;
}

.weeks {
  display: grid;
  gap: 2px;
}

.week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.day-cell {
  aspect-ratio: 1;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  color: var(--vp-c-text-1);
}

.day-cell:hover {
  background: var(--vp-c-bg-soft);
}

.day-cell.other-month {
  opacity: 0.4;
  color: var(--vp-c-text-3);
}

.day-cell.today {
  background: var(--vp-c-brand-1);
  color: white;
  font-weight: 600;
}

.day-cell.selected {
  background: var(--vp-c-brand-2);
  color: white;
  font-weight: 600;
}

.selected-date-info {
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--vp-c-brand-soft);
  border-radius: 6px;
  text-align: center;
}

.selected-date-info p {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
}

.calendar-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.calendar-info h4 {
  margin: 0;
  color: var(--vp-c-text-1);
}

.calendar-info ul {
  margin: 0;
  padding-left: 1.2rem;
  color: var(--vp-c-text-2);
}

.calendar-info li {
  margin-bottom: 0.5rem;
}

.code-preview {
  background: var(--vp-c-bg);
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-border);
}

.code-preview h5 {
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
}

.code-preview pre {
  margin: 0;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  overflow-x: auto;
}

.code-preview code {
  font-family: var(--vp-font-family-mono);
}

@media (max-width: 768px) {
  .interactive-calendar {
    grid-template-columns: 1fr;
  }

  .calendar-container {
    max-width: 100%;
  }
}
</style>
