<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>
<template>
  <div id="app">
    <header class="app-header">
      <div class="header-content">
        <div class="title-section">
          <h1>🌙 Taqwim Vue Playground</h1>
          <p>Complete showcase of Hijri calendar components and themes</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="nav">
        <RouterLink to="/" class="nav-link">🏠 Home</RouterLink>
        <RouterLink to="/default" class="nav-link">🎨 Default</RouterLink>
        <RouterLink to="/dark" class="nav-link">🌙 Dark</RouterLink>
        <RouterLink to="/modern" class="nav-link">✨ Modern</RouterLink>
        <RouterLink to="/islamic" class="nav-link">🕌 Islamic</RouterLink>
        <RouterLink to="/tailwind" class="nav-link">🎯 Tailwind</RouterLink>
        <RouterLink to="/neon" class="nav-link">💡 Neon</RouterLink>
        <RouterLink to="/ocean" class="nav-link">🌊 Ocean</RouterLink>
        <RouterLink to="/sunset" class="nav-link">🌅 Sunset</RouterLink>
        <RouterLink to="/cyberpunk" class="nav-link">🤖 Cyberpunk</RouterLink>
        <RouterLink to="/nature" class="nav-link">🌱 Nature</RouterLink>
        <RouterLink to="/minimalist" class="nav-link">📐 Minimalist</RouterLink>
        <RouterLink to="/luxurious" class="nav-link">💎 Luxurious</RouterLink>
        <RouterLink to="/material" class="nav-link">📦 Material</RouterLink>
        <RouterLink to="/simple" class="nav-link">📅 Simple</RouterLink>
        <RouterLink to="/demo" class="nav-link">📊 Demo</RouterLink>
      </nav>
    </header>

    <!-- Router Content -->
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* JetBrains Mono Font */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');
/* Amiri Font */
@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');

/* Base App Container */
#app {
  min-height: 100vh;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  padding: 20px;
  transition: all 0.3s ease;
}

/* Header */
.app-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  border-radius: 16px;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #f0f8f4, #e0ffe7);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.title-section h1 {
  font-size: 3rem;
  margin: 0 0 10px;
  font-weight: 900;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

.title-section p {
  font-size: 1.2rem;
  margin: 0 0 20px;
  opacity: 0.9;
  text-transform: uppercase;
  font-weight: 600;
}

/* Theme Switcher */
.theme-switcher {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.theme-switcher label {
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.theme-select {
  padding: 8px 12px;
  border-radius: 4px;
  border: 2px solid;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  cursor: pointer;
  min-width: 200px;
}

/* Navigation */
.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}

.nav-link {
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 700;
  border: 2px solid;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
}

/* Main Content */
.main-content {
  min-height: 60vh;
}

/* Responsive Design */
@media (max-width: 768px) {
  #app {
    padding: 10px;
  }

  .header-content {
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  .theme-switcher {
    align-items: center;
  }

  .title-section h1 {
    font-size: 2rem;
  }

  .nav {
    flex-direction: column;
    align-items: center;
  }

  .nav-link {
    width: 200px;
    text-align: center;
  }
}
</style>
