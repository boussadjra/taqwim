import type { HijriDateObject, MonthDay } from './types'
import { getDaysLengthInMonth, getDayInWeek } from '.'

/**
 * Get the days of the previous and next months of the given Hijri date.
 * @param hijriDate - The Hijri date to get the adjacent days of.
 * @returns An object containing the days of the previous and next months.
 */
export function getMonthAdjacentDays(hijriDate: HijriDateObject): {
  prevMonthDays: MonthDay[]
  nextMonthDays: MonthDay[]
} {
  // dayInWeek is the day of the week of the first day of the month
  const dayInWeek = getDayInWeek({
    ...hijriDate,
    hd: 1,
  })
  if (dayInWeek === undefined) return { prevMonthDays: [], nextMonthDays: [] }
  const { hy, hm } = hijriDate
  const prevMonth = hm === 1 ? 12 : hm - 1
  const prevYear = hm === 1 ? hy - 1 : hy
  const prevMonthLength = getDaysLengthInMonth(prevYear, prevMonth)
  const prevMonthStartDay = dayInWeek
  const prevMonthDays: MonthDay[] = []
  console.log(prevMonthStartDay)
  for (let i = prevMonthStartDay; i > 0; i--) {
    prevMonthDays.push({
      dayInMonth: prevMonthLength - i + 1,
      dayInWeek: dayInWeek - i,
      date: { hy: prevYear, hm: prevMonth, hd: prevMonthLength - i + 1 },
    })
  }

  const nextMonth = hm === 12 ? 1 : hm + 1
  const nextYear = hm === 12 ? hy + 1 : hy

  const endDayInWeek = (dayInWeek + getDaysLengthInMonth(hy, hm)) % 7

  const nextMonthDays: MonthDay[] = []
  for (let i = 0; i <= 6 - endDayInWeek; i++) {
    nextMonthDays.push({
      dayInMonth: i + 1,
      dayInWeek: endDayInWeek + i,
      date: { hy: nextYear, hm: nextMonth, hd: i + 1 },
    })
  }

  return { prevMonthDays, nextMonthDays }
}
