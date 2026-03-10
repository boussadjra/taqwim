<script lang="ts">
export interface HijriCalendarGridHeadProps {
  /** Additional HTML attributes */
  [key: string]: any
}
</script>

<script setup lang="ts">
defineProps<HijriCalendarGridHeadProps>()
</script>

<template>
  <div aria-hidden="true" v-bind="$attrs">
    <slot />
  </div>
</template>
