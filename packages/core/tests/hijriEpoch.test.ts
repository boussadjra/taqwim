import { describe, it, expect } from 'vitest'
import { HijriRangeError } from '../src/lib/errors'
import { EPOCH_DAY_RANGE } from '../src/lib/hDatesIndex'
import { epochDayToHijri, hijriToEpochDay, shiftHijriDays } from '../src/lib/hijriEpoch'
import { addHijriDays, getDaysLengthInMonth, subHijriDays } from '../src/lib'

const ramadan1 = { hy: 1445, hm: 9, hd: 1 }
const shaabanLastDay = {
  hy: 1445,
  hm: 8,
  hd: getDaysLengthInMonth({ hy: 1445, hm: 8 }),
}

describe('hijri epoch-day helpers', () => {
  it('round-trips a known Hijri date', () => {
    const epochDay = hijriToEpochDay(ramadan1.hy, ramadan1.hm, ramadan1.hd)
    expect(epochDay).toBeTypeOf('number')
    expect(epochDayToHijri(epochDay!)).toEqual(ramadan1)
  })

  it('adds and subtracts days within the same month', () => {
    expect(addHijriDays(ramadan1, 3)).toEqual({ hy: 1445, hm: 9, hd: 4 })
    expect(subHijriDays({ hy: 1445, hm: 9, hd: 4 }, 3)).toEqual(ramadan1)
  })

  it('crosses month and year boundaries', () => {
    expect(addHijriDays(shaabanLastDay, 1)).toEqual(ramadan1)
    expect(subHijriDays(ramadan1, 1)).toEqual(shaabanLastDay)
  })

  it('supports zero and negative amounts', () => {
    expect(addHijriDays(ramadan1, 0)).toEqual(ramadan1)
    expect(shiftHijriDays(ramadan1, -1)).toEqual(shaabanLastDay)
  })

  it('throws HijriRangeError beyond the supported table', () => {
    const minHijri = epochDayToHijri(EPOCH_DAY_RANGE.min)!
    const maxHijri = epochDayToHijri(EPOCH_DAY_RANGE.max)!

    expect(() => addHijriDays(minHijri, -1)).toThrow(HijriRangeError)
    expect(() => addHijriDays(maxHijri, 1)).toThrow(HijriRangeError)
  })

  it('treats weeks as seven-day shifts', () => {
    expect(addHijriDays(ramadan1, 7)).toEqual(subHijriDays(ramadan1, -7))
  })

  it('inverts day addition inside the supported range', () => {
    const amount = 17
    const shifted = addHijriDays(ramadan1, amount)
    expect(subHijriDays(shifted!, amount)).toEqual(ramadan1)
  })
})
