import { describe, it, expect } from 'vitest'
import { hDatesTable } from '../src/lib/hDates'
import { daysInHijriMonth, epochDayOf, MAX_HIJRI_YEAR, MIN_HIJRI_YEAR } from '../src/lib/hDatesIndex'
import { toGregorian } from '../src/lib/toGregorian'
import { toHijri } from '../src/lib/toHijri'

/**
 * Exhaustive verification of the binary-search conversion against the whole
 * Umm al-Qura table (~56k days). The previous implementation scanned the table
 * linearly and allocated a Date per row; these properties are what guarantee
 * the replacement is equivalent rather than merely faster.
 */
describe('Hijri <-> Gregorian conversion', () => {
  // ~56k dates. Mismatches are collected rather than asserted per-iteration:
  // 56k individual `expect` calls are slow enough to trip the default timeout.
  it('round-trips every date in the supported range, with no gaps', () => {
    const roundTripMismatches: string[] = []
    const dayGaps: string[] = []
    let previousEpochDay: number | undefined
    let checked = 0

    for (const record of hDatesTable) {
      for (let hm = 1; hm <= 12; hm++) {
        for (let hd = 1; hd <= daysInHijriMonth(record.dpm, hm); hd++) {
          const label = `${record.hy}-${hm}-${hd}`
          const gregorian = toGregorian({ hy: record.hy, hm, hd })!
          const back = toHijri(gregorian)!

          if (back.hy !== record.hy || back.hm !== hm || back.hd !== hd) {
            roundTripMismatches.push(`${label} -> ${back.hy}-${back.hm}-${back.hd}`)
          }

          const epochDay = epochDayOf(gregorian)
          if (previousEpochDay !== undefined && epochDay - previousEpochDay !== 1) {
            dayGaps.push(`${label} (delta ${epochDay - previousEpochDay})`)
          }
          previousEpochDay = epochDay
          checked++
        }
      }
    }

    expect(roundTripMismatches.slice(0, 10)).toEqual([])
    expect(dayGaps.slice(0, 10)).toEqual([])
    // 159 years of ~354 days.
    expect(checked).toBeGreaterThan(55_000)
  }, 30_000)

  it('returns Gregorian dates at local midnight', () => {
    const result = toGregorian({ hy: 1445, hm: 9, hd: 1 })!

    expect(result.getHours()).toBe(0)
    expect(result.getMinutes()).toBe(0)
    expect(result.getSeconds()).toBe(0)
    expect(result.getMilliseconds()).toBe(0)
  })

  it('is unaffected by the current time of day', () => {
    // Regression: toGregorian used to build its result from `new Date()`, so
    // it inherited the current wall-clock time instead of returning midnight.
    const first = toGregorian({ hy: 1446, hm: 1, hd: 1 })!
    const second = toGregorian({ hy: 1446, hm: 1, hd: 1 })!

    expect(first.getTime()).toBe(second.getTime())
  })

  it('exposes the table bounds as the supported range', () => {
    expect(MIN_HIJRI_YEAR).toBe(1343)
    expect(MAX_HIJRI_YEAR).toBe(1500)
  })
})
