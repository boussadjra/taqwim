import type { HijriDateObject } from '@taqwim/core'
import type { CalendarDay, CalendarMonth, CalendarState } from './types'

/**
 * Structural comparison of two calendar snapshots.
 *
 * Written out rather than deep-cloning or `JSON.stringify`-ing because it runs
 * on every option push, and because being explicit documents exactly what
 * counts as an observable change.
 */

function sameDate(a: HijriDateObject | undefined, b: HijriDateObject | undefined): boolean {
  if (a === b) return true
  if (!a || !b) return false
  return a.hy === b.hy && a.hm === b.hm && a.hd === b.hd
}

function sameValue(
  a: HijriDateObject | HijriDateObject[] | undefined,
  b: HijriDateObject | HijriDateObject[] | undefined,
): boolean {
  if (Array.isArray(a) !== Array.isArray(b)) return false
  if (!Array.isArray(a) || !Array.isArray(b)) return sameDate(a as HijriDateObject, b as HijriDateObject)
  return a.length === b.length && a.every((date, index) => sameDate(date, b[index]))
}

function sameDay(a: CalendarDay, b: CalendarDay): boolean {
  return (
    a.dayInMonth === b.dayInMonth &&
    a.dayOfWeek === b.dayOfWeek &&
    a.isOutsideMonth === b.isOutsideMonth &&
    a.isToday === b.isToday &&
    a.isSelected === b.isSelected &&
    a.isDisabled === b.isDisabled &&
    a.isUnavailable === b.isUnavailable &&
    a.isFocused === b.isFocused &&
    a.isTabbable === b.isTabbable &&
    sameDate(a.date, b.date) &&
    a.gregorianDate.getTime() === b.gregorianDate.getTime()
  )
}

function sameMonth(a: CalendarMonth, b: CalendarMonth): boolean {
  if (
    a.label !== b.label ||
    a.secondaryLabel !== b.secondaryLabel ||
    !sameDate(a.value, b.value) ||
    a.weeks.length !== b.weeks.length
  )
    return false

  return a.weeks.every((week, weekIndex) => {
    const other = b.weeks[weekIndex]
    return week.length === other.length && week.every((day, dayIndex) => sameDay(day, other[dayIndex]))
  })
}

function sameGregorianValue(a: Date | Date[] | undefined, b: Date | Date[] | undefined): boolean {
  if (Array.isArray(a) !== Array.isArray(b)) return false
  if (!Array.isArray(a) || !Array.isArray(b)) {
    if (!a && !b) return true
    if (!a || !b) return false
    return a.getTime() === (b as Date).getTime()
  }
  return a.length === b.length && a.every((date, index) => date.getTime() === b[index]!.getTime())
}

export function sameState(a: CalendarState, b: CalendarState): boolean {
  return (
    a.headingValue === b.headingValue &&
    a.secondaryHeadingValue === b.secondaryHeadingValue &&
    a.fullCalendarLabel === b.fullCalendarLabel &&
    a.showGregorian === b.showGregorian &&
    a.dateEmphasis === b.dateEmphasis &&
    a.gregorianLocale === b.gregorianLocale &&
    a.isInvalid === b.isInvalid &&
    a.isNextDisabled === b.isNextDisabled &&
    a.isPrevDisabled === b.isPrevDisabled &&
    a.dir === b.dir &&
    a.locale === b.locale &&
    a.disabled === b.disabled &&
    a.readonly === b.readonly &&
    a.weekStartsOn === b.weekStartsOn &&
    a.fixedWeeks === b.fixedWeeks &&
    a.multiple === b.multiple &&
    sameDate(a.placeholder, b.placeholder) &&
    sameDate(a.focusedDate, b.focusedDate) &&
    sameValue(a.value, b.value) &&
    sameGregorianValue(a.gregorianValue, b.gregorianValue) &&
    a.weekDays.length === b.weekDays.length &&
    a.weekDays.every((label, index) => label === b.weekDays[index]) &&
    a.months.length === b.months.length &&
    a.months.every((month, index) => sameMonth(month, b.months[index]))
  )
}
