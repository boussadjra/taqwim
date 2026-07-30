/** The option names, so the root can tell them from DOM attributes. */
export const OPTION_KEYS = new Set([
  'defaultValue',
  'value',
  'onValueChange',
  'defaultPlaceholder',
  'placeholder',
  'onPlaceholderChange',
  'weekStartsOn',
  'weekdayFormat',
  'calendarLabel',
  'fixedWeeks',
  'numberOfMonths',
  'pagedNavigation',
  'multiple',
  'preventDeselect',
  'disableDaysOutsideCurrentView',
  'disabled',
  'readonly',
  'minValue',
  'maxValue',
  'locale',
  'dir',
  'isDateDisabled',
  'isDateUnavailable',
  'nextPage',
  'prevPage',
])
export function splitCalendarProps(props) {
  const options = {}
  const domProps = {}
  for (const [key, value] of Object.entries(props)) {
    if (key === 'children' || key === 'initialFocus') continue
    ;(OPTION_KEYS.has(key) ? options : domProps)[key] = value
  }
  return { options, domProps }
}
