/**
 * Deprecated. Renamed to `@taqwim/core`.
 *
 * This package exists so an existing install keeps working through one upgrade.
 * It will not receive fixes.
 *
 * Note that 1.0 changed two behaviours you may be relying on: the business-day
 * weekend now defaults to Friday and Saturday, and out-of-range conversions
 * throw `HijriRangeError` instead of returning a wrong date. See the migration
 * guide before upgrading.
 */
export * from '@taqwim/core'
