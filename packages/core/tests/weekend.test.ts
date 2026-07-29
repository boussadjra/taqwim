import { describe, it, expect } from 'vitest'
import { addHijriBusinessDays } from '../src/lib/addHijriBusinessDays'
import { subHijriBusinessDays } from '../src/lib/subHijriBusinessDays'
import { getDayInWeek } from '../src/lib/getDayInWeek'
import { DEFAULT_WEEKEND } from '../src/lib/weekend'

const FRIDAY = 5
const SATURDAY = 6
const SUNDAY = 0
const WESTERN_WEEKEND = [SATURDAY, SUNDAY]

/**
 * The default weekend is Friday/Saturday, not the Monday-Friday working week
 * `date-fns` assumes. These cases are chosen so the two conventions disagree —
 * amounts that are multiples of 5 from a Monday land identically under both,
 * which is why the original business-day tests never caught the difference.
 */
describe('business days and the weekend', () => {
  it('defaults to a Friday/Saturday weekend', () => {
    expect(DEFAULT_WEEKEND).toEqual([FRIDAY, SATURDAY])
  })

  it('skips Friday and Saturday by default', () => {
    // 26 Sha'ban 1445 is a Thursday.
    const thursday = { hy: 1445, hm: 8, hd: 26 }
    expect(getDayInWeek(thursday)).toBe(4)

    // One business day on lands on Sunday, skipping Fri + Sat.
    const next = addHijriBusinessDays(thursday, 1)!
    expect(getDayInWeek(next)).toBe(SUNDAY)
  })

  it('skips Saturday and Sunday when configured for a Western week', () => {
    const thursday = { hy: 1445, hm: 8, hd: 26 }

    // Under a Sat/Sun weekend, Thursday + 1 is simply Friday.
    const next = addHijriBusinessDays(thursday, 1, { weekend: WESTERN_WEEKEND })!
    expect(getDayInWeek(next)).toBe(FRIDAY)
  })

  it('never returns a weekend day', () => {
    const start = { hy: 1445, hm: 9, hd: 1 }

    for (let amount = 1; amount <= 30; amount++) {
      const forward = addHijriBusinessDays(start, amount)!
      expect(DEFAULT_WEEKEND).not.toContain(getDayInWeek(forward))

      const backward = subHijriBusinessDays(start, amount)!
      expect(DEFAULT_WEEKEND).not.toContain(getDayInWeek(backward))
    }
  })

  it('treats add and sub as inverses when starting on a business day', () => {
    // 12 Rabi' I 1446 is a Sunday.
    const start = { hy: 1446, hm: 3, hd: 12 }
    expect(DEFAULT_WEEKEND).not.toContain(getDayInWeek(start))

    const forward = addHijriBusinessDays(start, 7)!
    expect(subHijriBusinessDays(forward, 7)).toEqual(start)
  })

  it('does not round-trip from a weekend start, because the start is not a business day', () => {
    // 10 Rabi' I 1446 is a Friday. Counting business days away and back lands
    // on the nearest business day, never on the weekend day itself.
    const friday = { hy: 1446, hm: 3, hd: 10 }
    expect(getDayInWeek(friday)).toBe(FRIDAY)

    const forward = addHijriBusinessDays(friday, 7)!
    const back = subHijriBusinessDays(forward, 7)!

    expect(back).not.toEqual(friday)
    expect(DEFAULT_WEEKEND).not.toContain(getDayInWeek(back))
  })

  it('advances five business days per calendar week', () => {
    const start = { hy: 1445, hm: 9, hd: 1 }

    // 5 business days is exactly one week under any 2-day weekend.
    const oneWeekOn = addHijriBusinessDays(start, 5)!
    expect(getDayInWeek(oneWeekOn)).toBe(getDayInWeek(start))
  })

  it('returns the same date for an amount of zero', () => {
    const start = { hy: 1445, hm: 9, hd: 1 }
    expect(addHijriBusinessDays(start, 0)).toEqual(start)
  })

  it('rejects a weekend that covers every day', () => {
    expect(() => addHijriBusinessDays({ hy: 1445, hm: 9, hd: 1 }, 1, { weekend: [0, 1, 2, 3, 4, 5, 6] })).toThrow(
      /all seven days/,
    )
  })

  it('rejects out-of-range weekend days', () => {
    expect(() => addHijriBusinessDays({ hy: 1445, hm: 9, hd: 1 }, 1, { weekend: [7] })).toThrow(/integers 0-6/)
  })

  it('supports a single-day weekend', () => {
    const start = { hy: 1445, hm: 9, hd: 1 }

    // With only Friday off, 6 business days is exactly one calendar week.
    const oneWeekOn = addHijriBusinessDays(start, 6, { weekend: [FRIDAY] })!
    expect(getDayInWeek(oneWeekOn)).toBe(getDayInWeek(start))
  })
})
