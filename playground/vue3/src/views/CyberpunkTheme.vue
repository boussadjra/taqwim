<template>
  <div class="theme-demo cyberpunk-theme">
    <h1>Cyberpunk Theme</h1>
    <HijriCalendar theme="cyberpunk" />
  </div>
</template>

<script setup lang="ts">
import { HijriCalendar } from 'taqwim-vue'
</script>

<style scoped>
.cyberpunk-theme {
  background: #1a0033;
  color: #ff0099;
  min-height: 100vh;
  padding: 2rem;
}
</style>
