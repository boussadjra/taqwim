<template>
  <div class="theme-page">
    <header class="theme-header">
      <h1>🎯 Tailwind Themes</h1>
      <p>Custom themes built with Tailwind CSS utilities for maximum flexibility</p>
    </header>

    <section class="themes-grid">
      <!-- Neon Theme -->
      <div class="theme-card">
        <h3>🌈 Neon Theme</h3>
        <div class="calendar-demo neon-theme">
          <div class="demo-calendar">
            <div class="calendar-header">
              <button class="nav-btn">‹</button>
              <span class="month-title">Muharram 1446</span>
              <button class="nav-btn">›</button>
            </div>
            <div class="days-preview">
              <span class="day" v-for="day in 7" :key="day">{{ day }}</span>
            </div>
          </div>
        </div>
        <p class="theme-desc">Vibrant neon colors with electric glow effects</p>
      </div>

      <!-- Ocean Theme -->
      <div class="theme-card">
        <h3>🌊 Ocean Theme</h3>
        <div class="calendar-demo ocean-theme">
          <div class="demo-calendar">
            <div class="calendar-header">
              <button class="nav-btn">‹</button>
              <span class="month-title">Muharram 1446</span>
              <button class="nav-btn">›</button>
            </div>
            <div class="days-preview">
              <span class="day" v-for="day in 7" :key="day">{{ day }}</span>
            </div>
          </div>
        </div>
        <p class="theme-desc">Calming ocean blues with wave-like animations</p>
      </div>

      <!-- Sunset Theme -->
      <div class="theme-card">
        <h3>🌅 Sunset Theme</h3>
        <div class="calendar-demo sunset-theme">
          <div class="demo-calendar">
            <div class="calendar-header">
              <button class="nav-btn">‹</button>
              <span class="month-title">Muharram 1446</span>
              <button class="nav-btn">›</button>
            </div>
            <div class="days-preview">
              <span class="day" v-for="day in 7" :key="day">{{ day }}</span>
            </div>
          </div>
        </div>
        <p class="theme-desc">Warm sunset gradients with golden hour vibes</p>
      </div>

      <!-- Cyberpunk Theme -->
      <div class="theme-card">
        <h3>⚡ Cyberpunk Theme</h3>
        <div class="calendar-demo cyberpunk-theme">
          <div class="demo-calendar">
            <div class="calendar-header">
              <button class="nav-btn">‹</button>
              <span class="month-title">Muharram 1446</span>
              <button class="nav-btn">›</button>
            </div>
            <div class="days-preview">
              <span class="day" v-for="day in 7" :key="day">{{ day }}</span>
            </div>
          </div>
        </div>
        <p class="theme-desc">Futuristic cyberpunk with neon borders</p>
      </div>

      <!-- Nature Theme -->
      <div class="theme-card">
        <h3>🌿 Nature Theme</h3>
        <div class="calendar-demo nature-theme">
          <div class="demo-calendar">
            <div class="calendar-header">
              <button class="nav-btn">‹</button>
              <span class="month-title">Muharram 1446</span>
              <button class="nav-btn">›</button>
            </div>
            <div class="days-preview">
              <span class="day" v-for="day in 7" :key="day">{{ day }}</span>
            </div>
          </div>
        </div>
        <p class="theme-desc">Earth tones with natural green accents</p>
      </div>

      <!-- Minimalist Theme -->
      <div class="theme-card">
        <h3>⚪ Minimalist Theme</h3>
        <div class="calendar-demo minimalist-theme">
          <div class="demo-calendar">
            <div class="calendar-header">
              <button class="nav-btn">‹</button>
              <span class="month-title">Muharram 1446</span>
              <button class="nav-btn">›</button>
            </div>
            <div class="days-preview">
              <span class="day" v-for="day in 7" :key="day">{{ day }}</span>
            </div>
          </div>
        </div>
        <p class="theme-desc">Ultra-clean design with maximum simplicity</p>
      </div>
    </section>

    <!-- Interactive Theme Builder -->
    <section class="theme-builder">
      <h2>🎨 Build Your Own Theme</h2>
      <div class="builder-container">
        <div class="controls">
          <div class="control-group">
            <label>Primary Color:</label>
            <input type="color" v-model="customTheme.primary" class="color-input" />
          </div>
          <div class="control-group">
            <label>Background:</label>
            <input type="color" v-model="customTheme.background" class="color-input" />
          </div>
          <div class="control-group">
            <label>Text Color:</label>
            <input type="color" v-model="customTheme.text" class="color-input" />
          </div>
          <div class="control-group">
            <label>Border Radius:</label>
            <input type="range" min="0" max="20" v-model="customTheme.borderRadius" class="slider" />
            <span>{{ customTheme.borderRadius }}px</span>
          </div>
        </div>

        <div class="preview-area">
          <h3>Custom Theme Preview</h3>

          <div class="locale-controls">
            <button
              @click="interactiveThemeLocale = 'en'"
              :class="{ active: interactiveThemeLocale === 'en' }"
              class="locale-btn"
            >
              English
            </button>
            <button
              @click="interactiveThemeLocale = 'ar'"
              :class="{ active: interactiveThemeLocale === 'ar' }"
              class="locale-btn"
            >
              العربية
            </button>
          </div>

          <!-- Real Taqwim Calendar Component -->
          <div class="calendar-demo custom-theme" :style="customThemeStyles">
            <HijriCalendarRoot
              v-model="interactiveThemeDate"
              :locale="interactiveThemeLocale"
              :dir="interactiveThemeLocale === 'ar' ? 'rtl' : 'ltr'"
            >
              <template #default="{ grid, weekDays }">
                <div class="interactive-calendar-header">
                  <HijriCalendarPrev class="interactive-nav-button">
                    {{ interactiveThemeLocale === 'ar' ? '→' : '←' }}
                  </HijriCalendarPrev>
                  <HijriCalendarHeading class="interactive-heading" />
                  <HijriCalendarNext class="interactive-nav-button">
                    {{ interactiveThemeLocale === 'ar' ? '←' : '→' }}
                  </HijriCalendarNext>
                </div>

                <HijriCalendarGrid class="interactive-calendar-grid">
                  <HijriCalendarGridHead>
                    <HijriCalendarGridRow class="interactive-weekdays-row">
                      <HijriCalendarHeadCell v-for="day in weekDays" :key="day" class="interactive-weekday-cell">
                        {{ day }}
                      </HijriCalendarHeadCell>
                    </HijriCalendarGridRow>
                  </HijriCalendarGridHead>

                  <HijriCalendarGridBody>
                    <HijriCalendarGridRow v-for="(week, index) in grid" :key="index" class="interactive-week-row">
                      <HijriCalendarCell
                        v-for="day in week"
                        :key="`${day.date.hy}-${day.date.hm}-${day.date.hd}`"
                        :date="day.date"
                        class="interactive-day-cell"
                      >
                        <HijriCalendarCellTrigger :day="day.date" :month="day.date" class="interactive-day-button">
                          {{ day.dayInMonth }}
                        </HijriCalendarCellTrigger>
                      </HijriCalendarCell>
                    </HijriCalendarGridRow>
                  </HijriCalendarGridBody>
                </HijriCalendarGrid>
              </template>
            </HijriCalendarRoot>
          </div>

          <div class="theme-code">
            <h4>Generated CSS:</h4>
            <pre><code>{{ generatedCSS }}</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- Usage Examples -->
    <section class="usage-examples">
      <h2>💻 Implementation Examples</h2>
      <div class="examples-grid">
        <div class="example-card">
          <h3>Basic Usage</h3>
          <pre><code>&lt;HijriCalendarRoot class="neon-theme"&gt;
  &lt;!-- Calendar components --&gt;
