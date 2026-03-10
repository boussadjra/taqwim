<template>
  <div class="theme-demo nature-theme">
    <h1>Nature Theme</h1>
    <HijriCalendar theme="nature" />
  </div>
</template>

<script setup lang="ts">
import { HijriCalendar } from 'taqwim-vue'
</script>

<style scoped>
.nature-theme {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: #234d20;
  min-height: 100vh;
  padding: 2rem;
}
</style>
