# @taqwim/svelte

Headless Svelte 5 components for Hijri calendars. No styles, no markup opinions — just behaviour, accessibility and the `data-*` attributes to hang a design on.

Want something that already looks like a calendar? Use [`@taqwim/svelte-styled`](../svelte-styled).

## Install

```sh
pnpm add @taqwim/svelte
```

Svelte 5 or later — the package uses runes and snippets.

## Use

```svelte
<script lang="ts">
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
  } from '@taqwim/svelte'

  let value = $state()
</script>

<HijriCalendarRoot {value} onValueChange={next => (value = next)} initialFocus>
  {#snippet children({ months, weekDays })}
    <HijriCalendarHeader>
      <HijriCalendarPrev>←</HijriCalendarPrev>
      <HijriCalendarHeading />
      <HijriCalendarNext>→</HijriCalendarNext>
    </HijriCalendarHeader>

    {#each months as month (month.label)}
      <HijriCalendarGrid {month}>
        <HijriCalendarGridHead>
          <HijriCalendarGridRow>
            {#each weekDays as day (day)}
              <HijriCalendarHeadCell>{day}</HijriCalendarHeadCell>
            {/each}
          </HijriCalendarGridRow>
        </HijriCalendarGridHead>

        <HijriCalendarGridBody>
          {#each month.weeks as week, i (i)}
            <HijriCalendarGridRow>
              {#each week as day (day.date.hd)}
                <HijriCalendarCell {day}>
                  <HijriCalendarCellTrigger {day} />
                </HijriCalendarCell>
              {/each}
            </HijriCalendarGridRow>
          {/each}
        </HijriCalendarGridBody>
      </HijriCalendarGrid>
    {/each}
  {/snippet}
</HijriCalendarRoot>
```

## How it works

All behaviour lives in [`@taqwim/calendar-core`](../calendar-core), a framework-free state machine. `HijriCalendarRoot` mirrors the store's snapshot into a rune and shares it through Svelte context; every part spreads attributes the store computed.

That is why the Vue, React, Solid and Angular adapters behave identically: one implementation of grid layout, selection, paging and keyboard navigation, and one set of emitted attributes.

Drop to the store directly with `createCalendarState`. It lives in a `.svelte.ts` module because runes are only compiled there:

```ts
import { createCalendarState } from '@taqwim/svelte'

const calendar = createCalendarState(() => ({ locale: 'ar', dir: 'rtl' }))
```

The package ships uncompiled `.svelte` files under the `svelte` export condition, so your compiler can target DOM or SSR.

## Props

The same names every adapter uses: `defaultValue` · `value` · `onValueChange` · `defaultPlaceholder` · `placeholder` · `onPlaceholderChange` · `calendarSystem` · `weekStartsOn` · `weekdayFormat` · `numberOfMonths` · `pagedNavigation` · `fixedWeeks` · `multiple` · `preventDeselect` · `minValue` · `maxValue` · `isDateDisabled` · `isDateUnavailable` · `disableDaysOutsideCurrentView` · `disabled` · `readonly` · `locale` · `dir` · `initialFocus` · `nextPage` · `prevPage` · `calendarLabel`.

`calendarSystem` defaults to Umm al-Qura and accepts an imported Civil or TBLA
strategy. [Compare the systems](https://taqwim.vercel.app/guide/calendar-systems/)
before changing it; Hijri fields do not identify an absolute day without their system.

`minValue`/`maxValue` disable the out-of-range days themselves, not only the paging buttons, and the matchers are enforced for keyboard selection as well as clicks.

Full reference: [Calendar options](https://taqwim.vercel.app/reference/options/).

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
