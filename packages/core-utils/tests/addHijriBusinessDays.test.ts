import { describe, it, expect } from 'vitest'
import { addHijriBusinessDays } from '../src/lib/addHijriBusinessDays'

describe('addHijriBusinessDays', () => {
  it('should add the specified number of business days to the given Hijri date', () => {
    const date = { hy: 1445, hm: 9, hd: 1 }
    const amount = 20
    const expectedDate = { hy: 1445, hm: 9, hd: 29 }

    const result = addHijriBusinessDays(date, amount)

    expect(result).toEqual(expectedDate)
  })

  it('should return null if the given Hijri date is invalid', () => {
    const date = { hy: 1445, hm: 13, hd: 1 }
    const amount = 5

    const result = addHijriBusinessDays(date, amount)

    expect(result).toBeNull()
  })
})
