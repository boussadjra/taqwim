import type { HijriDateObject, MonthDay } from './types'
import { getDaysLengthInMonth, getDayInWeek } from '.'

/**
 * Get the days of the previous and next months needed to pad the given month
 * into whole weeks.
 *
 * @param hijriDate - Any date in the month to pad.
 * @param weekStartsOn - Day the week starts on, `0` (Sunday) .. `6` (Saturday).
 *                       Defaults to Sunday.
 * @returns The leading days from the previous month and the trailing days from
 *          the next. `dayInWeek` is the true day of the week (0 = Sunday).
 */
export function getMonthAdjacentDays(
  hijriDate: HijriDateObject,
  weekStartsOn = 0,
): {
  prevMonthDays: MonthDay[]
  nextMonthDays: MonthDay[]
} {
  const firstDayInWeek = getDayInWeek({ ...hijriDate, hd: 1 })
  if (firstDayInWeek === undefined) return { prevMonthDays: [], nextMonthDays: [] }

  const { hy, hm } = hijriDate
  const daysInMonth = getDaysLengthInMonth(hy, hm)
  if (daysInMonth < 0) return { prevMonthDays: [], nextMonthDays: [] }

  // How many cells precede day 1 in this layout.
  const leading = (firstDayInWeek - weekStartsOn + 7) % 7

  const prevMonth = hm === 1 ? 12 : hm - 1
  const prevYear = hm === 1 ? hy - 1 : hy
  const prevMonthLength = getDaysLengthInMonth(prevYear, prevMonth)
  const prevMonthDays: MonthDay[] = []

  for (let i = leading; i > 0; i--) {
    const dayInMonth = prevMonthLength - i + 1
    prevMonthDays.push({
      dayInMonth,
      dayInWeek: (firstDayInWeek - i + 7) % 7,
      date: { hy: prevYear, hm: prevMonth, hd: dayInMonth },
    })
  }

  const nextMonth = hm === 12 ? 1 : hm + 1
  const nextYear = hm === 12 ? hy + 1 : hy

  // Day of the week immediately after the last day of the month.
  const dayAfterEnd = (firstDayInWeek + daysInMonth) % 7
  // Cells left to fill in the final week. Zero when the month ends exactly on
  // the last column — the previous implementation added a whole spurious week
  // in that case, because `i <= 6 - 0` still ran seven times.
  const trailing = (weekStartsOn - dayAfterEnd + 7) % 7

  const nextMonthDays: MonthDay[] = []
  for (let i = 0; i < trailing; i++) {
    nextMonthDays.push({
      dayInMonth: i + 1,
      dayInWeek: (dayAfterEnd + i) % 7,
      date: { hy: nextYear, hm: nextMonth, hd: i + 1 },
    })
  }

  return { prevMonthDays, nextMonthDays }
}
