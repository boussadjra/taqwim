/**
 * Checks if the first HijriDateObject is less than the second HijriDateObject.
 *
 * @param a - The first HijriDateObject to compare.
 * @param b - The second HijriDateObject to compare.
 * @returns True if `a` is less than `b`, false otherwise.
 */
import { type HijriDateObject, isGreaterThanOrEqual } from '.'

export function isLessThan(a: HijriDateObject, b: HijriDateObject): boolean {
  return !isGreaterThanOrEqual(a, b)
}
