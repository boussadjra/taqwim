---
title: Data attributes
description: The DOM contract every adapter emits, and the one every stylesheet targets.
---

This is the contract that makes the rest of the library work. Every adapter
emits exactly these attributes, which is why `@taqwim/themes` needs no
framework-specific CSS and why one Playwright spec can test all of them.

If you are writing your own styles, target these rather than class names.

## Root

`[data-taqwim-calendar]`

|                       |                                                       |
| --------------------- | ----------------------------------------------------- |
| `data-disabled`       | The whole calendar is disabled                        |
| `data-readonly`       | Days render but cannot be selected                    |
| `data-invalid`        | The current value falls outside `minValue`/`maxValue` |
| `data-show-gregorian` | Gregorian dates are visible in the grid               |
| `data-date-emphasis`  | `'hijri'` or `'gregorian'` when dual dates are shown  |
| `data-taqwim-theme`   | Set by the styled packages' `theme` prop              |
| `data-taqwim-size`    | Set by `size`, and absent at the default size         |

## Grid and structure

| Selector                           |                                      |
| ---------------------------------- | ------------------------------------ |
| `[data-taqwim-calendar-header]`    | The header group                     |
| `[data-taqwim-calendar-heading]`   | The month and year label             |
| `[data-taqwim-heading='month']`    | Styled packages: the month button    |
| `[data-taqwim-heading='year']`     | Styled packages: the year button     |
| `[data-taqwim-calendar-grid]`      | One per visible month                |
| `[data-taqwim-calendar-grid-head]` | The weekday label row, `aria-hidden` |
| `[data-taqwim-calendar-grid-body]` | The rows of days                     |
| `[data-taqwim-calendar-grid-row]`  | A week                               |
| `[data-taqwim-calendar-head-cell]` | A weekday label                      |
| `[data-taqwim-calendar-cell]`      | A gridcell                           |

## Day trigger

`[data-taqwim-calendar-cell-trigger]`

|                        |                                                |
| ---------------------- | ---------------------------------------------- |
| `data-value`           | `iYYYY-iMM-iDD`, the stable handle for a day   |
| `data-gregorian-value` | `YYYY-MM-DD` when `showGregorian` is enabled   |
| `data-selected`        | Part of the current selection                  |
| `data-today`           | The current Hijri day                          |
| `data-outside-month`   | Borrowed from an adjacent month                |
| `data-disabled`        | Out of range, or your `isDateDisabled` said so |
| `data-unavailable`     | Your `isDateUnavailable` said so               |
| `data-focused`         | The roving-focus target                        |

Styled dual-date cells use `data-primary` / `data-secondary` with
`data-calendar-system="hijri"` or `"gregorian"` on the inner spans.

Present attributes carry an empty string, so in CSS test for presence
(`[data-selected]`) and in JavaScript use `hasAttribute` — `getAttribute` returns
`''`, which is falsy and a common source of wrong conditionals.

## Paging buttons

Both carry `data-disabled` when paging further would leave the allowed range, and
an `aria-label` of `Previous page` or `Next page`. Prefer finding them by that
accessible name rather than by a test id — it checks the accessibility contract
at the same time.

## Date picker

| Selector                     |                                                              |
| ---------------------------- | ------------------------------------------------------------ |
| `.taqwim-datepicker`         | The wrapper, carrying `data-open` while the popover is shown |
| `.taqwim-datepicker-input`   | The `role="combobox"` input                                  |
| `.taqwim-datepicker-popover` | The `role="dialog"` panel                                    |
