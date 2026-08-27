---
'@taqwim/core': patch
---

Test `@taqwim/core` on Deno and Bun, not just Node.

The package has always been portable — no DOM, nothing from `node:`, one
dependency — but that was an assertion about the source rather than an
observation about the published artifact. Vitest runs `src/` under Node and
nothing else, so nothing in the repo had ever loaded `dist/` anywhere else.

There is now a conformance suite that does. One checks file runs unchanged
across a matrix of **runtime × module format × time zone**:

|             | ESM | CommonJS |
| ----------- | --- | -------- |
| **Node** 22 | ✓   | ✓        |
| **Deno** 2  | ✓   | —        |
| **Bun** 1   | ✓   | ✓        |

Deno has no CommonJS row because a Deno consumer resolves the `import`
condition; there is no CommonJS path there to test.

Every cell runs under `UTC`, `Asia/Riyadh` and `America/Los_Angeles`. That axis
is not padding: this library works in local calendar parts on purpose, so an
off-by-one that only shows up west of UTC is easy to write and runtimes ship
different tzdata builds.

Beyond the arithmetic, the checks cover the failures that live between the
source and the artifact — the full export list per module format, since the
ESM and CommonJS bundles are emitted separately and one can lose an export;
`instanceof HijriRangeError` surviving the module boundary; `date-fns/locale`
resolving, being the one deep import through another package's export map; and
all ~56,000 days the Umm al-Qura table covers, round-tripped in every cell.

Nothing about the published API changed. `bun add @taqwim/core` and
`deno add npm:@taqwim/core` already worked — they are now covered by CI, and
documented.
