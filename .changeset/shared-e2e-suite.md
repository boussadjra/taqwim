---
'@taqwim/calendar-core': patch
'@taqwim/themes': patch
---

Fix three accessibility defects the shared end-to-end suite found.

`getCellTriggerProps` emitted `aria-selected`, which is not a valid attribute on `role="button"` — axe flagged it as critical. In a date grid the selected state belongs on the enclosing `role="gridcell"`, which every adapter's Cell part already sets, so it is simply gone from the trigger.

Two colour-contrast failures in the bundled themes. The default theme's muted foreground measured 2.53:1 against its surface, and adjacent days measured 1.67:1 because `core.css` faded them with `opacity: 0.6`. Muted foregrounds are now 4.83:1 on light surfaces and 5.3:1 on dark, and adjacent days are distinguished by colour alone. These are checked by axe on every run rather than left to taste.
