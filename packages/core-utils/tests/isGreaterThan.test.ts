import { describe, it, expect } from 'vitest'
import { toHijri } from '../src/lib/toHijri'
import { isGreaterThan } from '../src/lib/isGreaterThan'

describe('isGreaterThan', () => {
  it('should return true if the first HijriDateObject is greater than the second HijriDateObject', () => {
    const hijriDate1 = { hy: 1445, hm: 9, hd: 1 }
    const hijriDate2 = { hy: 1443, hm: 5, hd: 28 }
    const result = isGreaterThan(hijriDate1, hijriDate2)
    expect(result).toBe(true)
  })

  it('should return false if the first HijriDateObject is not greater than the second HijriDateObject', () => {
    const hijriDate1 = { hy: 1443, hm: 5, hd: 28 }
    const hijriDate2 = { hy: 1445, hm: 9, hd: 1 }
    const result = isGreaterThan(hijriDate1, hijriDate2)
    expect(result).toBe(false)
  })

  it('should return false if the first and second HijriDateObjects are equal', () => {
    const hijriDate1 = { hy: 1445, hm: 9, hd: 1 }
    const hijriDate2 = { hy: 1445, hm: 9, hd: 1 }
    const result = isGreaterThan(hijriDate1, hijriDate2)
    expect(result).toBe(false)
  })
})
