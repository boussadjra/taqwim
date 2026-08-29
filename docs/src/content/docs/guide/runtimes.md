---
title: Node, Deno and Bun
description: Where @taqwim/core runs, how to install it in each runtime, and what is actually tested.
---

`@taqwim/core` is a conversion table and the arithmetic on top of it. It touches
no DOM, imports nothing from `node:`, and ships with zero production dependencies.
All it needs is `Date`, `Math`, `Intl`, and plain string work. So it runs wherever
JavaScript does.

That is easy to claim and easy to get wrong, so it is tested rather than
asserted. CI runs the built package through a matrix of
**runtime × module format × time zone**, and the same checks run in every cell:

|             | ESM | CommonJS |
| ----------- | --- | -------- |
| **Node** 22 | ✓   | ✓        |
| **Deno** 2  | ✓   | —        |
| **Bun** 1   | ✓   | ✓        |

Deno has no CommonJS column because a Deno consumer resolves the `import`
condition; there is no CommonJS path to reach. Node 20, 22 and 24 all run the
unit suite as well; the artifact matrix runs on 22. The whole thing lives in
[`packages/core/runtimes`](https://github.com/boussadjra/taqwim/tree/main/packages/core/runtimes).

## Installing

```sh
# Node, with any package manager
pnpm add @taqwim/core@beta
```

```sh
# Bun
bun add @taqwim/core@beta
```

```sh
# Deno
deno add npm:@taqwim/core@beta
```

The import is the same in all three:

```ts
import { toHijri } from '@taqwim/core'

toHijri('2026-08-26')
//=> { hy: 1448, hm: 3, hd: 13 }
```

Deno can also skip the manifest entirely and reach for the package inline,
which is the shortest path to a one-off script:

```ts
import { toHijri } from 'npm:@taqwim/core@beta'
```

## What the checks cover

Not just the arithmetic. The failures worth catching here are the ones that
appear between the source and the artifact, or between one runtime and another:

- **The whole export list**, by name and per module format. The ESM and
  CommonJS bundles are emitted separately, so an export can survive one and
  vanish from the other.
- **`instanceof HijriRangeError`** across the module boundary. The class
  extends `RangeError`, and whether that survives depends on the emitted output
  rather than the source.
- **Gregorian formatting via `Intl`**, with `calendar: 'gregory'` forced so Arabic
  locales do not default to a Hijri calendar for `MMMM`/`EEE` tokens.
- **Every one of the ~56,000 days** the Umm al-Qura table covers, round-tripped
  Gregorian → Hijri → Gregorian in each cell.

## Time zones are part of the matrix, on purpose

This library works in **local** calendar parts deliberately: `toGregorian`
returns local midnight, and `toHijri` reads a `Date` in whatever zone the host
is in, so that "which day is it" matches the user's clock rather than UTC's.

That makes the host time zone load-bearing, and runtimes ship different ICU and
tzdata builds. Every cell of the matrix therefore runs three times — under
`UTC`, `Asia/Riyadh` and `America/Los_Angeles` — so an off-by-one that only
appears on one side of the meridian cannot pass.

The consequence for your own code is the caution on
[Dates without a calendar](/guide/dates/): do not round-trip a
`toGregorian` result through `.toISOString()`. That is not a runtime
difference; it is true everywhere, and it is the mistake this design invites.

If your process and your users are in different zones — a server in UTC
rendering for a reader in Riyadh — see
[Server rendering](/guide/ssr/), which is about exactly that gap.

## What is not in the matrix

**Edge and worker runtimes** — Cloudflare Workers, Deno Deploy, Vercel's edge
runtime — are not tested. Nothing in the package is known to be incompatible
with them, and the properties that make it portable are the same ones they
require, but "should work" is not "is tested" and this page will not pretend
otherwise.

**The framework adapters** (`@taqwim/vue`, `@taqwim/react` and the rest) are not
in this matrix either. They run wherever their framework runs, and their
server-rendering behaviour is covered on
[Server rendering](/guide/ssr/) instead.

`engines.node` in `package.json` names **Node 20** as the floor. It is a
Node-specific field; Deno and Bun ignore it, and the versions those two are held
to are the ones in the table above.
