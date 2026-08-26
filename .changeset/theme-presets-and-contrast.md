---
'@taqwim/themes': minor
'@taqwim/vue-styled': minor
'@taqwim/react-styled': minor
'@taqwim/svelte-styled': minor
'@taqwim/solid-styled': minor
'@taqwim/angular-styled': minor
---

Twenty new themes, and every bundled theme now meets WCAG AA.

**Several existing themes changed appearance.** The docs claimed the bundled themes met AA and that axe verified it on every run; neither half was true. axe only ever ran against `default`, and a measurement of all thirteen found **72 text-on-surface pairs below 4.5:1 across eleven of them** — as low as 1.03:1, which is not readable.

`sunset` was the worst: white text on a mid-tone orange gradient fails every pair it has, and no token tweak fixes it. It is now dark text on the same warm gradient, which keeps the theme recognisable. `modern`, `nature`, `ocean`, `islamic` and `cyberpunk` have darker surfaces so their light text carries. `dark`, `default`, `material`, `minimalist` and `luxurious` changed individual tokens only. If you depended on the exact previous colours, copy the old file into your own `[data-taqwim-theme='…']` block.

Two `:root` tokens changed, so a calendar with no theme attribute is affected too: `--hc-unavailable` (`#ef4444` → `#dc2626`, was 3.76:1 on white) and `--hc-secondary-foreground` (`#6b7280` → `#4b5563`, was 4.39:1 on a nav button).

**The gate that keeps it true.** `packages/themes` now measures contrast on every test run: it resolves each pair `core.css` produces, follows `var()` chains, composites translucent layers bottom-up, and samples along gradients rather than only at their stops — a midpoint is often worse than either end. `minimal` is exempt by name, with a reason, because it inherits the host page's surface on purpose; any value that cannot be resolved statically in any other theme is a failure, not a skip.

**Twenty new presets**, all passing that gate on the first run. Ten neutral and brand palettes for ordinary product UI, which is what the catalogue lacked — `slate`, `stone`, `zinc`, `rose`, `violet`, `emerald`, `amber`, `indigo`, `teal`, `crimson` — and ten Hijri and regional ones: `ramadan`, `eid`, `masjid`, `madinah`, `andalus`, `sahara`, `mihrab`, `zellige`, `qamar`, `najd`. They are deliberately flat rather than gradient: every failure measured above traced to a gradient surface or a translucent foreground over one.

**Adding a theme is now one CSS file.** The theme-name union is generated from the stylesheets and exported as `@taqwim/themes/names`; the five styled packages import it instead of each maintaining an identical hand-written list. `HijriCalendarTheme` keeps its name and meaning in every package, so no import changes for consumers — it simply now includes the new presets.
