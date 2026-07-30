<script setup lang="ts">
import { injectHijriCalendarRootContext } from './context'

defineOptions({ name: 'HijriCalendarHeader' })

const { state } = injectHijriCalendarRootContext()
</script>

<template>
  <div role="group" :aria-label="state.fullCalendarLabel" :data-taqwim-calendar-header="''">
    <slot />
  </div>
</template>
