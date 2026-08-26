import './playground.css'
// One import, every theme. Selection happens with `data-taqwim-theme`, not
// by choosing which stylesheet to load.
import '@taqwim/themes'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
