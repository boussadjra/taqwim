---
title: Solid
description: The Solid adapter — headless primitives, the styled components, and the store hook.
---

Two packages: `@taqwim/solid` for behaviour and accessibility with no styles, and
`@taqwim/solid-styled` for a calendar that already looks like one.

Both are thin bindings to [`@taqwim/calendar-core`](/taqwim/reference/options/).
The state machine does the work; this package translates it into Solid.

## Full reference

The package README is the reference for this adapter and is kept next to the
code so the two cannot drift:

- [`packages/solid/README.md`](https://github.com/boussadjra/taqwim/blob/main/packages/solid/README.md) — the headless primitives, every prop, the keyboard model
- [`packages/solid-styled/README.md`](https://github.com/boussadjra/taqwim/blob/main/packages/solid-styled/README.md) — the themed components

## Common ground

Whatever the framework, the rendered DOM is the same. See
[Data attributes](/taqwim/reference/attributes/) for the contract, and
[Theming](/taqwim/guide/theming/) for how one stylesheet covers all five.

The option names are the same too — see
[Calendar options](/taqwim/reference/options/). Porting an example between
frameworks is a matter of syntax, not of behaviour.

:::caution[Known gap]
Four of the twenty-eight shared end-to-end specs fail for Solid: when `value` is
controlled and changes are handed back through `onValueChange`, the round trip
lands one interaction late. The uncontrolled path — `defaultValue` plus
`onValueChange` — is unaffected, as are all thirty-one of the adapter's unit
tests. See
[`e2e/KNOWN-GAPS.md`](https://github.com/boussadjra/taqwim/blob/main/e2e/KNOWN-GAPS.md).
:::
