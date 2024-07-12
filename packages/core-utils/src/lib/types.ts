export interface HijriDateObject {
  hy: number
  hm: number
  hd: number
}

export type HijriDuration = {
  years: number
  months: number
  days: number
  weeks: number
}

export type DateTextSeparator = '/' | '-'

export type TripleNumberFormat = `${number}${DateTextSeparator}${number}${DateTextSeparator}${number}`
