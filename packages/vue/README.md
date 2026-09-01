# @taqwim/vue

Headless Vue 3 components for Hijri calendars. No styles, no markup opinions — just behaviour, accessibility and the `data-*` attributes to hang a design on.

Want something that already looks like a calendar? Use [`@taqwim/vue-styled`](../vue-styled).

## Install

```sh
pnpm add @taqwim/vue
```

## Use

```vue
<script setup lang="ts">
import {
  HijriCalendarCell,
  HijriCalendarCellTrigger,
  HijriCalendarGrid,
  HijriCalendarGridBody,
  HijriCalendarGridHead,
  HijriCalendarGridRow,
  HijriCalendarHeadCell,
  HijriCalendarHeader,
  HijriCalendarHeading,
  HijriCalendarNext,
  HijriCalendarPrev,
  HijriCalendarRoot,
} from '@taqwim/vue'
import { ref } from 'vue'

const value = ref()
</script>

<template>
  <HijriCalendarRoot v-model="value" initial-focus v-slot="{ months, weekDays }">
    <HijriCalendarHeader>
      <HijriCalendarPrev>←</HijriCalendarPrev>
      <HijriCalendarHeading />
      <HijriCalendarNext>→</HijriCalendarNext>
    </HijriCalendarHeader>

    <HijriCalendarGrid v-for="month in months" :key="month.label" :month="month">
      <HijriCalendarGridHead>
        <HijriCalendarGridRow>
          <HijriCalendarHeadCell v-for="day in weekDays" :key="day">{{ day }}</HijriCalendarHeadCell>
        </HijriCalendarGridRow>
      </HijriCalendarGridHead>

      <HijriCalendarGridBody>
        <HijriCalendarGridRow v-for="(week, i) in month.weeks" :key="i">
          <HijriCalendarCell v-for="day in week" :key="day.date.hd" :day="day">
            <HijriCalendarCellTrigger :day="day" />
          </HijriCalendarCell>
        </HijriCalendarGridRow>
      </HijriCalendarGridBody>
    </HijriCalendarGrid>
  </HijriCalendarRoot>
</template>
```

## How it works

All behaviour lives in [`@taqwim/calendar-core`](../calendar-core), a framework-free state machine. `HijriCalendarRoot` creates a store, mirrors its snapshot into a `shallowRef`, and provides both through `provide`/`inject`. Every part spreads attributes the store computed.

That is why the React, Svelte, Solid and Angular adapters behave identically: there is one implementation of grid layout, selection, paging and keyboard navigation, and one set of emitted attributes.

Drop to the store directly with `useCalendar`:

```ts
import { useCalendar } from '@taqwim/vue'

const { store, state } = useCalendar(() => ({ locale: 'ar', dir: 'rtl' }))
```

## Props

`HijriCalendarRoot` accepts:

|                                       |                                                                    |
| ------------------------------------- | ------------------------------------------------------------------ |
| `v-model`                             | Selected date, or dates when `multiple`                            |
| `v-model:placeholder`                 | Which month is shown                                               |
| `defaultValue`, `defaultPlaceholder`  | Uncontrolled starting points                                       |
| `weekStartsOn`                        | `0` (Sunday) … `6`                                                 |
| `weekdayFormat`                       | `'weekDaysShort' \| 'weekDaysMedium' \| 'weekDaysLong'`            |
| `numberOfMonths`, `pagedNavigation`   | Multi-month display and paging                                     |
| `fixedWeeks`                          | Always six rows, so height never shifts                            |
| `calendarSystem`                      | Umm al-Qura by default; accepts an imported Civil or TBLA strategy |
| `multiple`, `preventDeselect`         | Selection behaviour                                                |
| `minValue`, `maxValue`                | Disables out-of-range days, not just the paging buttons            |
| `isDateDisabled`, `isDateUnavailable` | Custom matchers, enforced for keyboard and pointer alike           |
| `disableDaysOutsideCurrentView`       | Block days borrowed from adjacent months                           |
| `disabled`, `readonly`                |                                                                    |
| `locale`, `dir`                       | `'en' \| 'ar' \| 'fr'`, `'ltr' \| 'rtl'`                           |
| `initialFocus`                        | Focus the selection, else today, else the first of the month       |
| `nextPage`, `prevPage`                | Custom paging, e.g. a year at a time                               |
| `calendarLabel`                       | Accessible name                                                    |

The default slot gives `{ months, weekDays, date, locale, fixedWeeks, modelValue, state, store }`.

[Compare the supported calendar systems](https://taqwim.vercel.app/guide/calendar-systems/)
before changing the default; Hijri fields do not identify an absolute day without their system.

## Keyboard

| Key                           |                                                  |
| ----------------------------- | ------------------------------------------------ |
| `←` `→`                       | Previous / next day — mirrored under `dir="rtl"` |
| `↑` `↓`                       | Previous / next week                             |
| `Home` `End`                  | First / last day of the week                     |
| `PageUp` `PageDown`           | Previous / next month                            |
| `Shift` + `PageUp`/`PageDown` | Previous / next year                             |
| `Enter` `Space`               | Select the focused day                           |

A roving tabindex keeps exactly one cell in the tab order, so `Tab` enters and leaves the grid rather than walking 42 buttons.

## Attributes to style against

Root `[data-taqwim-calendar]`, with `data-disabled`, `data-readonly`, `data-invalid`.
Cell trigger `[data-taqwim-calendar-cell-trigger]`, with `data-selected`, `data-today`, `data-outside-month`, `data-disabled`, `data-unavailable`, `data-focused`, `data-value` (`iYYYY-iMM-iDD`).

[`@taqwim/themes`](../themes) is a ready-made stylesheet over exactly these.

## License

MIT
