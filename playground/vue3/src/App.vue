<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <header>
      <h1>Taqwim — Vue playground</h1>
      <nav>
        <RouterLink to="/">Calendar</RouterLink>
        <RouterLink to="/datepicker">Date picker</RouterLink>
        <RouterLink to="/headless">Headless</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
#app {
  max-width: 72rem;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: system-ui, sans-serif;
  color-scheme: light dark;
}

header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 1.5rem;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #d4d4d8;
}

h1 {
  margin: 0;
  font-size: 1.25rem;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  color: inherit;
  text-decoration: none;
  opacity: 0.65;
}

nav a.router-link-active {
  opacity: 1;
  font-weight: 600;
}
</style>
