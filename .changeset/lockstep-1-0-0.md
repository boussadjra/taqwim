---
'@taqwim/core': major
'@taqwim/calendar-core': major
'@taqwim/themes': major
'@taqwim/vue': major
'@taqwim/vue-styled': major
'@taqwim/react': major
'@taqwim/react-styled': major
'@taqwim/svelte': major
'@taqwim/svelte-styled': major
'@taqwim/solid': major
'@taqwim/solid-styled': major
'@taqwim/angular': major
'@taqwim/angular-styled': major
---

1.0.0 — the `@taqwim` scope, in lockstep.

Thirteen packages that only make sense together, so they version together: an adapter and the store it binds to must never be a version apart.

The old unscoped names get one final release that re-exports the new ones, then `npm deprecate`. See the [migration guide](https://boussadjra.github.io/taqwim/guide/migration/) for the deliberate breaking changes — the Friday–Saturday weekend default, out-of-range conversions throwing rather than returning a wrong date, attribute-based theming, and the compound parts taking a `CalendarDay`.
