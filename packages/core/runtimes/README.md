# Runtime conformance

`@taqwim/core` has no DOM access, no `node:` imports and no framework. It is
meant to run anywhere a `Date` does. This directory is what turns that from an
assertion about the source into an observation about the shipped artifact.

```sh
vp run -F @taqwim/core test:runtimes     # or: pnpm test:runtimes
node runtimes/run.mjs --require-all      # fail instead of skipping a missing runtime
```

## What it runs

A matrix of **runtime × module format × host time zone**, every cell running
[`checks.mjs`](./checks.mjs) unchanged — the same arrangement as the shared E2E
suite, where one spec runs against every framework adapter.

|          | ESM | CommonJS |
| -------- | --- | -------- |
| **Node** | ✓   | ✓        |
| **Deno** | ✓   | —        |
| **Bun**  | ✓   | ✓        |

Deno has no CommonJS row on purpose: a Deno consumer reaches the package as
`npm:@taqwim/core`, which resolves the `import` condition. There is no
CommonJS path there to test.

Each format is run under `UTC`, `Asia/Riyadh` and `America/Los_Angeles`. That
axis is not padding. This library reads and writes **local** calendar parts
deliberately — `toGregorian` returns local midnight, `epochDayOf` reads a
`Date` in its own zone — so an off-by-one that only appears west of UTC is an
easy bug to write, and runtimes ship different ICU and tzdata builds.

## What it proves that the Vitest suite does not

`vitest run` executes `src/` under Node. This executes `dist/` under three
runtimes. The gap between those two is where these failures live:

- **A named export lost in one module format.** tsdown emits the ESM and
  CommonJS bundles separately. `checks.mjs` compares the entire export list by
  name, so an export that survives one build and not the other is caught.
- **`instanceof HijriRangeError` breaking across the module boundary.** The
  class extends `RangeError` and repairs its prototype in the constructor;
  whether that survives depends on the emitted output, not the source.
- **`date-fns/locale` failing to resolve.** It is a deep import through another
  package's export map, and it is the one place in this library where module
  resolution can differ between runtimes rather than just arithmetic.
- **A runtime whose `Date` disagrees.** Every one of the ~56,000 days the
  Umm al-Qura table covers is round-tripped in each cell.

## Files

| File         |                                                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------------------------------- |
| `checks.mjs` | The checks. No imports, no `node:` builtins, no assertion library — it has to load in all three.                      |
| `esm.mjs`    | Loads the `import` entry and hands the namespace to `checks.mjs`.                                                     |
| `cjs.cjs`    | Loads the `require` entry and does the same.                                                                          |
| `run.mjs`    | The runner. Everything runtime-specific — spawning, time zones, resolving the entry from `package.json` — lives here. |

Nothing in this directory is published: `files` in `package.json` lists
`dist/**` and the three metadata files, and nothing else.

## Adding a runtime

Add an entry to `RUNTIMES` in [`run.mjs`](./run.mjs) with its executable name,
the module formats it should be held to, and how it spells "run this script".
The checks need no changes — that is the point of keeping them in one file that
imports nothing.

## When a runtime is not installed

The runner reports it as skipped and names it, rather than dropping it from the
matrix. `--require-all` — implied whenever `CI` is set — makes a skip a
failure instead, so the GitHub job cannot go green with two thirds of the
matrix missing.
