# Taqwim Constitution

## Core Principles

### I. Accuracy First

All Hijri date conversions and calculations must be correct against the Umm al-Qura calendar data. No feature or optimization may compromise date accuracy. Every new date utility must include validation against known reference dates.

### II. Tree-Shakeable & Lightweight

Both `@taqwim/core` and `taqwim-vue` must remain tree-shakeable. Each exported function should be independently importable. Bundle size impact must be considered for every addition.

### III. TypeScript Strictness

All source code uses strict TypeScript. Public APIs must have explicit type definitions. The `HijriDateObject` interface (`{ hy, hm, hd }`) is the canonical date representation across all packages.

### IV. Test Coverage

Every public function and component must have unit tests. Core date utilities require edge-case coverage (month boundaries, year transitions, invalid inputs). Vue components require both unit and E2E tests via Playwright.

### V. Framework Agnostic Core

`@taqwim/core` must have zero framework dependencies. It depends only on `date-fns` for Gregorian date operations. The Vue package (`taqwim-vue`) consumes the core as a workspace dependency.

## Monorepo Structure

- `packages/core/` — Pure TypeScript Hijri date utilities (npm: `@taqwim/core`)
- `packages/vue/` — Vue 3 components: HijriCalendar, DatePicker (npm: `taqwim-vue`)
- `playground/vue3/` — Development playground for manual testing
- `docs/` — VitePress documentation site

## Development Workflow

- **Package manager**: pnpm with workspace protocol
- **Build**: tsdown for both packages
- **Test**: Vitest for unit tests, Playwright for Vue E2E
- **Lint**: ESLint + Prettier, enforced via husky + lint-staged
- **Commits**: Conventional Commits enforced via commitlint
- **Releases**: Changesets for versioning, automated via GitHub Actions

## Governance

This constitution guides all development decisions for the Taqwim project. Amendments require documentation in a PR with clear rationale.

**Version**: 1.0.0 | **Ratified**: 2026-03-10 | **Last Amended**: 2026-03-10
