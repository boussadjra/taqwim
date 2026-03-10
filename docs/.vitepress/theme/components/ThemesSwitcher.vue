<script setup lang="ts">
import { ref } from 'vue'

const selectedTheme = ref('default')
const themes = [
  { value: 'default', label: '🎨 Default', description: 'Clean and professional' },
  { value: 'dark', label: '🌙 Dark', description: 'Dark mode for low light' },
  { value: 'modern', label: '✨ Modern', description: 'Glassmorphism and gradients' },
  { value: 'islamic', label: '🕌 Islamic', description: 'Traditional cultural design' },
  { value: 'brutalist', label: '💀 Brutalist', description: 'Raw and aggressive' },
]

const mockCalendarDays = Array.from({ length: 35 }, (_, i) => ({
  day: i + 1,
  isCurrentMonth: i >= 5 && i <= 34,
  isToday: i === 15,
  isSelected: i === 20,
}))
</script>

<template>
  <div class="theme-switcher-demo">
    <div class="controls">
      <h3>🎨 Theme Switcher</h3>
      <p>Choose a theme to see how the calendar adapts:</p>

      <div class="theme-buttons">
        <button
          v-for="theme in themes"
          :key="theme.value"
          @click="selectedTheme = theme.value"
          :class="['theme-btn', { active: selectedTheme === theme.value }]"
        >
          {{ theme.label }}
        </button>
      </div>

      <div class="theme-description">
        <strong>{{ themes.find(t => t.value === selectedTheme)?.label }}:</strong>
        {{ themes.find(t => t.value === selectedTheme)?.description }}
      </div>
    </div>

    <div class="calendar-preview" :class="`theme-${selectedTheme}`">
      <div class="calendar-header">
        <button class="nav-btn">&larr;</button>
        <h4>Rabi' I 1446</h4>
        <button class="nav-btn">&rarr;</button>
      </div>

      <div class="calendar-grid">
        <div class="weekdays">
          <div v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="day" class="weekday">
            {{ day }}
          </div>
        </div>

        <div class="days-grid">
          <button
            v-for="(dayData, index) in mockCalendarDays"
            :key="index"
            :class="[
              'day-cell',
              {
                'current-month': dayData.isCurrentMonth,
                today: dayData.isToday,
                selected: dayData.isSelected,
              },
            ]"
          >
            {{ dayData.isCurrentMonth ? dayData.day - 4 : '' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-switcher-demo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 2rem 0;
  padding: 2rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.controls h3 {
  margin-top: 0;
  color: var(--vp-c-text-1);
}

.controls p {
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
}

.theme-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.theme-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.theme-btn:hover {
  border-color: var(--vp-c-brand-1);
}

.theme-btn.active {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.theme-description {
  padding: 1rem;
  background: var(--vp-c-bg);
  border-radius: 4px;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.calendar-preview {
  padding: 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.calendar-header h4 {
  margin: 0;
  font-size: 1.1rem;
}

.nav-btn {
  background: var(--calendar-primary, var(--vp-c-brand-1));
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 0.5rem;
}

.weekday {
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.5rem;
  color: var(--calendar-text, var(--vp-c-text-2));
}

.days-grid {
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
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  color: var(--calendar-text, var(--vp-c-text-2));
}

.day-cell.current-month {
  color: var(--calendar-text, var(--vp-c-text-1));
}

.day-cell.current-month:hover {
  background: var(--calendar-hover, var(--vp-c-bg-soft));
}

.day-cell.today {
  background: var(--calendar-today, var(--vp-c-brand-1));
  color: white;
  font-weight: 600;
}

.day-cell.selected {
  background: var(--calendar-selected, var(--vp-c-brand-2));
  color: white;
  font-weight: 600;
}

/* Theme Styles */
.theme-default {
  --calendar-primary: var(--vp-c-brand-1);
  --calendar-text: var(--vp-c-text-1);
  --calendar-bg: var(--vp-c-bg);
  --calendar-hover: var(--vp-c-bg-soft);
  --calendar-today: #ed8936;
  --calendar-selected: var(--vp-c-brand-1);
  background: var(--calendar-bg);
  border: 1px solid var(--vp-c-border);
}

.theme-dark {
  --calendar-primary: #8b5cf6;
  --calendar-text: #f9fafb;
  --calendar-bg: #1f2937;
  --calendar-hover: #374151;
  --calendar-today: #6366f1;
  --calendar-selected: #8b5cf6;
  background: var(--calendar-bg);
  color: var(--calendar-text);
}

.theme-modern {
  --calendar-primary: #06d6a0;
  --calendar-text: #1a202c;
  --calendar-bg: rgba(248, 250, 252, 0.8);
  --calendar-hover: rgba(6, 214, 160, 0.1);
  --calendar-today: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  --calendar-selected: linear-gradient(135deg, #06d6a0 0%, #f72585 100%);
  background: var(--calendar-bg);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(6, 214, 160, 0.2);
}

.theme-islamic {
  --calendar-primary: #e6c18a;
  --calendar-text: #2d5a4a;
  --calendar-bg: #f8f5f0;
  --calendar-hover: rgba(230, 193, 138, 0.2);
  --calendar-today: #3d6b5a;
  --calendar-selected: #e6c18a;
  background: var(--calendar-bg);
  border: 2px solid var(--calendar-primary);
  font-family: 'Times New Roman', serif;
}

.theme-brutalist {
  --calendar-primary: #00ff00;
  --calendar-text: #ffffff;
  --calendar-bg: #000000;
  --calendar-hover: #333333;
  --calendar-today: #ff00ff;
  --calendar-selected: #00ff00;
  background: var(--calendar-bg);
  color: var(--calendar-text);
  border: 3px solid var(--calendar-primary);
  font-family: 'Courier New', monospace;
  box-shadow: 4px 4px 0px #333333;
}

@media (max-width: 768px) {
  .theme-switcher-demo {
    grid-template-columns: 1fr;
  }

  .theme-buttons {
    justify-content: center;
  }
}
</style>
