import './playground.css'
// One import, every theme. Selection happens with `data-taqwim-theme`, not
// by choosing which stylesheet to load.
import '@taqwim/themes'

import { render } from 'solid-js/web'
import { App } from './App'

render(() => <App />, document.getElementById('app')!)
