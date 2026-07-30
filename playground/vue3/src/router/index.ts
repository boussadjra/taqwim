import { createRouter, createWebHistory } from 'vue-router'
import HarnessView from '../views/HarnessView.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // `/` is the shared end-to-end harness in every playground, so one
    // Playwright spec can drive all five from the same URL shape.
    { path: '/', name: 'harness', component: HarnessView },
    { path: '/explore', name: 'explore', component: () => import('../views/PlaygroundView.vue') },
    { path: '/datepicker', name: 'datepicker', component: () => import('../views/DatePickerView.vue') },
    { path: '/headless', name: 'headless', component: () => import('../views/HeadlessView.vue') },
  ],
})
