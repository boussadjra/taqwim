---
'@taqwim/calendar-core': minor
'@taqwim/vue': minor
'@taqwim/vue-styled': minor
---

Rebuild `@taqwim/vue` on `@taqwim/calendar-core`, and split the themed components into `@taqwim/vue-styled`.

`HijriCalendarRoot` is now a thin binding to the state machine, so every prop it advertises actually works. Previously `weekStartsOn`, `fixedWeeks`, `numberOfMonths` and `initialFocus` were threaded through context and ignored, `minValue`/`maxValue` gated only the paging buttons while leaving out-of-range days selectable, and there was no keyboard navigation at all.

The compound surface is unchanged in shape, but the pieces now take the decorated `CalendarDay` the grid produces rather than a bare date plus the month it belongs to. The root's default slot supplies `months` (one entry per `numberOfMonths`) instead of a single `grid`.

`@taqwim/vue-styled` holds `HijriCalendar` and the rebuilt `HijriDatePicker`. Theming moved to a `theme` prop that sets `data-taqwim-theme`, so switching is an attribute change rather than a stylesheet swap, and the month/year picker now renders inline and offers only the years the conversion table covers — it previously derived them from `new Date().getFullYear() + 579` and offered years the calendar cannot convert.

`vue` is no longer a runtime dependency of `@taqwim/vue`, only a peer, so consumers can no longer end up with two Vue copies and broken `provide`/`inject`.
