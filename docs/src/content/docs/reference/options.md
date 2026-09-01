---
title: Calendar options
description: Every option the state machine accepts, and what each one does.
---

These are `@taqwim/calendar-core`'s `CalendarOptions`. Every adapter exposes the
same names, differing only where the host framework forces it — `v-model` in Vue,
`value`/`onValueChange` in React, Solid and Svelte, `@Input`/`@Output` in Angular.

## Value

| Option            | Default |                                                                                             |
| ----------------- | ------- | ------------------------------------------------------------------------------------------- |
| `defaultValue`    | —       | Initial selection, uncontrolled                                                             |
| `value`           | —       | Controlled selection. When set, the store never mutates it; it asks through `onValueChange` |
| `onValueChange`   | —       | Called whenever the selection changes                                                       |
| `multiple`        | `false` | Allow several dates                                                                         |
| `preventDeselect` | `false` | Once something is selected, keep something selected                                         |

## Which month is shown

| Option                  | Default |                                                |
| ----------------------- | ------- | ---------------------------------------------- |
| `defaultPlaceholder`    | today   | Month to display when nothing is selected      |
| `placeholder`           | —       | Controlled equivalent                          |
| `onPlaceholderChange`   | —       | Called whenever the visible month changes      |
| `numberOfMonths`        | `1`     | How many months to render side by side         |
| `pagedNavigation`       | `false` | Page by `numberOfMonths` rather than one month |
| `nextPage` / `prevPage` | —       | Custom paging, e.g. a year at a time           |

## Calendar system

| Option           | Default            |                                                                                            |
| ---------------- | ------------------ | ------------------------------------------------------------------------------------------ |
| `calendarSystem` | `islamicUmmAlQura` | Strategy used for conversion, grid dates, navigation, validation and Gregorian equivalents |

Import Civil or TBLA from its explicit `@taqwim/core/calendars/*` subpath and
pass the strategy object. There is no string registry: the supported choices
are `islamicUmmAlQura`, `islamicCivil` and `islamicTbla`. See
[Hijri calendar systems](/guide/calendar-systems/) for the comparison, imports,
framework examples, range policy and persistence guidance.

## Grid shape

| Option          | Default            |                                                            |
| --------------- | ------------------ | ---------------------------------------------------------- |
| `weekStartsOn`  | `0`                | `0` is Sunday through `6` Saturday                         |
| `weekdayFormat` | `'weekDaysMedium'` | Also `'weekDaysShort'`, `'weekDaysLong'`                   |
| `fixedWeeks`    | `false`            | Always six rows, so the height never shifts between months |

## What can be picked

| Option                          | Default |                                                                       |
| ------------------------------- | ------- | --------------------------------------------------------------------- |
| `minValue` / `maxValue`         | —       | Bounds. Disables the days themselves, not just the paging buttons     |
| `isDateDisabled`                | —       | Your own predicate. Enforced for keyboard selection as well as clicks |
| `isDateUnavailable`             | —       | Rendered as struck through and refused, but still focusable           |
| `disableDaysOutsideCurrentView` | `false` | Block days borrowed from adjacent months                              |
| `disabled`                      | `false` | The whole calendar                                                    |
| `readonly`                      | `false` | Days render normally but nothing can be selected                      |

`isDateDisabled` and `isDateUnavailable` differ in intent: disabled means _not a
valid choice here_, unavailable means _a real day that happens to be taken_.
Both refuse selection; only the second stays in the tab order.

## Presentation

| Option            | Default           |                                                                                 |
| ----------------- | ----------------- | ------------------------------------------------------------------------------- |
| `locale`          | `'en'`            | `'en'`, `'ar'`, `'fr'`                                                          |
| `showGregorian`   | `false`           | Show the corresponding Gregorian date alongside Hijri dates in the grid         |
| `dateEmphasis`    | `'hijri'`         | `'hijri'` or `'gregorian'` — which date is visually primary when both are shown |
| `gregorianLocale` | `locale`          | Locale for Gregorian formatting (`Intl`, always `calendar: 'gregory'`)          |
| `dir`             | `'ltr'`           | `'rtl'` also mirrors the horizontal arrow keys                                  |
| `calendarLabel`   | the visible month | Accessible name for the calendar                                                |
| `initialFocus`    | `false`           | Focus the selection, else today, else the first of the month, on mount          |

Hijri remains the canonical value. `getSnapshot().gregorianValue` is derived
from the selection via `toGregorian` — single dates become a `Date`, multiple
selection becomes `Date[]`, and an empty selection is `undefined`.

Styled `HijriDatePicker` adds `inputDisplay` (`'hijri'`, `'gregorian'`, or
`'both'`) and `gregorianFormat` for the input field. These are independent of
`showGregorian`, which only affects the popup grid.

## Reading the store directly

`createCalendar(options)` returns a `CalendarStore`. Each adapter exposes it —
`useCalendar` in Vue and React, `createCalendarStore` in Solid,
`createCalendarState` in Svelte, `TaqwimCalendarService` in Angular — for cases
the components do not cover.

```ts
store.subscribe(listener) // returns an unsubscribe function
store.getSnapshot() // stable reference between changes
store.setOptions(partial)

store.select(date)
store.setPlaceholder(date)
store.nextPage()
store.prevPage()
store.focusDate(date)
store.focusInitial()
store.handleKeydown(event) // true if consumed

store.getRootProps()
store.getGridProps(month)
store.getCellTriggerProps(day)
store.getPrevButtonProps()
store.getNextButtonProps()
```

`getSnapshot` returns the same object until something observable changes. That
stability is load-bearing: React's `useSyncExternalStore` re-renders on every new
reference, and adapters push their props in on every render, so an unstable
snapshot would never stop rendering.
