<template>
  <div class="theme-demo luxurious-theme">
    <h1>Luxurious Theme</h1>
    <HijriCalendar theme="luxurious" />
  </div>
</template>

<script setup lang="ts">
import { HijriCalendar } from 'taqwim-vue'
</script>

<style scoped>
.luxurious-theme {
  background: #bfae9e;
  color: #fff;
  min-height: 100vh;
  padding: 2rem;
}
</style>
