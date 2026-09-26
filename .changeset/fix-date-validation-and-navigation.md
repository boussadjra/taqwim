---
'@taqwim/core': patch
'@taqwim/calendar-core': patch
'@taqwim/vue-styled': patch
'@taqwim/react-styled': patch
'@taqwim/svelte-styled': patch
'@taqwim/solid-styled': patch
'@taqwim/angular-styled': patch
---

Reject fractional Hijri fields and impossible Gregorian dates consistently, preserve Gregorian years 0–99 during conversion, and reject non-finite business-day amounts before they can hang the caller.

Keep a keyboard tab stop after paging or changing date availability, allow selection in every displayed month, support paging across year zero with tabular calendars, and stop multi-month views at the end of the Umm al-Qura table.

Manual date-picker input now respects date bounds, disabled and unavailable dates, read-only state, and `preventDeselect`. Gregorian dates outside the active calendar's range revert as invalid input. Controlled selections that become invalid after a calendar-system change no longer crash picker formatting.

Multiple Vue date pickers now use distinct popup IDs so each input identifies its own dialog.
