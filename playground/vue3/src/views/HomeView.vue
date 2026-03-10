<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { formatHijriDate, toHijri } from 'taqwim-core-utils'

const today = toHijri(new Date())!
const currentTime = ref(new Date().toLocaleTimeString())

// Update time every second for that authentic brutalist feel
onMounted(() => {
  setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString()
  }, 1000)
})

const themes = [
  {
    name: 'DEFAULT',
    route: '/default',
    color: '#667eea',
    description: 'Clean • Professional • Elegant',
  },
  {
    name: 'DARK',
    route: '/dark',
    color: '#23272f',
    description: 'Night Mode • Modern • Comfortable',
  },
  {
    name: 'MODERN',
    route: '/modern',
    color: '#06d6a0',
    description: 'Glassmorphism • Trendy • Beautiful',
  },
  {
    name: 'ISLAMIC',
    route: '/islamic',
    color: '#d4af37',
    description: 'Traditional • Cultural • Authentic',
  },
  {
    name: 'NEON',
    route: '/neon',
    color: '#39ff14',
    description: 'Vibrant • Futuristic • Eye-catching',
  },
  {
    name: 'OCEAN',
    route: '/ocean',
    color: '#0093e9',
    description: 'Calm • Blue Tones • Refreshing',
  },
  {
    name: 'SUNSET',
    route: '/sunset',
    color: '#ff6e7f',
    description: 'Warm • Gradient • Inviting',
  },
  {
    name: 'CYBERPUNK',
    route: '/cyberpunk',
    color: '#ff0099',
    description: 'Bold • Sci-Fi • Neon Glow',
  },
  {
    name: 'NATURE',
    route: '/nature',
    color: '#43e97b',
    description: 'Earthy • Green • Organic',
  },
  {
    name: 'MINIMALIST',
    route: '/minimalist',
    color: '#f5f5f5',
    description: 'Simple • Clean • Uncluttered',
  },
  {
    name: 'LUXURIOUS',
    route: '/luxurious',
    color: '#bfae9e',
    description: 'Premium • Gold Accents • Elegant',
  },
  {
    name: 'MATERIAL',
    route: '/material',
    color: '#2196f3',
    description: 'Google Material • Familiar • Accessible',
  },
]

const features = [
  'Headless Calendar Components',
  'Hijri Date System Support',
  'TypeScript Everything',
  'Vue 3 Composition API',
  'RTL Language Support',
  'Accessibility Built-in',
  'MIT License',
  'Developer Friendly',
]

const stats = [
  { label: 'COMPONENTS', value: '12+' },
  { label: 'THEMES', value: '12+' },
  { label: 'LOCALES', value: '3' },
  { label: 'BUGS', value: 'SOME' },
]
</script>

<template>
  <div class="home-container">
    <!-- Hero Section -->
    <header class="hero">
      <div class="noise-bg"></div>
      <div class="hero-content">
        <div class="title-section">
          <h1 class="main-title">
            TAQWIM
            <span class="subtitle">HIJRI CALENDAR</span>
          </h1>
          <div class="status-bar">
            <span>Ready</span>
            <span class="separator">•</span>
            <span>{{ currentTime }}</span>
            <span class="separator">•</span>
            <span>{{ formatHijriDate(today, 'iYYYY/iMM/iDD', 'en') }}</span>
          </div>
        </div>

        <div class="hero-description">
          <p class="big-text">
            Beautiful and Modern<br />
            Hijri Calendar<br />
            Components for Vue 3
          </p>
          <p class="warning">✨ Built with care for developers and users alike</p>
        </div>

        <div class="cta-section">
          <a href="https://github.com/boussadjra/taqwim" class="cta-button secondary"> View Source </a>
        </div>
      </div>
    </header>

    <!-- Stats -->
    <section class="stats-section">
      <div class="stats-grid">
        <div v-for="stat in stats" :key="stat.label" class="stat-item">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features-section">
      <h2 class="section-title">What You Get</h2>
      <div class="features-grid">
        <div v-for="feature in features" :key="feature" class="feature-item">
          <span class="bullet">✓</span>
          {{ feature }}
        </div>
      </div>
    </section>

    <!-- Themes Grid -->
    <section class="themes-section my-20">
      <h2 class="section-title">Choose Your Style</h2>
      <div class="themes-grid">
        <RouterLink
          v-for="theme in themes"
          :key="theme.name"
          :to="theme.route"
          class="theme-card"
          :style="{ '--theme-color': theme.color }"
        >
          <div class="theme-header">
            <h3 class="theme-name">{{ theme.name }}</h3>
          </div>
          <p class="theme-description">{{ theme.description }}</p>
          <div class="theme-preview" :style="{ backgroundColor: theme.color }"></div>
          <div class="theme-action">View Theme →</div>
        </RouterLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-text">
          <p>Made with ❤️ and Coffee</p>
          <p>By Developer for Developers</p>
        </div>
        <div class="footer-links">
          <a href="https://github.com/boussadjra/taqwim">GitHub</a>
          <a href="https://www.npmjs.com/package/taqwim-vue">NPM</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* Base Styles */
