import type { CalendarDay, CalendarMonth } from '@taqwim/calendar-core'
import { getCellDisplayValues } from '@taqwim/calendar-core'
import { children, createEffect, onMount, splitProps, type JSX } from 'solid-js'
import { HijriCalendarContext, useHijriCalendarContext } from './context'
import { OPTION_KEYS, type HijriCalendarRootProps } from './types'
import { createCalendarStore } from './useCalendar'

type DivProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'>
type ButtonProps = Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick' | 'type'>

/*
 * Every part below spreads props the store computed. Because those are the same
 * `data-*` and `aria-*` attributes the Vue and React adapters emit,
 * `@taqwim/themes` styles all of them and one Playwright spec covers all of
 * them.
 *
 * Props are never destructured — Solid props are getters, and destructuring
 * would read them once and lose reactivity.
 */

/*
 * `props` is an accessor, not a value, and that is the whole point.
 *
 * Every call site sits inside a JSX expression, which Solid compiles into a
 * tracked computation. Passing `month()` or `state().weekDays` evaluates the
 * signal *to build the argument*, which subscribes the computation to it — so
 * every store change threw the subtree away and built a new one, even for the
 * common case where `children` is plain JSX and the argument is never used.
 *
 * For the grid that was not a performance detail. A browser focuses a button
 * before it clicks it, the focus handler calls `store.focusDate`, and Solid
 * delegates `click` to the document: the click was dispatched at a button that
 * had already been replaced, and selection by mouse did not work at all.
 *
 * Read lazily, the argument is only built when a caller actually passed a
 * function, and the JSX subtree is created once and then updated in place by
 * the fine-grained bindings inside it.
 */
function renderChildren<T>(raw: JSX.Element | ((props: T) => JSX.Element) | undefined, props: () => T): JSX.Element {
  if (typeof raw !== 'function') return raw

  const resolved = children(() => (raw as (props: T) => JSX.Element)(props()))
  return resolved() as JSX.Element
}

export function HijriCalendarRoot(props: HijriCalendarRootProps): JSX.Element {
  const [options, local, domProps] = splitProps(props, OPTION_KEYS, ['children', 'initialFocus'])

  let rootElement: HTMLDivElement | undefined
  // Set by the store when the roving focus moves; consumed after the render.
  let pendingFocus: string | undefined

  const { store, state } = createCalendarStore(() => ({
    ...options,
    onFocusedDateChange: date => {
      pendingFocus = date ? store.formatter.isoDate(date) : undefined
    },
  }))

  /*
   * The store owns which date has focus; the adapter owns the DOM. Solid's
   * effects run after the DOM is updated, so the target cell exists even when
   * the move paged the calendar into a month that was not rendered a moment
   * ago.
   */
  createEffect(() => {
    // Read the state so this re-runs on every change.
    state()
    if (!pendingFocus) return

    const value = pendingFocus
    pendingFocus = undefined
    rootElement?.querySelector<HTMLElement>(`[data-taqwim-calendar-cell-trigger][data-value="${value}"]`)?.focus()
  })

  onMount(() => {
    if (local.initialFocus) store.focusInitial()
  })

  const onKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = event => {
    if (store.handleKeydown(event)) event.preventDefault()
  }

  const rootProps = () => {
    void state()
    return store.getRootProps()
  }

  return (
    <HijriCalendarContext.Provider value={{ store, state }}>
      <div ref={rootElement} {...rootProps()} {...domProps} onKeyDown={onKeyDown}>
        {renderChildren(local.children, () => ({
          get months() {
            return state().months
          },
          get weekDays() {
            return state().weekDays
          },
          get modelValue() {
            return state().value
          },
          get gregorianValue() {
            return state().gregorianValue
          },
          get state() {
            return state()
          },
          store,
        }))}

        {/* Inlined rather than classed: the headless package must not require a stylesheet. */}
        <div
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: '0',
            margin: '-1px',
            overflow: 'hidden',
            'clip-path': 'inset(50%)',
            'white-space': 'nowrap',
            border: '0',
          }}
        >
          <div role="heading" aria-level={2}>
            {state().fullCalendarLabel}
          </div>
        </div>
      </div>
    </HijriCalendarContext.Provider>
  )
}

export function HijriCalendarHeader(props: DivProps & { children?: JSX.Element }): JSX.Element {
  const { state } = useHijriCalendarContext()
  const [local, rest] = splitProps(props, ['children'])

  return (
    <div role="group" aria-label={state().fullCalendarLabel} data-taqwim-calendar-header="" {...rest}>
      {local.children}
    </div>
  )
}

export function HijriCalendarHeading(
  props: DivProps & { children?: JSX.Element | ((headingValue: string) => JSX.Element) },
): JSX.Element {
  const { state } = useHijriCalendarContext()
  const hasChildren = 'children' in props
  const [local, rest] = splitProps(props, ['children'])

  return (
    <div data-taqwim-calendar-heading="" data-disabled={state().disabled ? '' : undefined} {...rest}>
      {hasChildren ? renderChildren(local.children, () => state().headingValue) : state().headingValue}
    </div>
  )
}

export function HijriCalendarPrev(
  props: ButtonProps & { children?: JSX.Element | ((disabled: boolean) => JSX.Element) },
): JSX.Element {
  const { store, state } = useHijriCalendarContext()
  const [local, rest] = splitProps(props, ['children'])
  const prevProps = () => {
    void state()
    return store.getPrevButtonProps()
  }

  return (
    <button {...prevProps()} {...rest} disabled={state().isPrevDisabled} onClick={() => store.prevPage()}>
      {renderChildren(local.children, () => state().isPrevDisabled)}
    </button>
  )
}

