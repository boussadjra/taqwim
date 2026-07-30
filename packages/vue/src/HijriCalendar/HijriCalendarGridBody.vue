<script setup lang="ts">
defineOptions({ name: 'HijriCalendarGridBody' })
</script>

<template>
  <div :data-taqwim-calendar-grid-body="''">
    <slot />
  </div>
</template>
