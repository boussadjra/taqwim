# @taqwim/calendar-core

## 1.0.0

### Major Changes

- bd3dd91: 1.0.0 — the `@taqwim` scope, in lockstep.

  Thirteen packages that only make sense together, so they version together: an adapter and the store it binds to must never be a version apart.

  The old unscoped packages remain available at their existing versions. Install the scoped packages to receive fixes. See the [migration guide](https://taqwim.vercel.app/guide/migration/) for the deliberate breaking changes — the Friday–Saturday weekend default, out-of-range conversions throwing rather than returning a wrong date, attribute-based theming, and the compound parts taking a `CalendarDay`.

### Minor Changes

- b394aef: Add `@taqwim/calendar-core`, the framework-agnostic calendar state machine.

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

- 685e457: Add themed hover and focus tooltips on calendar day cells.

  - `getCellProps()` and `getCellTooltip()` expose the full date label on each gridcell
  - Headless adapters bind `data-tooltip` and a native `title` fallback on every day cell
  - `@taqwim/themes` renders the label in a tooltip above the cell on hover and focus

- f7f0b09: Add optional dual Hijri/Gregorian date presentation while keeping Hijri as the canonical calendar value.

  - `showGregorian` displays the corresponding Gregorian date in calendar cells, with configurable `dateEmphasis` (`hijri` or `gregorian`)
  - `gregorianLocale` controls Gregorian formatting independently from the Hijri `locale`
  - Headless adapters expose derived `gregorianValue` alongside the existing Hijri selection
  - `HijriDatePicker` adds `inputDisplay` (`hijri`, `gregorian`, or `both`) and `gregorianFormat` for the input field, independent of the popup grid
  - Custom trigger APIs expose explicit `hijriValue` and `gregorianValue` strings

  Existing consumers see no change until the new props are used.

- 2800a7c: Add deterministic Civil and TBLA Hijri calendar systems while preserving Umm
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

- 7ab50a8: Rebuild `@taqwim/vue` on `@taqwim/calendar-core`, and split the themed components into `@taqwim/vue-styled`.

  `HijriCalendarRoot` is now a thin binding to the state machine, so every prop it advertises actually works. Previously `weekStartsOn`, `fixedWeeks`, `numberOfMonths` and `initialFocus` were threaded through context and ignored, `minValue`/`maxValue` gated only the paging buttons while leaving out-of-range days selectable, and there was no keyboard navigation at all.

  The compound surface is unchanged in shape, but the pieces now take the decorated `CalendarDay` the grid produces rather than a bare date plus the month it belongs to. The root's default slot supplies `months` (one entry per `numberOfMonths`) instead of a single `grid`.

  `@taqwim/vue-styled` holds `HijriCalendar` and the rebuilt `HijriDatePicker`. Theming moved to a `theme` prop that sets `data-taqwim-theme`, so switching is an attribute change rather than a stylesheet swap, and the month/year picker now renders inline and offers only the years the conversion table covers — it previously derived them from `new Date().getFullYear() + 579` and offered years the calendar cannot convert.

  `vue` is no longer a runtime dependency of `@taqwim/vue`, only a peer, so consumers can no longer end up with two Vue copies and broken `provide`/`inject`.

### Patch Changes

- Apply uncontrolled default values and the initial displayed month when an
  Angular component supplies its first bound inputs. The Angular playground now
  compiles and runs in the shared browser suite, including keyboard, date-picker,
  right-to-left and accessibility cases.
- 2f8e131: Ship the licence text with every package.

  Twelve of the thirteen declared `"license": "MIT"` and listed `LICENSE` in `files`, but only `@taqwim/core` actually had the file — so the rest were published without their licence.

  Six packages had no README at all: Svelte, Solid and Angular, headless and themed. The documentation site pointed readers at those files as the per-adapter reference, so those links were dead.

- Keep adjacent dates and custom paging inside the selected calendar system's supported range. Preserve Gregorian years 0–99 when finding today's Hijri date, accept partial duration objects in the public types, and validate unchanged dates in arithmetic calls.

  Date pickers now let users type without losing input focus. ArrowDown or a custom trigger moves focus into the calendar; keyboard selection and Escape restore the input or trigger. Svelte keeps accessibility attributes synchronized when options change and renders the initial selected input text during server rendering.

  Calendar component types allow Hijri selections and placeholders alongside native DOM attributes without conflicting with their text values. Solid custom triggers stay mounted while their open state and selected date update, so keyboard dismissal and selection restore focus.

  Disabled calendars also prevent month and year heading controls from changing the displayed page.

  Calendar tooltips no longer create horizontal page overflow while hidden. Visible labels wrap within their week row, including its outer columns in left-to-right and right-to-left calendars.

- c7f7aa4: Reject fractional Hijri fields and impossible Gregorian dates consistently, preserve Gregorian years 0–99 during conversion, and reject non-finite business-day amounts before they can hang the caller.

  Keep a keyboard tab stop after paging or changing date availability, allow selection in every displayed month, support paging across year zero with tabular calendars, and stop multi-month views at the end of the Umm al-Qura table.

  Manual date-picker input now respects date bounds, disabled and unavailable dates, read-only state, and `preventDeselect`. Gregorian dates outside the active calendar's range revert as invalid input. Controlled selections that become invalid after a calendar-system change no longer crash picker formatting.

  Multiple Vue date pickers now use distinct popup IDs so each input identifies its own dialog.

- 81dfc28: Add React adapters: `@taqwim/react` (headless) and `@taqwim/react-styled` (themed).

  Both bind to the same `@taqwim/calendar-core` store as the Vue packages, so grid layout, selection, paging, keyboard navigation and the emitted `data-*` attributes are one implementation rather than two. The prop names match the Vue adapter deliberately; the two test suites are near-identical files, which is what keeps parity honest.

  Porting to a second framework exposed a defect in the store. `notify()` invalidated the snapshot unconditionally, so any adapter that pushes props in on every render — which is the normal React pattern — looped forever: push options, notify, re-render, push options. `notify()` now compares the newly built state against the previous one and keeps the old reference when nothing observable changed. Comparing built state rather than incoming options is what makes it safe with inline callbacks: a consumer's `isDateDisabled` gets a new identity every render, but only a change in what it _returns_ counts as a change.

- 7ab50a8: Keep exactly one calendar cell reachable with Tab.

  The roving tabindex was tied to `isFocused`, which is undefined until the calendar is focused — so on first render every cell was `tabindex="-1"` and a keyboard user could not enter the grid at all. `CalendarDay` now carries `isTabbable`, resolved as focused date → selected → today → first selectable day of the visible month, skipping disabled days so bounded months stay reachable.

- 0a82157: Fix three accessibility defects the shared end-to-end suite found.

  `getCellTriggerProps` emitted `aria-selected`, which is not a valid attribute on `role="button"` — axe flagged it as critical. In a date grid the selected state belongs on the enclosing `role="gridcell"`, which every adapter's Cell part already sets, so it is simply gone from the trigger.

  Two colour-contrast failures in the bundled themes. The default theme's muted foreground measured 2.53:1 against its surface, and adjacent days measured 1.67:1 because `core.css` faded them with `opacity: 0.6`. Muted foregrounds are now 4.83:1 on light surfaces and 5.3:1 on dark, and adjacent days are distinguished by colour alone. These are checked by axe on every run rather than left to taste.

- Updated dependencies [b394aef]
- Updated dependencies
- Updated dependencies [e960ad1]
- Updated dependencies [c7f7aa4]
- Updated dependencies [2bcb6f3]
- Updated dependencies [cd9d7c3]
- Updated dependencies [bd3dd91]
- Updated dependencies [2800a7c]
- Updated dependencies [424cb22]
  - @taqwim/core@1.0.0
