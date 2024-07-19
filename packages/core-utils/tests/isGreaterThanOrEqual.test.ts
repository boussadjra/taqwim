import { describe, it, expect } from 'vitest'
import { isGreaterThanOrEqual } from '../src/lib/isGreaterThanOrEqual'

describe('isGreaterThanOrEqual', () => {
  it('should return true if the first HijriDateObject is greater than or equal to the second HijriDateObject', () => {
    const hijriDate1 = { hy: 1445, hm: 9, hd: 1 }
    const hijriDate2 = { hy: 1443, hm: 5, hd: 28 }
    const result = isGreaterThanOrEqual(hijriDate1, hijriDate2)
    expect(result).toBe(true)
  })

  it('should return true if the first HijriDateObject is equal to the second HijriDateObject', () => {
    const hijriDate1 = { hy: 1445, hm: 9, hd: 1 }
    const hijriDate2 = { hy: 1445, hm: 9, hd: 1 }
    const result = isGreaterThanOrEqual(hijriDate1, hijriDate2)
    expect(result).toBe(true)
  })

  it('should return false if the first HijriDateObject is not greater than or equal to the second HijriDateObject', () => {
    const hijriDate1 = { hy: 1443, hm: 5, hd: 28 }
    const hijriDate2 = { hy: 1445, hm: 9, hd: 1 }
    const result = isGreaterThanOrEqual(hijriDate1, hijriDate2)
    expect(result).toBe(false)
  })
})
