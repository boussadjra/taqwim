# Known gaps in the shared suite

All five framework playgrounds, including Angular, run the shared Playwright
suite by default. Angular also runs `ngc` with `strictTemplates` during its
package build. It does not have a separate Vitest component suite; its rendered
behavior is checked by the shared browser suite.

The Angular playground must allow the Analog Vite plugin to emit compiled
components (`noEmit` must not be set in `tsconfig.app.json`) and provide an
`<app-root>` host in `index.html`.
