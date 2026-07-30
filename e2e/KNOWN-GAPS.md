# Known gaps in the shared suite

The shared spec runs against every framework and is the definition of parity.
Where an adapter does not pass it, that is recorded here rather than worked
around in the spec, so the gap stays visible.

## Angular — excluded from the default run

`@analogjs/vite-plugin-angular` does not compile an Angular app under Vite 8: it
leaves `@Component` decorators to Vite's own transform, which emits a plain JS
decorator helper, and the playground never bootstraps. The plugin reports
`"…contains Angular decorators but is not in the TypeScript program"` even when
the tsconfig resolves and includes the file.

Until that lands, `@taqwim/angular` is verified by `ngc` with `strictTemplates`
on every build — which does check every component and template — but **not** at
the DOM level. Treat Angular parity as asserted by construction (it binds to the
same store) rather than as tested.

Run it on demand with `playwright test --project=angular`.

## Solid — 4 of 28 specs fail because clicking a cell rebuilds it

`selection › selects on click`, `deselects on a second click`, `accumulates
selections under multiple`, and `keyboard › pages a month, and a year with
Shift`.

**Root cause.** `HijriCalendarGrid` renders
`{renderChildren(local.children, month())}`. That expression reads the store
snapshot, so Solid discards and rebuilds the entire grid subtree on every state
change. A real browser focuses a button before it clicks it; the focus handler
calls `store.focusDate`, which is a state change; and Solid delegates `click` to
the document. By the time the click is dispatched the button has been replaced,
so it never reaches a live handler.

This is not about controlled values — an earlier version of this note said it
was, and that was wrong. It is also not about `For` versus `Index`: switching the
grid to `Index` is the right choice anyway and has been kept, but it does not
help, because the rebuild happens above it.

`packages/solid-styled/tests/controlled.test.tsx` pins it down. Clicking a
freshly looked-up cell passes; clicking a reference held across a focus fails.
That second case is marked `it.fails`, so the suite turns red the moment it
starts working. jsdom's `fireEvent.click` dispatches no focus, which is why the
other 31 Solid unit tests never see it.

**The fix**, for whoever picks this up: hand the child function an accessor
rather than a value, so the expression no longer reads the snapshot. That cannot
be done while the render prop is `children` — Solid resolves children by
invoking them with no arguments. The render props need to move to named props
(`<HijriCalendarGrid renderMonth={month => …} />`), which is an API change and
deserves its own pass.
