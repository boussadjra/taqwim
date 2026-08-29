import type { CalendarDay, CalendarMonth } from '@taqwim/calendar-core'
import { getCellDisplayValues } from '@taqwim/calendar-core'
import type { ComponentPropsWithoutRef, KeyboardEvent, ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { HijriCalendarProvider, useHijriCalendarContext } from './context'
import type { HijriCalendarRootProps } from './types'
import { useCalendar } from './useCalendar'

type DivProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'dir'>
type ButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'onClick' | 'type'>

/**
 * The store speaks DOM attribute names, which is what makes one stylesheet and
 * one e2e suite cover every framework. React wants `tabIndex`, so that single
 * key is renamed here rather than compromising the shared contract.
 */
function withReactCasing<T extends { tabindex: 0 | -1 }>({ tabindex, ...rest }: T) {
  return { ...rest, tabIndex: tabindex }
}

/*
 * Every part below spreads props the store computed. Because those are the same
 * `data-*` and `aria-*` attributes the Vue adapter emits, `@taqwim/themes`
 * styles both without a line of React-specific CSS, and one Playwright spec
 * covers both.
 */

/**
 * Which props belong to the state machine. Anything else a caller passes is a
 * DOM attribute and lands on the root element — React has no `$attrs`, so the
 * split has to be explicit.
 */
const OPTION_KEYS = new Set<string>([
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
  'showGregorian',
  'dateEmphasis',
  'gregorianLocale',
  'dir',
  'isDateDisabled',
  'isDateUnavailable',
  'nextPage',
  'prevPage',
])

function splitProps(props: Record<string, unknown>) {
  const options: Record<string, unknown> = {}
  const domProps: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(props)) {
    ;(OPTION_KEYS.has(key) ? options : domProps)[key] = value
  }

  return { options, domProps }
}

export function HijriCalendarRoot({ children, initialFocus, ...rest }: HijriCalendarRootProps & DivProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const pendingFocus = useRef<string | undefined>(undefined)

  const { options, domProps } = splitProps(rest as Record<string, unknown>)

  const { store, state } = useCalendar({
    ...options,
    onFocusedDateChange: date => {
      pendingFocus.current = date ? store.formatter.isoDate(date) : undefined
    },
  })

  // The store owns which date has focus; the adapter owns the DOM. Running
  // after commit means the target cell exists even when the move paged the
  // calendar into a month that was not rendered a moment ago.
  useEffect(() => {
    const value = pendingFocus.current
    if (!value) return
    pendingFocus.current = undefined

    rootRef.current?.querySelector<HTMLElement>(`[data-taqwim-calendar-cell-trigger][data-value="${value}"]`)?.focus()
  })

  const focusedOnMount = useRef(false)
  useEffect(() => {
    if (!initialFocus || focusedOnMount.current) return
    focusedOnMount.current = true
    store.focusInitial()
  }, [initialFocus, store])

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (store.handleKeydown(event)) event.preventDefault()
  }

  return (
    <HijriCalendarProvider value={{ store, state }}>
      <div {...store.getRootProps()} {...domProps} ref={rootRef} onKeyDown={onKeyDown}>
        {typeof children === 'function'
          ? children({
              months: state.months,
              weekDays: state.weekDays,
              modelValue: state.value,
              gregorianValue: state.gregorianValue,
              state,
              store,
            })
          : children}

        {/* Inlined rather than classed: the headless package must not require a stylesheet. */}
        <div
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clipPath: 'inset(50%)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          <div role="heading" aria-level={2}>
            {state.fullCalendarLabel}
          </div>
        </div>
      </div>
    </HijriCalendarProvider>
  )
}

export function HijriCalendarHeader({ children, ...rest }: DivProps & { children?: ReactNode }) {
  const { state } = useHijriCalendarContext()

  return (
    <div role="group" aria-label={state.fullCalendarLabel} data-taqwim-calendar-header="" {...rest}>
      {children}
    </div>
  )
}

export function HijriCalendarHeading({
  children,
  ...rest
}: DivProps & { children?: ReactNode | ((headingValue: string) => ReactNode) }) {
  const { state } = useHijriCalendarContext()

  return (
    <div data-taqwim-calendar-heading="" data-disabled={state.disabled ? '' : undefined} {...rest}>
      {typeof children === 'function' ? children(state.headingValue) : (children ?? state.headingValue)}
    </div>
  )
}

