# @taqwim/vue-styled

A Hijri calendar and date picker for Vue 3 that already looks like one.

Built on [`@taqwim/vue`](../vue) (behaviour) and [`@taqwim/themes`](../themes) (appearance). If you want to build your own markup, use the headless package directly — everything here is composed from its public parts.

## Install

```sh
pnpm add @taqwim/vue-styled
```

## Use

```vue
<script setup lang="ts">
import { HijriCalendar, HijriDatePicker } from '@taqwim/vue-styled'
import { ref } from 'vue'

const date = ref()
</script>

<template>
  <HijriCalendar v-model="date" show-gregorian theme="islamic" locale="ar" dir="rtl" />
  <HijriDatePicker v-model="date" input-display="both" />
</template>
```

### Dual Hijri/Gregorian presentation

Hijri remains the canonical value (`v-model` is always a `HijriDateObject`). Gregorian dates are derived for display:

```vue
<!-- Hijri-primary dual calendar -->
<HijriCalendar v-model="date" show-gregorian />

<!-- Gregorian-primary presentation (navigation stays Hijri-based) -->
<HijriCalendar v-model="date" show-gregorian date-emphasis="gregorian" />

<!-- Different locales for each calendar -->
<HijriCalendar v-model="date" show-gregorian locale="ar" gregorian-locale="en" dir="rtl" />
```

`showGregorian` controls the popup/grid. `inputDisplay` on `HijriDatePicker` controls the input independently:

```vue
<HijriDatePicker v-model="date" show-gregorian input-display="gregorian" />
<HijriDatePicker v-model="date" input-display="both" />
```

Headless consumers get `gregorianValue` from `HijriCalendarRoot`'s default slot alongside `modelValue`.

The stylesheet is imported for you.

## Theming

`theme` sets `data-taqwim-theme` on the calendar, so switching is an attribute change — no stylesheet swapping, and several themes can coexist on one page.

**Neutral** `default` · `dark` · `slate` · `stone` · `zinc` · `minimal` · `minimalist` · `material`

**Brand** `rose` · `violet` · `emerald` · `amber` · `indigo` · `teal` · `crimson` · `modern` · `ocean` · `sunset` · `nature` · `neon` · `cyberpunk` · `luxurious`

**Hijri & regional** `islamic` · `ramadan` · `eid` · `masjid` · `madinah` · `andalus` · `sahara` · `mihrab` · `zellige` · `qamar` · `najd`

`size` is orthogonal: `compact`, `default`, `large`.

To restyle rather than re-theme, override the tokens — see [`@taqwim/themes`](../themes).

## Props

Everything [`@taqwim/vue`](../vue)'s `HijriCalendarRoot` accepts, plus:

|                     |                                                                              |
| ------------------- | ---------------------------------------------------------------------------- |
| `theme`             | Bundled theme name. Default `'default'`                                      |
| `size`              | `'compact' \| 'default' \| 'large'`                                          |
| `showNavigation`    | Previous/next buttons. Default `true`                                        |
| `showWeekdays`      | Weekday label row. Default `true`                                            |
| `selectableHeading` | Month and year heading buttons that open their pickers. Default `true`       |
| `navigationIcons`   | `{ prev?, next? }` components replacing the chevrons                         |
| `showGregorian`     | Show corresponding Gregorian dates in cells. Default `false`                 |
| `dateEmphasis`      | `'hijri' \| 'gregorian'` — which date is visually primary. Default `'hijri'` |
| `gregorianLocale`   | Locale for Gregorian formatting. Defaults to `locale`                        |

Slots: `header`, `prev-button`, `next-button`, `weekday`, `cell`.

`HijriDatePicker` adds `format` (Hijri pattern, default `'iYYYY-iMM-iDD'`), `gregorianFormat` (`Intl.DateTimeFormatOptions`, default ISO-like `YYYY-MM-DD`), `inputDisplay` (`'hijri' \| 'gregorian' \| 'both'`, default `'hijri'`), `inputPlaceholder`, `label`, `editable`, and a `trigger` slot exposing `value`, `hijriValue`, and `gregorianValue`. Manual entry accepts Hijri numeric `YYYY-MM-DD` / `DD-MM-YYYY` (or Gregorian when `inputDisplay="gregorian"`); `both` shows both values but edits the Hijri representation; unparseable text reverts rather than clearing the selection.

## License

MIT
