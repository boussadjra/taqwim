import { describe, it, expect } from 'vitest'
import { getMonthAdjacentDays } from '../src/lib/getMonthAdjacentDays'
import { getDayInWeek } from '../src/lib/getDayInWeek'
import { getDaysLengthInMonth } from '../src/lib/getDaysLengthInMonth'

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

describe('getMonthAdjacentDays: padding to whole weeks', () => {
  const YEARS = [1444, 1445, 1446, 1447]

  it('pads every month to a whole number of weeks', () => {
    for (const hy of YEARS) {
      for (let hm = 1; hm <= 12; hm++) {
        const { prevMonthDays, nextMonthDays } = getMonthAdjacentDays({ hy, hm, hd: 1 })
        const total = prevMonthDays.length + getDaysLengthInMonth(hy, hm) + nextMonthDays.length

        expect(total % 7, `${hy}-${hm} spans ${total} cells`).toBe(0)
      }
    }
  })

  it('adds no trailing days when the month ends on the last column', () => {
    // Ramadan 1446 starts on a Saturday and has 29 days, so it ends exactly
    // on the final column. The old implementation added a whole spurious
    // extra week here, because `i <= 6 - 0` still looped seven times.
    const monthEndingOnBoundary = { hy: 1446, hm: 9, hd: 1 }
    const firstDayOfWeek = getDayInWeek(monthEndingOnBoundary)!
    const daysInMonth = getDaysLengthInMonth(1446, 9)
    expect((firstDayOfWeek + daysInMonth) % 7).toBe(0)

    expect(getMonthAdjacentDays(monthEndingOnBoundary).nextMonthDays).toEqual([])
  })

  it('reports the true day of the week for every padded day', () => {
    const { prevMonthDays, nextMonthDays } = getMonthAdjacentDays({ hy: 1445, hm: 12, hd: 1 })

    for (const day of [...prevMonthDays, ...nextMonthDays]) {
      expect(day.dayInWeek).toBe(getDayInWeek(day.date))
    }
  })

  describe('weekStartsOn', () => {
    it('shifts how many leading days are needed', () => {
      const sunday = getMonthAdjacentDays({ hy: 1446, hm: 3, hd: 1 }, 0)
      const monday = getMonthAdjacentDays({ hy: 1446, hm: 3, hd: 1 }, 1)

      expect(monday.prevMonthDays.length).not.toBe(sunday.prevMonthDays.length)
    })

    it('still pads to whole weeks for any start day', () => {
      for (let weekStartsOn = 0; weekStartsOn <= 6; weekStartsOn++) {
        for (let hm = 1; hm <= 12; hm++) {
          const { prevMonthDays, nextMonthDays } = getMonthAdjacentDays({ hy: 1446, hm, hd: 1 }, weekStartsOn)
          const total = prevMonthDays.length + getDaysLengthInMonth(1446, hm) + nextMonthDays.length

          expect(total % 7, `weekStartsOn=${weekStartsOn} month=${hm}`).toBe(0)
        }
      }
    })

    it('starts the padded span on the requested day', () => {
      for (let weekStartsOn = 0; weekStartsOn <= 6; weekStartsOn++) {
        const { prevMonthDays } = getMonthAdjacentDays({ hy: 1446, hm: 3, hd: 1 }, weekStartsOn)
        const firstCell = prevMonthDays[0]?.date ?? { hy: 1446, hm: 3, hd: 1 }

        expect(getDayInWeek(firstCell), `weekStartsOn=${weekStartsOn}`).toBe(weekStartsOn)
      }
    })
  })
})
