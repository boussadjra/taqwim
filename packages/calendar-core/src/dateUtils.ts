import {
  getDaysLengthInMonth,
  isEqual,
  islamicUmmAlQura,
  type HijriCalendarSystem,
  type HijriDateObject,
} from '@taqwim/core'

/**
 * Day arithmetic in epoch-day space.
 *
 * Working in integers rather than chaining `addHijriDays` keeps grid building
 * allocation-free and, more importantly, lets callers test whether a date is
 * representable *before* converting — conversions throw outside the Umm
 * al-Qura table, and a calendar grid routinely reaches past its edges.
 */

export function toEpochDayOrNull(
  date: HijriDateObject,
  calendarSystem: HijriCalendarSystem = islamicUmmAlQura,
): number | null {
  return calendarSystem.toEpochDay(date)
}

export function fromEpochDayOrNull(
  epochDay: number,
  calendarSystem: HijriCalendarSystem = islamicUmmAlQura,
): HijriDateObject | null {
  return calendarSystem.fromEpochDay(epochDay)
}

/** Shift a Hijri date by whole days, or `null` if the result leaves the supported range. */
export function shiftDays(
  date: HijriDateObject,
  days: number,
  calendarSystem: HijriCalendarSystem = islamicUmmAlQura,
): HijriDateObject | null {
  const epochDay = toEpochDayOrNull(date, calendarSystem)
  return epochDay === null ? null : fromEpochDayOrNull(epochDay + days, calendarSystem)
}

/**
 * Shift by whole months, clamping the day to the target month's length so that
 * e.g. the 30th of a 30-day month lands on the 29th of a 29-day month.
 */
export function shiftMonths(
  date: HijriDateObject,
  months: number,
  calendarSystem: HijriCalendarSystem = islamicUmmAlQura,
): HijriDateObject | null {
  const absolute = date.hy * 12 + (date.hm - 1) + months
  const hy = Math.floor(absolute / 12)
  const hm = (absolute % 12) + 1

  const daysInMonth = getDaysLengthInMonth(hy, hm, { calendarSystem })
  if (daysInMonth < 0) {
    return null
  }

  return { hy, hm, hd: Math.min(date.hd, daysInMonth) }
}

export function startOfMonth(date: HijriDateObject): HijriDateObject {
  return { hy: date.hy, hm: date.hm, hd: 1 }
}

/** Chronological comparison: negative if `a` precedes `b`. */
export function compareDates(a: HijriDateObject, b: HijriDateObject): number {
  return a.hy - b.hy || a.hm - b.hm || a.hd - b.hd
}

export function isSameDate(a: HijriDateObject | undefined, b: HijriDateObject | undefined): boolean {
  return Boolean(a && b && isEqual(a, b))
}

export function isSameMonth(a: HijriDateObject, b: HijriDateObject): boolean {
  return a.hy === b.hy && a.hm === b.hm
}

/** Today as a Hijri date, or `null` if the system clock sits outside the table. */
export function todayHijri(calendarSystem: HijriCalendarSystem = islamicUmmAlQura): HijriDateObject | null {
  const today = new Date()
  const epochDay = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86_400_000)
  return calendarSystem.fromEpochDay(epochDay)
}
