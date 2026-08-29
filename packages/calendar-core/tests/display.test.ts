import { describe, expect, it } from 'vitest'
import { createFormatter } from '../src/formatter'
import { getCellDisplayValues } from '../src/display'
import type { CalendarDay } from '../src/types'

const RAMADAN_9: CalendarDay = {
  date: { hy: 1445, hm: 9, hd: 9 },
  gregorianDate: new Date(2024, 2, 19),
  isToday: false,
  isSelected: false,
  isDisabled: false,
  isUnavailable: false,
  isOutsideMonth: false,
}

describe('getCellDisplayValues', () => {
  const formatter = createFormatter('en')

  it('returns Hijri-only values when Gregorian is hidden', () => {
    expect(getCellDisplayValues(RAMADAN_9, formatter, false, 'hijri')).toEqual({
      dayValue: '9',
      hijriDayValue: '9',
      gregorianDayValue: '19',
      primaryDayValue: '9',
    })
  })

  it('uses day numbers for the secondary label when both calendars are shown', () => {
    const hijriPrimary = getCellDisplayValues(RAMADAN_9, formatter, true, 'hijri')
    expect(hijriPrimary.primaryDayValue).toBe('9')
    expect(hijriPrimary.secondaryDayValue).toBe('19')
    expect(hijriPrimary.secondaryDayValue).not.toMatch(/[A-Za-z]/)

    const gregorianPrimary = getCellDisplayValues(RAMADAN_9, formatter, true, 'gregorian')
    expect(gregorianPrimary.primaryDayValue).toBe('19')
    expect(gregorianPrimary.secondaryDayValue).toBe('9')
  })
})
