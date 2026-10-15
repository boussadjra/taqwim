# @taqwim/core

## 1.0.0

### Major Changes

- 2bcb6f3: Rename `taqwim-core-utils` to `@taqwim/core`, and correct the date math.

  **Breaking changes**

  - **Package renamed.** Replace `taqwim-core-utils` with `@taqwim/core` in
    `package.json` and every import. The API is otherwise unchanged.
  - **Business days now default to a Friday/Saturday weekend** instead of the
    Monday–Friday working week inherited from `date-fns`. This matches the
    working week across most of the Arab world. `addHijriBusinessDays` and
    `subHijriBusinessDays` take an optional third argument to override it:
    `{ weekend: [6, 0] }` restores the previous Saturday/Sunday behaviour.
  - **Out-of-range dates now throw.** `toHijri` and `toGregorian` throw a
    `HijriRangeError` outside the Umm al-Qura table's coverage (1343–1500 AH /
    1924–2076 CE). They previously returned silently wrong values. The bounds are
    exported as `MIN_HIJRI_YEAR`, `MAX_HIJRI_YEAR`, `MIN_GREGORIAN_DATE` and
    `MAX_GREGORIAN_DATE`.
  - **`toGregorian` returns local midnight.** It previously built its result from
    `new Date()` and so inherited the current wall-clock time, meaning two calls
    with the same input returned different `Date` values.

  **Performance**

  `toHijri` used to scan the 159-row lookup table linearly, allocating a `Date`
  per row — twice, because it then called `getHijriYear`, which scanned again.
  It now binary-searches a precomputed epoch-day index with no allocation.
  Measured ~3000x faster; rendering one 42-cell calendar grid went from ~42ms of
  conversion to ~0.014ms. The same index removes the linear scans in
  `isValidHijriDate`, `getDaysLengthInMonth`, `toGregorian` and `getHijriYear`.

  **Other**

  - Removed `src/lib/utils.ts`, an unexported duplicate of `isValidHijriDate`.
  - `formatHijriDate` no longer rebuilds an intermediate `Date` on every token
    match within a single format call.

