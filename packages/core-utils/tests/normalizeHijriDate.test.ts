import { describe, it, expect } from 'vitest'
import { normalizeHijriDate } from '../src/lib/normalizeHijriDate'

describe('normalizeHijriDate', () => {
  it('should convert a string to a HijriDateObject', () => {
    const hijriDate = normalizeHijriDate('1443-01-01')
    expect(hijriDate).toEqual({ hy: 1443, hm: 1, hd: 1 })
  })

  it('should return the same HijriDateObject', () => {
    const hijriDate = normalizeHijriDate({ hy: 1443, hm: 1, hd: 1 })
    expect(hijriDate).toEqual({ hy: 1443, hm: 1, hd: 1 })
  })

  it('should throw an error if the input is invalid', () => {
    expect(() => normalizeHijriDate('')).toThrowError('Invalid date format')
  })
})
