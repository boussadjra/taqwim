import '@taqwim/themes'

export { default as HijriCalendar } from './HijriCalendar.svelte'
export { default as HijriDatePicker } from './HijriDatePicker.svelte'
export type {
  HijriCalendarLayout,
  HijriCalendarProps,
  HijriCalendarSize,
  HijriCalendarTheme,
  HijriDatePickerProps,
} from './types'

// Re-exported so a consumer using only the styled package still gets the
// headless primitives to drop down to.
export * from '@taqwim/svelte'
