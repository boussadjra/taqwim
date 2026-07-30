---
'@taqwim/solid': minor
'@taqwim/solid-styled': minor
'@taqwim/svelte': minor
'@taqwim/svelte-styled': minor
'@taqwim/angular': minor
'@taqwim/angular-styled': minor
'@taqwim/vue-styled': patch
'@taqwim/react-styled': patch
---

Add Solid, Svelte 5 and Angular adapters, headless and themed.

All six bind to the same `@taqwim/calendar-core` store as the Vue and React packages, so grid layout, selection, paging, keyboard navigation and the emitted `data-*` attributes are one implementation across five frameworks. The prop names match deliberately, and the Solid and Svelte test suites are near-identical files to the Vue and React ones.

Svelte's compiler-level accessibility checks caught a gap shared by every date picker: `role="combobox"` is only complete when it points at the popup it controls. All four now set `aria-controls` and give the popover an id and a tab stop.

The Angular package ships without a Vitest suite. `@analogjs/vite-plugin-angular` cannot build the Angular program under Vite 8 and Vitest 4, so a test file's `@Component` decorators fall through to Vite's own transform. It is verified instead by `ngc` with `strictTemplates` on every build, and at the DOM level by the shared Playwright suite. Angular is pinned to 21 rather than 22 because 22 requires TypeScript 6 and the rest of the workspace is on 5.9.
