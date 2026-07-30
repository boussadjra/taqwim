---
title: Vue
description: The Vue adapter — headless primitives, the styled components, and the store hook.
---

Two packages: `@taqwim/vue` for behaviour and accessibility with no styles, and
`@taqwim/vue-styled` for a calendar that already looks like one.

Both are thin bindings to [`@taqwim/calendar-core`](/taqwim/reference/options/).
The state machine does the work; this package translates it into Vue.

## Full reference

The package README is the reference for this adapter and is kept next to the
code so the two cannot drift:

- [`packages/vue/README.md`](https://github.com/boussadjra/taqwim/blob/main/packages/vue/README.md) — the headless primitives, every prop, the keyboard model
- [`packages/vue-styled/README.md`](https://github.com/boussadjra/taqwim/blob/main/packages/vue-styled/README.md) — the themed components

## Common ground

Whatever the framework, the rendered DOM is the same. See
[Data attributes](/taqwim/reference/attributes/) for the contract, and
[Theming](/taqwim/guide/theming/) for how one stylesheet covers all five.

The option names are the same too — see
[Calendar options](/taqwim/reference/options/). Porting an example between
frameworks is a matter of syntax, not of behaviour.
