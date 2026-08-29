import { describe, it, expect } from 'vitest'
import { HijriRangeError } from '../src/lib/errors'
import { parseIsoDate } from '../src/lib/parseIsoDate'
import { toHijri } from '../src/lib/toHijri'

describe('parseIsoDate', () => {
  it('parses date-only ISO strings as local Gregorian calendar dates', () => {
    expect(parseIsoDate('2024-03-11')).toEqual(new Date(2024, 2, 11))
    expect(toHijri('2024-03-11')).toEqual({ hy: 1445, hm: 9, hd: 1 })
  })

  it('rejects invalid month and day values', () => {
    expect(() => parseIsoDate('2024-13-01')).toThrow('Invalid Gregorian date')
    expect(() => parseIsoDate('2024-02-30')).toThrow('Invalid Gregorian date')
    expect(() => parseIsoDate('not-a-date')).toThrow('Invalid Gregorian date')
  })

  it('accepts leap-day dates when valid', () => {
    expect(parseIsoDate('2024-02-29')).toEqual(new Date(2024, 1, 29))
  })

  it('throws HijriRangeError outside the Umm al-Qura table', () => {
    expect(() => toHijri('1920-01-01')).toThrow(HijriRangeError)
  })
})
