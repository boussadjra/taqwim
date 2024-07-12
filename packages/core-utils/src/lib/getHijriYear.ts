import { set, startOfDay, toDate } from 'date-fns'
import { hDates, hDatesTable } from '.'

export function getHijriYear(closestDate: Date): hDates | undefined {
  return hDatesTable.find((date: hDates) => {
    const dt = startOfDay(set(new Date(), { year: date.gy, month: date.gm - 1, date: date.gd }))
    return toDate(dt).getTime() === closestDate.getTime()
  })
}
