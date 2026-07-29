import {
  EPOCH_DAY_RANGE,
  epochDayOf,
  epochDayToDate,
  getDaysLengthInMonth,
  isEqual,
  toGregorian,
  toHijri,
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

export function toEpochDayOrNull(date: HijriDateObject): number | null {
  try {
    const gregorian = toGregorian(date)
    return gregorian ? epochDayOf(gregorian) : null
  } catch {
    return null
  }
}

export function fromEpochDayOrNull(epochDay: number): HijriDateObject | null {
  if (epochDay < EPOCH_DAY_RANGE.min || epochDay > EPOCH_DAY_RANGE.max) {
    return null
  }
  try {
    return toHijri(epochDayToDate(epochDay))
  } catch {
    return null
  }
}

/** Shift a Hijri date by whole days, or `null` if the result leaves the supported range. */
export function shiftDays(date: HijriDateObject, days: number): HijriDateObject | null {
  const epochDay = toEpochDayOrNull(date)
  return epochDay === null ? null : fromEpochDayOrNull(epochDay + days)
}

/**
 * Shift by whole months, clamping the day to the target month's length so that
 * e.g. the 30th of a 30-day month lands on the 29th of a 29-day month.
 */
export function shiftMonths(date: HijriDateObject, months: number): HijriDateObject | null {
  const absolute = date.hy * 12 + (date.hm - 1) + months
  const hy = Math.floor(absolute / 12)
  const hm = (absolute % 12) + 1

  const daysInMonth = getDaysLengthInMonth(hy, hm)
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
export function todayHijri(): HijriDateObject | null {
  try {
    return toHijri(new Date())
  } catch {
    return null
  }
}
