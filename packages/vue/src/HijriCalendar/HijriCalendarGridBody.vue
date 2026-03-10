<script lang="ts">
export interface HijriCalendarGridBodyProps {
  /** Additional HTML attributes */
  [key: string]: any
}
</script>

<script setup lang="ts">
defineProps<HijriCalendarGridBodyProps>()
</script>

<template>
  <div v-bind="$attrs">
    <slot />
  </div>
</template>
