---
'@taqwim/calendar-core': patch
'@taqwim/themes': patch
'@taqwim/vue': patch
'@taqwim/vue-styled': patch
'@taqwim/react': patch
'@taqwim/react-styled': patch
'@taqwim/svelte': patch
'@taqwim/svelte-styled': patch
'@taqwim/solid': patch
'@taqwim/solid-styled': patch
'@taqwim/angular': patch
'@taqwim/angular-styled': patch
---

Ship the licence text with every package.

Twelve of the thirteen declared `"license": "MIT"` and listed `LICENSE` in `files`, but only `@taqwim/core` actually had the file — so the rest were published without their licence.

Six packages had no README at all: Svelte, Solid and Angular, headless and themed. The documentation site pointed readers at those files as the per-adapter reference, so those links were dead.
