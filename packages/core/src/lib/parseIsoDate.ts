import { epochDayToDate, toEpochDay } from './hDatesIndex'

/** Local-midnight `Date` for Gregorian parts, rejecting impossible calendar dates. */
export function dateFromGregorianParts(year: number, month: number, day: number): Date {
  const date = epochDayToDate(toEpochDay(year, month, day))

  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
    throw new Error('Invalid Gregorian date')
  }

  return date
}

/** Gregorian calendar date from a timezone-safe `YYYY-MM-DD` string. */
export function parseIsoDate(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) {
    throw new Error('Invalid Gregorian date')
  }

  return dateFromGregorianParts(Number(match[1]), Number(match[2]), Number(match[3]))
}
