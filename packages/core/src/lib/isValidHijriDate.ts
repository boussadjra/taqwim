import { daysInHijriMonth, recordForHijriYear } from './hDatesIndex'

export function isValidHijriDate(date: { hy: number; hm: number; hd: number }): boolean
export function isValidHijriDate(date: string, separator?: string): boolean
export function isValidHijriDate(hy: number, hm: number, hd: number): boolean
/**
 * Checks if a given Hijri date is valid.
 *
 * @param hy - The Hijri year as a number, string, or an object with `hy`, `hm`, and `hd` properties.
 * @param hm - The Hijri month as a number or string. Optional if `hy` is an object.
 * @param hd - The Hijri day as a number. Optional if `hy` is an object.
 * @returns A boolean indicating whether the Hijri date is valid or not.
 */
export function isValidHijriDate(
  hy: number | string | { hy: number; hm: number; hd: number },
  hm?: number | string,
  hd?: number,
): boolean {
  if (typeof hy === 'string') {
    const dateParts = hy.split((hm as string) || '-').map(Number)
    if (dateParts.length !== 3 || dateParts.some(Number.isNaN)) return false
    const [year, month, day] = dateParts

    return isValidHijriDate(year, month, day)
  }
  if (typeof hy === 'object') {
    return isValidHijriDate(hy.hy, hy.hm, hy.hd)
  }
  const yearRecord = recordForHijriYear(hy)
  if (!yearRecord) {
    return false
  }

  const month = hm as number
  if (month < 1 || month > 12) {
    return false
  }

  return hd! >= 1 && hd! <= daysInHijriMonth(yearRecord.dpm, month)
}
