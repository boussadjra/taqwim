# Taqwim — agent instructions

## What this is

Umm al-Qura Hijri date utilities, and an accessible calendar for Vue, React, Svelte 5, Solid and Angular. Thirteen published packages, versioned in lockstep.

## Structure

```
taqwim/
├── packages/
│   ├── core/              # Hijri date utilities (dependency-free, epoch-day Gregorian helpers)
│   │   ├── src/lib/       # One exported function per file, re-exported from index.ts
│   │   ├── src/lib/hDates.ts   # Umm al-Qura table
│   │   ├── src/lib/locales/    # ar, en, fr
│   │   └── tests/         # One test file per function
│   ├── calendar-core/     # The calendar state machine — no framework
│   ├── themes/            # core.css + variables.css + themes/*.css, Tailwind preset
│   ├── vue/       vue-styled/
│   ├── react/     react-styled/
│   ├── svelte/    svelte-styled/
│   ├── solid/     solid-styled/
│   └── angular/   angular-styled/
├── playground/            # One app per framework, all serving the same harness at /
├── e2e/                   # One Playwright spec run against every playground
├── docs/                  # Astro Starlight
└── legacy/                # Published taqwim-vue / taqwim-core-utils, frozen
```

## The rule that matters

**Behaviour belongs in `calendar-core`, not in an adapter.** Grid building, selection, paging, keyboard navigation and the emitted `data-*` attributes are one implementation. An adapter is a binding: it mirrors the store's snapshot into that framework's reactivity and spreads the attributes the store computed. If you are writing calendar logic inside an adapter, it belongs in the store instead.

The five adapters advertise the same prop names on purpose, and their test suites are near-identical files. Port a change across all five.

## Types

```typescript
interface HijriDateObject {
  hy: number // Hijri year
  hm: number // month, 1-12
  hd: number // day
}
```

Conversion covers 1343–1500 AH and throws `HijriRangeError` outside it. Business days default to a Friday/Saturday weekend.

## Naming

- Core functions: `verbHijriNoun` — `toHijri`, `addHijriDays`, `formatHijriDate`, `isValidHijriDate`
- Subtraction mirrors addition: `addHijriMonths` ↔ `subHijriMonths`
- Components are PascalCase and prefixed: `HijriCalendarRoot`, `HijriCalendarCellTrigger`

## Tooling

The workspace runs on [Vite+](https://vite.plus) (`vp`). **Tasks are declared per package in `vite.config.ts` under `run.tasks`** — with `input`, `output` and `dependsOn` for caching — not in `package.json` scripts.

| Command                       |                                                      |
| ----------------------------- | ---------------------------------------------------- |
| `vp run -r build`             | Build every package                                  |
| `vp run -F @taqwim/vue test`  | One package                                          |
| `vp check` / `vp check --fix` | Lint, format, type-check (no separate ESLint config) |
| `vp run -r verify-package`    | `publint` + `attw` on the packable output            |
| `playwright test`             | Shared e2e suite                                     |

Node >= 20. Builds use `tsdown`, except Angular (`ngc`, partial compilation) and Svelte (`svelte-package`). Vue emits declarations with `vue-tsc` because tsdown's SFC dts pipeline crashes on this source tree.

## Versioning

`scripts/version.js` is the only thing that writes a version during the pre-1.0 alpha — `pnpm version:alpha`, `pnpm version:beta`, `pnpm version:set <version>`. **Do not run `changeset version`**: pending changesets describe the eventual 1.0.0 and would jump straight there. Add a changeset with any PR that changes published code; they are the changelog.

## Style

- Strict TypeScript, no `any`, explicit return types on public APIs
- Conventional Commits, enforced by commitlint; `vp check` runs on staged files via husky
- Core utilities are pure functions
- Comments explain _why_, especially where something looks odd — match the density of the surrounding file

## Known gaps

Recorded in `e2e/KNOWN-GAPS.md` rather than worked around: Angular has no DOM-level coverage (the Analog Vite plugin cannot compile it under Vite 8). Do not "fix" the shared spec to hide it.
