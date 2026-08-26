# Vue playground

One of five apps that render the same four views against a different adapter.
They exist to be looked at side by side: identical chrome, identical controls,
so a visual difference between them means a difference in the adapters rather
than in the scaffolding around them.

```sh
pnpm --filter taqwim-playground-vue dev     # http://localhost:5173
vp run -F taqwim-playground-vue build
vp run -F taqwim-playground-vue type-check
```

`build` and `type-check` are declared as `vp` tasks in `vite.config.ts`, not as
`package.json` scripts — see the root `CLAUDE.md`.

## The views

| Route         |                                                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`           | The shared end-to-end harness. Configured from the query string, so one Playwright spec drives all five playgrounds. Contract in `e2e/harness.ts` |
| `/explore`    | `HijriCalendar` with every option exercisable live                                                                                                |
| `/datepicker` | `HijriDatePicker`, including the input's text handling                                                                                            |
| `/headless`   | `@taqwim/vue`'s primitives with no stylesheet, styled from scratch by the view itself                                                             |

Vue is the only one with a router; the other four hang their extra views off
the hash. `/` has to stay the harness in all five either way.

## Styling

`src/assets/playground.css` is a byte-for-byte copy of the file in the other
four playgrounds, deliberately — a shared runtime import would be one more
thing that could differ between them and hide a real difference. Nothing in it
may style `[data-taqwim-*]`: that is `@taqwim/themes`'s job, and reaching into
it here would mean the playground stops showing what a consumer actually gets.