- bd3dd91: 1.0.0 — the `@taqwim` scope, in lockstep.

  Thirteen packages that only make sense together, so they version together: an adapter and the store it binds to must never be a version apart.

  The old unscoped packages remain available at their existing versions. Install the scoped packages to receive fixes. See the [migration guide](https://taqwim.vercel.app/guide/migration/) for the deliberate breaking changes — the Friday–Saturday weekend default, out-of-range conversions throwing rather than returning a wrong date, attribute-based theming, and the compound parts taking a `CalendarDay`.

### Minor Changes

- cd9d7c3: Add comprehensive CI/CD pipeline and development infrastructure

  - Add GitHub Actions workflows for CI, security scanning, and releases
  - Implement Changesets for better version management
  - Add issue templates and contributing guidelines
  - Enhance package configurations for better tree-shaking
  - Add bundle analysis and optimization
  - Improve TypeScript configuration and exports
  - Add test coverage reporting
  - Update documentation with comprehensive README

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

- 424cb22: `@taqwim/core` no longer depends on `date-fns`. Gregorian ISO parsing (`YYYY-MM-DD`), day/week arithmetic, and mixed Hijri/Gregorian formatting are implemented with small native helpers on top of Taqwim's existing epoch-day model. Umm al-Qura conversion semantics are unchanged.

  **Formatter tokens.** Documented Hijri tokens (`iYYYY`, `iMM`, `iMMM`, `iMMMM`, `iDD`, `iD`, `iE`, `iEEE`, `iEEEE`, …) and the mixed Gregorian tokens used in docs and tests (`yyyy`, `yy`, `y`, `MM`, `M`, `dd`, `d`, `MMM`, `MMMM`, `E`, `EEE`, `EEEE`) are preserved. Undocumented date-fns-only tokens (time-of-day, ordinals, quarters, week/year numbering variants, and similar) are no longer supported.

  ### Bundle impact

  Measured from production Vite consumer bundles (minified, same fixtures) before and after this change:

  | Import scenario                       | Before (gzip) | After (gzip) | Change |
  | ------------------------------------- | ------------: | -----------: | -----: |
  | Conversion (`toHijri`, `toGregorian`) |       4.09 kB |      2.92 kB | −28.5% |
  | Arithmetic                            |       4.34 kB |      2.84 kB | −34.5% |
  | Formatter                             |      13.20 kB |      4.24 kB | −67.9% |
  | Representative core                   |      15.35 kB |      5.47 kB | −64.4% |

  Minified formatter bundle: 46.91 kB → 12.39 kB (−73.6%). Brotli formatter bundle: 10.87 kB → 3.22 kB (−70.4%).

  Published tarball: ~52 kB before → 48 kB after (date-fns was never shipped inside the package, but the built JS is smaller).

  Production dependencies: **before** 1 (`date-fns@^4.1.0`); **after** 0.

### Patch Changes

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

- Keep adjacent dates and custom paging inside the selected calendar system's supported range. Preserve Gregorian years 0–99 when finding today's Hijri date, accept partial duration objects in the public types, and validate unchanged dates in arithmetic calls.

  Date pickers now let users type without losing input focus. ArrowDown or a custom trigger moves focus into the calendar; keyboard selection and Escape restore the input or trigger. Svelte keeps accessibility attributes synchronized when options change and renders the initial selected input text during server rendering.

  Calendar component types allow Hijri selections and placeholders alongside native DOM attributes without conflicting with their text values. Solid custom triggers stay mounted while their open state and selected date update, so keyboard dismissal and selection restore focus.

  Disabled calendars also prevent month and year heading controls from changing the displayed page.

  Calendar tooltips no longer create horizontal page overflow while hidden. Visible labels wrap within their week row, including its outer columns in left-to-right and right-to-left calendars.

- e960ad1: Test `@taqwim/core` on Deno and Bun, not just Node.

  The package has always been portable — no DOM, nothing from `node:`, one
  dependency — but that was an assertion about the source rather than an
  observation about the published artifact. Vitest runs `src/` under Node and
  nothing else, so nothing in the repo had ever loaded `dist/` anywhere else.

  There is now a conformance suite that does. One checks file runs unchanged
  across a matrix of **runtime × module format × time zone**:

  |             | ESM | CommonJS |
  | ----------- | --- | -------- |
  | **Node** 22 | ✓   | ✓        |
  | **Deno** 2  | ✓   | —        |
  | **Bun** 1   | ✓   | ✓        |

  Deno has no CommonJS row because a Deno consumer resolves the `import`
  condition; there is no CommonJS path there to test.

  Every cell runs under `UTC`, `Asia/Riyadh` and `America/Los_Angeles`. That axis
  is not padding: this library works in local calendar parts on purpose, so an
  off-by-one that only shows up west of UTC is easy to write and runtimes ship
  different tzdata builds.

  Beyond the arithmetic, the checks cover the failures that live between the
  source and the artifact — the full export list per module format, since the
  ESM and CommonJS bundles are emitted separately and one can lose an export;
  `instanceof HijriRangeError` surviving the module boundary; `date-fns/locale`
  resolving, being the one deep import through another package's export map; and
  all ~56,000 days the Umm al-Qura table covers, round-tripped in every cell.

  Nothing about the published API changed. `bun add @taqwim/core` and
  `deno add npm:@taqwim/core` already worked — they are now covered by CI, and
  documented.

- c7f7aa4: Reject fractional Hijri fields and impossible Gregorian dates consistently, preserve Gregorian years 0–99 during conversion, and reject non-finite business-day amounts before they can hang the caller.

  Keep a keyboard tab stop after paging or changing date availability, allow selection in every displayed month, support paging across year zero with tabular calendars, and stop multi-month views at the end of the Umm al-Qura table.

  Manual date-picker input now respects date bounds, disabled and unavailable dates, read-only state, and `preventDeselect`. Gregorian dates outside the active calendar's range revert as invalid input. Controlled selections that become invalid after a calendar-system change no longer crash picker formatting.

  Multiple Vue date pickers now use distinct popup IDs so each input identifies its own dialog.
