# @taqwim/solid-styled

A Hijri calendar and date picker for Solid that already looks like one.

Built on [`@taqwim/solid`](../solid) (behaviour) and [`@taqwim/themes`](../themes) (appearance). If you want to build your own markup, use the headless package directly — everything here is composed from its public parts.

## Install

```sh
pnpm add @taqwim/solid-styled
```

Solid 1.8 or later.

## Use

```tsx
import { HijriCalendar, HijriDatePicker } from '@taqwim/solid-styled'
import { createSignal } from 'solid-js'

export function Example() {
  const [date, setDate] = createSignal()

  return (
    <>
      <HijriCalendar value={date()} onValueChange={setDate} theme="islamic" locale="ar" dir="rtl" />
      <HijriDatePicker value={date()} onValueChange={setDate} />
    </>
  )
}
```

The stylesheet is imported for you.

## Theming

`theme` sets `data-taqwim-theme` on the calendar, so switching is an attribute change — no stylesheet swapping, and several themes can coexist on one page.

`default` · `dark` · `modern` · `islamic` · `minimal` · `minimalist` · `neon` · `ocean` · `sunset` · `cyberpunk` · `nature` · `luxurious` · `material`

`size` is orthogonal: `compact`, `default`, `large`.

To restyle rather than re-theme, override the tokens — see [`@taqwim/themes`](../themes).

## Props

Everything [`@taqwim/solid`](../solid)'s root accepts, plus:

|                               |                                                      |
| ----------------------------- | ---------------------------------------------------- |
| `theme`                       | Bundled theme name. Default `'default'`              |
| `size`                        | `'compact' \| 'default' \| 'large'`                  |
| `showNavigation`              | Previous/next buttons. Default `true`                |
| `showWeekdays`                | Weekday label row. Default `true`                    |
| `selectableHeading`           | Heading opens month and year pickers. Default `true` |
| `navigationIcons`             | `{ prev?, next? }` components replacing the chevrons |
| `renderCell`, `renderWeekday` | Render props for cell contents and weekday labels    |

`HijriDatePicker` adds `format` (default `'iYYYY-iMM-iDD'`), `inputPlaceholder`, `label` and `editable`. It accepts typed dates in `iYYYY-MM-DD` or `DD-MM-iYYYY`, with `/` or `-`; unparseable text reverts rather than clearing the selection.

## Known issue

Clicking a day can fail to register. See
[`e2e/KNOWN-GAPS.md`](../../e2e/KNOWN-GAPS.md).

## License

MIT
