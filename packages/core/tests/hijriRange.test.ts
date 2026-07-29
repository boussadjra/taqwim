import { describe, it, expect } from 'vitest'
import { HijriRangeError } from '../src/lib/errors'
import { MAX_GREGORIAN_DATE, MAX_HIJRI_YEAR, MIN_GREGORIAN_DATE, MIN_HIJRI_YEAR } from '../src/lib/hDatesIndex'
import { toGregorian } from '../src/lib/toGregorian'
import { toHijri } from '../src/lib/toHijri'

/**
 * Conversions are driven by a finite Umm al-Qura table (1343-1500 AH). Dates
 * outside it used to return silently wrong values; they now throw.
 */
describe('supported range', () => {
  describe('toGregorian', () => {
    it('throws HijriRangeError below the table', () => {
      expect(() => toGregorian({ hy: MIN_HIJRI_YEAR - 1, hm: 1, hd: 1 })).toThrow(HijriRangeError)
    })

    it('throws HijriRangeError above the table', () => {
      expect(() => toGregorian({ hy: MAX_HIJRI_YEAR + 1, hm: 1, hd: 1 })).toThrow(HijriRangeError)
    })

    it('names the supported range in the message', () => {
      expect(() => toGregorian({ hy: 1200, hm: 1, hd: 1 })).toThrow(/1343-1500 AH/)
    })

    it('accepts both boundary years', () => {
      expect(toGregorian({ hy: MIN_HIJRI_YEAR, hm: 1, hd: 1 })).toBeInstanceOf(Date)
      expect(toGregorian({ hy: MAX_HIJRI_YEAR, hm: 1, hd: 1 })).toBeInstanceOf(Date)
    })

    it('still reports impossible dates inside the range as invalid, not out of range', () => {
      // 1445 Ramadan has 29 days, so day 31 is a bad date rather than a bad year.
      expect(() => toGregorian({ hy: 1445, hm: 9, hd: 31 })).toThrow('Invalid Hijri date')
    })
  })

  describe('toHijri', () => {
    it('throws HijriRangeError before the table starts', () => {
      const dayBefore = new Date(MIN_GREGORIAN_DATE)
      dayBefore.setDate(dayBefore.getDate() - 1)

      expect(() => toHijri(dayBefore)).toThrow(HijriRangeError)
    })

    it('throws HijriRangeError after the table ends', () => {
      const dayAfter = new Date(MAX_GREGORIAN_DATE)
      dayAfter.setDate(dayAfter.getDate() + 1)

      expect(() => toHijri(dayAfter)).toThrow(HijriRangeError)
    })

    it('accepts both boundary dates', () => {
      expect(toHijri(MIN_GREGORIAN_DATE)).toEqual({ hy: MIN_HIJRI_YEAR, hm: 1, hd: 1 })
      expect(toHijri(MAX_GREGORIAN_DATE)).toMatchObject({ hy: MAX_HIJRI_YEAR, hm: 12 })
    })
  })

  it('HijriRangeError is a RangeError with a stable name', () => {
    const error = HijriRangeError.forHijriYear(1200)

    expect(error).toBeInstanceOf(RangeError)
    expect(error).toBeInstanceOf(HijriRangeError)
    expect(error.name).toBe('HijriRangeError')
  })
})
