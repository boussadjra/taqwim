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

## Solid — 4 of 28 specs fail in controlled mode

`selection › selects on click`, `deselects on a second click`, `accumulates
selections under multiple`, and `keyboard › pages a month, and a year with
Shift`.

The harness binds `value` and hands changes back through `onValueChange`, the
same shape the React harness uses — React passes all 28. In Solid the round trip
lands one interaction late: `data-focused` updates immediately, so the snapshot
is reaching the DOM, but the controlled `value` pushed back through
`setOptions` is not reflected until the next interaction.

Solid's own 31 unit tests pass, including selection, because they mostly drive
the uncontrolled path. The defect is specific to controlled `value` in the Solid
adapter and is not present in the store.
