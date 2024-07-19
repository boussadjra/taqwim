/**
 * Checks if the first HijriDateObject is greater than the second HijriDateObject.
 * @param a - The first HijriDateObject to compare.
 * @param b - The second HijriDateObject to compare.
 * @returns True if the first HijriDateObject is greater than the second HijriDateObject, false otherwise.
 */
import { HijriDateObject } from '.'

export function isGreaterThan(a: HijriDateObject, b: HijriDateObject): boolean {
  if (a.hy > b.hy) return true
  if (a.hy === b.hy && a.hm > b.hm) return true
  if (a.hy === b.hy && a.hm === b.hm && a.hd > b.hd) return true
  return false
}
