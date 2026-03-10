# Taqwim — Copilot Instructions

## Project Overview

Taqwim is a Hijri (Islamic) date library for JavaScript/TypeScript. It provides accurate Hijri-to-Gregorian conversion using the Umm al-Qura calendar, date arithmetic, formatting, and Vue 3 components (calendar, datepicker).

## Repository Structure

```
taqwim/
├── packages/
│   ├── core-utils/          # Pure TS Hijri date utilities (npm: taqwim-core-utils)
│   │   ├── src/lib/         # All exported functions (one per file)
│   │   ├── src/lib/types.ts # HijriDateObject, HijriDuration, MonthDay
│   │   ├── src/lib/hDates.ts # Umm al-Qura calendar data
│   │   ├── src/lib/locales/ # i18n locale data (ar, en, fr)
│   │   └── tests/           # Vitest unit tests (one per function)
│   └── vue/                 # Vue 3 components (npm: taqwim-vue)
│       ├── src/HijriCalendar/
│       ├── src/DatePicker/
│       ├── src/composables/
│       ├── src/style/       # Theme CSS files
│       └── tests/           # Vitest + Playwright E2E
├── playground/vue3/         # Dev playground
├── docs/                    # VitePress documentation
└── .specify/                # Spec-kit artifacts
```

## Key Conventions

### Canonical Date Type

The `HijriDateObject` interface is the core type across all packages:

```typescript
interface HijriDateObject {
  hy: number
  hm: number
  hd: number
}
```

- `hy` = Hijri year, `hm` = Hijri month (1-12), `hd` = Hijri day

### Module Pattern

Each core function lives in its own file under `packages/core-utils/src/lib/` and is re-exported through `packages/core-utils/src/lib/index.ts`. Follow this pattern when adding new utilities.

### Naming

- Core functions follow `verbHijriNoun` naming: `toHijri`, `addHijriDays`, `formatHijriDate`, `isValidHijriDate`
- Subtraction mirrors addition: `addHijriMonths` ↔ `subHijriMonths`
- Vue components use PascalCase: `HijriCalendar`, `TaqwimDatePicker`

### Testing

- Each core utility has a matching `tests/{functionName}.test.ts` file
- Tests use Vitest; run with `pnpm core:test`
- Vue unit tests use `@vue/test-utils` + Vitest; run with `pnpm vue:test`
- Vue E2E tests use Playwright; run with `pnpm vue:test:e2e`

### Building

- Both packages use `tsdown` for bundling
- Core outputs: CJS (`dist/index.js`), ESM (`dist/index.mjs`), types (`dist/index.d.ts`)
- Vue outputs: CJS, ESM, CSS, types

## Commands

| Command                 | Description                         |
| ----------------------- | ----------------------------------- |
| `pnpm core:test`        | Run core-utils unit tests           |
| `pnpm core:build`       | Build core-utils                    |
| `pnpm vue:test`         | Run Vue component unit tests        |
| `pnpm vue:build`        | Build Vue package                   |
| `pnpm vue:test:e2e`     | Run Playwright E2E tests            |
| `pnpm vue:play:dev`     | Start Vue playground                |
| `pnpm lint`             | ESLint with auto-fix                |
| `pnpm format`           | Prettier format all files           |
| `pnpm test`             | Run all tests (core + vue)          |
| `pnpm build`            | Build all packages                  |
| `pnpm release`          | Build + test + changeset publish    |
| `pnpm version-packages` | Apply changesets, update CHANGELOGs |
| `pnpm changeset`        | Create a new changeset              |

## Technology Stack

- **Language**: TypeScript (strict)
- **Package Manager**: pnpm (workspaces)
- **Core dependency**: date-fns (Gregorian date operations only)
- **Vue**: Vue 3.x with Composition API
- **Build**: tsdown (both packages)
- **Test**: Vitest (unit), Playwright (E2E)
- **Lint**: ESLint 9 flat config + Prettier
- **CI**: GitHub Actions (Node 18/20 matrix)
- **Release**: Changesets + bumpp
- **CI/CD**: GitHub Actions — Changesets auto-publishes on merge to main

## Code Style

- Strict TypeScript — no `any`, explicit return types on public APIs
- Conventional Commits enforced via commitlint
- ESLint + Prettier enforced via husky pre-commit hooks
- Prefer functional style for core utilities (pure functions, no side effects)
- Vue components use `<script setup>` with TypeScript

## Spec-Driven Development

This project uses [GitHub Spec Kit](https://github.com/github/spec-kit) for spec-driven development. Use the `/speckit.*` commands to create specifications, plans, and tasks before implementing new features. The project constitution is at `.specify/memory/constitution.md`.
