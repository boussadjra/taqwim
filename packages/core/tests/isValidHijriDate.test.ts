import { describe, it, expect } from 'vitest'
import { isValidHijriDate } from '../src/lib/isValidHijriDate'

describe('isValidHijriDate', () => {
  it('should return true for a valid Hijri date', () => {
    const result = isValidHijriDate(1443, 9, 1)
    expect(result).toBe(true)
  })

  it('should return false for an invalid Hijri date', () => {
    const result = isValidHijriDate(1443, 13, 1)
    expect(result).toBe(false)
  })

  it('should return true for a valid Hijri date string', () => {
    const result = isValidHijriDate('1443-9-1')
    expect(result).toBe(true)
  })
  it('should return false for a invalid Hijri date string', () => {
    const result = isValidHijriDate('1-09-1443')
    expect(result).toBe(false)
  })

  it('should return false for an invalid Hijri date string', () => {
    const result = isValidHijriDate('1443-13-1')
    expect(result).toBe(false)
  })

  it('should return true for a valid Hijri date object', () => {
    const result = isValidHijriDate({ hy: 1443, hm: 9, hd: 1 })
    expect(result).toBe(true)
  })

  it('should return false for an invalid Hijri date object', () => {
    const result = isValidHijriDate({ hy: 1443, hm: 13, hd: 1 })
    expect(result).toBe(false)
  })
})