export function HijriCalendarPrev({
  children,
  ...rest
}: ButtonProps & { children?: ReactNode | ((disabled: boolean) => ReactNode) }) {
  const { store, state } = useHijriCalendarContext()
  const disabled = state.isPrevDisabled

  return (
    <button {...store.getPrevButtonProps()} {...rest} disabled={disabled} onClick={store.prevPage}>
      {typeof children === 'function' ? children(disabled) : children}
    </button>
  )
}

export function HijriCalendarNext({
  children,
  ...rest
}: ButtonProps & { children?: ReactNode | ((disabled: boolean) => ReactNode) }) {
  const { store, state } = useHijriCalendarContext()
  const disabled = state.isNextDisabled

  return (
    <button {...store.getNextButtonProps()} {...rest} disabled={disabled} onClick={store.nextPage}>
      {typeof children === 'function' ? children(disabled) : children}
    </button>
  )
}

export function HijriCalendarGrid({
  month,
  children,
  ...rest
}: DivProps & {
  /** Optional for the single-month case, where it defaults to the only month. */
  month?: CalendarMonth
  children?: ReactNode | ((month: CalendarMonth) => ReactNode)
}) {
  const { store, state } = useHijriCalendarContext()
  const resolved = month ?? state.months[0]

  return (
    <div tabIndex={-1} {...store.getGridProps(resolved)} {...rest}>
      {typeof children === 'function' ? children(resolved) : children}
    </div>
  )
}

export function HijriCalendarGridHead({
  children,
  ...rest
}: DivProps & { children?: ReactNode | ((weekDays: string[]) => ReactNode) }) {
  const { state } = useHijriCalendarContext()

  // The weekday row duplicates each cell's accessible label, so it is hidden
  // from assistive technology rather than read out twice.
  return (
    <div aria-hidden="true" data-taqwim-calendar-grid-head="" {...rest}>
      {typeof children === 'function' ? children(state.weekDays) : children}
    </div>
  )
}

export function HijriCalendarGridBody({ children, ...rest }: DivProps & { children?: ReactNode }) {
  return (
    <div data-taqwim-calendar-grid-body="" {...rest}>
      {children}
    </div>
  )
}

export function HijriCalendarGridRow({ children, ...rest }: DivProps & { children?: ReactNode }) {
  return (
    <div role="row" data-taqwim-calendar-grid-row="" {...rest}>
      {children}
    </div>
  )
}

export function HijriCalendarHeadCell({ children, ...rest }: DivProps & { children?: ReactNode }) {
  return (
    <div data-taqwim-calendar-head-cell="" {...rest}>
      {children}
    </div>
  )
}

export function HijriCalendarCell({ day, children, ...rest }: DivProps & { day: CalendarDay; children?: ReactNode }) {
  return (
    <div
      role="gridcell"
      aria-selected={day.isSelected || undefined}
      aria-disabled={day.isDisabled || day.isUnavailable || undefined}
      data-taqwim-calendar-cell=""
      data-disabled={day.isDisabled ? '' : undefined}
      data-outside-month={day.isOutsideMonth ? '' : undefined}
      {...rest}
    >
      {children}
    </div>
  )
}

export function HijriCalendarCellTrigger({
  day,
  children,
  ...rest
}: ButtonProps & {
  day: CalendarDay
  children?:
    | ReactNode
    | ((props: {
        dayValue: string
        hijriDayValue: string
        gregorianDayValue: string
        primaryDayValue: string
        secondaryDayValue?: string
        day: CalendarDay
      }) => ReactNode)
}) {
  const { store, state } = useHijriCalendarContext()
  const display = getCellDisplayValues(day, store.formatter, state.showGregorian, state.dateEmphasis)

  function onClick() {
    // `select` re-checks these itself; this only avoids the pointless call.
    if (day.isDisabled || day.isUnavailable) return
    store.select(day.date)
  }

  function onFocus() {
    // Tabbing or clicking into a cell makes it the roving-focus target.
    // Re-reporting a date the store already holds would echo its own
    // programmatic `.focus()` back at it, so that case is skipped.
    if (day.isDisabled || day.isFocused) return
    store.focusDate(day.date)
  }

  return (
    <button {...withReactCasing(store.getCellTriggerProps(day))} {...rest} onClick={onClick} onFocus={onFocus}>
      {typeof children === 'function'
        ? children({
            dayValue: display.dayValue,
            hijriDayValue: display.hijriDayValue,
            gregorianDayValue: display.gregorianDayValue,
            primaryDayValue: display.primaryDayValue,
            secondaryDayValue: display.secondaryDayValue,
            day,
          })
        : (children ?? display.dayValue)}
    </button>
  )
}
