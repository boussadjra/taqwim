---
'@taqwim/react': minor
'@taqwim/react-styled': minor
'@taqwim/calendar-core': patch
---

Add React adapters: `@taqwim/react` (headless) and `@taqwim/react-styled` (themed).

Both bind to the same `@taqwim/calendar-core` store as the Vue packages, so grid layout, selection, paging, keyboard navigation and the emitted `data-*` attributes are one implementation rather than two. The prop names match the Vue adapter deliberately; the two test suites are near-identical files, which is what keeps parity honest.

Porting to a second framework exposed a defect in the store. `notify()` invalidated the snapshot unconditionally, so any adapter that pushes props in on every render — which is the normal React pattern — looped forever: push options, notify, re-render, push options. `notify()` now compares the newly built state against the previous one and keeps the old reference when nothing observable changed. Comparing built state rather than incoming options is what makes it safe with inline callbacks: a consumer's `isDateDisabled` gets a new identity every render, but only a change in what it _returns_ counts as a change.
