<script lang="ts">
export interface HijriCalendarHeadCellProps {
  /** Additional HTML attributes */
  [key: string]: any
}
</script>

<script setup lang="ts">
defineProps<HijriCalendarHeadCellProps>()
</script>

<template>
  <div v-bind="$attrs">
    <slot />
  </div>
</template>
