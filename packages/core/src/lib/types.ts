export interface HijriDateObject {
  hy: number
  hm: number
  hd: number
}

export interface HijriDuration {
  years: number
  months: number
  days: number
  weeks: number
}

export type DateTextSeparator = '/' | '-'

export type TripleNumberFormat = `${number}${DateTextSeparator}${number}${DateTextSeparator}${number}`

export type ValidHijriDate = HijriDateObject | TripleNumberFormat

export interface MonthDay {
  dayInMonth: number
  dayInWeek: number
  date: HijriDateObject
  isToday?: boolean
  isAdjacent?: boolean
}
