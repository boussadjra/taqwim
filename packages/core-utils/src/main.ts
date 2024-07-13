import { getMonthAdjacentDays } from './lib'

const hijriDate = { hy: 1444, hm: 12, hd: 1 }

const { prevMonthDays, nextMonthDays } = getMonthAdjacentDays(hijriDate)

console.log(prevMonthDays)
console.log(nextMonthDays)
