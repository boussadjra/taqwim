---
title: Migrating to 1.0
description: What changed between taqwim-core-utils / taqwim-vue and the @taqwim scope, and why.
---

1.0 renames every package into the `@taqwim` scope and makes several deliberate
breaking changes. The old names get one final release that re-exports the new
ones and is then deprecated, so nothing breaks the moment you update — but they
will not receive fixes.

| Before              | After                                                      |
| ------------------- | ---------------------------------------------------------- |
| `taqwim-core-utils` | `@taqwim/core`                                             |
| `taqwim-vue`        | `@taqwim/vue` (headless) and `@taqwim/vue-styled` (themed) |

## The weekend is now Friday and Saturday

`addHijriBusinessDays` and `subHijriBusinessDays` used to delegate to date-fns,
which skips Saturday and Sunday. For a Hijri calendar that is the wrong default:
most of the Muslim world rests on Friday and Saturday.

```ts
// Before: skipped Sat/Sun.
addHijriBusinessDays(date, 5)

// Now: skips Fri/Sat.
addHijriBusinessDays(date, 5)

// Either convention, explicitly:
addHijriBusinessDays(date, 5, { weekend: [0, 6] }) // Sunday and Saturday
```

`weekend` takes day numbers where `0` is Sunday. It rejects a value outside
0–6, and rejects all seven days — there would be no business day to land on.

## Out-of-range dates throw

`hDatesTable` covers 1343–1500 AH (1924–2077 CE). Outside it, `toHijri` and
`toGregorian` used to return a silently wrong result. They now throw
`HijriRangeError`, which extends `RangeError`.

```ts
import { HijriRangeError, MAX_HIJRI_YEAR, MIN_HIJRI_YEAR, toHijri } from '@taqwim/core'

try {
  toHijri(new Date('1850-01-01'))
} catch (error) {
  if (error instanceof HijriRangeError) {
    // error.message names the supported range
  }
}
```

If you were relying on the old behaviour, guard with `MIN_HIJRI_YEAR` and
`MAX_HIJRI_YEAR` before converting.

## `toGregorian` returns local midnight

It used to inherit the wall-clock time from `new Date()`, so the same Hijri date
converted to a different `Date` depending on when you called it. It now always
returns local midnight.

## Themes are an attribute, not an import

Theme selection used to mean importing a different stylesheet. It is now an
attribute, so a page can host several themes at once and switch at runtime.

```diff
- import 'taqwim-vue/hijri-calendar-islamic.css'
+ import '@taqwim/themes'
```

```diff
- <HijriCalendar class="hijri-calendar-islamic" />
+ <HijriCalendar theme="islamic" />
```

Custom properties were renamed from `--hijri-calendar-*` to `--hc-*`. If you
overrode any, rename the prefix — the token names after it are unchanged.
See [Theming](/taqwim/guide/theming/).

## Props that used to do nothing now work

`HijriCalendarRoot` accepted these and ignored them. If you passed them
expecting no effect, expect an effect now:

- `weekStartsOn` — the grid and the weekday labels both hardcoded Sunday
- `fixedWeeks` — was threaded through context and never applied
- `numberOfMonths` — only one month was ever built
- `initialFocus` — resolved to a `// TODO`
- `minValue` / `maxValue` — gated only the paging buttons; out-of-range days
  stayed selectable
- `isDateUnavailable` — guarded the click handler but not the selection itself

There is also full keyboard navigation, which did not exist at all. See
[Accessibility and keyboard](/taqwim/guide/accessibility/).

## The compound parts take a day, not a date

The pieces now receive the decorated `CalendarDay` the grid produces, which
already carries its state, instead of a bare date plus the month it belongs to.

```diff
- <HijriCalendarCellTrigger :day="day.date" :month="date" />
+ <HijriCalendarCellTrigger :day="day" />
```

The root's default slot supplies `months` — one entry per `numberOfMonths` —
rather than a single `grid`.

## `vue` is a peer dependency only

`taqwim-vue` listed `vue` in both `dependencies` and `peerDependencies`, which
could leave an application with two copies of Vue and a broken `provide`/
`inject` chain. `@taqwim/vue` declares it as a peer dependency only.
