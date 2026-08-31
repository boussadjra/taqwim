import {
  getDayInWeek,
  getDaysLengthInMonth,
  getLocaleData,
  islamicUmmAlQura,
  type HijriCalendarSystem,
  type HijriDateObject,
} from '@taqwim/core'
import { fromEpochDayOrNull, isSameMonth, startOfMonth, toEpochDayOrNull } from './dateUtils'
import type { WeekDayFormat, WeekStartsOn } from './types'

const DAYS_PER_WEEK = 7
const FIXED_WEEK_ROWS = 6

/** A grid cell before selection/focus state is layered on. */
export interface RawDay {
  date: HijriDateObject
  dayInMonth: number
  dayOfWeek: number
  isOutsideMonth: boolean
}

/**
 * Weekday labels rotated so index 0 is `weekStartsOn`.
 *
 * The locale arrays are always Sunday-first; the previous implementation used
 * them as-is, which is why `weekStartsOn` had no visible effect.
 */
export function buildWeekDays(locale: string, format: WeekDayFormat, weekStartsOn: WeekStartsOn): string[] {
  const labels = getLocaleData(locale, format) as string[]
  return Array.from({ length: DAYS_PER_WEEK }, (_, i) => labels[(i + weekStartsOn) % DAYS_PER_WEEK])
}

/**
 * Build one month's grid: leading days from the previous month, the month
 * itself, then trailing days to complete the final week.
 *
 * @param fixedWeeks Pad to six rows so the calendar's height never changes
 *                   between months.
 */
export function buildMonthWeeks(
  month: HijriDateObject,
  weekStartsOn: WeekStartsOn,
  fixedWeeks: boolean,
  calendarSystem: HijriCalendarSystem = islamicUmmAlQura,
): RawDay[][] {
  const first = startOfMonth(month)
  const firstDayOfWeek = getDayInWeek(first, { calendarSystem })
  const daysInMonth = getDaysLengthInMonth(month.hy, month.hm, { calendarSystem })

  if (firstDayOfWeek === undefined || daysInMonth < 0) {
    return []
  }

  // How many trailing days of the previous month precede day 1 in this layout.
  const leading = (firstDayOfWeek - weekStartsOn + DAYS_PER_WEEK) % DAYS_PER_WEEK

  const used = leading + daysInMonth
  const trailing = fixedWeeks
    ? FIXED_WEEK_ROWS * DAYS_PER_WEEK - used
    : (DAYS_PER_WEEK - (used % DAYS_PER_WEEK)) % DAYS_PER_WEEK

  const firstEpochDay = toEpochDayOrNull(first, calendarSystem)
  if (firstEpochDay === null) {
    return []
  }

  const startEpochDay = firstEpochDay - leading
  const totalDays = used + trailing
  const weeks: RawDay[][] = []
  let week: RawDay[] = []

  for (let i = 0; i < totalDays; i++) {
    const date = fromEpochDayOrNull(startEpochDay + i, calendarSystem)

    // Near the table's edges the surrounding days may not be representable.
    // Drop the row rather than surfacing a half-built week.
    if (!date) {
      week.push(null as unknown as RawDay)
    } else {
      week.push({
        date,
        dayInMonth: date.hd,
        dayOfWeek: (weekStartsOn + (i % DAYS_PER_WEEK)) % DAYS_PER_WEEK,
        isOutsideMonth: !isSameMonth(date, month),
      })
    }

    if (week.length === DAYS_PER_WEEK) {
      weeks.push(week.filter(Boolean))
      week = []
    }
  }

  if (week.length > 0) {
    weeks.push(week.filter(Boolean))
  }

  return weeks.filter(row => row.length > 0)
}

/** The months a calendar shows, starting at `placeholder`. */
export function visibleMonths(placeholder: HijriDateObject, numberOfMonths: number): HijriDateObject[] {
  const months: HijriDateObject[] = []
  const base = startOfMonth(placeholder)

  for (let i = 0; i < numberOfMonths; i++) {
    const absolute = base.hy * 12 + (base.hm - 1) + i
    months.push({ hy: Math.floor(absolute / 12), hm: (absolute % 12) + 1, hd: 1 })
  }

  return months
}
