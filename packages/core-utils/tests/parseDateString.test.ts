import { describe, it, expect } from 'vitest'
import { parseDateString } from '../src/lib/parseDateString'

describe('parseDateString', () => {
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
