# @taqwim/react

Headless React components for Hijri calendars. No styles, no markup opinions — just behaviour, accessibility and the `data-*` attributes to hang a design on.

Want something that already looks like a calendar? Use [`@taqwim/react-styled`](../react-styled).

## Install

```sh
pnpm add @taqwim/react
```

React 18 or 19.

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
} from '@taqwim/react'
import { useState } from 'react'

export function Calendar() {
  const [value, setValue] = useState()

  return (
    <HijriCalendarRoot value={value} onValueChange={setValue} initialFocus>
      {({ months, weekDays }) => (
        <>
          <HijriCalendarHeader>
            <HijriCalendarPrev>←</HijriCalendarPrev>
            <HijriCalendarHeading />
            <HijriCalendarNext>→</HijriCalendarNext>
          </HijriCalendarHeader>

          {months.map(month => (
            <HijriCalendarGrid key={month.label} month={month}>
              <HijriCalendarGridHead>
                <HijriCalendarGridRow>
                  {weekDays.map(day => (
                    <HijriCalendarHeadCell key={day}>{day}</HijriCalendarHeadCell>
                  ))}
                </HijriCalendarGridRow>
              </HijriCalendarGridHead>

              <HijriCalendarGridBody>
                {month.weeks.map((week, i) => (
                  <HijriCalendarGridRow key={i}>
                    {week.map(day => (
                      <HijriCalendarCell key={day.date.hd} day={day}>
                        <HijriCalendarCellTrigger day={day} />
                      </HijriCalendarCell>
                    ))}
                  </HijriCalendarGridRow>
                ))}
              </HijriCalendarGridBody>
            </HijriCalendarGrid>
          ))}
        </>
      )}
    </HijriCalendarRoot>
  )
}
```

## How it works

All behaviour lives in [`@taqwim/calendar-core`](../calendar-core), a framework-free state machine. `HijriCalendarRoot` creates a store and subscribes with `useSyncExternalStore`; every part spreads attributes the store computed. The Vue, Svelte, Solid and Angular adapters bind to the same store, so behaviour and emitted markup are identical across all of them.

Drop to the store directly with `useCalendar`:

```ts
import { useCalendar } from '@taqwim/react'

const { store, state } = useCalendar({ locale: 'ar', dir: 'rtl' })
```

Inline callbacks and matchers are safe to pass — the store compares built state rather than option identity, so a fresh `isDateDisabled` on every render neither loops nor goes stale.

## Props

Controlled with `value` / `onValueChange` and `placeholder` / `onPlaceholderChange`; uncontrolled with `defaultValue` / `defaultPlaceholder`.

`weekStartsOn` · `weekdayFormat` · `numberOfMonths` · `pagedNavigation` · `fixedWeeks` · `multiple` · `preventDeselect` · `minValue` · `maxValue` · `isDateDisabled` · `isDateUnavailable` · `disableDaysOutsideCurrentView` · `disabled` · `readonly` · `locale` · `dir` · `initialFocus` · `nextPage` · `prevPage` · `calendarLabel`

`minValue`/`maxValue` disable the out-of-range days themselves, not only the paging buttons, and the matchers are enforced for keyboard selection as well as clicks.

`children` may be a render prop receiving `{ months, weekDays, state, store }`. Anything else you pass lands on the root element.

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
