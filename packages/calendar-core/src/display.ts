import type { CalendarDay, CalendarFormatter, DateEmphasis } from './types'

export interface CellDisplayValues {
  /** Primary display value — matches configured emphasis when dual dates are shown. */
  dayValue: string
  hijriDayValue: string
  gregorianDayValue: string
  primaryDayValue: string
  secondaryDayValue?: string
}

export function getCellDisplayValues(
  day: CalendarDay,
  formatter: CalendarFormatter,
  showGregorian: boolean,
  dateEmphasis: DateEmphasis,
): CellDisplayValues {
  const hijriDayValue = formatter.dayOfMonth(day.date)
  const gregorianDayValue = formatter.gregorianDayOfMonth(day.date)

  if (!showGregorian) {
    return {
      dayValue: hijriDayValue,
      hijriDayValue,
      gregorianDayValue,
      primaryDayValue: hijriDayValue,
    }
  }

  const primaryDayValue = dateEmphasis === 'gregorian' ? gregorianDayValue : hijriDayValue
  // Day numbers only — the header already carries the month range, and a
  // compact label like "Aug 29" wraps unpredictably inside a 2rem cell.
  const secondaryDayValue = dateEmphasis === 'gregorian' ? hijriDayValue : gregorianDayValue

  return {
    dayValue: primaryDayValue,
    hijriDayValue,
    gregorianDayValue,
    primaryDayValue,
    secondaryDayValue,
  }
}

/** Hover tooltip for a day trigger — mirrors the accessible name the store emits. */
export function getCellTooltip(day: CalendarDay, formatter: CalendarFormatter, showGregorian: boolean): string {
  return showGregorian ? formatter.dualFullDate(day.date) : formatter.fullDate(day.date)
}
