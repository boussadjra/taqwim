import { describe, it, expect } from 'vitest'
import { formatHijriDate } from '../src/lib/formatHijriDate'

describe('formatHijriDate', () => {
  it('formats the Hijri date correctly with default locale', () => {
    const hijriDate = { hy: 1443, hm: 3, hd: 10 }
    const formatStr = 'iYYYY/iMM/iDD'
    const expectedFormattedDate = '1443/03/10'

    const formattedDate = formatHijriDate(hijriDate, formatStr)
    console.log(formattedDate)
    expect(formattedDate).toEqual(expectedFormattedDate)
  })

  it('formats the Hijri date correctly with specified locale', () => {
    const hijriDate = { hy: 1443, hm: 3, hd: 10 }
    const formatStr = 'iD iMMM, iYYYY'
    const locale = 'en'
    const expectedFormattedDate = "10 Rabi'1, 1443"

    const formattedDate = formatHijriDate(hijriDate, formatStr, locale)

    console.log(formattedDate)

    expect(formattedDate).toEqual(expectedFormattedDate)
  })

  it('formats the Hijri date correctly with specified locale', () => {
    const hijriDate = { hy: 1445, hm: 9, hd: 1 }
    const formatStr = 'iEEEE, iD iMMMM iYYYY'
    const locale = 'ar'
    const expectedFormattedDate = 'الإثنين, 1 رمضان 1445'

    const formattedDate = formatHijriDate(hijriDate, formatStr, locale)

    console.log(formattedDate)

    expect(formattedDate).toEqual(expectedFormattedDate)
  })

  it('formats the Hijri date correctly with specified locale', () => {
    const hijriDate = { hy: 1445, hm: 9, hd: 1 }
    const formatStr = 'iE, iD iMMM iYYYY'
    const locale = 'en'
    const expectedFormattedDate = '1, 1 Ramadan 1445'

    const formattedDate = formatHijriDate(hijriDate, formatStr, locale)

    console.log(formattedDate)

    expect(formattedDate).toEqual(expectedFormattedDate)
  })

  it('formats the Hijri date with its corresponding gregorian date', () => {
    const hijriDate = { hy: 1445, hm: 9, hd: 1 }
    const formatStr = 'iD iMMM, iYYYY الموافق لـ dd MMMM, yyyy'
    const locale = 'ar'
    const expectedFormattedDate = '1 رمضان, 1445 الموافق لـ 11 مارس, 2024'

    const formattedDate = formatHijriDate(hijriDate, formatStr, locale)

    console.log(formattedDate)

    expect(formattedDate).toEqual(expectedFormattedDate)
  })

  it('Throws an error when the locale is not supported', () => {
    const hijriDate = { hy: 1445, hm: 9, hd: 1 }
    const formatStr = 'iD iMMM, iYYYY'
    const locale = 'zz'

    expect(() => formatHijriDate(hijriDate, formatStr, locale)).toThrowError(`The locale "${locale}" is not supported.`)
  })

  it('Throws an error when the date is not a valid Hijri date', () => {
    const hijriDate = { hy: 1445, hm: 9, hd: 31 }
    const formatStr = 'iD iMMM, iYYYY'
    const locale = 'ar'

    expect(() => formatHijriDate(hijriDate, formatStr, locale)).toThrowError('Invalid Hijri date')
  })
})
