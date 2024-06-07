// utils.ts
import { hDatesTable } from './hDates'

export function isValidHijriDate(hy: number, hm: number, hd: number): boolean {
  const yearRecord = hDatesTable.find(record => record.hy === hy)
  if (!yearRecord) {
    return false
  }

  const daysInMonth = (yearRecord.dpm >> (hm - 1)) & 1 ? 30 : 29
  return hm >= 1 && hm <= 12 && hd >= 1 && hd <= daysInMonth
}
