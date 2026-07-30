import { isValidHijriDate, type HijriDateObject } from '@taqwim/core'

/*
 * Deliberately not `@taqwim/core`'s `parseDateString`: that throws on bad input
 * and resolves an empty string to today, neither of which suits an input the
 * user is still typing into.
 */
const YMD = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/
const DMY = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/

export function parseDraft(text: string): HijriDateObject | null {
  const trimmed = text.trim()

  const ymd = YMD.exec(trimmed)
  const dmy = ymd ? null : DMY.exec(trimmed)
  if (!ymd && !dmy) return null

  const [hy, hm, hd] = ymd
    ? [Number(ymd[1]), Number(ymd[2]), Number(ymd[3])]
    : [Number(dmy![3]), Number(dmy![2]), Number(dmy![1])]

  const candidate = { hy, hm, hd }
  return isValidHijriDate(candidate) ? candidate : null
}
