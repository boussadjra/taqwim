/**
 * Checks if a HijriDateObject `a` is less than or equal to another HijriDateObject `b`.
 *
 * @param a - The first HijriDateObject to compare.
 * @param b - The second HijriDateObject to compare.
 * @returns `true` if `a` is less than or equal to `b`, `false` otherwise.
 */
import { type HijriDateObject, isGreaterThan } from '.'

export function isLessThanOrEqual(a: HijriDateObject, b: HijriDateObject): boolean {
  return !isGreaterThan(a, b)
}
