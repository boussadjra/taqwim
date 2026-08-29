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
  const secondaryDayValue =
    dateEmphasis === 'gregorian' ? formatter.hijriShortDate(day.date) : formatter.gregorianShortDate(day.date)

  return {
    dayValue: primaryDayValue,
    hijriDayValue,
    gregorianDayValue,
    primaryDayValue,
    secondaryDayValue,
  }
}
