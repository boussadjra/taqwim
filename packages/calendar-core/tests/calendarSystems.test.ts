import { islamicCivil } from '@taqwim/core/calendars/islamic-civil'
import { islamicTbla } from '@taqwim/core/calendars/islamic-tbla'
import { islamicUmmAlQura, type HijriDateObject } from '@taqwim/core'
import { describe, expect, it, vi } from 'vitest'
import { createCalendar } from '../src'

const PLACEHOLDER: HijriDateObject = { hy: 1448, hm: 3, hd: 1 }
const VALUE: HijriDateObject = { hy: 1448, hm: 3, hd: 10 }

describe('calendar strategies', () => {
  it('uses one strategy consistently for grids and Gregorian derived values', () => {
    const store = createCalendar({
      calendarSystem: islamicCivil,
      defaultPlaceholder: PLACEHOLDER,
      defaultValue: VALUE,
      showGregorian: true,
    })
    const state = store.getSnapshot()
    const selected = state.months.flatMap(month => month.weeks.flat()).find(day => day.isSelected)!

    expect(state.calendarSystem).toBe(islamicCivil)
    expect(islamicCivil.toEpochDay(selected.date)).toBe(islamicCivil.toEpochDay(VALUE))
    expect(selected.gregorianDate.getTime()).toBe((state.gregorianValue as Date).getTime())
    expect(state.secondaryHeadingValue).toBe(store.formatter.gregorianMonthRange(PLACEHOLDER))
  })

  it('rebuilds all derived state when the calendar changes without emitting selection', () => {
    const onValueChange = vi.fn()
    const store = createCalendar({
      calendarSystem: islamicUmmAlQura,
      defaultPlaceholder: PLACEHOLDER,
      defaultValue: VALUE,
      showGregorian: true,
      onValueChange,
    })
    const before = store.getSnapshot()
    const beforeGregorian = (before.gregorianValue as Date).getTime()

    store.setOptions({ calendarSystem: islamicCivil })
    const civil = store.getSnapshot()
    store.setOptions({ calendarSystem: islamicTbla })
    const tbla = store.getSnapshot()

    expect(civil).not.toBe(before)
    expect(civil.calendarSystem).toBe(islamicCivil)
    expect((civil.gregorianValue as Date).getTime()).not.toBe(beforeGregorian)
    expect((tbla.gregorianValue as Date).getTime() - (civil.gregorianValue as Date).getTime()).toBe(-86_400_000)
    expect(tbla.value).toEqual(VALUE)
    expect(tbla.placeholder).toEqual(PLACEHOLDER)
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('preserves a controlled numeric value that becomes invalid under the new strategy', () => {
    let value: HijriDateObject | undefined
    for (let year = 1343; year <= 1500 && !value; year++) {
      for (let month = 1; month <= 12; month++) {
        if (islamicUmmAlQura.daysInMonth(year, month) === 30 && islamicCivil.daysInMonth(year, month) === 29) {
          value = { hy: year, hm: month, hd: 30 }
          break
        }
      }
    }
    expect(value).toBeDefined()

    const store = createCalendar({ value, placeholder: value, calendarSystem: islamicUmmAlQura })
    expect(store.getSnapshot().isInvalid).toBe(false)
    store.setOptions({ calendarSystem: islamicCivil })

    expect(store.getSnapshot().value).toEqual(value)
    expect(store.getSnapshot().isInvalid).toBe(true)
  })
})
