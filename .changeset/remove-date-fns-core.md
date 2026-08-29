---
'@taqwim/core': minor
---

`@taqwim/core` no longer depends on `date-fns`. Gregorian ISO parsing (`YYYY-MM-DD`), day/week arithmetic, and mixed Hijri/Gregorian formatting are implemented with small native helpers on top of Taqwim's existing epoch-day model. Umm al-Qura conversion semantics are unchanged.

**Formatter tokens.** Documented Hijri tokens (`iYYYY`, `iMM`, `iMMM`, `iMMMM`, `iDD`, `iD`, `iE`, `iEEE`, `iEEEE`, …) and the mixed Gregorian tokens used in docs and tests (`yyyy`, `yy`, `y`, `MM`, `M`, `dd`, `d`, `MMM`, `MMMM`, `E`, `EEE`, `EEEE`) are preserved. Undocumented date-fns-only tokens (time-of-day, ordinals, quarters, week/year numbering variants, and similar) are no longer supported.

### Bundle impact

Measured from production Vite consumer bundles (minified, same fixtures) before and after this change:

| Import scenario                       | Before (gzip) | After (gzip) | Change |
| ------------------------------------- | ------------: | -----------: | -----: |
| Conversion (`toHijri`, `toGregorian`) |       4.09 kB |      2.92 kB | −28.5% |
| Arithmetic                            |       4.34 kB |      2.84 kB | −34.5% |
| Formatter                             |      13.20 kB |      4.24 kB | −67.9% |
| Representative core                   |      15.35 kB |      5.47 kB | −64.4% |

Minified formatter bundle: 46.91 kB → 12.39 kB (−73.6%). Brotli formatter bundle: 10.87 kB → 3.22 kB (−70.4%).

Published tarball: ~52 kB before → 48 kB after (date-fns was never shipped inside the package, but the built JS is smaller).

Production dependencies: **before** 1 (`date-fns@^4.1.0`); **after** 0.
