# @taqwim/themes

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

- be8584c: Add `@taqwim/themes`: framework-free CSS for Taqwim calendars, plus a Tailwind preset.

  Themes are now selected with `data-taqwim-theme="islamic"` on any ancestor instead of by importing a different stylesheet, so a page can host several themes at once and switch at runtime.

  Structure is written once in `core.css` against the `data-*` attributes `@taqwim/calendar-core` emits, so the same stylesheet serves every framework adapter. Each of the thirteen themes is now ~30 token overrides rather than a duplicated copy of the structural rules — the pre-1.0 stylesheets repeated every layout rule per theme, which is how `variables.css` and `hijri-calendar-islamic.css` came to disagree on what "islamic" looked like, with load order deciding.

  The Tailwind preset is generated from `variables.css` at build time rather than hand-maintained, and both v3-style JS presets and a v4 `@theme` block are shipped. Tests assert the contract holds: `core.css` may contain no literal colour, and no theme may declare a token `variables.css` does not define.

  Tokens are namespaced `--hc-*`, renamed from `--hijri-calendar-*`.

- 898d50f: Twenty new themes, and every bundled theme now meets WCAG AA.

  **Several existing themes changed appearance.** The docs claimed the bundled themes met AA and that axe verified it on every run; neither half was true. axe only ever ran against `default`, and a measurement of all thirteen found **72 text-on-surface pairs below 4.5:1 across eleven of them** — as low as 1.03:1, which is not readable.

  `sunset` was the worst: white text on a mid-tone orange gradient fails every pair it has, and no token tweak fixes it. It is now dark text on the same warm gradient, which keeps the theme recognisable. `modern`, `nature`, `ocean`, `islamic` and `cyberpunk` have darker surfaces so their light text carries. `dark`, `default`, `material`, `minimalist` and `luxurious` changed individual tokens only. If you depended on the exact previous colours, copy the old file into your own `[data-taqwim-theme='…']` block.

  Two `:root` tokens changed, so a calendar with no theme attribute is affected too: `--hc-unavailable` (`#ef4444` → `#dc2626`, was 3.76:1 on white) and `--hc-secondary-foreground` (`#6b7280` → `#4b5563`, was 4.39:1 on a nav button).

  **The gate that keeps it true.** `packages/themes` now measures contrast on every test run: it resolves each pair `core.css` produces, follows `var()` chains, composites translucent layers bottom-up, and samples along gradients rather than only at their stops — a midpoint is often worse than either end. `minimal` is exempt by name, with a reason, because it inherits the host page's surface on purpose; any value that cannot be resolved statically in any other theme is a failure, not a skip.

  **Twenty new presets**, all passing that gate on the first run. Ten neutral and brand palettes for ordinary product UI, which is what the catalogue lacked — `slate`, `stone`, `zinc`, `rose`, `violet`, `emerald`, `amber`, `indigo`, `teal`, `crimson` — and ten Hijri and regional ones: `ramadan`, `eid`, `masjid`, `madinah`, `andalus`, `sahara`, `mihrab`, `zellige`, `qamar`, `najd`. They are deliberately flat rather than gradient: every failure measured above traced to a gradient surface or a translucent foreground over one.

  **Adding a theme is now one CSS file.** The theme-name union is generated from the stylesheets and exported as `@taqwim/themes/names`; the five styled packages import it instead of each maintaining an identical hand-written list. `HijriCalendarTheme` keeps its name and meaning in every package, so no import changes for consumers — it simply now includes the new presets.

### Patch Changes

- 2f8e131: Ship the licence text with every package.

  Twelve of the thirteen declared `"license": "MIT"` and listed `LICENSE` in `files`, but only `@taqwim/core` actually had the file — so the rest were published without their licence.

  Six packages had no README at all: Svelte, Solid and Angular, headless and themed. The documentation site pointed readers at those files as the per-adapter reference, so those links were dead.

- Keep adjacent dates and custom paging inside the selected calendar system's supported range. Preserve Gregorian years 0–99 when finding today's Hijri date, accept partial duration objects in the public types, and validate unchanged dates in arithmetic calls.

  Date pickers now let users type without losing input focus. ArrowDown or a custom trigger moves focus into the calendar; keyboard selection and Escape restore the input or trigger. Svelte keeps accessibility attributes synchronized when options change and renders the initial selected input text during server rendering.

  Calendar component types allow Hijri selections and placeholders alongside native DOM attributes without conflicting with their text values. Solid custom triggers stay mounted while their open state and selected date update, so keyboard dismissal and selection restore focus.

  Disabled calendars also prevent month and year heading controls from changing the displayed page.

  Calendar tooltips no longer create horizontal page overflow while hidden. Visible labels wrap within their week row, including its outer columns in left-to-right and right-to-left calendars.

- 3ff5603: Date picker month/year navigation is visible, and paging no longer closes the popover.

  **Vue was forwarding `showNavigation` and `selectableHeading` as `false`.** Optional booleans on `HijriDatePicker` default to `false` unless `withDefaults` says otherwise, so the popover opened with no chevrons and a static heading. Those props now default to `true`, matching `HijriCalendar`.

  **Prev/next stay open.** Paging unmounts the focused day cell, which fires `focusout` with no `relatedTarget`. Every adapter treated that as “click outside” and dismissed the popover. The popover now closes only when focus actually moves outside, or on a pointer down on the page. Solid registers that document listener inside `onMount`, so Astro can server-render the picker without touching `document`.

  **Month and year are separate heading buttons.** The heading used to be one title that opened a month grid, with the year buried in a tab. It is now two labelled controls with a caret, so jumping by month or by year is as obvious as paging.

- a0db2f0: `HijriDatePicker` is single-select in Vue too, and its popover is no longer squeezed.

  **Vue's picker no longer accepts `multiple`.** React, Svelte and Solid already omitted it — the input holds one formatted date and the value is one `HijriDateObject`, so a multi-select calendar has nowhere to put the rest of the selection. Vue accepted the prop and kept only `value[0]`, which meant picking a second date silently kept the first and the popup stayed open with no way to finish. `HijriDatePickerProps` is now `Omit<HijriCalendarProps, 'multiple'>` in all four, so the same code ports between them.

  If you were passing `multiple` to Vue's `HijriDatePicker`, it was not doing what it looked like it was doing. Use `HijriCalendar` with `multiple` for a multi-select calendar; the picker stays single-select.

  **The popover renders at its natural width.** `.taqwim-datepicker-popover` is absolutely positioned inside `.taqwim-datepicker`, which is only as wide as the input, so it shrink-to-fit against that instead of against the calendar it contains — the grid came out compressed and the month heading wrapped onto two lines. It now sets `width: max-content`. This affects every framework's date picker.

- 0a82157: Fix three accessibility defects the shared end-to-end suite found.

  `getCellTriggerProps` emitted `aria-selected`, which is not a valid attribute on `role="button"` — axe flagged it as critical. In a date grid the selected state belongs on the enclosing `role="gridcell"`, which every adapter's Cell part already sets, so it is simply gone from the trigger.

  Two colour-contrast failures in the bundled themes. The default theme's muted foreground measured 2.53:1 against its surface, and adjacent days measured 1.67:1 because `core.css` faded them with `opacity: 0.6`. Muted foregrounds are now 4.83:1 on light surfaces and 5.3:1 on dark, and adjacent days are distinguished by colour alone. These are checked by axe on every run rather than left to taste.
