import { islamicUmmAlQura, type HijriCalendarId, type HijriCalendarSystem } from '@taqwim/core'
import { islamicCivil } from '@taqwim/core/calendars/islamic-civil'
import { islamicTbla } from '@taqwim/core/calendars/islamic-tbla'

export const HIJRI_CALENDAR_OPTIONS = [
  { id: 'islamic-umalqura', label: 'Umm al-Qura' },
  { id: 'islamic-civil', label: 'Civil' },
  { id: 'islamic-tbla', label: 'TBLA' },
] as const satisfies readonly { id: HijriCalendarId; label: string }[]

export const HIJRI_CALENDAR_SYSTEMS: Record<HijriCalendarId, HijriCalendarSystem> = {
  'islamic-umalqura': islamicUmmAlQura,
  'islamic-civil': islamicCivil,
  'islamic-tbla': islamicTbla,
}

export function calendarSystemIdFromSearch(search: string): HijriCalendarId {
  const requested = new URLSearchParams(search).get('calendar')
  return HIJRI_CALENDAR_OPTIONS.some(option => option.id === requested)
    ? (requested as HijriCalendarId)
    : 'islamic-umalqura'
}
