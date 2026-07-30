/**
 * Deprecated. Split into `@taqwim/vue` (headless) and `@taqwim/vue-styled`
 * (themed), and rewritten on `@taqwim/calendar-core`.
 *
 * This package exists so an existing install keeps working through one upgrade.
 * It will not receive fixes.
 *
 * The component API changed: the compound parts now take the decorated
 * `CalendarDay` the grid produces rather than a bare date, the root's slot
 * supplies `months` instead of `grid`, and themes are selected with a `theme`
 * prop rather than by importing a stylesheet. See the migration guide.
 */
export * from '@taqwim/vue-styled'
