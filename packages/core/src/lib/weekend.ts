import { dayOfWeekFromEpochDay } from './hDatesIndex'

/** Days of the week that are not business days, as `0` (Sunday) .. `6` (Saturday). */
export type Weekend = readonly number[]

/**
 * Friday and Saturday — the working week across most of the Arab world, and
 * the sensible default for a Hijri calendar library.
 *
 * Note this differs from `date-fns`, which is fixed to Saturday/Sunday. Pass
 * `{ weekend: [6, 0] }` for the Western convention.
 */
export const DEFAULT_WEEKEND: Weekend = [5, 6]

export interface BusinessDayOptions {
  /**
   * Days of the week treated as non-working, as `0` (Sunday) .. `6` (Saturday).
   * @default [5, 6] // Friday, Saturday
   */
  weekend?: Weekend
}

function toWeekendSet(weekend: Weekend): Set<number> {
  const set = new Set<number>()
  for (const day of weekend) {
    if (!Number.isInteger(day) || day < 0 || day > 6) {
      throw new RangeError(`Weekend days must be integers 0-6, received ${day}.`)
    }
    set.add(day)
  }
  if (set.size >= 7) {
    throw new RangeError('Weekend cannot cover all seven days; there would be no business days to count.')
  }
  return set
}

/**
 * Steps `amount` business days from `startEpochDay`, skipping weekend days.
 * Negative amounts step backwards. The starting day is never counted, so a
 * start that falls on a weekend simply walks forward to the next working day.
 */
export function shiftBusinessDays(startEpochDay: number, amount: number, weekend: Weekend): number {
  if (amount === 0) {
    return startEpochDay
  }

  const weekendDays = toWeekendSet(weekend)
  const step = amount > 0 ? 1 : -1
  let remaining = Math.abs(Math.trunc(amount))
  let epochDay = startEpochDay

  while (remaining > 0) {
    epochDay += step
    if (!weekendDays.has(dayOfWeekFromEpochDay(epochDay))) {
      remaining--
    }
  }

  return epochDay
}
