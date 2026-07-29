import { MAX_HIJRI_YEAR, MIN_HIJRI_YEAR, MAX_GREGORIAN_DATE, MIN_GREGORIAN_DATE } from './hDatesIndex'

/**
 * Thrown when a date falls outside the Umm al-Qura table's coverage.
 *
 * Conversions are table-driven, so dates beyond it cannot be computed. They
 * previously returned silently wrong values, which is worse than failing.
 */
export class HijriRangeError extends RangeError {
  override readonly name = 'HijriRangeError'

  constructor(message: string) {
    super(message)
    // Required for `instanceof` to work when targeting ES5-era output.
    Object.setPrototypeOf(this, HijriRangeError.prototype)
  }

  static forHijriYear(hijriYear: number): HijriRangeError {
    return new HijriRangeError(
      `Hijri year ${hijriYear} is outside the supported range ${MIN_HIJRI_YEAR}-${MAX_HIJRI_YEAR} AH.`,
    )
  }

  static forGregorianDate(date: Date): HijriRangeError {
    return new HijriRangeError(
      `Gregorian date ${date.toDateString()} is outside the supported range ` +
        `${MIN_GREGORIAN_DATE.toDateString()} to ${MAX_GREGORIAN_DATE.toDateString()}.`,
    )
  }
}
