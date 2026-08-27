# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Umm al-Qura Hijri date utilities and an accessible calendar for Vue 3, React, Svelte 5, Solid and Angular. Thirteen published `@taqwim/*` packages, versioned in lockstep.

## Commands

The workspace runs on [Vite+](https://vite.plus) (`vp`), not on npm scripts.

```sh
vp run -r build                  # every package, in dependency order
vp run -F @taqwim/vue build      # one package (-F is a filter)
vp run -r test
vp run -r type-check             # tsc / vue-tsc / svelte-check against every app and package
vp check                         # lint + format + type-check, all in one
vp check --fix
vp run -r verify-package         # publint + attw against the packable output
vp run -F @taqwim/core test:runtimes   # built core under node, deno and bun
playwright test                  # shared e2e suite (vue, react, svelte, solid)
playwright test --project=angular   # Angular is declared but not in the default run
```

Root `package.json` scripts (`pnpm build`, `pnpm test`, `pnpm check`, `pnpm docs:dev`, …) are thin wrappers over these.

`vp check` and `vp run -r type-check` are not the same thing. The first is oxc's
linter and formatter over the whole tree; the second is the real compiler, per
package, and it is the only one that reads `.vue` and `.svelte` templates or
resolves a `@taqwim/*` import against what that package actually exports.

### Running a single test

```sh
pnpm --filter '@taqwim/core' exec vitest run tests/toHijri.test.ts
pnpm --filter '@taqwim/core' exec vitest run -t '<test name>'
pnpm --filter '@taqwim/vue' exec vitest        # watch mode
```

**On Windows, run these from PowerShell.** In Git Bash, `pnpm --filter @taqwim/core exec …` mangles the scoped name (it fails with `'ore' is not recognized`), quoted or not. `vp run -F @taqwim/core test` works in either shell.

### Task definitions

Tasks live in each package's `vite.config.ts` under `run.tasks`, with `input`, `output` and `dependsOn` — **not** in `package.json` scripts. `dependsOn: afterDeps` (`[{ task: 'build', from: 'dependencies' }]`) is the idiom for "build my workspace dependencies first". Adding or changing a task means editing that file, and `input`/`output` must be declared honestly or `vp` will serve a stale cache.

## Architecture

### One state machine, five bindings

The load-bearing idea: **all calendar behaviour lives in `@taqwim/calendar-core`, and the adapters are bindings, not implementations.** Grid building, selection, paging, keyboard navigation, and every emitted `data-*` and ARIA attribute are written once.

`createCalendar(options): CalendarStore` is a framework-free external store:

- `subscribe(listener)` / `getSnapshot()` — the snapshot reference is **stable between changes**, so it plugs straight into `useSyncExternalStore` and equivalents
- `setOptions(partial)` — how an adapter pushes props in when they change
- `select`, `setPlaceholder`, `nextPage`, `prevPage`, `focusDate`, `focusInitial`
- `handleKeydown(event)` — returns `true` if consumed, so the adapter knows whether to `preventDefault()`
- `getRootProps()`, `getGridProps(month)`, `getCellTriggerProps(day)`, `getPrevButtonProps()`, `getNextButtonProps()` — the attribute bags each part spreads

`notify()` compares the newly built state against the previous one and keeps the old reference when nothing observable changed. That is what stops React-style "push options on every render" from looping forever, and it compares _built state_ rather than incoming options — so a consumer's inline `isDateDisabled` getting a new identity each render is harmless, while a change in what it _returns_ counts.

How each adapter binds:

|          |                                                                                                                                                                         |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vue      | `createCalendar` in `useCalendar.ts`; `store.subscribe` into a ref, `watch(options, …, { flush: 'sync' })` back out; shared via provide/inject                          |
| React    | `useSyncExternalStore(store.subscribe, store.getSnapshot, …)`; options merged in an effect (commit phase), never during render                                          |
| Svelte 5 | Snapshot mirrored into a rune; `createCalendarState` lives in a `.svelte.ts` module because runes only compile there                                                    |
| Solid    | Snapshot mirrored into a signal; the options accessor is a **function** so prop reads register as dependencies (Solid props are getters — destructuring freezes config) |
| Angular  | `TaqwimCalendarService`, provided by the root component so there is one per calendar; snapshot exposed as a signal; zoneless                                            |

**If you are writing calendar logic inside an adapter, it belongs in the store instead.** A calendar bug is nearly always one fix in `calendar-core`, not five.

### Headless / styled split

Each framework ships two packages: `@taqwim/<fw>` (behaviour, no styles, compound components) and `@taqwim/<fw>-styled` (`HijriCalendar` + `HijriDatePicker`, built entirely from the headless package's public parts). The styled package re-exports its headless sibling, so consumers can drop down without adding a dependency. If a styled component needs something the headless surface does not expose, add it to the headless surface rather than reaching inside.

### Themes

`@taqwim/themes` is framework-free CSS over the `data-*` attributes the store emits, so one stylesheet serves all five adapters. Themes are selected with `data-taqwim-theme="islamic"` on any ancestor — not by importing a different stylesheet — so a page can host several and switch at runtime.

The split is enforced by tests in `packages/themes/tests/`, and they are the constraints most likely to be broken by accident:

- `core.css` may contain no literal colour, and may reference no token `variables.css` does not define
- a theme may set only tokens the contract defines, and every rule in it must be scoped to its own `[data-taqwim-theme='<name>']`
- `all.css` must import every theme

The Tailwind preset is generated from `variables.css` at build time; do not hand-edit it.

### Parity is the contract

The five adapters deliberately advertise the same prop names, and `e2e/specs/calendar.spec.ts` is written against the DOM alone and runs unchanged against all of them. Each playground serves the same query-string harness at `/` (contract in `e2e/harness.ts`, copied into each playground rather than imported, on purpose).

The unit suites are near-identical files across adapters for the same reason. **Port a change across all five, tests included.**

Where an adapter cannot pass, it goes in `e2e/KNOWN-GAPS.md` with a real diagnosis — never worked around in the spec or quietly skipped. One gap is open now: Angular has no DOM-level coverage (`@analogjs/vite-plugin-angular` cannot compile it under Vite 8). Solid used to drop clicks and no longer does; all twenty-eight specs pass on all four of the projects in the default run.

### `@taqwim/core`

One exported function per file under `src/lib/`, re-exported from `index.ts`. Naming is `verbHijriNoun` (`toHijri`, `addHijriDays`, `formatHijriDate`), and subtraction mirrors addition (`addHijriMonths` ↔ `subHijriMonths`). Each function has a matching `tests/<functionName>.test.ts`.

Conversion is table-driven (`hDates.ts`) covering **1343–1500 AH / 1924–2077 CE**, and throws `HijriRangeError` outside it rather than returning a silently wrong date. Business-day arithmetic defaults to a **Friday/Saturday** weekend, overridable per call. `date-fns` is used for Gregorian math only.

The package touches no DOM and imports nothing from `node:`, so it is held to running on **Node, Deno and Bun**. `runtimes/` is the suite that proves it: one checks file run unchanged across runtime × module format × time zone, against `dist/` rather than `src/`. That is the only thing in the repo that observes the shipped artifact outside Node — Vitest never does. Adding a runtime means one entry in `runtimes/run.mjs`, not a new checks file; see `packages/core/runtimes/README.md`.

## Versioning

The thirteen packages move as a unit. `scripts/version.js` is the **only** thing that writes a version during the pre-1.0 alpha:

```sh
pnpm version:set 0.1.0-alpha.1     # exact version
pnpm version:alpha                 # alpha.1 -> alpha.2 (keeps the identifier)
pnpm version:beta                  # alpha.2 -> beta.0
pnpm version:set minor             # graduate out of prerelease
pnpm version:set patch --dry-run
```

It never touches `legacy/*` (the published `taqwim-vue` / `taqwim-core-utils`, frozen at the versions npm has). Internal deps are `workspace:*`, resolved at publish, so only the `version` field is rewritten.

**Do not run `changeset version`.** Pending changesets describe the eventual 1.0.0 release with major bumps for all thirteen; applying them now jumps straight to 1.0.0 and overwrites the script. Changesets is the release mechanism from 1.0.0 onward, and `.changeset/config.json` lists the same thirteen as `fixed`.

Changesets are still the changelog — **add one with any PR that changes published code** (`pnpm changeset`), written for someone upgrading rather than as a commit summary. A changeset may not mix ignored and non-ignored packages; that combination makes every changesets command fail outright.

## Conventions

- Strict TypeScript, no `any`, explicit return types on public APIs
- Conventional Commits (commitlint enforces); `vp check --fix` runs on staged files via husky
- Comments explain _why_, especially where something looks odd — match the density of the surrounding file
- `e2e/KNOWN-GAPS.md` is load-bearing documentation, not a scratchpad: keep its diagnoses accurate

## Working agreement

**Do not commit, and do not create branches.** Leave changes in the working
tree for the user to review and commit themselves. This holds even when a task
looks finished and even in autonomous/auto mode — staging or committing on
their behalf takes the review step away from them. Run `git status`/`git diff`
freely; stop before `git add`, `git commit`, `git checkout -b` and `git push`.
