# taqwim-core-utils

> **Deprecated.** This package is now [`@taqwim/core`](https://www.npmjs.com/package/@taqwim/core).

```sh
pnpm remove taqwim-core-utils
pnpm add @taqwim/core
```

This version re-exports `@taqwim/core` so an existing install keeps working
through one upgrade. It will not receive fixes.

Two behaviours changed in 1.0 and are worth reading before you move:

- `addHijriBusinessDays` / `subHijriBusinessDays` now skip **Friday and
  Saturday** rather than Saturday and Sunday. Pass `{ weekend: [0, 6] }` for the
  old behaviour.
- Conversions outside 1343–1500 AH now throw `HijriRangeError` instead of
  returning a quietly wrong date.

Full guide: https://boussadjra.github.io/taqwim/guide/migration/
