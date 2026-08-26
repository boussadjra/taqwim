<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

/*
 * Vue is the one playground with a router — the others hang their extra views
 * off the hash. The chrome is still the shared `.pg-*` classes so the five
 * look identical, which is the point: a visual difference between them should
 * mean a difference in the adapters, not in their scaffolding.
 */
const VIEWS = [
  { to: '/', label: 'Harness' },
  { to: '/explore', label: 'Calendar' },
  { to: '/datepicker', label: 'Date picker' },
  { to: '/headless', label: 'Headless' },
]
</script>

<template>
  <header class="pg-header">
    <strong>Taqwim — Vue playground</strong>
    <nav>
      <RouterLink v-for="item in VIEWS" :key="item.to" :to="item.to">{{ item.label }}</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>
