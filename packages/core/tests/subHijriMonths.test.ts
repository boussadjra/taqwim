import { describe, it, expect } from 'vitest'
import { subHijriMonths } from '../src/lib/subHijriMonths'

describe('subHijriMonths', () => {
  it('should substract the specified number of Months from the given date', () => {
    const date = { hy: 1446, hm: 10, hd: 1 }
    const amount = 13
    const expectedDate = { hy: 1445, hm: 9, hd: 1 }

    const result = subHijriMonths(date, amount)

    expect(result).toEqual(expectedDate)
  })

  it('should substract the specified number of Months from the given date and adjust the month', () => {
    const date = { hy: 1445, hm: 9, hd: 30 }
    const amount = 1

    const result = subHijriMonths(date, amount)

    expect(result).toEqual({ hy: 1445, hm: 8, hd: 29 })
  })

  it('should substract the specified number of Months from the given date and adjust the month', () => {
    const date = { hy: 1445, hm: 9, hd: 30 }
    const amount = 14

    const result = subHijriMonths(date, amount)

    expect(result).toEqual({ hy: 1444, hm: 7, hd: 29 })
  })

  it('should substract the specified number of Months from the given date and adjust the month over many years', () => {
    const date = { hy: 1448, hm: 2, hd: 30 }
    const amount = 27

    const result = subHijriMonths(date, amount)

    expect(result).toEqual({ hy: 1445, hm: 11, hd: 29 })
  })
  it('should substract the specified large number of Months from the given date and adjust the month', () => {
    const date = { hy: 1454, hm: 2, hd: 30 }
    const amount = 100

    const result = subHijriMonths(date, amount)

    expect(result).toEqual({ hy: 1445, hm: 10, hd: 29 })
  })
})
