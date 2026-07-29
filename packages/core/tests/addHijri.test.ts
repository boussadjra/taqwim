import { describe, it, expect } from 'vitest'
import { addHijri } from '../src/lib/addHijri'

describe('addHijri', () => {
  it('should handle adding only years to the given Hijri date', () => {
    const date = { hy: 1445, hm: 9, hd: 1 }
    const duration = { years: 2 }
    const expectedDate = { hy: 1447, hm: 9, hd: 1 }

    const result = addHijri(date, duration)

    expect(result).toEqual(expectedDate)
  })

  it('should handle adding only months to the given Hijri date', () => {
    const date = { hy: 1445, hm: 9, hd: 1 }
    const duration = { months: 3 }
    const expectedDate = { hy: 1445, hm: 12, hd: 1 }

    const result = addHijri(date, duration)

    expect(result).toEqual(expectedDate)
  })

  it('should handle adding only weeks to the given Hijri date', () => {
    const date = { hy: 1445, hm: 9, hd: 1 }
    const duration = { weeks: 2 }
    const expectedDate = { hy: 1445, hm: 9, hd: 15 }

    const result = addHijri(date, duration)

    expect(result).toEqual(expectedDate)
  })

  it('should handle adding only days to the given Hijri date', () => {
    const date = { hy: 1445, hm: 9, hd: 1 }
    const duration = { days: 10 }
    const expectedDate = { hy: 1445, hm: 9, hd: 11 }

    const result = addHijri(date, duration)

    expect(result).toEqual(expectedDate)
  })

  it('should return the same date if the duration is empty', () => {
    const date = { hy: 1445, hm: 9, hd: 1 }
    const duration = {}

    const result = addHijri(date, duration)

    expect(result).toEqual(date)
  })

  it('should handle adding multiple fields to the given Hijri date', () => {
    const date = { hy: 1445, hm: 9, hd: 1 }
    const duration = { years: 2, months: 3, weeks: 2, days: 10 }
    const expectedDate = { hy: 1447, hm: 12, hd: 25 }

    const result = addHijri(date, duration)

    expect(result).toEqual(expectedDate)
  })
})
