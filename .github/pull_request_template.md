## What this changes

<!-- What changed, and why. Link the issue if there is one. -->

Fixes #

## Type

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation
- [ ] Build / CI / tooling

## Scope

- [ ] `@taqwim/core` — date utilities
- [ ] `@taqwim/calendar-core` — the state machine (**affects every adapter**)
- [ ] `@taqwim/themes`
- [ ] Adapters: <!-- vue / react / svelte / solid / angular, headless and/or styled -->
- [ ] Docs, playgrounds, or tooling

## Parity

The five adapters are meant to behave identically, and one Playwright spec runs against all of them.

- [ ] Behaviour changes went into `calendar-core`, not into a single adapter
- [ ] Adapter-level changes were ported to all five, tests included
- [ ] Not applicable

## Checks

- [ ] `vp check` passes
- [ ] `vp run -r test` passes
- [ ] `playwright test` passes, or the failure is recorded in `e2e/KNOWN-GAPS.md` with a diagnosis
- [ ] `vp run -r verify-package` passes, if packaging changed
- [ ] A changeset is included, if published code changed (`pnpm changeset`)

## Notes

<!-- Screenshots for visual changes; anything a reviewer should know. -->
