<script setup lang="ts">
defineOptions({ name: 'HijriCalendarGridRow' })
</script>

<template>
  <div role="row" :data-taqwim-calendar-grid-row="''">
    <slot />
  </div>
</template>
