import {
  formatHijriDate,
  HijriRangeError,
  islamicUmmAlQura,
  isValidHijriDate,
  toHijri,
  type HijriCalendarSystem,
  type HijriDateObject,
} from '@taqwim/core'
import {
  DEFAULT_GREGORIAN_FORMAT_OPTIONS,
  formatGregorianDate,
  formatGregorianIsoDate,
  toGregorianDate,
} from './gregorian'
import { compareDates } from './dateUtils'
import type { CalendarOptions } from './types'

export type DatePickerInputDisplay = 'hijri' | 'gregorian' | 'both'

const BOTH_SEPARATOR = ' · '

export interface DatePickerFormatOptions {
  hijriFormat: string
  gregorianFormat: Intl.DateTimeFormatOptions
  locale: string
  gregorianLocale: string
  inputDisplay: DatePickerInputDisplay
  calendarSystem?: HijriCalendarSystem
}

export interface DatePickerFormattedValues {
  /** Ready-to-render trigger text for the configured `inputDisplay`. */
  value: string
  hijriValue: string
  gregorianValue: string
}

export interface DatePickerDraftOptions extends Pick<
  CalendarOptions,
  'minValue' | 'maxValue' | 'isDateDisabled' | 'isDateUnavailable' | 'disabled' | 'readonly' | 'preventDeselect'
> {
  editable?: boolean
}

function formatGregorianForPicker(date: Date, locale: string, options: Intl.DateTimeFormatOptions): string {
  const isDefaultIso =
    options.calendar === 'gregory' &&
    options.year === 'numeric' &&
    options.month === '2-digit' &&
    options.day === '2-digit'

  if (isDefaultIso) return formatGregorianIsoDate(date)
  return formatGregorianDate(date, locale, options)
}

export function formatDatePickerValues(
  hijri: HijriDateObject | undefined,
  options: DatePickerFormatOptions,
): DatePickerFormattedValues {
  const calendarSystem = options.calendarSystem ?? islamicUmmAlQura
  // A controlled value can become invalid when the calendar strategy changes.
  if (hijri && !isValidHijriDate(hijri, { calendarSystem })) {
    return { value: '', hijriValue: '', gregorianValue: '' }
  }
  const hijriValue = hijri ? formatHijriDate(hijri, options.hijriFormat, options.locale, { calendarSystem }) : ''
  const gregorianValue = hijri
    ? formatGregorianForPicker(toGregorianDate(hijri, calendarSystem), options.gregorianLocale, options.gregorianFormat)
    : ''

  let value: string
  switch (options.inputDisplay) {
    case 'gregorian':
      value = gregorianValue
      break
    case 'both':
      value = hijriValue && gregorianValue ? `${hijriValue}${BOTH_SEPARATOR}${gregorianValue}` : hijriValue
      break
    default:
      value = hijriValue
  }

  return { value, hijriValue, gregorianValue }
}

const HIJRI_YMD = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/
const HIJRI_DMY = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/
const GREGORIAN_YMD = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/
const GREGORIAN_DMY = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/

function parseHijriNumeric(text: string, calendarSystem: HijriCalendarSystem): HijriDateObject | null {
  const trimmed = text.trim()
  const ymd = HIJRI_YMD.exec(trimmed)
  const dmy = ymd ? null : HIJRI_DMY.exec(trimmed)
  if (!ymd && !dmy) return null

  const [hy, hm, hd] = ymd
    ? [Number(ymd[1]), Number(ymd[2]), Number(ymd[3])]
    : [Number(dmy![3]), Number(dmy![2]), Number(dmy![1])]

  const candidate = { hy, hm, hd }
  return isValidHijriDate(candidate, { calendarSystem }) ? candidate : null
}

function parseGregorianNumeric(text: string, calendarSystem: HijriCalendarSystem): HijriDateObject | null {
  const trimmed = text.trim()
  const ymd = GREGORIAN_YMD.exec(trimmed)
  const dmy = ymd ? null : GREGORIAN_DMY.exec(trimmed)
  if (!ymd && !dmy) return null

  const [year, month, day] = ymd
    ? [Number(ymd[1]), Number(ymd[2]), Number(ymd[3])]
    : [Number(dmy![3]), Number(dmy![2]), Number(dmy![1])]

  const date = new Date(0)
  date.setFullYear(year, month - 1, day)
  date.setHours(0, 0, 0, 0)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null
  }

  try {
    return toHijri(date, { calendarSystem })
  } catch (error) {
    // A well-formed date may still lie outside the active calendar's range.
    if (error instanceof HijriRangeError) return null
    throw error
  }
}

/**
 * Parse manual DatePicker input.
 *
 * - `hijri` / `both` (while editing): Hijri numeric `YYYY-MM-DD` or `DD-MM-YYYY`
 * - `gregorian`: Gregorian numeric `YYYY-MM-DD` or `DD-MM-YYYY`, converted via `toHijri`
 *
 * Returns `'empty'` when the trimmed text is blank.
 * Returns `null` for dates blocked by the picker constraints.
 */
export function parseDatePickerDraft(
  text: string,
  inputDisplay: DatePickerInputDisplay,
  calendarSystem: HijriCalendarSystem = islamicUmmAlQura,
  options: DatePickerDraftOptions = {},
): HijriDateObject | null | 'empty' {
  if (options.disabled || options.readonly || options.editable === false) return null
  const trimmed = text.trim()
  if (trimmed === '') return options.preventDeselect ? null : 'empty'

  const date =
    inputDisplay === 'gregorian'
      ? parseGregorianNumeric(trimmed, calendarSystem)
      : parseHijriNumeric(trimmed, calendarSystem)
  if (!date) return null
  if (options.minValue && compareDates(date, options.minValue) < 0) return null
  if (options.maxValue && compareDates(date, options.maxValue) > 0) return null
  if (options.isDateDisabled?.(date) || options.isDateUnavailable?.(date)) return null

  return date
}

export { DEFAULT_GREGORIAN_FORMAT_OPTIONS, BOTH_SEPARATOR }
