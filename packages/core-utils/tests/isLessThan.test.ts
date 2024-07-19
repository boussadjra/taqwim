import { describe, it, expect } from 'vitest'
import { isLessThan } from '../src/lib/isLessThan'

describe('isLessThan', () => {
  it('should return true if the first HijriDateObject is less than the second HijriDateObject', () => {
    const hijriDate1 = { hy: 1443, hm: 5, hd: 28 }
    const hijriDate2 = { hy: 1445, hm: 9, hd: 1 }
    const result = isLessThan(hijriDate1, hijriDate2)
    expect(result).toBe(true)
  })

  it('should return false if the first HijriDateObject is equal to the second HijriDateObject', () => {
    const hijriDate1 = { hy: 1445, hm: 9, hd: 1 }
    const hijriDate2 = { hy: 1445, hm: 9, hd: 1 }
    const result = isLessThan(hijriDate1, hijriDate2)
    expect(result).toBe(false)
  })

  it('should return false if the first HijriDateObject is greater than or equal to the second HijriDateObject', () => {
    const hijriDate1 = { hy: 1445, hm: 9, hd: 1 }
    const hijriDate2 = { hy: 1443, hm: 5, hd: 28 }
    const result = isLessThan(hijriDate1, hijriDate2)
    expect(result).toBe(false)
  })
})
