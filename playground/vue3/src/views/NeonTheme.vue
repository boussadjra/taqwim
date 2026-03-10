<template>
  <div class="theme-demo neon-theme">
    <h1>Neon Theme</h1>
    <HijriCalendar theme="neon" />
  </div>
</template>

<script setup lang="ts">
import { HijriCalendar } from 'taqwim-vue'
</script>

<style scoped>
.neon-theme {
  background: #111;
  color: #39ff14;
  min-height: 100vh;
  padding: 2rem;
}
</style>
