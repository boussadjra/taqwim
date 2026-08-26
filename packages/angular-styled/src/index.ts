import '@taqwim/themes'

export { HijriCalendar, type HijriCalendarLayout, type HijriCalendarSize, type HijriCalendarTheme } from './calendar'
export { HijriDatePicker } from './datepicker'

// Re-exported so a consumer using only the styled package still gets the
// headless primitives to drop down to.
export * from '@taqwim/angular'
