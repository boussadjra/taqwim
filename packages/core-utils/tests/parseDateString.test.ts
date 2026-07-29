import { describe, it, expect, vi, afterEach } from 'vitest'
import { parseDateString } from '../src/lib/parseDateString'

describe('parseDateString', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should parse a valid date string in the format yyyy-MM-dd', () => {
    const dateString = '1446-01-10'
    const expectedDate = { hy: 1446, hm: 1, hd: 10 }
    const result = parseDateString(dateString)
    expect(result).toEqual(expectedDate)
  })

  it('should parse a valid date string in the format dd-MM-yyyy', () => {
    const dateString = '10-01-1446'
    const expectedDate = { hy: 1446, hm: 1, hd: 10 }
    const result = parseDateString(dateString)
    expect(result).toEqual(expectedDate)
  })

  it('should return the current date if the passed parameter is empty', () => {
    // Pinned: this assertion is only meaningful against a fixed "now".
    // 2024-07-22 (Gregorian) is 1446-01-16 (Hijri).
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 6, 22))

    expect(parseDateString('')).toEqual({ hy: 1446, hm: 1, hd: 16 })
  })
  it('should throw an error for an invalid date', () => {
    const dateString = '1446/01/31'
    // console.log(parseDateString(dateString))
    expect(() => parseDateString(dateString)).toThrow('Invalid date')
  })

  it('should throw an error for an invalid date format', () => {
    const dateString = '01*01*1446'
    expect(() => parseDateString(dateString)).toThrow('Invalid date format')
  })
})
