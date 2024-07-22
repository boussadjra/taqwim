import { isValidHijriDate, toHijri } from '.'
import type { HijriDateObject, TripleNumberFormat } from './types'

/**
 * Parses a date string and returns a HijriDateObject.
 *
 * @param dateString - The date string to parse.
 * @returns The parsed HijriDateObject.
 * @throws Error if the date format is invalid.
 */
export function parseDateString(dateString: TripleNumberFormat | '' | null | undefined): HijriDateObject {
  // Define regular expressions for the different date formats
  const regexes = {
    yyyyMMdd: /^\d{4}[-/]\d{2}[-/]\d{2}$/,
    ddMMyyyy: /^\d{2}[-/]\d{2}[-/]\d{4}$/,
  }

  let date = null

  if (dateString === '' || dateString === null || dateString === undefined) {
    const now = new Date()
    date = toHijri(now)
  }

  if (!dateString) {
    return date as HijriDateObject
  }

  if (regexes.yyyyMMdd.test(dateString)) {
    // Format: yyyy-MM-dd or yyyy/MM/dd
    date = {
      hy: parseInt(dateString.slice(0, 4)),
      hm: parseInt(dateString.slice(5, 7)),
      hd: parseInt(dateString.slice(8, 10)),
    }
  } else if (regexes.ddMMyyyy.test(dateString)) {
    // Format: dd-MM-yyyy or dd/MM/yyyy
    const parts = dateString.split(/[-/]/)
    date = {
      hy: parseInt(parts[2]),
      hm: parseInt(parts[1]),
      hd: parseInt(parts[0]),
    }
  } else {
    throw new Error('Invalid date format')
  }

  if (!isValidHijriDate(date)) {
    throw new Error('Invalid date')
  }

  return date
}
