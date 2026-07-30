import { getDayInWeek, type HijriDateObject } from '@taqwim/core'
import { compareDates, isSameDate, isSameMonth, shiftDays, shiftMonths, startOfMonth, todayHijri } from './dateUtils'
import { createFormatter } from './formatter'
import { buildMonthWeeks, buildWeekDays, visibleMonths, type RawDay } from './grid'
import type {
  CalendarDay,
  CalendarMonth,
  CalendarOptions,
  CalendarState,
  CalendarStore,
  CellTriggerProps,
  Direction,
  GridProps,
  PageButtonProps,
  RootProps,
  WeekDayFormat,
  WeekStartsOn,
} from './types'

/**
 * Explicitly typed rather than `as const`, so `opt('dir')` widens to
 * `Direction` instead of narrowing to the literal `'ltr'`.
 */
interface DefaultedOptions {
  weekStartsOn: WeekStartsOn
  weekdayFormat: WeekDayFormat
  fixedWeeks: boolean
  numberOfMonths: number
  pagedNavigation: boolean
  multiple: boolean
  preventDeselect: boolean
  disableDaysOutsideCurrentView: boolean
  disabled: boolean
  readonly: boolean
  locale: string
  dir: Direction
}

const DEFAULTS: DefaultedOptions = {
  weekStartsOn: 0,
  weekdayFormat: 'weekDaysMedium',
  fixedWeeks: false,
  numberOfMonths: 1,
  pagedNavigation: false,
  multiple: false,
  preventDeselect: false,
  disableDaysOutsideCurrentView: false,
  disabled: false,
  readonly: false,
  locale: 'en',
  dir: 'ltr',
}

