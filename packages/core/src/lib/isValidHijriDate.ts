import { resolveCalendarSystem } from './calendarSystem'
import type { HijriCalendarSystemOptions } from './types'

export function isValidHijriDate(
  date: { hy: number; hm: number; hd: number },
  options?: HijriCalendarSystemOptions,
): boolean
export function isValidHijriDate(date: string, separator?: string, options?: HijriCalendarSystemOptions): boolean
export function isValidHijriDate(hy: number, hm: number, hd: number, options?: HijriCalendarSystemOptions): boolean
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
  hmOrOptions?: number | string | HijriCalendarSystemOptions,
  hdOrOptions?: number | HijriCalendarSystemOptions,
  options?: HijriCalendarSystemOptions,
): boolean {
  if (typeof hy === 'string') {
    const separator = typeof hmOrOptions === 'string' ? hmOrOptions : '-'
    const calendarOptions =
      typeof hmOrOptions === 'object' ? hmOrOptions : typeof hdOrOptions === 'object' ? hdOrOptions : options
    const dateParts = hy.split(separator).map(Number)
    if (dateParts.length !== 3 || dateParts.some(Number.isNaN)) return false
    const [year, month, day] = dateParts

    return isValidHijriDate(year, month, day, calendarOptions)
  }
  if (typeof hy === 'object') {
    return isValidHijriDate(hy.hy, hy.hm, hy.hd, hmOrOptions as HijriCalendarSystemOptions | undefined)
  }
  const month = hmOrOptions as number
  if (month < 1 || month > 12) {
    return false
  }
  const days = resolveCalendarSystem(options).daysInMonth(hy, month)
  const day = hdOrOptions as number
  return days > 0 && day >= 1 && day <= days
}
