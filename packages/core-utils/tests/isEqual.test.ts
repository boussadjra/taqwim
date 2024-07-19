import { describe, it, expect } from 'vitest'
import { isEqual } from '../src/lib/isEqual'

describe('isEqual', () => {
  it('should return true if the HijriDateObjects are equal', () => {
    const hijriDate1 = { hy: 1445, hm: 9, hd: 1 }
    const hijriDate2 = { hy: 1445, hm: 9, hd: 1 }
    const result = isEqual(hijriDate1, hijriDate2)
    expect(result).toBe(true)
  })

  it('should return false if the HijriDateObjects are not equal', () => {
    const hijriDate1 = { hy: 1445, hm: 9, hd: 1 }
    const hijriDate2 = { hy: 1446, hm: 1, hd: 6 }
    const result = isEqual(hijriDate1, hijriDate2)
    expect(result).toBe(false)
  })
})