&lt;/HijriCalendarRoot&gt;</code></pre>
        </div>

        <div class="example-card">
          <h3>Custom CSS Variables</h3>
          <pre><code>.my-theme {
  --hc-primary-color: #ff6b6b;
  --hc-bg-color: #ffffff;
  --hc-text-color: #2d3748;
}</code></pre>
        </div>

        <div class="example-card">
          <h3>Tailwind Classes</h3>
          <pre><code>&lt;div class="bg-gradient-to-r from-purple-400 
            via-pink-500 to-red-500 rounded-lg"&gt;
  &lt;HijriCalendarRoot&gt;
    &lt;!-- Calendar --&gt;
  &lt;/HijriCalendarRoot&gt;
&lt;/div&gt;</code></pre>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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

// Custom theme configuration
const customTheme = ref({
  primary: '#3b82f6',
  background: '#ffffff',
  text: '#1f2937',
  borderRadius: 8,
})

const interactiveThemeDate = ref()
const interactiveThemeLocale = ref<'en' | 'ar'>('en')

// Generate CSS styles for custom theme
const customThemeStyles = computed(() => ({
  '--hc-primary-color': customTheme.value.primary,
  '--hc-bg-color': customTheme.value.background,
  '--hc-text-color': customTheme.value.text,
  '--hc-border-radius': `${customTheme.value.borderRadius}px`,
}))

