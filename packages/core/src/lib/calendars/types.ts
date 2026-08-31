import type { HijriDateObject } from '../types'

/** Deterministic Hijri calendar identifiers defined by Unicode CLDR. */
export type HijriCalendarId = 'islamic-umalqura' | 'islamic-civil' | 'islamic-tbla'

/** Minimal calendar-specific conversion contract used by core and calendar-core. */
export interface HijriCalendarSystem {
  readonly id: HijriCalendarId
  toEpochDay(date: HijriDateObject): number | null
  fromEpochDay(epochDay: number): HijriDateObject | null
  daysInMonth(year: number, month: number): number
}

/** Additive options shared by calendar-dependent core helpers. */
export interface HijriCalendarSystemOptions {
  /** @default islamicUmmAlQura */
  calendarSystem?: HijriCalendarSystem
}
