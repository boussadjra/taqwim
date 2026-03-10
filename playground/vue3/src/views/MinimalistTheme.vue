<template>
  <div class="theme-demo minimalist-theme">
    <h1>Minimalist Theme</h1>
    <HijriCalendar theme="minimalist" />
  </div>
</template>

<script setup lang="ts">
import { HijriCalendar } from 'taqwim-vue'
</script>

<style scoped>
.minimalist-theme {
  background: #f5f5f5;
  color: #222;
  min-height: 100vh;
  padding: 2rem;
}
</style>