function toArray(value: HijriDateObject | HijriDateObject[] | undefined): HijriDateObject[] {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

/** How far into its week a date sits, given where the week starts. 0 = first column. */
function weekdayOffset(date: HijriDateObject, weekStartsOn: number): number {
  const dayOfWeek = getDayInWeek(date)
  return dayOfWeek === undefined ? 0 : (dayOfWeek - weekStartsOn + 7) % 7
}

/**
 * The framework-agnostic Hijri calendar.
 *
 * Every adapter (Vue, React, Svelte, Solid, Angular) binds to this one store,
 * so grid layout, selection, paging, keyboard navigation and the emitted
 * `data-*` attributes are written once and behave identically everywhere.
 */
export function createCalendar(initialOptions: CalendarOptions = {}): CalendarStore {
  let options: CalendarOptions = { ...initialOptions }
  const listeners = new Set<() => void>()

  // Uncontrolled fallbacks. When the matching option is supplied the caller
  // owns the value and these are ignored.
  let internalValue: HijriDateObject | HijriDateObject[] | undefined = initialOptions.defaultValue
  let internalPlaceholder: HijriDateObject =
    initialOptions.placeholder ??
    initialOptions.defaultPlaceholder ??
    startOfMonth(
      toArray(initialOptions.value ?? initialOptions.defaultValue)[0] ?? todayHijri() ?? { hy: 1446, hm: 1, hd: 1 },
    )
  let focusedDate: HijriDateObject | undefined

  let snapshot: CalendarState | null = null

  const opt = <K extends keyof DefaultedOptions>(key: K): DefaultedOptions[K] =>
    (options[key as keyof CalendarOptions] as DefaultedOptions[K] | undefined) ?? DEFAULTS[key]

  const currentValue = () => (options.value !== undefined ? options.value : internalValue)
  const currentPlaceholder = () => options.placeholder ?? internalPlaceholder

  function notify() {
    snapshot = null
    for (const listener of listeners) listener()
  }

  // ---------------------------------------------------------------- matchers

  function isOutOfBounds(date: HijriDateObject): boolean {
    const { minValue, maxValue } = options
    if (minValue && compareDates(date, minValue) < 0) return true
    if (maxValue && compareDates(date, maxValue) > 0) return true
    return false
  }

  /**
   * `minValue` / `maxValue` used to gate only the paging buttons, leaving
   * out-of-range days selectable. They now disable the days themselves.
   */
  function isDateDisabled(date: HijriDateObject, isOutsideMonth = false): boolean {
    if (opt('disabled')) return true
    if (isOutOfBounds(date)) return true
    if (opt('disableDaysOutsideCurrentView') && isOutsideMonth) return true
    return options.isDateDisabled?.(date) ?? false
  }

  function isDateUnavailable(date: HijriDateObject): boolean {
    return options.isDateUnavailable?.(date) ?? false
  }

  function isDateSelected(date: HijriDateObject): boolean {
    return toArray(currentValue()).some(selected => isSameDate(selected, date))
  }

  function isSelectable(date: HijriDateObject, isOutsideMonth = false): boolean {
    return !opt('readonly') && !isDateDisabled(date, isOutsideMonth) && !isDateUnavailable(date)
  }

  // ------------------------------------------------------------------ paging

  const pageStep = () => (opt('pagedNavigation') ? opt('numberOfMonths') : 1)

  function pageTarget(direction: 1 | -1): HijriDateObject | null {
    const placeholder = currentPlaceholder()
    const custom = direction === 1 ? options.nextPage : options.prevPage
    return custom ? custom(placeholder) : shiftMonths(placeholder, direction * pageStep())
  }

  function isPageDisabled(direction: 1 | -1): boolean {
    if (opt('disabled')) return true

    const target = pageTarget(direction)
    if (!target) return true

    const { minValue, maxValue } = options
    if (direction === 1 && maxValue) {
      // Blocked only when the whole target month sits past maxValue.
      return compareDates(startOfMonth(target), startOfMonth(maxValue)) > 0
    }
    if (direction === -1 && minValue) {
      return compareDates(startOfMonth(target), startOfMonth(minValue)) < 0
    }
    return false
  }

  function setPlaceholder(date: HijriDateObject) {
    const next = startOfMonth(date)
    if (isSameMonth(next, currentPlaceholder())) return

    internalPlaceholder = next
    options.onPlaceholderChange?.(next)
    notify()
  }

  function page(direction: 1 | -1) {
    if (isPageDisabled(direction)) return
    const target = pageTarget(direction)
    if (target) setPlaceholder(target)
  }

  // --------------------------------------------------------------- selection

  function commitValue(next: HijriDateObject | HijriDateObject[] | undefined) {
    internalValue = next
    options.onValueChange?.(next)
    notify()
  }

  function select(date: HijriDateObject) {
    // Guarded here rather than only in the click handler, so keyboard
    // selection and programmatic calls honour the same rules.
    if (!isSelectable(date, !isSameMonth(date, currentPlaceholder()))) return

    const value = currentValue()

    if (!opt('multiple')) {
      const single = Array.isArray(value) ? value[0] : value

      if (single && isSameDate(single, date) && !opt('preventDeselect')) {
        setPlaceholder(date)
        commitValue(undefined)
        return
      }
      commitValue({ ...date })
      return
    }

    const list = toArray(value)
    const index = list.findIndex(selected => isSameDate(selected, date))

    if (index === -1) {
      commitValue([...list.map(d => ({ ...d })), { ...date }])
      return
    }

    if (opt('preventDeselect')) return

    const remaining = list.filter((_, i) => i !== index).map(d => ({ ...d }))
    if (remaining.length === 0) {
      setPlaceholder(date)
      commitValue(undefined)
      return
    }
    commitValue(remaining)
  }

  // ------------------------------------------------------------------- focus

  function isVisible(date: HijriDateObject): boolean {
    return visibleMonths(currentPlaceholder(), opt('numberOfMonths')).some(month => isSameMonth(month, date))
  }

  function focusDate(date: HijriDateObject | undefined) {
    if (date && isOutOfBounds(date)) return

    focusedDate = date ? { ...date } : undefined

    // Page so the newly focused date is on screen.
    if (date && !isVisible(date)) {
      setPlaceholder(date)
    }

    options.onFocusedDateChange?.(focusedDate)
    notify()
  }

  function focusInitial() {
    const selected = toArray(currentValue())[0]
    if (selected && isVisible(selected)) {
      focusDate(selected)
      return
    }

    const today = todayHijri()
    if (today && isVisible(today)) {
      focusDate(today)
      return
    }

    focusDate(startOfMonth(currentPlaceholder()))
  }

  // ---------------------------------------------------------------- keyboard

  function moveFocus(days: number) {
    const from = focusedDate ?? startOfMonth(currentPlaceholder())
    const next = shiftDays(from, days)
    if (next) focusDate(next)
  }

  function moveFocusMonths(months: number) {
    const from = focusedDate ?? startOfMonth(currentPlaceholder())
    const next = shiftMonths(from, months)
    if (next) focusDate(next)
  }

  /**
   * Roving-focus keyboard navigation.
   *
   * This did not exist before: `initialFocus` resolved to a TODO and no arrow
   * handling was implemented at all, which made the calendar unusable without
   * a mouse. Horizontal keys are mirrored under `dir="rtl"`, which matters for
   * the Arabic locale the library is primarily for.
   */
  function handleKeydown(event: Pick<KeyboardEvent, 'key' | 'shiftKey'>): boolean {
    if (opt('disabled')) return false

    const rtl = opt('dir') === 'rtl'
    const weekStartsOn = opt('weekStartsOn')

    switch (event.key) {
      case 'ArrowLeft':
        moveFocus(rtl ? 1 : -1)
        return true
      case 'ArrowRight':
        moveFocus(rtl ? -1 : 1)
        return true
      case 'ArrowUp':
        moveFocus(-7)
        return true
      case 'ArrowDown':
        moveFocus(7)
        return true
      case 'Home': {
        const from = focusedDate ?? startOfMonth(currentPlaceholder())
        moveFocus(-weekdayOffset(from, weekStartsOn))
        return true
      }
      case 'End': {
        const from = focusedDate ?? startOfMonth(currentPlaceholder())
        moveFocus(6 - weekdayOffset(from, weekStartsOn))
        return true
      }
      case 'PageUp':
        moveFocusMonths(event.shiftKey ? -12 : -1)
        return true
      case 'PageDown':
        moveFocusMonths(event.shiftKey ? 12 : 1)
        return true
      case 'Enter':
      case ' ':
      case 'Spacebar':
        if (focusedDate) select(focusedDate)
        return true
      default:
        return false
    }
  }

  // ---------------------------------------------------------------- snapshot

  function decorate(
    raw: RawDay,
    today: HijriDateObject | undefined,
    tabbable: HijriDateObject | undefined,
  ): CalendarDay {
    return {
      date: raw.date,
      dayInMonth: raw.dayInMonth,
      dayOfWeek: raw.dayOfWeek,
      isOutsideMonth: raw.isOutsideMonth,
      isToday: isSameDate(today, raw.date),
      isSelected: isDateSelected(raw.date),
      isDisabled: isDateDisabled(raw.date, raw.isOutsideMonth),
      isUnavailable: isDateUnavailable(raw.date),
      isFocused: isSameDate(focusedDate, raw.date),
      // Adjacent days are never the tab stop, so a single tabbable date cannot
      // land on two cells when the same day is borrowed by two months.
      isTabbable: !raw.isOutsideMonth && isSameDate(tabbable, raw.date),
    }
  }

  /**
   * The single Tab stop of the roving tabindex.
   *
   * Mirrors `focusInitial`'s preference order so that tabbing in and then
   * pressing an arrow key continues from where the eye already was. Disabled
   * days are skipped: making the tab stop unreachable would strand keyboard
   * users outside the grid, which is exactly what a roving tabindex is for.
   */
  function tabbableDate(): HijriDateObject | undefined {
    if (focusedDate) return focusedDate

    const candidates = [toArray(currentValue())[0], todayHijri() ?? undefined].filter(
      (date): date is HijriDateObject => Boolean(date) && isVisible(date as HijriDateObject),
    )

    for (const candidate of candidates) {
      if (!isDateDisabled(candidate)) return candidate
    }

    const start = startOfMonth(currentPlaceholder())
    if (!isDateDisabled(start)) return start

    // A bounded month (minValue mid-month, say) has no selectable first day.
    for (let day = 2; day <= 30; day++) {
      const candidate = { ...start, hd: day }
      if (!isDateDisabled(candidate)) return candidate
    }
    return start
  }

  function build(): CalendarState {
    const placeholder = currentPlaceholder()
    const locale = opt('locale')
    const formatter = createFormatter(locale)
    const weekStartsOn = opt('weekStartsOn')
    const fixedWeeks = opt('fixedWeeks')
    // Resolved once per build rather than once per cell.
    const today = todayHijri() ?? undefined
    const tabbable = tabbableDate()

    const months: CalendarMonth[] = visibleMonths(placeholder, opt('numberOfMonths')).map(month => ({
      value: month,
      label: formatter.monthYear(month),
      weeks: buildMonthWeeks(month, weekStartsOn, fixedWeeks).map(week =>
        week.map(day => decorate(day, today, tabbable)),
      ),
    }))

    const value = currentValue()
    const isInvalid = toArray(value).some(isOutOfBounds)

    return {
      placeholder,
      value,
      focusedDate,
      months,
      weekDays: buildWeekDays(locale, opt('weekdayFormat'), weekStartsOn),
      headingValue: formatter.monthYear(placeholder),
      fullCalendarLabel: options.calendarLabel ?? `Calendar for ${formatter.monthYear(placeholder)}`,
      isInvalid,
      isNextDisabled: isPageDisabled(1),
      isPrevDisabled: isPageDisabled(-1),
      dir: opt('dir'),
      locale,
      disabled: opt('disabled'),
      readonly: opt('readonly'),
      weekStartsOn,
      fixedWeeks,
      multiple: opt('multiple'),
    }
  }

  function getSnapshot(): CalendarState {
    // Cached so the reference is stable between changes, which is what
    // React's useSyncExternalStore (and Solid/Svelte equivalents) require.
    snapshot ??= build()
    return snapshot
  }

  // ----------------------------------------------------------- prop getters

  function getRootProps(): RootProps {
    const state = getSnapshot()
    return {
      role: 'application',
      'aria-label': state.fullCalendarLabel,
      dir: state.dir,
      'data-taqwim-calendar': '',
      ...(state.disabled ? { 'data-disabled': '' as const } : {}),
      ...(state.readonly ? { 'data-readonly': '' as const } : {}),
      ...(state.isInvalid ? { 'data-invalid': '' as const } : {}),
    }
  }

  function getGridProps(month: CalendarMonth): GridProps {
    const state = getSnapshot()
    return {
      role: 'grid',
      'aria-label': month.label,
      'data-taqwim-calendar-grid': '',
      ...(state.readonly ? { 'aria-readonly': 'true' as const, 'data-readonly': '' as const } : {}),
      ...(state.disabled ? { 'aria-disabled': 'true' as const, 'data-disabled': '' as const } : {}),
    }
  }

  function getCellTriggerProps(day: CalendarDay): CellTriggerProps {
    const formatter = createFormatter(opt('locale'))
    const blocked = day.isDisabled || day.isUnavailable

    return {
      role: 'button',
      type: 'button',
      // Roving tabindex: exactly one cell is tabbable at a time.
      tabindex: day.isTabbable && !blocked ? 0 : -1,
      'aria-label': formatter.fullDate(day.date),
      'aria-selected': day.isSelected,
      'aria-disabled': blocked,
      'data-value': formatter.isoDate(day.date),
      'data-taqwim-calendar-cell-trigger': '',
      ...(day.isSelected ? { 'data-selected': '' as const } : {}),
      ...(day.isDisabled ? { 'data-disabled': '' as const } : {}),
      ...(day.isUnavailable ? { 'data-unavailable': '' as const } : {}),
      ...(day.isToday ? { 'data-today': '' as const } : {}),
      ...(day.isOutsideMonth ? { 'data-outside-month': '' as const } : {}),
      ...(day.isFocused ? { 'data-focused': '' as const } : {}),
    }
  }

  function getPrevButtonProps(): PageButtonProps {
    const disabled = getSnapshot().isPrevDisabled
    return {
      role: 'button',
      type: 'button',
      'aria-label': 'Previous page',
      'aria-disabled': disabled,
      ...(disabled ? { 'data-disabled': '' as const } : {}),
    }
  }

  function getNextButtonProps(): PageButtonProps {
    const disabled = getSnapshot().isNextDisabled
    return {
      role: 'button',
      type: 'button',
      'aria-label': 'Next page',
      'aria-disabled': disabled,
      ...(disabled ? { 'data-disabled': '' as const } : {}),
    }
  }

  return {
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getSnapshot,
    setOptions(next) {
      options = { ...options, ...next }
      notify()
    },
    select,
    setPlaceholder,
    nextPage: () => page(1),
    prevPage: () => page(-1),
    focusDate,
    focusInitial,
    handleKeydown,
    get formatter() {
      return createFormatter(opt('locale'))
    },
    getRootProps,
    getGridProps,
    getCellTriggerProps,
    getPrevButtonProps,
    getNextButtonProps,
  }
}
