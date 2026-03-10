import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },

    {
      path: '/default',
      name: 'default',
      component: () => import('../views/DefaultTheme.vue'),
    },
    {
      path: '/dark',
      name: 'dark',
      component: () => import('../views/DarkTheme.vue'),
    },
    {
      path: '/modern',
      name: 'modern',
      component: () => import('../views/ModernTheme.vue'),
    },
    {
      path: '/islamic',
      name: 'islamic',
      component: () => import('../views/IslamicTheme.vue'),
    },
    {
      path: '/tailwind',
      name: 'tailwind',
      component: () => import('../views/TailwindThemes.vue'),
    },
    {
      path: '/neon',
      name: 'neon',
      component: () => import('../views/NeonTheme.vue'),
    },
    {
      path: '/ocean',
      name: 'ocean',
      component: () => import('../views/OceanTheme.vue'),
    },
    {
      path: '/sunset',
      name: 'sunset',
      component: () => import('../views/SunsetTheme.vue'),
    },
    {
      path: '/cyberpunk',
      name: 'cyberpunk',
      component: () => import('../views/CyberpunkTheme.vue'),
    },
    {
      path: '/nature',
      name: 'nature',
      component: () => import('../views/NatureTheme.vue'),
    },
    {
      path: '/minimalist',
      name: 'minimalist',
      component: () => import('../views/MinimalistTheme.vue'),
    },
    {
      path: '/luxurious',
      name: 'luxurious',
      component: () => import('../views/LuxuriousTheme.vue'),
    },
    {
      path: '/material',
      name: 'material',
      component: () => import('../views/MaterialTheme.vue'),
    },
    {
      path: '/simple',
      name: 'simple',
      component: () => import('../views/HijriCalendarSimple.vue'),
    },
    {
      path: '/demo',
      name: 'demo',
      component: () => import('../views/HijriCalendarDemo.vue'),
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/HijriCalendarTest.vue'),
    },
  ],
})

export default router
