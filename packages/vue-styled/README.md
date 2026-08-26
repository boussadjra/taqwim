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
  <HijriCalendar v-model="date" theme="islamic" locale="ar" dir="rtl" />
  <HijriDatePicker v-model="date" />
</template>
```

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

|                     |                                                      |
| ------------------- | ---------------------------------------------------- |
| `theme`             | Bundled theme name. Default `'default'`              |
| `size`              | `'compact' \| 'default' \| 'large'`                  |
| `showNavigation`    | Previous/next buttons. Default `true`                |
| `showWeekdays`      | Weekday label row. Default `true`                    |
| `selectableHeading` | Heading opens month and year pickers. Default `true` |
| `navigationIcons`   | `{ prev?, next? }` components replacing the chevrons |

Slots: `header`, `prev-button`, `next-button`, `weekday`, `cell`.

`HijriDatePicker` adds `format` (default `'iYYYY-iMM-iDD'`), `inputPlaceholder`, `label`, `editable`, and a `trigger` slot. It accepts typed dates in `iYYYY-MM-DD` or `DD-MM-iYYYY`, with `/` or `-`; unparseable text reverts rather than clearing the selection.

## License

MIT
