import { describe, it, expect } from 'vitest'
import { subHijriWeeks } from '../src/lib/subHijriWeeks'

describe('subHijriWeeks', () => {
  it('should substract the specified number of Weeks from the given date', () => {
    const date = { hy: 1445, hm: 11, hd: 12 }
    const amount = 10
    const expectedDate = { hy: 1445, hm: 9, hd: 1 }

    const result = subHijriWeeks(date, amount)

    expect(result).toEqual(expectedDate)
  })
})
