# taqwim-vue

> **Deprecated.** Split into [`@taqwim/vue`](https://www.npmjs.com/package/@taqwim/vue)
> (headless) and [`@taqwim/vue-styled`](https://www.npmjs.com/package/@taqwim/vue-styled)
> (themed).

```sh
pnpm remove taqwim-vue
pnpm add @taqwim/vue-styled
```

This version re-exports `@taqwim/vue-styled` so an existing install keeps
working through one upgrade. It will not receive fixes.

The rewrite changed the component API — the compound parts take a `CalendarDay`
rather than a bare date, the root's slot supplies `months` rather than `grid`,
and themes are a `theme` prop rather than a stylesheet import. It also made
`weekStartsOn`, `fixedWeeks`, `numberOfMonths`, `initialFocus`, `minValue`,
`maxValue` and `isDateUnavailable` actually work, and added keyboard navigation.

Full guide: https://boussadjra.github.io/taqwim/guide/migration/
