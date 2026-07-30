---
title: Server rendering
description: What to expect when a Taqwim calendar is rendered on the server.
---

The state machine is plain TypeScript with no DOM access, so it runs on a server
unchanged. Two things are worth knowing before you render one.

## Today is resolved at render time

`toHijri(new Date())` reads the machine's clock and time zone. A server in UTC
and a browser in Riyadh can disagree about which day it is, which shows up as a
hydration mismatch on the `data-today` attribute.

If that matters, pass an explicit `defaultPlaceholder` computed once and shared
between server and client, rather than letting each resolve today independently.

## Focus is a client concern

`initialFocus` calls `.focus()`, which only exists in a browser. Every adapter
runs it in a mounted/after-view hook, so it is a no-op on the server — nothing to
configure.

## Per framework

**Vue** — works with `@vue/server-renderer` as-is. The store is created in
`setup`, and the `subscribe` call is cleaned up through `onScopeDispose`.

**React** — `useSyncExternalStore` takes a third argument for the server
snapshot; the adapter passes `getSnapshot` for both, since the store's snapshot
is already environment-independent.

**Svelte** — the package ships uncompiled `.svelte` files under the `svelte`
export condition so your compiler can target SSR or DOM as needed.

**Solid** — the package ships uncompiled JSX under the `solid` export condition
for the same reason. `dist/index.js` is a DOM-compiled fallback for bundlers that
ignore the condition; if you are server-rendering, make sure the condition is
honoured.

**Angular** — compiled in partial mode by `ngc`, so it links against your own
Angular version and works with `@angular/ssr`. The adapter is signal-driven and
runs zoneless.
