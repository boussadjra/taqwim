import './assets/main.css'
import 'taqwim-vue/hijri-calendar.css'
import 'taqwim-vue/hijri-calendar-default.css'
import 'taqwim-vue/hijri-calendar-dark.css'
import 'taqwim-vue/hijri-calendar-modern.css'
import 'taqwim-vue/hijri-calendar-islamic.css'
import 'taqwim-vue/hijri-calendar-neon.css'
import 'taqwim-vue/hijri-calendar-ocean.css'
import 'taqwim-vue/hijri-calendar-sunset.css'
import 'taqwim-vue/hijri-calendar-cyberpunk.css'
import 'taqwim-vue/hijri-calendar-nature.css'
import 'taqwim-vue/hijri-calendar-minimalist.css'
import 'taqwim-vue/hijri-calendar-luxurious.css'
import 'taqwim-vue/hijri-calendar-material.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
