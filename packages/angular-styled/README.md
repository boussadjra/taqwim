# @taqwim/angular-styled

A Hijri calendar and date picker for Angular that already looks like one.

Built on [`@taqwim/angular`](../angular) (behaviour) and [`@taqwim/themes`](../themes) (appearance). If you want to build your own markup, use the headless package directly — everything here is composed from its public parts.

## Install

```sh
pnpm add @taqwim/angular-styled
```

Angular 21 or later.

## Use

```ts
import { HijriCalendar, HijriDatePicker } from '@taqwim/angular-styled'
import { Component, signal } from '@angular/core'

@Component({
  standalone: true,
  imports: [HijriCalendar, HijriDatePicker],
  template: `
    <taqwim-hijri-calendar [value]="date()" (valueChange)="date.set($event)" theme="islamic" locale="ar" dir="rtl" />

    <taqwim-hijri-datepicker [value]="date()" (valueChange)="date.set($event)" />
  `,
})
export class Example {
  readonly date = signal(undefined)
}
```

The stylesheet is imported for you.

## Theming

`theme` sets `data-taqwim-theme` on the calendar, so switching is an attribute change — no stylesheet swapping, and several themes can coexist on one page.

**Neutral** `default` · `dark` · `slate` · `stone` · `zinc` · `minimal` · `minimalist` · `material`

**Brand** `rose` · `violet` · `emerald` · `amber` · `indigo` · `teal` · `crimson` · `modern` · `ocean` · `sunset` · `nature` · `neon` · `cyberpunk` · `luxurious`

**Hijri & regional** `islamic` · `ramadan` · `eid` · `masjid` · `madinah` · `andalus` · `sahara` · `mihrab` · `zellige` · `qamar` · `najd`

`size` is orthogonal: `compact`, `default`, `large`.

To restyle rather than re-theme, override the tokens — see [`@taqwim/themes`](../themes).

## Inputs

Everything [`@taqwim/angular`](../angular)'s root accepts, plus:

|                     |                                                                        |
| ------------------- | ---------------------------------------------------------------------- |
| `theme`             | Bundled theme name. Default `'default'`                                |
| `size`              | `'compact' \| 'default' \| 'large'`                                    |
| `showNavigation`    | Previous/next buttons. Default `true`                                  |
| `showWeekdays`      | Weekday label row. Default `true`                                      |
| `selectableHeading` | Month and year heading buttons that open their pickers. Default `true` |

`taqwim-hijri-datepicker` adds `format` (default `'iYYYY-iMM-iDD'`), `inputPlaceholder`, `label` and `editable`. It accepts typed dates in `iYYYY-MM-DD` or `DD-MM-iYYYY`, with `/` or `-`; unparseable text reverts rather than clearing the selection.

## Known issue

Not yet covered by the shared end-to-end suite. See
[`e2e/KNOWN-GAPS.md`](../../e2e/KNOWN-GAPS.md).

## License

MIT
