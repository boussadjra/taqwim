---
'@taqwim/solid': patch
'@taqwim/solid-styled': patch
---

Fix selecting a date by mouse in the Solid adapter.

Clicking a day cell did nothing in a real browser. `HijriCalendarGrid` built its
children from an expression that read the store snapshot, so Solid discarded and
rebuilt the whole grid on every state change. A browser focuses a button before
it clicks it, that focus is a state change, and Solid delegates `click` to the
document — so the click was dispatched at a button that had already been
replaced, and never reached a live handler. Keyboard selection was unaffected,
which is why this looked like a styling problem rather than a broken adapter.

The render-prop argument is now passed as an accessor and only read when a
caller actually passed a function, so a plain JSX subtree is created once and
updated in place by the bindings inside it. No API change: `children` still
accepts either JSX or a function, and the function still receives a value.

The four end-to-end specs this was failing now pass, and Solid clears all
twenty-eight — the same suite, unchanged, that the other adapters run.
