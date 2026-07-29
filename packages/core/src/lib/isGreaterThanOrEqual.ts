/**
 * Checks if the first HijriDateObject is greater than or equal to the second HijriDateObject.
 * @param a - The first HijriDateObject.
 * @param b - The second HijriDateObject.
 * @returns Returns true if the first HijriDateObject is greater than or equal to the second HijriDateObject, otherwise returns false.
 */
import { isEqual, isGreaterThan } from '.'
import type { HijriDateObject } from '.'

export function isGreaterThanOrEqual(a: HijriDateObject, b: HijriDateObject): boolean {
  return isEqual(a, b) || isGreaterThan(a, b)
}
