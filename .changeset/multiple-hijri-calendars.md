---
'@taqwim/core': minor
'@taqwim/calendar-core': minor
'@taqwim/themes': minor
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
---

Add deterministic Civil and TBLA Hijri calendar systems while preserving Umm
al-Qura as the default everywhere.

- Import optional strategies from `@taqwim/core/calendars/islamic-civil` and
  `@taqwim/core/calendars/islamic-tbla`, then pass `{ calendarSystem }` to
  calendar-dependent core helpers.
- Pass the same additive `calendarSystem` option to calendar-core, every
  headless or styled framework calendar, and every styled date picker.
- Runtime calendar changes rebuild all derived calendar state without changing
  a controlled selection.

The optional algorithms use explicit subpath exports and remain outside an
Umm-al-Qura-only bundle. Existing calls and component markup require no changes.
