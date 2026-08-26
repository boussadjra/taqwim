import '@taqwim/themes'

export {
  default as HijriCalendar,
  type HijriCalendarLayout,
  type HijriCalendarProps,
  type HijriCalendarSize,
  type HijriCalendarSlots,
  type HijriCalendarTheme,
} from './HijriCalendar.vue'
export { default as HijriDatePicker, type HijriDatePickerProps, type HijriDatePickerSlots } from './HijriDatePicker.vue'

// Re-exported so a consumer using only the styled package still gets the
// headless primitives to drop down to.
export * from '@taqwim/vue'
