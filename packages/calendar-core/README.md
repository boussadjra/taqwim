# @taqwim/calendar-core

Framework-agnostic Hijri calendar state machine. Grid building, selection,
paging, roving-focus keyboard navigation and accessibility attributes — with no
dependency on any UI framework.

This is the layer every Taqwim adapter (`@taqwim/vue`, `@taqwim/react`,
`@taqwim/svelte`, `@taqwim/solid`, `@taqwim/angular`) binds to, so calendar
behaviour is written once and is identical everywhere.

```bash
npm install @taqwim/calendar-core
```

## Usage

```typescript
import { createCalendar } from '@taqwim/calendar-core'

const calendar = createCalendar({
  locale: 'ar',
  dir: 'rtl',
  weekStartsOn: 6, // Saturday
  fixedWeeks: true,
  onValueChange: value => console.log(value),
})

calendar.subscribe(() => render(calendar.getSnapshot()))
```

The store exposes a `subscribe` / `getSnapshot` pair, so it plugs directly into
React's `useSyncExternalStore` and the equivalent primitive in every other
framework. `getSnapshot()` returns a **stable reference** until something
actually changes.

## The state

```typescript
const { months, weekDays, headingValue, isInvalid } = calendar.getSnapshot()

for (const month of months) {
  for (const week of month.weeks) {
    for (const day of week) {
      // day.date, day.isToday, day.isSelected, day.isDisabled,
      // day.isUnavailable, day.isOutsideMonth, day.isFocused
    }
  }
}
```

## Accessibility

Prop getters return the attributes an adapter should spread onto its elements.
Because every adapter uses these, the emitted DOM is identical across
frameworks — which is what lets one shared end-to-end suite verify all of them.

```typescript
calendar.getRootProps() // role="application", aria-label, dir, data-taqwim-calendar
calendar.getGridProps(month) // role="grid", aria-label
calendar.getCellTriggerProps(day) // roving tabindex, aria-*, data-*
calendar.getPrevButtonProps()
calendar.getNextButtonProps()
```

### Keyboard

`handleKeydown(event)` implements roving focus and returns `true` when it
consumed the event, so the adapter knows whether to call `preventDefault()`.

| Key                             | Action                                           |
| ------------------------------- | ------------------------------------------------ |
| `←` / `→`                       | Previous / next day (mirrored under `dir="rtl"`) |
| `↑` / `↓`                       | Previous / next week                             |
| `Home` / `End`                  | First / last day of the focused week             |
| `PageUp` / `PageDown`           | Previous / next month                            |
| `Shift` + `PageUp` / `PageDown` | Previous / next year                             |
| `Enter` / `Space`               | Select the focused date                          |

The store owns _which_ date has focus; the adapter owns the DOM. Use the
`onFocusedDateChange` callback to call `.focus()` on the matching cell.

## Controlled and uncontrolled

Pass `defaultValue` / `defaultPlaceholder` to let the store own its state, or
`value` / `placeholder` to own it yourself. In controlled mode the store reports
changes through `onValueChange` / `onPlaceholderChange` and waits for you to
push a new value back via `setOptions`.

## License

MIT
