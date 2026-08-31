import { daysInHijriMonth, recordForHijriYear } from '../hDatesIndex'
import { epochDayToHijri, hijriToEpochDay } from '../hijriEpoch'
import type { HijriCalendarSystem } from './types'

/** Taqwim's authoritative, table-driven Umm al-Qura implementation. */
export const islamicUmmAlQura: HijriCalendarSystem = {
  id: 'islamic-umalqura',
  toEpochDay(date) {
    const record = recordForHijriYear(date.hy)
    if (!record || date.hm < 1 || date.hm > 12) return null
    if (date.hd < 1 || date.hd > daysInHijriMonth(record.dpm, date.hm)) return null
    return hijriToEpochDay(date.hy, date.hm, date.hd) ?? null
  },
  fromEpochDay: epochDayToHijri,
  daysInMonth(year, month) {
    const record = recordForHijriYear(year)
    return record && month >= 1 && month <= 12 ? daysInHijriMonth(record.dpm, month) : -1
  },
}
