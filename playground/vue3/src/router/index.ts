import { createRouter, createWebHistory } from 'vue-router'
import PlaygroundView from '../views/PlaygroundView.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'playground', component: PlaygroundView },
    { path: '/datepicker', name: 'datepicker', component: () => import('../views/DatePickerView.vue') },
    { path: '/headless', name: 'headless', component: () => import('../views/HeadlessView.vue') },
  ],
})
