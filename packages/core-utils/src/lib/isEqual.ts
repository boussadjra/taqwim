/**
 * Checks if two HijriDateObject instances are equal.
 * @param a - The first HijriDateObject to compare.
 * @param b - The second HijriDateObject to compare.
 * @returns True if the HijriDateObject instances are equal, false otherwise.
 */
import { HijriDateObject } from '.'

export function isEqual(a: HijriDateObject, b: HijriDateObject): boolean {
  return a.hy === b.hy && a.hm === b.hm && a.hd === b.hd
}
