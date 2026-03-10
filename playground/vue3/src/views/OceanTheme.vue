<template>
  <div class="theme-demo ocean-theme">
    <h1>Ocean Theme</h1>
    <HijriCalendar theme="ocean" />
  </div>
</template>

<script setup lang="ts">
import { HijriCalendar } from 'taqwim-vue'
</script>

<style scoped>
.ocean-theme {
  background: linear-gradient(135deg, #0093e9 0%, #80d0c7 100%);
  color: #fff;
  min-height: 100vh;
  padding: 2rem;
}
</style>
