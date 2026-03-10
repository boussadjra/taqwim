<script lang="ts">
export interface HijriCalendarHeaderProps {
  /** Additional HTML attributes */
  [key: string]: any
}
</script>

<script setup lang="ts">
import { injectHijriCalendarRootContext } from './HijriCalendarRoot.vue'

defineProps<HijriCalendarHeaderProps>()

const rootContext = injectHijriCalendarRootContext()
</script>

<template>
  <div role="group" :aria-label="rootContext.fullCalendarLabel.value" v-bind="$attrs">
    <slot />
  </div>
</template>
