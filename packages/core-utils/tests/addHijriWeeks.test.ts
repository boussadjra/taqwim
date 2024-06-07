import { describe, it, expect } from 'vitest'
import { addHijriWeeks } from '../src/lib/addHijriWeeks'

describe('addHijriWeeks', () => {
  it('should add the specified number of Weeks to the given date', () => {
    const date = { hy: 1445, hm: 9, hd: 30 }
    const amount = 10
    const expectedDate = { hy: 1445, hm: 12, hd: 12 }

    const result = addHijriWeeks(date, amount)

    expect(result).toEqual(expectedDate)
  })
})
