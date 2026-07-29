---
'@taqwim/calendar-core': minor
'@taqwim/core': patch
---

Add `@taqwim/calendar-core`, the framework-agnostic calendar state machine.

Calendar behaviour — grid building, selection, paging, keyboard navigation and
accessibility attributes — now lives in one dependency-free package that every
framework adapter binds to, rather than being reimplemented per framework.

Building it closed a set of gaps in the existing Vue implementation, where
several documented props were threaded through props and context but never
actually applied:

- **`weekStartsOn`** had no effect; the grid and the weekday labels both
  hardcoded a Sunday start. Both now honour it.
- **`fixedWeeks`** was passed through context and never used. It now pads every
  month to six rows so the calendar's height does not shift.
- **`numberOfMonths`** only ever produced one month. The state now exposes one
  grid per month.
- **`minValue` / `maxValue`** gated only the previous/next buttons, leaving
  out-of-range days selectable, and `isInvalid` was hardcoded to `false`. They
  now disable the days themselves and drive `isInvalid`.
- **`isDateUnavailable`** was checked only in the cell's click handler, so
  keyboard and programmatic selection bypassed it. It is now enforced in
  `select`.
- **`initialFocus` and keyboard navigation** did not exist — the focus handler
  was a TODO and no arrow-key handling was implemented, so the calendar could
  not be operated without a mouse. Full roving-focus navigation is now
  implemented, mirrored for RTL.
- **`formatter`** was typed `any` with a TODO. It is now a typed,
  locale-bound `CalendarFormatter`.

`@taqwim/core`'s `getMonthAdjacentDays` gains an optional `weekStartsOn`
argument, reports the true day of the week for padded days, and no longer emits
a spurious extra week when a month ends exactly on the last column of the grid.
