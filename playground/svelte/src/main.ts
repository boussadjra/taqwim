import './playground.css'
// One import, every theme. Selection happens with `data-taqwim-theme`, not by
// choosing which stylesheet to load.
import '@taqwim/themes'

import { mount } from 'svelte'
import App from './App.svelte'

mount(App, { target: document.getElementById('app')! })
