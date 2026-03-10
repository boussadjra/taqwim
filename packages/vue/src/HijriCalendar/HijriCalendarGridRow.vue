<script lang="ts">
export interface HijriCalendarGridRowProps {
  /** Additional HTML attributes */
  [key: string]: any
}
</script>

<script setup lang="ts">
defineProps<HijriCalendarGridRowProps>()
</script>

<template>
  <div role="row" v-bind="$attrs">
    <slot />
  </div>
</template>
