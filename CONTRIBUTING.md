# Contributing to Taqwim

Bug reports, fixes, features and questions are all welcome.

## Setup

Node 24, pnpm 11, and [Vite+](https://vite.plus) — the workspace uses `vp` for tasks, linting, formatting and type-checking. The published packages support older Node versions where their manifests declare them; CI checks the built core on Node 20 separately.

```bash
git clone https://github.com/boussadjra/taqwim.git
cd taqwim
curl -fsSL https://vite.plus/install | bash
pnpm install
vp run -r build
vp run -r test
```

## Layout

```
taqwim/
├── packages/
│   ├── core/              # Hijri date utilities — no framework, no deps
│   ├── calendar-core/     # The calendar state machine every adapter binds to
│   ├── themes/            # Framework-free CSS + generated Tailwind preset
│   ├── vue/       vue-styled/
│   ├── react/     react-styled/
│   ├── svelte/    svelte-styled/
│   ├── solid/     solid-styled/
│   └── angular/   angular-styled/
├── playground/            # One app per framework; all serve the same harness at /
├── e2e/                   # One Playwright spec, run against every playground
├── docs/                  # Astro Starlight site
└── legacy/                # The published taqwim-vue and taqwim-core-utils, frozen
```

The shape that matters: **behaviour lives in `calendar-core`, not in the adapters.** A calendar bug is almost always fixed there once rather than five times. An adapter should be a binding — if you find yourself implementing logic in one, that logic probably belongs in the store.

## Tasks

Tasks are declared per package in `vite.config.ts` under `run.tasks`, with their inputs, outputs and dependencies, so `vp` can cache and order them. They are **not** in `package.json` scripts.

```bash
vp run -r build            # every package
vp run -F @taqwim/vue test # one package
vp check                   # lint + format + types
vp check --fix
playwright test            # shared e2e suite
```

Adding a task means editing that package's `vite.config.ts`. Declare `input`/`output` honestly — a task that under-declares its inputs will be cached when it should have re-run.

## Making a change

1. Branch off `main`.
2. Make the change, with tests. Every adapter's test suite is deliberately a near-identical file to the others — that symmetry is what keeps parity honest, so port a new test across all five.
3. `vp check --fix` and `vp run -r test`.
4. If you touched anything published, add a changeset (below).
5. Commit using [Conventional Commits](https://conventionalcommits.org/) — commitlint enforces this.

```
feat(calendar-core): honour weekStartsOn in the weekday labels
fix(react): stop the store looping when props are pushed every render
docs: correct the Solid known-issue diagnosis
```

### Parity is the contract

The five adapters advertise the same prop names and emit the same `data-*` attributes. One Playwright spec runs against all of them. If an adapter cannot pass it, that goes in [`e2e/KNOWN-GAPS.md`](./e2e/KNOWN-GAPS.md) with a real diagnosis — not worked around in the spec, and not quietly skipped.

## Versions and releases

The thirteen `@taqwim/*` packages are versioned in **lockstep**: one version across all of them, because an adapter and the store it binds to must never be a version apart. [Changesets](https://github.com/changesets/changesets) manages releases from 1.0.0 onward; `.changeset/config.json` declares all thirteen packages as one fixed group. `scripts/version.js` remains only for the historical prerelease line.

**Add a changeset with any PR that changes published code**:

```bash
pnpm changeset
```

Changesets are the changelog. Write them for someone upgrading — what changed, and what they have to do about it — not as a commit summary. To prepare a release, run `pnpm changeset:status`, then `pnpm changeset:version`. Review all thirteen package versions and generated changelogs. Changesets does not update the private workspace and docs versions, so synchronize those separately. Run the local build, type checks, unit tests, coverage, package checks, and shared browser suite before publishing.

Preview the exact registry plan with `pnpm publish:packages --dry-run`. The script checks each package against npm and skips exact versions already published, so it can resume a partial release. It publishes stable versions under `latest` and keeps future prereleases under their own tag once stable exists.

The CI workflow runs on pull requests to `main` and pushes to `main`; the Release workflow also runs on pushes to `main`. Both consume GitHub Actions minutes. Arrange an explicit Actions opt-in before pushing or merging a release. The Release workflow publishes only when `NPM_TRUSTED_PUBLISHING=true` is set in the `release` environment and all thirteen npm packages trust `boussadjra/taqwim`, `release.yml`, and that environment. It uses OIDC and npm provenance. A local version bump or a passing local check is not proof of npm publication.

## Reporting issues

Use the [issue templates](https://github.com/boussadjra/taqwim/issues/new/choose). For a bug, the thing that helps most is a minimal reproduction and which adapter it is on — parity means a bug in one is often a bug in the store, and therefore in all five.

## Code of Conduct

This project is governed by its [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions are licensed under the MIT License.
