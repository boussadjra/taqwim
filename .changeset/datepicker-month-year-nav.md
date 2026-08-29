---
'@taqwim/themes': patch
'@taqwim/vue-styled': patch
'@taqwim/react-styled': patch
'@taqwim/svelte-styled': patch
'@taqwim/solid-styled': patch
'@taqwim/angular-styled': patch
---

Date picker month/year navigation is visible, and paging no longer closes the popover.

**Vue was forwarding `showNavigation` and `selectableHeading` as `false`.** Optional booleans on `HijriDatePicker` default to `false` unless `withDefaults` says otherwise, so the popover opened with no chevrons and a static heading. Those props now default to `true`, matching `HijriCalendar`.

**Prev/next stay open.** Paging unmounts the focused day cell, which fires `focusout` with no `relatedTarget`. Every adapter treated that as “click outside” and dismissed the popover. The popover now closes only when focus actually moves outside, or on a pointer down on the page. Solid registers that document listener inside `onMount`, so Astro can server-render the picker without touching `document`.

**Month and year are separate heading buttons.** The heading used to be one title that opened a month grid, with the year buried in a tab. It is now two labelled controls with a caret, so jumping by month or by year is as obvious as paging.