export function HijriCalendarNext(
  props: ButtonProps & { children?: JSX.Element | ((disabled: boolean) => JSX.Element) },
): JSX.Element {
  const { store, state } = useHijriCalendarContext()
  const [local, rest] = splitProps(props, ['children'])
  const nextProps = () => {
    void state()
    return store.getNextButtonProps()
  }

  return (
    <button {...nextProps()} {...rest} disabled={state().isNextDisabled} onClick={() => store.nextPage()}>
      {renderChildren(local.children, () => state().isNextDisabled)}
    </button>
  )
}

export function HijriCalendarGrid(
  props: DivProps & {
    /** Optional for the single-month case, where it defaults to the only month. */
    month?: CalendarMonth
    children?: JSX.Element | ((month: CalendarMonth) => JSX.Element)
  },
): JSX.Element {
  const { store, state } = useHijriCalendarContext()
  const [local, rest] = splitProps(props, ['month', 'children'])
  const month = () => local.month ?? state().months[0]
  const gridProps = () => {
    void state()
    return store.getGridProps(month())
  }

  return (
    <div tabindex={-1} {...gridProps()} {...rest}>
      {/*
        `month`, not `month()`. Handing over the accessor keeps this expression
        from reading the store, so the grid is built once and then updated in
        place; passing the value rebuilt every cell on every state change and
        broke selection by mouse outright. See `renderChildren` above.
      */}
      {renderChildren(local.children, month)}
    </div>
  )
}

export function HijriCalendarGridHead(
  props: DivProps & { children?: JSX.Element | ((weekDays: string[]) => JSX.Element) },
): JSX.Element {
  const { state } = useHijriCalendarContext()
  const [local, rest] = splitProps(props, ['children'])

  // The weekday row duplicates each cell's accessible label, so it is hidden
  // from assistive technology rather than read out twice.
  return (
    <div aria-hidden="true" data-taqwim-calendar-grid-head="" {...rest}>
      {renderChildren(local.children, () => state().weekDays)}
    </div>
  )
}

export function HijriCalendarGridBody(props: DivProps & { children?: JSX.Element }): JSX.Element {
  const [local, rest] = splitProps(props, ['children'])

  return (
    <div data-taqwim-calendar-grid-body="" {...rest}>
      {local.children}
    </div>
  )
}

export function HijriCalendarGridRow(props: DivProps & { children?: JSX.Element }): JSX.Element {
  const [local, rest] = splitProps(props, ['children'])

  return (
    <div role="row" data-taqwim-calendar-grid-row="" {...rest}>
      {local.children}
    </div>
  )
}

export function HijriCalendarHeadCell(props: DivProps & { children?: JSX.Element }): JSX.Element {
  const [local, rest] = splitProps(props, ['children'])

  return (
    <div data-taqwim-calendar-head-cell="" {...rest}>
      {local.children}
    </div>
  )
}

export function HijriCalendarCell(props: DivProps & { day: CalendarDay; children?: JSX.Element }): JSX.Element {
  const { store, state } = useHijriCalendarContext()
  const [local, rest] = splitProps(props, ['day', 'children'])
  const cellProps = () => {
    void state()
    return store.getCellProps(local.day)
  }

  return (
    <div
      role="gridcell"
      aria-selected={local.day.isSelected || undefined}
      aria-disabled={local.day.isDisabled || local.day.isUnavailable || undefined}
      data-taqwim-calendar-cell={cellProps()['data-taqwim-calendar-cell']}
      data-tooltip={cellProps()['data-tooltip']}
      title={cellProps()['data-tooltip']}
      data-disabled={local.day.isDisabled ? '' : undefined}
      data-outside-month={local.day.isOutsideMonth ? '' : undefined}
      {...rest}
    >
      {local.children}
    </div>
  )
}

export function HijriCalendarCellTrigger(
  props: ButtonProps & {
    day: CalendarDay
    children?:
      | JSX.Element
      | ((props: {
          dayValue: string
          hijriDayValue: string
          gregorianDayValue: string
          primaryDayValue: string
          secondaryDayValue?: string
          day: CalendarDay
        }) => JSX.Element)
  },
): JSX.Element {
  const { store, state } = useHijriCalendarContext()
  const hasChildren = 'children' in props
  const [local, rest] = splitProps(props, ['day', 'children'])
  const display = () => getCellDisplayValues(local.day, store.formatter, state().showGregorian, state().dateEmphasis)

  /*
   * The prop getters read the store's snapshot directly, which is not a signal.
   * Touching `state()` here is what makes this a tracked dependency — without
   * it the attributes only refresh when the day object happens to change
   * identity, which leaves the rendered selection one interaction behind.
   */
  const triggerProps = () => {
    void state()
    return store.getCellTriggerProps(local.day)
  }

  function onClick() {
    // `select` re-checks these itself; this only avoids the pointless call.
    if (local.day.isDisabled || local.day.isUnavailable) return
    store.select(local.day.date)
  }

  function onFocus() {
    // Tabbing or clicking into a cell makes it the roving-focus target.
    // Re-reporting a date the store already holds would echo its own
    // programmatic `.focus()` back at it, so that case is skipped.
    if (local.day.isDisabled || local.day.isFocused) return
    store.focusDate(local.day.date)
  }

  return (
    <button {...triggerProps()} {...rest} onClick={onClick} onFocus={onFocus}>
      {hasChildren
        ? renderChildren(local.children, () => ({
            dayValue: display().dayValue,
            hijriDayValue: display().hijriDayValue,
            gregorianDayValue: display().gregorianDayValue,
            primaryDayValue: display().primaryDayValue,
            secondaryDayValue: display().secondaryDayValue,
            day: local.day,
          }))
        : display().dayValue}
    </button>
  )
}
