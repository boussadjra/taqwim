// useDateLogic.ts
import { computed, ref } from 'vue'
import {
  getDayInWeek,
  getDaysLengthInMonth,
  toHijri,
  normalizeHijriDate,
  getMonthAdjacentDays,
  addHijriMonths,
  subHijriMonths,
  hDatesTable,
  getLocaleData,
} from 'taqwim-core-utils'
import type { ValidHijriDate, MonthDay } from 'taqwim-core-utils'
import type { MonthFormat } from './types'
export function useDate(options: {
  initialDate: ValidHijriDate
  showAdjacentDays: boolean
  monthFormat: MonthFormat
  locale: string
}) {
  const normalizedHijriDate = ref(normalizeHijriDate(options.initialDate))

  const today = computed(() => toHijri(new Date())!)

  //month
  const daysInMonth = computed(() => getDaysLengthInMonth(normalizedHijriDate.value.hy, normalizedHijriDate.value.hm))

  const currentMonthDays = computed(() => {
    const days: MonthDay[] = []
    for (let i = 1; i <= daysInMonth.value; i++) {
      days.push({
        dayInMonth: i,
        dayInWeek: getDayInWeek({ hy: normalizedHijriDate.value.hy, hm: normalizedHijriDate.value.hm, hd: i }) ?? 0,
        date: {
          hy: normalizedHijriDate.value.hy,
          hm: normalizedHijriDate.value.hm,
          hd: i,
        },
      })
    }
    return days
  })

  const monthDays = computed(() => {
    const days = currentMonthDays.value
    if (options.showAdjacentDays) {
      const { prevMonthDays, nextMonthDays } = getMonthAdjacentDays(normalizedHijriDate.value)
      const todayValue = today.value
      return [
        ...prevMonthDays.map(day => ({
          ...day,
          isAdjacent: true,
        })),
        ...days.map(day => ({
          ...day,
          isAdjacent: false,
          isToday: day.date.hy === todayValue.hy && day.date.hm === todayValue.hm && day.dayInMonth === todayValue.hd,
        })),
        ...nextMonthDays.map(day => ({
          ...day,
          isAdjacent: true,
        })),
      ]
    }
    return days
  })

  const months = computed(() => {
    return getLocaleData(options.locale, options.monthFormat)
  })

  const currentMonth = computed(() => {
    return months.value[normalizedHijriDate.value.hm - 1]
  })

  const prevMonth = () => {
    const date = subHijriMonths(normalizedHijriDate.value, 1)
    normalizedHijriDate.value = date!
  }

  const nextMonth = () => {
    const date = addHijriMonths(normalizedHijriDate.value, 1)
    normalizedHijriDate.value = date!
  }
  //year

  const years = computed(() => {
    return hDatesTable.map(year => year.hy)
  })

  const currentYear = computed(() => {
    return normalizedHijriDate.value.hy
  })

  return { monthDays, prevMonth, nextMonth, today, years, months, currentMonth, currentYear, normalizedHijriDate }
}
