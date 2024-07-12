import { HijriDateObject, ValidHijriDate } from './types'
import { parseDateString } from './parseDateString'

/**
 * Normalizes the given Hijri date to a HijriDateObject.
 * @param hijriDate - The Hijri date to normalize.
 * @returns The normalized Hijri date as a HijriDateObject.
 * @throws Error if the hijriDate is of invalid type.
 */
export function normalizeHijriDate(hijriDate: ValidHijriDate): HijriDateObject {
  if (typeof hijriDate === 'object' && 'hy' in hijriDate && 'hm' in hijriDate && 'hd' in hijriDate) {
    // hijriDate is already a HijriDateObject
    return hijriDate
  } else if (typeof hijriDate === 'string') {
    // hijriDate is a TripleNumberFormat, parse it
    return parseDateString(hijriDate)
  } else {
    throw new Error('Invalid hijriDate type')
  }
}
