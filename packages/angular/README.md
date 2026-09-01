# @taqwim/angular

Headless Angular components for Hijri calendars. No styles, no markup opinions — just behaviour, accessibility and the `data-*` attributes to hang a design on.

Want something that already looks like a calendar? Use [`@taqwim/angular-styled`](../angular-styled).

## Install

```sh
pnpm add @taqwim/angular
```

Angular 21 or later. Angular 22 requires TypeScript 6, which this workspace is not on yet.

## Use

```ts
import { TAQWIM_CALENDAR } from '@taqwim/angular'
import { Component, signal } from '@angular/core'

@Component({
  standalone: true,
  imports: [TAQWIM_CALENDAR],
  template: `
    <taqwim-calendar #root [initialFocus]="true" (valueChange)="value.set($event)">
      <taqwim-calendar-header>
        <button taqwimCalendarPrev>←</button>
        <taqwim-calendar-heading />
        <button taqwimCalendarNext>→</button>
      </taqwim-calendar-header>

      @for (month of root.months(); track month.label) {
        <taqwim-calendar-grid [month]="month">
          <div taqwimCalendarGridHead>
            <div taqwimCalendarGridRow>
              @for (day of root.weekDays(); track day) {
                <div taqwimCalendarHeadCell>{{ day }}</div>
              }
            </div>
          </div>

          <div taqwimCalendarGridBody>
            @for (week of month.weeks; track $index) {
              <div taqwimCalendarGridRow>
                @for (day of week; track day.date.hd) {
                  <div [taqwimCalendarCell]="day">
                    <button [taqwimCalendarCellTrigger]="day"></button>
                  </div>
                }
              </div>
            }
          </div>
        </taqwim-calendar-grid>
      }
    </taqwim-calendar>
  `,
})
export class Calendar {
  readonly value = signal(undefined)
}
```

`TAQWIM_CALENDAR` is every part, for `imports:`. Import them individually if you prefer.

## How it works

All behaviour lives in [`@taqwim/calendar-core`](../calendar-core), a framework-free state machine. `TaqwimCalendarService` wraps it as an injectable — provided by `HijriCalendarRoot`, so there is one instance per calendar — and exposes the snapshot as a signal. Every part binds attributes the store computed.

That is why the Vue, React, Svelte and Solid adapters behave identically: one implementation of grid layout, selection, paging and keyboard navigation, and one set of emitted attributes.

The adapter is signal-driven and runs zoneless. It is compiled by `ngc` in partial mode, so it links against your own Angular version, and works with `@angular/ssr`.

## Inputs and outputs

Inputs use the same names every adapter uses: `defaultValue` · `value` · `defaultPlaceholder` · `placeholder` · `calendarSystem` · `weekStartsOn` · `weekdayFormat` · `numberOfMonths` · `pagedNavigation` · `fixedWeeks` · `multiple` · `preventDeselect` · `minValue` · `maxValue` · `isDateDisabled` · `isDateUnavailable` · `disableDaysOutsideCurrentView` · `disabled` · `readonly` · `locale` · `dir` · `initialFocus` · `nextPage` · `prevPage` · `calendarLabel`.

`calendarSystem` defaults to Umm al-Qura and accepts an imported Civil or TBLA
strategy. [Compare the systems](https://taqwim.vercel.app/guide/calendar-systems/)
before changing it; Hijri fields do not identify an absolute day without their system.

Outputs: `valueChange` and `placeholderChange`.

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

## Known issue

This adapter is not yet covered by the shared end-to-end suite: the Analog Vite
plugin cannot compile an Angular app under Vite 8. It is verified by `ngc` with
`strictTemplates` on every build, which checks every component and template, but
not at the DOM level. See [`e2e/KNOWN-GAPS.md`](../../e2e/KNOWN-GAPS.md).

## License

MIT
