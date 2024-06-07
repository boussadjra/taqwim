import { hDatesTable } from '.'

/**
 * Returns the length of a month in the Hijri calendar.
 * @param hy The Hijri year.
 * @param hm The Hijri month (1-12).
 * @returns The length of the month in days. Returns -1 if the month is invalid.
 */
export function getDaysLengthInMonth(hy: number, hm: number): number {
  if (hm < 1 || hm > 12) {
    return -1
  }
  const hijriYearRecord = hDatesTable.find(record => record.hy === hy)
  if (hijriYearRecord) {
    return (hijriYearRecord.dpm >> (hm - 1)) & 1 ? 30 : 29
  }

  return -1
}
