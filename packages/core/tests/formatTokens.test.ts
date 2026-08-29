import { describe, it, expect } from 'vitest'
import { formatHijriDate } from '../src/lib/formatHijriDate'

const ramadan1 = { hy: 1445, hm: 9, hd: 1 }

describe('formatHijriDate tokens', () => {
  it.each([
    ['iYYYY', '1445'],
    ['iYY', '45'],
    ['iMM', '09'],
    ['iM', '9'],
    ['iDD', '01'],
    ['iD', '1'],
    ['yyyy-MM-dd', '2024-03-11'],
  ] as const)('formats %s', (token, expected) => {
    expect(formatHijriDate(ramadan1, token)).toBe(expected)
  })

  it('formats mixed Hijri and Gregorian output in Arabic', () => {
    expect(formatHijriDate(ramadan1, 'iD iMMM, iYYYY الموافق لـ dd MMMM, yyyy', 'ar')).toBe(
      '1 رمضان, 1445 الموافق لـ 11 مارس, 2024',
    )
  })

  it('formats Hijri weekday names from bundled locale data', () => {
    expect(formatHijriDate(ramadan1, 'iEEEE iD iMMMM iYYYY', 'en')).toBe('Monday 1 Ramadan 1445')
    expect(formatHijriDate(ramadan1, 'iD iMMM iYYYY', 'fr')).toBe('1 Ramadan 1445')
  })
})
