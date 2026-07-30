<script setup lang="ts">
defineOptions({ name: 'HijriCalendarHeadCell' })
</script>

<template>
  <div :data-taqwim-calendar-head-cell="''">
    <slot />
  </div>
</template>
