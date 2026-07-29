---
'@taqwim/core': major
---

Rename `taqwim-core-utils` to `@taqwim/core`, and correct the date math.

**Breaking changes**

- **Package renamed.** Replace `taqwim-core-utils` with `@taqwim/core` in
  `package.json` and every import. The API is otherwise unchanged.
- **Business days now default to a Friday/Saturday weekend** instead of the
  Monday–Friday working week inherited from `date-fns`. This matches the
  working week across most of the Arab world. `addHijriBusinessDays` and
  `subHijriBusinessDays` take an optional third argument to override it:
  `{ weekend: [6, 0] }` restores the previous Saturday/Sunday behaviour.
- **Out-of-range dates now throw.** `toHijri` and `toGregorian` throw a
  `HijriRangeError` outside the Umm al-Qura table's coverage (1343–1500 AH /
  1924–2076 CE). They previously returned silently wrong values. The bounds are
  exported as `MIN_HIJRI_YEAR`, `MAX_HIJRI_YEAR`, `MIN_GREGORIAN_DATE` and
  `MAX_GREGORIAN_DATE`.
- **`toGregorian` returns local midnight.** It previously built its result from
  `new Date()` and so inherited the current wall-clock time, meaning two calls
  with the same input returned different `Date` values.

**Performance**

`toHijri` used to scan the 159-row lookup table linearly, allocating a `Date`
per row — twice, because it then called `getHijriYear`, which scanned again.
It now binary-searches a precomputed epoch-day index with no allocation.
Measured ~3000x faster; rendering one 42-cell calendar grid went from ~42ms of
conversion to ~0.014ms. The same index removes the linear scans in
`isValidHijriDate`, `getDaysLengthInMonth`, `toGregorian` and `getHijriYear`.

**Other**

- Removed `src/lib/utils.ts`, an unexported duplicate of `isValidHijriDate`.
- `formatHijriDate` no longer rebuilds an intermediate `Date` on every token
  match within a single format call.