.home-container {
  min-height: 100vh;
  overflow-x: hidden;
  transition: all 0.3s ease;
}

@keyframes scanlines {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(4px);
  }
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Common Elements */
.hero-content {
  text-align: center;
  max-width: 900px;
  padding: 40px 20px;
  z-index: 1;
}

.subtitle {
  display: block;
  font-size: clamp(1.2rem, 3vw, 2.5rem);
  opacity: 0.7;
  margin-top: 10px;
  letter-spacing: 0.1em;
}

.status-bar {
  font-size: 0.9rem;
  margin: 20px 0 40px 0;
  font-weight: 400;
  padding: 8px 16px;
  border: 1px solid;
  border-radius: 20px;
  display: inline-block;
}

.separator {
  margin: 0 8px;
  opacity: 0.6;
}

.big-text {
  font-size: clamp(1.5rem, 4vw, 3rem);
  font-weight: 700;
  line-height: 1.1;
  margin: 40px 0 20px 0;
  text-transform: uppercase;
  letter-spacing: -0.01em;
}

.warning {
  font-size: 1.1rem;
  margin: 20px 0 40px 0;
  padding: 12px;
  border: 2px solid;
  font-weight: 600;
  border-radius: 8px;
}

.cta-section {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 40px;
}

.cta-button {
  display: inline-block;
  padding: 16px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  text-transform: none;
  letter-spacing: 0.02em;
  border: 2px solid;
  border-radius: 8px;
  transition: all 0.2s;
  font-family: inherit;
  cursor: pointer;
}

.cta-button.primary {
  background: var(--primary-bg, #ffffff);
  color: var(--primary-color, #000000);
  border-color: var(--primary-border, #ffffff);
}

.cta-button.secondary {
  background: transparent;
  color: inherit;
  border-color: currentColor;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  max-width: 800px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
  border: 2px solid;
  border-radius: 12px;
  padding: 30px 20px;
  background: inherit;
}

.stat-value {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.section-title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 800;
  text-align: center;
  margin-bottom: 60px;
  text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.2);
}

.features-grid {
  max-width: 800px;
  margin: 0 auto;
  display: grid;
  gap: 20px;
}

.feature-item {
  font-size: 1.2rem;
  font-weight: 700;
  padding: 20px;
  background: rgba(0, 0, 0, 0.1);
  border: 2px solid;
  display: flex;
  align-items: center;
  gap: 15px;
}

.bullet {
  font-weight: 800;
  font-size: 1.5rem;
}

.footnote {
  text-align: center;
  margin-top: 40px;
  font-size: 0.9rem;
  opacity: 0.8;
}

.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.theme-card {
  text-decoration: none;
  color: inherit;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid;
  border-radius: 12px;
  padding: 25px;
  transition: all 0.2s;
  display: block;
}

.theme-card:hover {
  transform: translate(3px, 3px);
}
.theme-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.theme-name {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
}

.theme-price {
  background: var(--theme-color);
  color: #ffffff;
  padding: 6px 12px;
  font-weight: 700;
  font-size: 0.9rem;
}

.theme-description {
  font-size: 0.9rem;
  margin: 15px 0;
  font-weight: 400;
  opacity: 0.8;
}

.theme-preview {
  height: 80px;
  margin: 20px 0;
  border: 2px solid;
}

.theme-action {
  font-weight: 700;
  text-align: center;
  padding: 12px;
  background: currentColor;
  color: var(--card-bg, #ffffff);
  margin-top: 20px;
}

.playground-section {
  padding: 80px 20px;
}

.playground-card {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  border: 4px solid;
  padding: 60px 40px;
  background: rgba(0, 0, 0, 0.1);
}

.playground-card h2 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 20px;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.2);
}

.playground-card p {
  font-size: 1.2rem;
  margin-bottom: 40px;
  opacity: 0.9;
}

.playground-btn {
  display: inline-block;
  padding: 20px 40px;
  text-decoration: none;
  font-weight: 800;
  font-size: 1.2rem;
  border: 3px solid;
  transition: all 0.2s;
  font-family: inherit;
  background: inherit;
  color: inherit;
}

.footer {
  padding: 60px 20px;
  border-top: 4px solid;
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 30px;
}

.footer-text p {
  margin: 5px 0;
  font-weight: 700;
}

.footer-links {
  display: flex;
  gap: 30px;
}

.footer-links a {
  color: inherit;
  text-decoration: none;
  font-weight: 700;
  padding: 8px 16px;
  border: 2px solid;
  transition: all 0.2s;
}

/* Responsive */
@media (max-width: 768px) {
  .cta-section {
    flex-direction: column;
    align-items: center;
  }

  .cta-button {
    width: 100%;
    max-width: 300px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
  }

  .footer-links {
    flex-direction: column;
    gap: 15px;
  }
}
</style>

<!-- Add scoped styles for component-specific elements -->
<style scoped>
/* Component-specific overrides that don't conflict with themes */
.hero-content {
  position: relative;
  z-index: 2;
}
</style>
