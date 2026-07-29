import { describe, it, expect } from 'vitest'
import { getMonthAdjacentDays } from '../src/lib/getMonthAdjacentDays'

describe('getMonthAdjacentDays', () => {
  it('should return the days of the previous and next months of the given Hijri date', () => {
    const hijriDate = { hy: 1445, hm: 9, hd: 1 }
    const result = getMonthAdjacentDays(hijriDate)
    expect(result.prevMonthDays).toEqual([{ dayInMonth: 29, dayInWeek: 0, date: { hy: 1445, hm: 8, hd: 29 } }])
    expect(result.nextMonthDays).toEqual([
      { dayInMonth: 1, dayInWeek: 3, date: { hy: 1445, hm: 10, hd: 1 } },
      { dayInMonth: 2, dayInWeek: 4, date: { hy: 1445, hm: 10, hd: 2 } },
      { dayInMonth: 3, dayInWeek: 5, date: { hy: 1445, hm: 10, hd: 3 } },
      { dayInMonth: 4, dayInWeek: 6, date: { hy: 1445, hm: 10, hd: 4 } },
    ])
  })

  it('should return the days of the previous empty and next months of the given Hijri date', () => {
    const hijriDate = { hy: 1446, hm: 1, hd: 1 }
    const result = getMonthAdjacentDays(hijriDate)
    expect(result.prevMonthDays).toEqual([])
    expect(result.nextMonthDays).toEqual([
      { dayInMonth: 1, dayInWeek: 1, date: { hy: 1446, hm: 2, hd: 1 } },
      { dayInMonth: 2, dayInWeek: 2, date: { hy: 1446, hm: 2, hd: 2 } },
      { dayInMonth: 3, dayInWeek: 3, date: { hy: 1446, hm: 2, hd: 3 } },
      { dayInMonth: 4, dayInWeek: 4, date: { hy: 1446, hm: 2, hd: 4 } },
      { dayInMonth: 5, dayInWeek: 5, date: { hy: 1446, hm: 2, hd: 5 } },
      { dayInMonth: 6, dayInWeek: 6, date: { hy: 1446, hm: 2, hd: 6 } },
    ])
  })

  it('should return the days of the previous and next empty months of the given Hijri date between 1445-12-29 and 1446-1-1', () => {
    const hijriDate = { hy: 1445, hm: 12, hd: 1 }
    const result = getMonthAdjacentDays(hijriDate)
    console.log(result)
    expect(result.prevMonthDays).toEqual([
      {
        dayInMonth: 25,
        dayInWeek: 0,
        date: {
          hy: 1445,
          hm: 11,
          hd: 25,
        },
      },
      {
        dayInMonth: 26,
        dayInWeek: 1,
        date: {
          hy: 1445,
          hm: 11,
          hd: 26,
        },
      },
      {
        dayInMonth: 27,
        dayInWeek: 2,
        date: {
          hy: 1445,
          hm: 11,
          hd: 27,
        },
      },
      {
        dayInMonth: 28,
        dayInWeek: 3,
        date: {
          hy: 1445,
          hm: 11,
          hd: 28,
        },
      },
      {
        dayInMonth: 29,
        dayInWeek: 4,
        date: {
          hy: 1445,
          hm: 11,
          hd: 29,
        },
      },
    ])
  })
})
