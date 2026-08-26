---
'@taqwim/themes': minor
---

Add `@taqwim/themes`: framework-free CSS for Taqwim calendars, plus a Tailwind preset.

Themes are now selected with `data-taqwim-theme="islamic"` on any ancestor instead of by importing a different stylesheet, so a page can host several themes at once and switch at runtime.

Structure is written once in `core.css` against the `data-*` attributes `@taqwim/calendar-core` emits, so the same stylesheet serves every framework adapter. Each of the thirteen themes is now ~30 token overrides rather than a duplicated copy of the structural rules — the pre-1.0 stylesheets repeated every layout rule per theme, which is how `variables.css` and `hijri-calendar-islamic.css` came to disagree on what "islamic" looked like, with load order deciding.

The Tailwind preset is generated from `variables.css` at build time rather than hand-maintained, and both v3-style JS presets and a v4 `@theme` block are shipped. Tests assert the contract holds: `core.css` may contain no literal colour, and no theme may declare a token `variables.css` does not define.

Tokens are namespaced `--hc-*`, renamed from `--hijri-calendar-*`.
