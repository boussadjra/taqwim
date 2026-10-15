import { describe, expect, it } from 'vitest'
import { addHijri, subHijri, type HijriDuration } from '../src'
import { islamicCivil } from '../src/lib/calendars/islamic-civil'

describe.each([
  ['addHijri', addHijri],
  ['subHijri', subHijri],
] as const)('%s duration validation', (_name, applyDuration) => {
  it.each<HijriDuration>([{}, { years: 0 }, { months: 0, weeks: 0, days: 0 }])(
    'rejects invalid dates even for a no-op duration %j',
    duration => {
      expect(applyDuration({ hy: 1445, hm: 9, hd: 31 }, duration)).toBeNull()
      expect(applyDuration({ hy: 1342, hm: 1, hd: 1 }, duration)).toBeNull()
    },
  )

  it('validates using the requested calendar strategy', () => {
    const date = { hy: 0, hm: 1, hd: 1 }
    const duration: HijriDuration = {}
    expect(applyDuration(date, duration, { calendarSystem: islamicCivil })).toEqual(date)
    expect(applyDuration({ hy: 1445, hm: 2, hd: 30 }, duration, { calendarSystem: islamicCivil })).toBeNull()
  })
})
