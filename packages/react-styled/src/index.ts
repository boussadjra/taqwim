import '@taqwim/themes'

export {
  HijriCalendar,
  type HijriCalendarLayout,
  type HijriCalendarProps,
  type HijriCalendarSize,
  type HijriCalendarTheme,
} from './HijriCalendar'
export { HijriDatePicker, type HijriDatePickerProps } from './HijriDatePicker'

// Re-exported so a consumer using only the styled package still gets the
// headless primitives to drop down to.
export * from '@taqwim/react'