// Generate CSS code for copying
const generatedCSS = computed(() =>
  `
.custom-theme {
  --hc-primary-color: ${customTheme.value.primary};
  --hc-bg-color: ${customTheme.value.background};
  --hc-text-color: ${customTheme.value.text};
  --hc-border-radius: ${customTheme.value.borderRadius}px;
}`.trim(),
)
</script>

<style scoped>
.theme-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
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

.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.theme-card {
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.theme-card:hover {
  transform: translateY(-5px);
}

.theme-card h3 {
  margin-bottom: 15px;
  color: #2d3748;
  font-size: 1.2rem;
}

.calendar-demo {
  margin-bottom: 15px;
}

.demo-calendar {
  border-radius: var(--hc-border-radius, 8px);
  padding: 15px;
  transition: all 0.3s ease;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.nav-btn {
  background: var(--hc-primary-color, #3b82f6);
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.nav-btn:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

.month-title {
  font-weight: 600;
  color: var(--hc-text-color, #2d3748);
}

.days-preview {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 0.875rem;
  color: var(--hc-text-color, #2d3748);
  cursor: pointer;
  transition: all 0.2s;
}

.day:hover {
  background: var(--hc-primary-color, #3b82f6);
  color: white;
}

.theme-desc {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

/* Neon Theme */
.neon-theme {
  --hc-primary-color: #ff0080;
  --hc-bg-color: #0a0a0a;
  --hc-text-color: #ffffff;
  background: linear-gradient(135deg, #0a0a0a, #1a0033);
  box-shadow: 0 0 20px rgba(255, 0, 128, 0.3);
}

.neon-theme .nav-btn {
  box-shadow: 0 0 10px rgba(255, 0, 128, 0.5);
}

/* Ocean Theme */
.ocean-theme {
  --hc-primary-color: #0077be;
  --hc-bg-color: #f0f9ff;
  --hc-text-color: #0c4a6e;
  background: linear-gradient(135deg, #bfdbfe, #dbeafe);
}

/* Sunset Theme */
.sunset-theme {
  --hc-primary-color: #f97316;
  --hc-bg-color: #fff7ed;
  --hc-text-color: #9a3412;
  background: linear-gradient(135deg, #fed7aa, #ffedd5);
}

/* Cyberpunk Theme */
.cyberpunk-theme {
  --hc-primary-color: #00ff88;
  --hc-bg-color: #0f0f23;
  --hc-text-color: #00ff88;
  background: linear-gradient(135deg, #0f0f23, #1a1a2e);
  border: 1px solid #00ff88;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.2);
}

/* Nature Theme */
.nature-theme {
  --hc-primary-color: #059669;
  --hc-bg-color: #f0fdf4;
  --hc-text-color: #064e3b;
  background: linear-gradient(135deg, #dcfce7, #f0fdf4);
}

/* Minimalist Theme */
.minimalist-theme {
  --hc-primary-color: #374151;
  --hc-bg-color: #ffffff;
  --hc-text-color: #111827;
  background: #ffffff;
  border: 1px solid #e5e7eb;
}

/* Theme Builder */
.theme-builder {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 60px;
}

.theme-builder h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #2d3748;
}

.builder-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
}

.controls {
  display: grid;
  gap: 20px;
}

.locale-controls {
  text-align: center;
  margin-bottom: 15px;
}

.locale-btn {
  padding: 6px 12px;
  margin: 0 3px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #4a5568;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8rem;
}

.locale-btn:hover {
  border-color: var(--hc-primary-color, #3b82f6);
  color: var(--hc-primary-color, #3b82f6);
}

.locale-btn.active {
  background: var(--hc-primary-color, #3b82f6);
  color: white;
  border-color: var(--hc-primary-color, #3b82f6);
}

/* Interactive Calendar Styles */
.interactive-calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 0 5px;
}

.interactive-nav-button {
  background: var(--hc-primary-color, #3b82f6);
  color: white;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: var(--hc-border-radius, 8px);
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.interactive-nav-button:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

.interactive-nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.interactive-heading {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--hc-text-color, #1f2937);
}

.interactive-calendar-grid {
  width: 100%;
}

.interactive-weekdays-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-bottom: 5px;
}

.interactive-weekday-cell {
  text-align: center;
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--hc-text-color, #1f2937);
  padding: 6px 2px;
  text-transform: uppercase;
}

.interactive-week-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-bottom: 1px;
}

.interactive-day-cell {
  aspect-ratio: 1;
}

.interactive-day-button {
  width: 100%;
  height: 100%;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--hc-border-radius, 8px);
  cursor: pointer;
  font-size: 0.75rem;
  color: var(--hc-text-color, #1f2937);
  transition: all 0.2s ease;
}

.interactive-day-button:hover {
  background: rgba(59, 130, 246, 0.1);
}

.interactive-day-button[data-selected='true'] {
  background: var(--hc-primary-color, #3b82f6);
  color: white;
  font-weight: 600;
}

.interactive-day-button[data-today='true'] {
  background: rgba(59, 130, 246, 0.2);
  color: var(--hc-primary-color, #3b82f6);
  font-weight: 600;
}

.interactive-day-button[data-outside-month='true'] {
  opacity: 0.4;
}

/* RTL Support for Interactive Calendar */
[dir='rtl'] .interactive-calendar-header {
  direction: rtl;
}

[dir='rtl'] .interactive-weekdays-row,
[dir='rtl'] .interactive-week-row {
  direction: rtl;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-group label {
  font-weight: 500;
  min-width: 100px;
  color: #374151;
}

.color-input {
  width: 50px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.slider {
  flex: 1;
  margin-right: 10px;
}

.preview-area h3 {
  margin-bottom: 20px;
  color: #2d3748;
}

.custom-theme {
  --hc-border-radius: 8px;
}

.theme-code {
  margin-top: 20px;
  background: #f7fafc;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.theme-code h4 {
  margin-bottom: 10px;
  color: #374151;
  font-size: 0.9rem;
}

.theme-code pre {
  margin: 0;
  font-size: 0.8rem;
  color: #4a5568;
}

/* Usage Examples */
.usage-examples {
  background: #1f2937;
  color: white;
  padding: 40px;
  border-radius: 16px;
}

.usage-examples h2 {
  text-align: center;
  margin-bottom: 30px;
  color: white;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.example-card {
  background: #374151;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #4b5563;
}

.example-card h3 {
  margin-bottom: 15px;
  color: #f9fafb;
  font-size: 1rem;
}

.example-card pre {
  background: #111827;
  padding: 15px;
  border-radius: 8px;
  font-size: 0.8rem;
  line-height: 1.4;
  overflow-x: auto;
}

/* Responsive */
@media (max-width: 1024px) {
  .builder-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .themes-grid {
    grid-template-columns: 1fr;
  }

  .examples-grid {
    grid-template-columns: 1fr;
  }
}
</style>
