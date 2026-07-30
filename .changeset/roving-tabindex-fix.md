---
'@taqwim/calendar-core': patch
---

Keep exactly one calendar cell reachable with Tab.

The roving tabindex was tied to `isFocused`, which is undefined until the calendar is focused — so on first render every cell was `tabindex="-1"` and a keyboard user could not enter the grid at all. `CalendarDay` now carries `isTabbable`, resolved as focused date → selected → today → first selectable day of the visible month, skipping disabled days so bounded months stay reachable.
