<template>
  <div class="theme-demo material-theme">
    <h1>Material Theme</h1>
    <HijriCalendar theme="material" />
  </div>
</template>

<script setup lang="ts">
import { HijriCalendar } from 'taqwim-vue'
</script>

<style scoped>
.material-theme {
  background: #2196f3;
  color: #fff;
  min-height: 100vh;
  padding: 2rem;
}
</style>
