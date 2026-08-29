---
'@taqwim/calendar-core': minor
'@taqwim/vue': minor
'@taqwim/vue-styled': minor
'@taqwim/react': minor
'@taqwim/react-styled': minor
'@taqwim/svelte': minor
'@taqwim/svelte-styled': minor
'@taqwim/solid': minor
'@taqwim/solid-styled': minor
'@taqwim/angular': minor
'@taqwim/angular-styled': minor
'@taqwim/themes': minor
---

Add themed hover and focus tooltips on calendar day cells.

- `getCellProps()` and `getCellTooltip()` expose the full date label on each gridcell
- Headless adapters bind `data-tooltip` and a native `title` fallback on every day cell
- `@taqwim/themes` renders the label in a tooltip above the cell on hover and focus
