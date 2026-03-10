<template>
  <div class="theme-demo sunset-theme">
    <h1>Sunset Theme</h1>
    <HijriCalendar theme="sunset" />
  </div>
</template>

<script setup lang="ts">
import { HijriCalendar } from 'taqwim-vue'
</script>

<style scoped>
.sunset-theme {
  background: linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%);
  color: #fff;
  min-height: 100vh;
  padding: 2rem;
}
</style>
