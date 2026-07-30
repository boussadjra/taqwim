import './assets/main.css'
// One import, every theme. Selection happens with `data-taqwim-theme`, not by
// choosing which stylesheet to load.
import '@taqwim/themes'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
