# @taqwim/svelte-styled

A Hijri calendar and date picker for Svelte 5 that already looks like one.

Built on [`@taqwim/svelte`](../svelte) (behaviour) and [`@taqwim/themes`](../themes) (appearance). If you want to build your own markup, use the headless package directly — everything here is composed from its public parts.

## Install

```sh
pnpm add @taqwim/svelte-styled
```

Svelte 5 or later.

## Use

```svelte
<script lang="ts">
  import { HijriCalendar, HijriDatePicker } from '@taqwim/svelte-styled'

  let date = $state()
</script>

<HijriCalendar value={date} onValueChange={next => (date = next)} theme="islamic" locale="ar" dir="rtl" />
<HijriDatePicker value={date} onValueChange={next => (date = next)} />
```

The stylesheet is imported for you.

## Theming

`theme` sets `data-taqwim-theme` on the calendar, so switching is an attribute change — no stylesheet swapping, and several themes can coexist on one page.

`default` · `dark` · `modern` · `islamic` · `minimal` · `minimalist` · `neon` · `ocean` · `sunset` · `cyberpunk` · `nature` · `luxurious` · `material`

`size` is orthogonal: `compact`, `default`, `large`.

To restyle rather than re-theme, override the tokens — see [`@taqwim/themes`](../themes).

## Props

Everything [`@taqwim/svelte`](../svelte)'s root accepts, plus:

|                     |                                                      |
| ------------------- | ---------------------------------------------------- |
| `theme`             | Bundled theme name. Default `'default'`              |
| `size`              | `'compact' \| 'default' \| 'large'`                  |
| `showNavigation`    | Previous/next buttons. Default `true`                |
| `showWeekdays`      | Weekday label row. Default `true`                    |
| `selectableHeading` | Heading opens month and year pickers. Default `true` |
| `navigationIcons`   | `{ prev?, next? }` components replacing the chevrons |

Snippet props: `cell` and `weekday`.

`HijriDatePicker` adds `format` (default `'iYYYY-iMM-iDD'`), `inputPlaceholder`, `label` and `editable`. It accepts typed dates in `iYYYY-MM-DD` or `DD-MM-iYYYY`, with `/` or `-`; unparseable text reverts rather than clearing the selection.

## License

MIT
