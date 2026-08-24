# Contributing to Taqwim

Bug reports, fixes, features and questions are all welcome.

## Setup

Node >= 20, pnpm, and [Vite+](https://vite.plus) — the workspace uses `vp` for tasks, linting, formatting and type-checking.

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

The thirteen `@taqwim/*` packages are versioned in **lockstep**: one version across all of them, because an adapter and the store it binds to must never be a version apart. Two mechanisms exist, for two different phases.

### Now: the prerelease line

While the project is pre-1.0, `scripts/version.js` is the only thing that writes a version number:

```bash
pnpm version:set 0.1.0-alpha.1     # an exact version
pnpm version:alpha                 # 0.1.0-alpha.1 -> 0.1.0-alpha.2
pnpm version:beta                  # 0.1.0-alpha.2 -> 0.1.0-beta.0
pnpm version:set preminor --preid beta
pnpm version:set minor             # graduate: 0.1.0-beta.0 -> 0.1.0
pnpm version:set patch --dry-run   # preview, write nothing
```

It accepts an exact version or any semver release type (`major`, `minor`, `patch`, `premajor`, `preminor`, `prepatch`, `prerelease`), with `--preid alpha|beta|rc`. Continuing a prerelease keeps its identifier unless you ask for another, so `pnpm version:alpha` twice gives `alpha.2` then `alpha.3`. It writes only the `version` field — internal dependencies are `workspace:*`, which pnpm resolves at publish time — and it never touches `legacy/*`, which is frozen at the versions npm already has.

Publish a prerelease under its own dist-tag, so `pnpm add @taqwim/vue` does not resolve to it:

```bash
pnpm -r --filter "@taqwim/*" publish --access public --tag alpha --no-git-checks
```

### Later: 1.0.0 and after

[Changesets](https://github.com/changesets/changesets) is the release mechanism from 1.0.0 onward, and `.changeset/config.json` declares the same thirteen packages as `fixed` so lockstep holds there too.

**Add a changeset with any PR that changes published code**, now included:

```bash
pnpm changeset
```

Changesets are the changelog. Write them for someone upgrading — what changed, and what they have to do about it — not as a commit summary.

> **Do not run `changeset version` during the alpha.** Pending changesets already describe the 1.0.0 release, including major bumps; applying them now would jump straight to 1.0.0 and overwrite whatever `scripts/version.js` set. They are consumed deliberately, when the project graduates.

On merge to `main`, `.github/workflows/release.yml` builds, tests, verifies the packable output, and then opens or publishes a changesets version PR. Tarballs are published with npm provenance.

## Reporting issues

Use the [issue templates](https://github.com/boussadjra/taqwim/issues/new/choose). For a bug, the thing that helps most is a minimal reproduction and which adapter it is on — parity means a bug in one is often a bug in the store, and therefore in all five.

## Code of Conduct

This project is governed by its [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions are licensed under the MIT License.
