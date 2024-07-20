import type { HijriDateObject, ValidHijriDate } from 'taqwim-core-utils'

export type WeekDayFormat = 'weekDaysMedium' | 'weekDaysLong' | 'weekDaysShort'
export type MonthFormat = 'monthsMedium' | 'monthsLong' | 'monthsShort'
export type ViewMode = 'month' | 'months' | 'years'

export interface DatePickerProps {
  viewMode: ViewMode
  locale: string
  modelValue: ValidHijriDate
  formattedValue: string
  format: string
  title: string
  weekDayFormat: WeekDayFormat
  monthFormat: MonthFormat
  showAdjacentDays: boolean
}

export interface DatePickerEmits {
  (event: 'update:modelValue', value: HijriDateObject): boolean
  (event: 'update:formattedValue', value: string): boolean
}
