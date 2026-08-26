# @taqwim/themes

Framework-free CSS for Taqwim Hijri calendars, plus a Tailwind v4 preset.

Nothing in this package knows about Vue, React, Svelte, Solid or Angular. Every selector keys off the `data-*` attributes that [`@taqwim/calendar-core`](../calendar-core) emits through its prop getters, so one stylesheet styles all five adapters.

## Install

```sh
pnpm add @taqwim/themes
```

## Use

```js
import '@taqwim/themes'
```

```html
<div data-taqwim-theme="islamic">
  <!-- any Taqwim calendar -->
</div>
```

Themes are selected by attribute, not by import. A page can host several at once, and switching one at runtime is a single `setAttribute` — no stylesheet swapping.

Importing everything costs thirty-three themes you probably do not use. To ship one:

```js
import '@taqwim/themes/variables.css'
import '@taqwim/themes/core.css'
import '@taqwim/themes/themes/islamic.css'
```

`variables.css` must come before `core.css`, and themes after both.

### Bundled themes

**Neutral** `default` · `dark` · `slate` · `stone` · `zinc` · `minimal` · `minimalist` · `material`

**Brand** `rose` · `violet` · `emerald` · `amber` · `indigo` · `teal` · `crimson` · `modern` · `ocean` · `sunset` · `nature` · `neon` · `cyberpunk` · `luxurious`

**Hijri & regional** `islamic` · `ramadan` · `eid` · `masjid` · `madinah` · `andalus` · `sahara` · `mihrab` · `zellige` · `qamar` · `najd`

`default` restates the `:root` tokens under an explicit attribute — you only need it to opt a subtree _out_ of an ancestor's theme. `minimal` is chromeless and is the right starting point for a bespoke look.

## Structure

| File            | Contains                                                           |
| --------------- | ------------------------------------------------------------------ |
| `variables.css` | The token contract — every custom property, with its default value |
| `core.css`      | Structure only: layout, sizing, states. No literal colours         |
| `themes/*.css`  | ~30 token overrides each, scoped to `[data-taqwim-theme='name']`   |
| `tailwind`      | Tailwind preset, **generated** from `variables.css`                |

The split is what makes a theme thirty lines instead of three hundred: structure is written once, and a theme only says what is different. It is enforced by tests — `core.css` may not contain a literal colour, and a theme may not declare a token the contract does not define.

## Custom themes

Set the tokens you care about under your own attribute value:

```css
[data-taqwim-theme='brand'] {
  --hc-primary: #6d28d9;
  --hc-primary-hover: #5b21b6;
  --hc-accent: #ede9fe;
  --hc-accent-foreground: #5b21b6;
  --hc-border-radius: 1rem;
}
```

Anything you leave out falls back to `:root`.

Every token is namespaced `--hc-*`. Pre-1.0 stylesheets used `--hijri-calendar-*`; if you wrote overrides against those, rename the prefix.

`variables.css` also responds to `prefers-contrast: more` and `prefers-reduced-motion: reduce`, and grows the tap targets under 640px.

## Tailwind

The preset is generated from `variables.css` at build time rather than maintained by hand — otherwise the two drift the first time a token is added.

Tailwind v4, CSS-first:

```css
@import 'tailwindcss';
@import '@taqwim/themes';
@import '@taqwim/themes/tailwind/theme.css';
```

Tailwind v3, or v4 via `@config`:

```js
import taqwim from '@taqwim/themes/tailwind'

export default {
  presets: [taqwim],
}
```

Either way you get `bg-taqwim-primary`, `text-taqwim-foreground`, `rounded-taqwim-cell`, `text-taqwim-lg` and so on. The values are `var()` references, so utilities restyle themselves when `data-taqwim-theme` changes — no rebuild.

The raw map is available too:

```js
import { tokens } from '@taqwim/themes/tokens'
```

## License

MIT
