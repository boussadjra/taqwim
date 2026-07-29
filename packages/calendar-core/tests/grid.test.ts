import { describe, it, expect } from 'vitest'
import { getDayInWeek, getDaysLengthInMonth } from '@taqwim/core'
import { createCalendar } from '../src/store'
import type { CalendarDay, WeekStartsOn } from '../src/types'

const RAMADAN_1445 = { hy: 1445, hm: 9, hd: 1 }

function flatten(days: CalendarDay[][]): CalendarDay[] {
  return days.flat()
}

describe('grid layout', () => {
  it('lays out weeks of seven days', () => {
    const state = createCalendar({ placeholder: RAMADAN_1445 }).getSnapshot()

    expect(state.months).toHaveLength(1)
    for (const week of state.months[0].weeks) {
      expect(week).toHaveLength(7)
    }
  })

  it('contains every day of the month exactly once, in order', () => {
    const state = createCalendar({ placeholder: RAMADAN_1445 }).getSnapshot()
    const inMonth = flatten(state.months[0].weeks).filter(day => !day.isOutsideMonth)
    const daysInMonth = getDaysLengthInMonth(RAMADAN_1445.hy, RAMADAN_1445.hm)

    expect(inMonth).toHaveLength(daysInMonth)
    expect(inMonth.map(day => day.dayInMonth)).toEqual(Array.from({ length: daysInMonth }, (_, i) => i + 1))
  })

  it('covers every month of a year with no missing or duplicated days', () => {
    for (let hm = 1; hm <= 12; hm++) {
      const state = createCalendar({ placeholder: { hy: 1446, hm, hd: 1 } }).getSnapshot()
      const inMonth = flatten(state.months[0].weeks).filter(day => !day.isOutsideMonth)
      const expected = getDaysLengthInMonth(1446, hm)

      expect(
        inMonth.map(day => day.dayInMonth),
        `month ${hm}`,
      ).toEqual(Array.from({ length: expected }, (_, i) => i + 1))
    }
  })

  describe('weekStartsOn', () => {
    // Previously inert: the grid and the weekday labels both hardcoded Sunday.
    it.each([0, 1, 2, 3, 4, 5, 6] as WeekStartsOn[])('starts each week on day %i', weekStartsOn => {
      const state = createCalendar({ placeholder: RAMADAN_1445, weekStartsOn }).getSnapshot()

      for (const week of state.months[0].weeks) {
        expect(getDayInWeek(week[0].date)).toBe(weekStartsOn)
      }
    })

    it('rotates the weekday labels to match', () => {
      const sunday = createCalendar({ placeholder: RAMADAN_1445, weekStartsOn: 0 }).getSnapshot()
      const monday = createCalendar({ placeholder: RAMADAN_1445, weekStartsOn: 1 }).getSnapshot()

      expect(monday.weekDays[0]).toBe(sunday.weekDays[1])
      expect(monday.weekDays[6]).toBe(sunday.weekDays[0])
    })

    it('keeps the same set of days regardless of where the week starts', () => {
      const sunday = createCalendar({ placeholder: RAMADAN_1445, weekStartsOn: 0 }).getSnapshot()
      const wednesday = createCalendar({ placeholder: RAMADAN_1445, weekStartsOn: 3 }).getSnapshot()

      const inMonth = (state: typeof sunday) =>
        flatten(state.months[0].weeks)
          .filter(day => !day.isOutsideMonth)
          .map(day => day.dayInMonth)

      expect(inMonth(wednesday)).toEqual(inMonth(sunday))
    })
  })

  describe('fixedWeeks', () => {
    // Previously inert: threaded through context but never applied.
    it('always renders six rows when enabled', () => {
      for (let hm = 1; hm <= 12; hm++) {
        const state = createCalendar({ placeholder: { hy: 1445, hm, hd: 1 }, fixedWeeks: true }).getSnapshot()
        expect(state.months[0].weeks, `month ${hm}`).toHaveLength(6)
      }
    })

    it('renders only the rows it needs when disabled', () => {
      const rowCounts = new Set<number>()

      for (let hm = 1; hm <= 12; hm++) {
        const state = createCalendar({ placeholder: { hy: 1445, hm, hd: 1 }, fixedWeeks: false }).getSnapshot()
        rowCounts.add(state.months[0].weeks.length)
      }

      // A 29/30-day month spans 5 or 6 rows depending on its first weekday.
      expect([...rowCounts].every(count => count === 5 || count === 6)).toBe(true)
      expect(rowCounts.size).toBeGreaterThan(1)
    })
  })

  describe('numberOfMonths', () => {
    // Previously inert: the grid only ever computed one month.
    it('renders the requested number of consecutive months', () => {
      const state = createCalendar({ placeholder: RAMADAN_1445, numberOfMonths: 3 }).getSnapshot()

      expect(state.months).toHaveLength(3)
      expect(state.months.map(month => month.value.hm)).toEqual([9, 10, 11])
    })

    it('rolls over the year boundary', () => {
      const state = createCalendar({ placeholder: { hy: 1445, hm: 12, hd: 1 }, numberOfMonths: 2 }).getSnapshot()

      expect(state.months.map(month => ({ hy: month.value.hy, hm: month.value.hm }))).toEqual([
        { hy: 1445, hm: 12 },
        { hy: 1446, hm: 1 },
      ])
    })

    it('gives each month its own heading', () => {
      const state = createCalendar({ placeholder: RAMADAN_1445, numberOfMonths: 2 }).getSnapshot()

      expect(state.months[0].label).not.toBe(state.months[1].label)
    })
  })

  it('marks adjacent days as outside the month', () => {
    const state = createCalendar({ placeholder: RAMADAN_1445, fixedWeeks: true }).getSnapshot()
    const days = flatten(state.months[0].weeks)

    expect(days.filter(day => day.isOutsideMonth).length).toBeGreaterThan(0)
    for (const day of days.filter(d => d.isOutsideMonth)) {
      expect(day.date.hm).not.toBe(9)
    }
  })
})
