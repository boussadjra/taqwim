# @taqwim/angular

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

- 0161cdd: Add Solid, Svelte 5 and Angular adapters, headless and themed.

  All six bind to the same `@taqwim/calendar-core` store as the Vue and React packages, so grid layout, selection, paging, keyboard navigation and the emitted `data-*` attributes are one implementation across five frameworks. The prop names match deliberately, and the Solid and Svelte test suites are near-identical files to the Vue and React ones.

  Svelte's compiler-level accessibility checks caught a gap shared by every date picker: `role="combobox"` is only complete when it points at the popup it controls. All four now set `aria-controls` and give the popover an id and a tab stop.

  The Angular package has no separate Vitest suite. Its build runs `ngc` with `strictTemplates`, and the shared Playwright suite verifies its rendered behavior. Angular is pinned to 21 rather than 22 because 22 requires TypeScript 6 and the rest of the workspace is on 5.9.

### Patch Changes

- Apply uncontrolled default values and the initial displayed month when an
  Angular component supplies its first bound inputs. The Angular playground now
  compiles and runs in the shared browser suite, including keyboard, date-picker,
  right-to-left and accessibility cases.
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
