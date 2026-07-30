---
title: Theming
description: Switch themes with an attribute, or build your own from the token contract.
---

`@taqwim/themes` is a plain CSS package. It knows nothing about any framework —
every selector keys off the `data-*` attributes `@taqwim/calendar-core` emits, so
one stylesheet serves all five adapters.

## Switching themes

The `theme` prop sets `data-taqwim-theme` on the calendar. Because it is an
attribute rather than a stylesheet, several themes can coexist on one page and
switching costs a single `setAttribute`.

```html
<div data-taqwim-theme="islamic">
  <!-- any Taqwim calendar -->
</div>
```

Bundled: `default` · `dark` · `modern` · `islamic` · `minimal` · `minimalist` ·
`neon` · `ocean` · `sunset` · `cyberpunk` · `nature` · `luxurious` · `material`.

`size` is orthogonal — `compact`, `default`, `large` — and sets
`data-taqwim-size`. A theme sets colours; a size sets metrics; they compose.

## Loading less

Importing `@taqwim/themes` brings in all thirteen. To ship one:

```js
import '@taqwim/themes/variables.css'
import '@taqwim/themes/core.css'
import '@taqwim/themes/themes/islamic.css'
```

`variables.css` must come before `core.css`, and themes after both.

## Your own theme

Set the tokens you care about under your own attribute value. Anything you leave
out falls back to `:root`.

```css
[data-taqwim-theme='brand'] {
  --hijri-calendar-primary: #6d28d9;
  --hijri-calendar-primary-hover: #5b21b6;
  --hijri-calendar-accent: #ede9fe;
  --hijri-calendar-accent-foreground: #5b21b6;
  --hijri-calendar-border-radius: 1rem;
}
```

That is all a bundled theme is: about thirty token overrides. Structure lives
once in `core.css`, which contains no literal colour — a test fails the build if
one appears.

:::caution[Check your contrast]
The bundled themes meet WCAG AA, and axe verifies it on every run. If you write
your own, check `muted-foreground` and `outside-month` against your surface —
those are the two that fail most easily, and the two that failed here before the
end-to-end suite caught them.
:::

See the full list under [Design tokens](/taqwim/reference/tokens/).

## Tailwind

The preset is generated from `variables.css` at build time, so the two cannot
drift.

```css
/* Tailwind v4 */
@import 'tailwindcss';
@import '@taqwim/themes';
@import '@taqwim/themes/tailwind/theme.css';
```

```js
/* Tailwind v3, or v4 via @config */
import taqwim from '@taqwim/themes/tailwind'

export default { presets: [taqwim] }
```

Either way you get `bg-taqwim-primary`, `text-taqwim-foreground`,
`rounded-taqwim-cell`, `text-taqwim-lg` and so on. The values are `var()`
references, so the utilities restyle themselves when `data-taqwim-theme` changes.

## No theme at all

The headless packages ship no CSS. If you want to write every rule yourself,
depend on `@taqwim/vue` (or the React, Svelte, Solid, Angular equivalent) and
style the [data attributes](/taqwim/reference/attributes/) directly.
