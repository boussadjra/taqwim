# @taqwim/vue

## 1.0.0

### Major Changes

- bd3dd91: 1.0.0 — the `@taqwim` scope, in lockstep.

  Thirteen packages that only make sense together, so they version together: an adapter and the store it binds to must never be a version apart.

  The old unscoped packages remain available at their existing versions. Install the scoped packages to receive fixes. See the [migration guide](https://taqwim.vercel.app/guide/migration/) for the deliberate breaking changes — the Friday–Saturday weekend default, out-of-range conversions throwing rather than returning a wrong date, attribute-based theming, and the compound parts taking a `CalendarDay`.

### Minor Changes

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

- 2f8e131: Ship the licence text with every package.

  Twelve of the thirteen declared `"license": "MIT"` and listed `LICENSE` in `files`, but only `@taqwim/core` actually had the file — so the rest were published without their licence.

  Six packages had no README at all: Svelte, Solid and Angular, headless and themed. The documentation site pointed readers at those files as the per-adapter reference, so those links were dead.

- Updated dependencies
- Updated dependencies [2f8e131]
- Updated dependencies [b394aef]
- Updated dependencies
- Updated dependencies [e960ad1]
- Updated dependencies [685e457]
- Updated dependencies [f7f0b09]
- Updated dependencies [c7f7aa4]
- Updated dependencies [2bcb6f3]
- Updated dependencies [cd9d7c3]
- Updated dependencies [bd3dd91]
- Updated dependencies [2800a7c]
- Updated dependencies [81dfc28]
- Updated dependencies [424cb22]
- Updated dependencies [7ab50a8]
- Updated dependencies [0a82157]
- Updated dependencies [7ab50a8]
  - @taqwim/calendar-core@1.0.0
  - @taqwim/core@1.0.0
