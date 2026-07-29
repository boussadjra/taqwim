import { describe, it, expect } from 'vitest'
import { toGregorian } from '../src/lib/toGregorian'

describe('toGregorian', () => {
  it('should convert a valid Hijri date to a valid Gregorian date', () => {
    const hijriDate = { hy: 1445, hm: 9, hd: 1 }
    const result = toGregorian(hijriDate)
    console.log('result', result)
    expect(result.toDateString()).toEqual('Mon Mar 11 2024')
  })

  it('should convert a valid Hijri date with separate arguments to a valid Gregorian date ', () => {
    const hijriYear = 1445
    const hijriMonth = 9
    const hijriDay = 1
    const result = toGregorian(hijriYear, hijriMonth, hijriDay)
    expect(result.toDateString()).toEqual('Mon Mar 11 2024')
  })

  it('should throw an error for invalid Hijri date', () => {
    const hijriDate = { hy: 1445, hm: 9, hd: 31 }
    expect(() => {
      toGregorian(hijriDate)
    }).toThrow('Invalid Hijri date')
  })

  it('should throw an error for invalid arguments', () => {
    const hijriYear = 1445
    const hijriMonth = 9
    expect(() => {
      toGregorian(hijriYear, hijriMonth)
    }).toThrow('Invalid arguments')
  })
})
