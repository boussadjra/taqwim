<script setup lang="ts">
import { ref, watch } from 'vue'
// import HijriCalendar from '../../../../packages/vue/src/HijriCalendar/HijriCalendar.vue'
import type { HijriDateObject } from '@taqwim/core'
import { HijriCalendar } from 'taqwim-vue'

const selectedDate = ref<HijriDateObject>({ hy: 1446, hm: 2, hd: 15 })

function onDateChange(date: HijriDateObject | HijriDateObject[] | undefined) {
  console.log('Selected date:', date)
  if (date && !Array.isArray(date)) {
    selectedDate.value = date
  }
}

// Watch for changes in selectedDate
watch(
  selectedDate,
  newDate => {
    console.log('Date changed to:', newDate)
  },
  { deep: true },
)
</script>

<template>
  <div class="calendar-test p-4">
    <h1>HijriCalendar Component Test</h1>

    <div class="selection-display">
      <h3>Current Selection</h3>
      <pre>{{ JSON.stringify(selectedDate, null, 2) }}</pre>
    </div>
    <div class="flex p-8 gap-4 justify-center flex-wrap">
      <div class="example max-w-96">
        <h3>Islamic Theme (Arabic locale)</h3>
        <HijriCalendar locale="ar" v-model="selectedDate" theme="islamic" />
      </div>

      <div class="example max-w-96">
        <h3>Islamic Theme (English locale)</h3>
        <HijriCalendar locale="en" v-model="selectedDate" theme="islamic" />
      </div>

      <div class="example max-w-96">
        <h3>Default Theme</h3>
        <HijriCalendar v-model="selectedDate" theme="default" />
      </div>

      <div class="example max-w-96">
        <h3>Modern Theme</h3>
        <HijriCalendar size="compact" v-model="selectedDate" theme="modern" />
      </div>

      <div class="example max-w-96">
        <h3>Dark Theme</h3>
        <HijriCalendar size="compact" v-model="selectedDate" theme="dark" />
      </div>

      <div class="example max-w-96">
        <h3>Neon Theme</h3>
        <HijriCalendar v-model="selectedDate" theme="neon" />
      </div>

      <div class="example max-w-96">
        <h3>Ocean Theme</h3>
        <HijriCalendar v-model="selectedDate" theme="ocean" />
      </div>

      <div class="example max-w-96">
        <h3>Sunset Theme</h3>
        <HijriCalendar v-model="selectedDate" theme="sunset" />
      </div>

      <div class="example max-w-96">
        <h3>Cyberpunk Theme</h3>
        <HijriCalendar v-model="selectedDate" theme="cyberpunk" />
      </div>

      <div class="example max-w-96">
        <h3>Nature Theme</h3>
        <HijriCalendar v-model="selectedDate" theme="nature" />
      </div>

      <div class="example max-w-96">
        <h3>Minimalist Theme</h3>
        <HijriCalendar v-model="selectedDate" theme="minimalist" />
      </div>

      <div class="example max-w-96">
        <h3>Luxurious Theme</h3>
        <HijriCalendar v-model="selectedDate" theme="luxurious" />
      </div>

      <div class="example max-w-96">
        <h3>Material Theme</h3>
        <HijriCalendar v-model="selectedDate" theme="material" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-test {
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
</style>
