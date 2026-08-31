# Taqwim

[![CI](https://github.com/boussadjra/taqwim/workflows/CI/badge.svg)](https://github.com/boussadjra/taqwim/actions)
[![npm](https://img.shields.io/npm/v/@taqwim/core/beta.svg)](https://www.npmjs.com/package/@taqwim/core)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Umm al-Qura Hijri date utilities, and an accessible calendar for **Vue, React, Svelte, Solid and Angular**.

Calendar behaviour — grid building, selection, paging, keyboard navigation, accessibility attributes — is implemented once in a framework-free state machine. Every adapter is a thin binding to it, so the five behave identically and emit the same markup.

> **Beta.** The current release is `0.1.0-beta.7`, published under the `beta` dist-tag. The API is settling and can still change between betas.

📖 **[Documentation](https://boussadjra.github.io/taqwim/)**

## Packages

Thirteen packages, versioned in lockstep — an adapter and the store it binds to must never be a version apart.

| Package                                             | What it is                                                                     |
| --------------------------------------------------- | ------------------------------------------------------------------------------ |
| [`@taqwim/core`](./packages/core)                   | Hijri ↔ Gregorian conversion, arithmetic, formatting. Framework-free           |
| [`@taqwim/calendar-core`](./packages/calendar-core) | The calendar state machine every adapter binds to                              |
| [`@taqwim/themes`](./packages/themes)               | Framework-free CSS: 33 themes over `data-*` attributes, plus a Tailwind preset |

Per framework, a headless package and a themed one built on it:

| Framework | Headless                                | Themed                                                |
| --------- | --------------------------------------- | ----------------------------------------------------- |
| Vue 3     | [`@taqwim/vue`](./packages/vue)         | [`@taqwim/vue-styled`](./packages/vue-styled)         |
| React     | [`@taqwim/react`](./packages/react)     | [`@taqwim/react-styled`](./packages/react-styled)     |
| Svelte 5  | [`@taqwim/svelte`](./packages/svelte)   | [`@taqwim/svelte-styled`](./packages/svelte-styled)   |
| Solid     | [`@taqwim/solid`](./packages/solid)     | [`@taqwim/solid-styled`](./packages/solid-styled)     |
| Angular   | [`@taqwim/angular`](./packages/angular) | [`@taqwim/angular-styled`](./packages/angular-styled) |

Reach for **headless** when you are building your own markup, and **styled** when you want a calendar that already looks like one. The styled packages re-export their headless siblings, so you can drop down without adding a dependency.

## Quick start

### Dates only

```sh
pnpm add @taqwim/core@beta
```

```typescript
import { toHijri, toGregorian, formatHijriDate } from '@taqwim/core'

toHijri(new Date('2024-03-11'))
// => { hy: 1445, hm: 9, hd: 1 }

toGregorian({ hy: 1445, hm: 9, hd: 1 })
// => Mon Mar 11 2024 00:00:00

formatHijriDate({ hy: 1445, hm: 9, hd: 1 }, 'iYYYY/iMM/iDD', 'ar')
// => ١٤٤٥/٠٩/٠١
```

Conversion is table-driven and covers **1343–1500 AH** (1924–2077 CE). Outside that range it throws `HijriRangeError` rather than returning a silently wrong date. Business-day arithmetic defaults to a Friday/Saturday weekend, overridable per call.

Full API: **[reference](https://boussadjra.github.io/taqwim/api/)**.

### A calendar

```sh
pnpm add @taqwim/vue-styled@beta    # or react-styled, svelte-styled, solid-styled, angular-styled
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HijriCalendar } from '@taqwim/vue-styled'

const date = ref()
</script>

<template>
  <HijriCalendar v-model="date" theme="islamic" locale="ar" dir="rtl" />
</template>
```

The stylesheet comes with it. The equivalent for every other framework is in that package's README, linked in the table above.

## Theming

Themes are selected with an attribute, not by importing a different stylesheet — so one page can host several, and switching at runtime is a state change:

```html
<div data-taqwim-theme="islamic">…</div>
```

**Neutral** `default` · `dark` · `slate` · `stone` · `zinc` · `minimal` · `minimalist` · `material`

**Brand** `rose` · `violet` · `emerald` · `amber` · `indigo` · `teal` · `crimson` · `modern` · `ocean` · `sunset` · `nature` · `neon` · `cyberpunk` · `luxurious`

**Hijri & regional** `islamic` · `ramadan` · `eid` · `masjid` · `madinah` · `andalus` · `sahara` · `mihrab` · `zellige` · `qamar` · `najd`

Each theme is ~30 token overrides; structure is written once against the `data-*` attributes the state machine emits. To restyle rather than re-theme, override the tokens under your own attribute value — see [`@taqwim/themes`](./packages/themes).

## Accessibility

The grid is a real `role="grid"` with the roving tabindex a date picker is supposed to have: `Tab` enters and leaves it rather than walking 42 buttons, and arrows move within it, mirrored under `dir="rtl"`. Every bundled theme is measured against WCAG AA by a unit test on every run, and axe checks the rendered calendar end to end — neither is left to taste.

Details: **[Accessibility and keyboard](https://boussadjra.github.io/taqwim/guide/accessibility/)**.

## Development

Requires Node >= 20, pnpm, and [Vite+](https://vite.plus) (`curl -fsSL https://vite.plus/install | bash`).

```sh
git clone https://github.com/boussadjra/taqwim.git
cd taqwim
pnpm install
vp run -r build
vp run -r test
```

| Command                         |                                                |
| ------------------------------- | ---------------------------------------------- |
| `pnpm build`                    | Build every package                            |
| `pnpm test`                     | Unit tests, all packages                       |
| `pnpm test:e2e`                 | Shared Playwright suite across the playgrounds |
| `pnpm check` / `pnpm check:fix` | Lint, format and type-check                    |
| `pnpm verify-package`           | `publint` + `attw` on what would be published  |
| `pnpm docs:dev`                 | Documentation site                             |

Task graph, caching and cross-package dependencies are declared per package in `vite.config.ts` under `run.tasks`, not in `package.json`.

### Known gaps

One is tracked openly in [`e2e/KNOWN-GAPS.md`](./e2e/KNOWN-GAPS.md): Angular is not yet covered by the end-to-end suite, because the Analog Vite plugin cannot compile it under Vite 8.

## Credits

Taqwim was inspired by [luxon-hijri](https://github.com/acamarata/luxon-hijri) by
[Aric Camarata](https://github.com/acamarata) — a table-based Umm al-Qura
implementation for Luxon, and the project that made the case that a Hijri
calendar should be tabulated and bounded rather than approximated. Taqwim takes
that premise somewhere else: no Luxon dependency, and an accessible calendar
component for five frameworks on top of the date maths. Both are MIT.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow, project layout, and how versions and releases work.

## License

[MIT](LICENSE) © [Brahim Boussadjra](https://github.com/boussadjra)
