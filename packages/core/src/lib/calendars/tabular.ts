import type { HijriCalendarId, HijriCalendarSystem } from './types'

const DAYS_PER_30_YEAR_CYCLE = 10_631

function floorDiv(dividend: number, divisor: number): number {
  return Math.floor(dividend / divisor)
}

function isLeapYear(year: number): boolean {
  // Equivalent to the 2,5,7,10,13,16,18,21,24,26,29 cycle, including
  // proleptic years on either side of 1 AH.
  return (((11 * year + 14) % 30) + 30) % 30 < 11
}

function yearStart(year: number): number {
  return (year - 1) * 354 + floorDiv(3 + 11 * year, 30)
}

function monthStart(month: number): number {
  // 0-based month; ceil(29.5 * month) expressed with integers.
  return floorDiv(59 * month + 1, 2)
}

/**
 * Shared tabular implementation used by Civil and TBLA.
 *
 * ICU defines Civil with Julian day 1948440 (Friday, 19 July 622 in the
 * proleptic Gregorian calendar) and TBLA with 1948439 (Thursday). Subtracting
 * the Unix epoch Julian day 2440588 gives the integer epoch-day constants
 * supplied here. The conversion formulas mirror ICU's fixed 30-year cycle but
 * avoid floating-point Julian-day arithmetic.
 */
export function createTabularCalendar(id: HijriCalendarId, epochDay: number): HijriCalendarSystem {
  return {
    id,
    toEpochDay(date) {
      const days = this.daysInMonth(date.hy, date.hm)
      if (!Number.isInteger(date.hy) || days < 0 || !Number.isInteger(date.hd) || date.hd < 1 || date.hd > days) {
        return null
      }
      return epochDay + yearStart(date.hy) + monthStart(date.hm - 1) + date.hd - 1
    },
    fromEpochDay(value) {
      if (!Number.isInteger(value)) return null
      const days = value - epochDay
      const cycle = floorDiv(days, DAYS_PER_30_YEAR_CYCLE)
      let year = cycle * 30 + 1
      let remaining = days - cycle * DAYS_PER_30_YEAR_CYCLE

      while (remaining >= 354 + (isLeapYear(year) ? 1 : 0)) {
        remaining -= 354 + (isLeapYear(year) ? 1 : 0)
        year++
      }

      let month = 1
      while (remaining >= this.daysInMonth(year, month)) {
        remaining -= this.daysInMonth(year, month)
        month++
      }

      return { hy: year, hm: month, hd: remaining + 1 }
    },
    daysInMonth(year, month) {
      if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) return -1
      if (month === 12) return isLeapYear(year) ? 30 : 29
      return month % 2 === 1 ? 30 : 29
    },
  }
}

export function isTabularHijriLeapYear(year: number): boolean {
  return Number.isInteger(year) && isLeapYear(year)
}
