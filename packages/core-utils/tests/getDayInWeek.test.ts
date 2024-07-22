import { describe, it, expect } from 'vitest'
import { getDayInWeek } from '../src/lib/getDayInWeek'

describe('getDayInWeek', () => {
  it('should return the correct day of the week for a valid Hijri date 1', () => {
    const hijriDate = { hy: 1445, hm: 9, hd: 1 } // 1 ramadan 1445
    const dayOfWeek = getDayInWeek(hijriDate)
    expect(dayOfWeek).toBe(1) // Monday
  })

  it('should return the correct day of the week for a valid Hijri date 2', () => {
    const hijriDate = { hy: 1446, hm: 1, hd: 6 } // 6 muharram 1446
    const dayOfWeek = getDayInWeek(hijriDate)
    expect(dayOfWeek).toBe(5) // Friday
  })
  it('should return the correct day of the week for a valid Hijri date 3', () => {
    const hijriDate = { hy: 1446, hm: 1, hd: 1 } // 1 muharram 1446
    const dayOfWeek = getDayInWeek(hijriDate)
    expect(dayOfWeek).toBe(0) // Sunday
  })

  it('should return the today weekday ', () => {
    const now = new Date()

    expect(getDayInWeek('')).toBe(now.getDay())
  })
})
