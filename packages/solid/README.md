# @taqwim/solid

Headless Solid components for Hijri calendars. No styles, no markup opinions — just behaviour, accessibility and the `data-*` attributes to hang a design on.

Want something that already looks like a calendar? Use [`@taqwim/solid-styled`](../solid-styled).

## Install

```sh
pnpm add @taqwim/solid
```

Solid 1.8 or later.

## Use

```tsx
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
} from '@taqwim/solid'
import { createSignal, For, Index } from 'solid-js'

export function Calendar() {
  const [value, setValue] = createSignal()

  return (
    <HijriCalendarRoot value={value()} onValueChange={setValue} initialFocus>
      {({ months, weekDays }) => (
        <>
          <HijriCalendarHeader>
            <HijriCalendarPrev>←</HijriCalendarPrev>
            <HijriCalendarHeading />
            <HijriCalendarNext>→</HijriCalendarNext>
          </HijriCalendarHeader>

          <Index each={months}>
            {month => (
              <HijriCalendarGrid month={month()}>
                <HijriCalendarGridHead>
                  <HijriCalendarGridRow>
                    <For each={weekDays}>{day => <HijriCalendarHeadCell>{day}</HijriCalendarHeadCell>}</For>
                  </HijriCalendarGridRow>
                </HijriCalendarGridHead>

                <HijriCalendarGridBody>
                  <Index each={month().weeks}>
                    {week => (
                      <HijriCalendarGridRow>
                        <Index each={week()}>
                          {day => (
                            <HijriCalendarCell day={day()}>
                              <HijriCalendarCellTrigger day={day()} />
                            </HijriCalendarCell>
                          )}
                        </Index>
                      </HijriCalendarGridRow>
                    )}
                  </Index>
                </HijriCalendarGridBody>
              </HijriCalendarGrid>
            )}
          </Index>
        </>
      )}
    </HijriCalendarRoot>
  )
}
```

Use `Index` rather than `For` for the grid. The store rebuilds its arrays on every snapshot and `For` keys by reference, so it would throw away and recreate every cell on each change.

## How it works

All behaviour lives in [`@taqwim/calendar-core`](../calendar-core), a framework-free state machine. `HijriCalendarRoot` mirrors the store's snapshot into a signal and shares it through Solid context; every part spreads attributes the store computed.

That is why the Vue, React, Svelte and Angular adapters behave identically: one implementation of grid layout, selection, paging and keyboard navigation, and one set of emitted attributes.

Drop to the store directly with `createCalendarStore`:

```ts
import { createCalendarStore } from '@taqwim/solid'

const { store, state } = createCalendarStore(() => ({ locale: 'ar', dir: 'rtl' }))
```

The accessor is a function so that reading props inside it registers them as dependencies — Solid props are getters, and destructuring would freeze the calendar at its initial configuration.

The package ships uncompiled JSX under the `solid` export condition so your compiler can target DOM or SSR; `dist/index.js` is a DOM-compiled fallback for bundlers that ignore the condition.

## Props

The same names every adapter uses: `defaultValue` · `value` · `onValueChange` · `defaultPlaceholder` · `placeholder` · `onPlaceholderChange` · `weekStartsOn` · `weekdayFormat` · `numberOfMonths` · `pagedNavigation` · `fixedWeeks` · `multiple` · `preventDeselect` · `minValue` · `maxValue` · `isDateDisabled` · `isDateUnavailable` · `disableDaysOutsideCurrentView` · `disabled` · `readonly` · `locale` · `dir` · `initialFocus` · `nextPage` · `prevPage` · `calendarLabel`.

`minValue`/`maxValue` disable the out-of-range days themselves, not only the paging buttons, and the matchers are enforced for keyboard selection as well as clicks.

Full reference: [Calendar options](https://boussadjra.github.io/taqwim/reference/options/).

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

## Known issue

Clicking a day can fail to register: focusing a cell is a state change, that
rebuilds the grid, and Solid delegates `click` to the document — so the click
lands on a node that has already been replaced. See
[`e2e/KNOWN-GAPS.md`](../../e2e/KNOWN-GAPS.md) for the analysis and the fix.

## License

MIT
