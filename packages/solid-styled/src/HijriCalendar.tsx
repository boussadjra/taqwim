import { getLocaleData, MAX_HIJRI_YEAR, MIN_HIJRI_YEAR, type HijriDateObject } from '@taqwim/core'
import type { CalendarDay, HijriCalendarRootOptions } from '@taqwim/solid'
import {
  HijriCalendarCell,
  HijriCalendarCellTrigger,
  HijriCalendarGrid,
  HijriCalendarGridBody,
  HijriCalendarGridHead,
  HijriCalendarGridRow,
  HijriCalendarHeadCell,
  HijriCalendarHeader,
  HijriCalendarHeading,
  HijriCalendarNext,
  HijriCalendarPrev,
  HijriCalendarRoot,
  useHijriCalendarContext,
} from '@taqwim/solid'
import { createSignal, For, Index, Show, splitProps, type Component, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { ArrowLeft, ArrowRight } from './icons'

/*
 * Generated from the stylesheets in @taqwim/themes, so a new preset is one
 * CSS file rather than an identical edit in all five styled packages.
 */
import type { HijriCalendarLayout, HijriCalendarTheme } from '@taqwim/themes/names'

export type { HijriCalendarLayout, HijriCalendarTheme }

export type HijriCalendarSize = 'compact' | 'default' | 'large'

export type HijriCalendarCellRenderProps = {
  dayValue: string
  hijriDayValue: string
  gregorianDayValue: string
  primaryDayValue: string
  secondaryDayValue?: string
  day: CalendarDay
}

export interface HijriCalendarProps extends HijriCalendarRootOptions {
  /**
   * Which bundled theme to render with.
   *
   * Applied as `data-taqwim-theme`, so it can also be set on any ancestor to
   * theme a whole subtree, and changed at runtime without swapping stylesheets.
   * @default 'default'
   */
  theme?: HijriCalendarTheme
  /** @default 'default' */
  size?: HijriCalendarSize
  /**
   * How the calendar is arranged.
   *
   * Applied as `data-taqwim-layout`, orthogonal to `theme` and `size` — a
   * theme sets colours, a size sets metrics, a layout sets arrangement.
   * `panel` keeps the grid visible while the month/year picker is open.
   * @default 'default'
   */
  layout?: HijriCalendarLayout
  /** Show the previous/next paging buttons. @default true */
  showNavigation?: boolean
  /** Show the weekday label row. @default true */
  showWeekdays?: boolean
  /**
   * Show the month and year as separate heading buttons that open their pickers.
   * @default true
   */
  selectableHeading?: boolean
  /** Replace the default chevrons. */
  navigationIcons?: { prev?: Component; next?: Component }
  /** Replaces the contents of a day cell. */
  renderCell?: (props: HijriCalendarCellRenderProps) => JSX.Element
  /** Replaces a weekday label. */
  renderWeekday?: (props: { weekday: string; index: number }) => JSX.Element
}

type HijriCalendarChromeProps = Pick<
  HijriCalendarProps,
  | 'layout'
  | 'showNavigation'
  | 'showWeekdays'
  | 'selectableHeading'
  | 'navigationIcons'
  | 'renderCell'
  | 'renderWeekday'
>

function renderDefaultCell(cell: HijriCalendarCellRenderProps, dateEmphasis: 'hijri' | 'gregorian'): JSX.Element {
  if (cell.secondaryDayValue) {
    return (
      <span class="taqwim-calendar-cell-dates">
        <span
          class="taqwim-calendar-cell-primary"
          data-primary
          data-calendar-system={dateEmphasis === 'gregorian' ? 'gregorian' : 'hijri'}
        >
          {cell.primaryDayValue}
        </span>
        <span
          class="taqwim-calendar-cell-secondary"
          data-secondary
          data-calendar-system={dateEmphasis === 'gregorian' ? 'hijri' : 'gregorian'}
        >
          {cell.secondaryDayValue}
        </span>
      </span>
    )
  }

  return <span>{cell.dayValue}</span>
}

/*
 * Bounded by what the Umm al-Qura table actually covers, rather than the
 * `new Date().getFullYear() + 579` approximation the pre-1.0 Vue version used —
 * that offered years the calendar cannot convert.
 */
const YEARS = Array.from({ length: MAX_HIJRI_YEAR - MIN_HIJRI_YEAR + 1 }, (_, i) => MIN_HIJRI_YEAR + i)

/*
 * Rendered as a child of `HijriCalendarRoot` rather than through its render
 * prop. Solid SSR hydrates render-prop children by invoking the function during
 * render; any reactive text inside the returned tree can be created and
 * discarded before the DOM is written, which leaves nodes like the month
 * heading button empty and breaks hydration in Astro islands.
 */
function HijriCalendarBody(props: HijriCalendarChromeProps): JSX.Element {
  const { store, state } = useHijriCalendarContext()
  const [picker, setPicker] = createSignal<'month' | 'year' | null>(null)

  const layout = () => props.layout ?? 'default'
  const showNavigation = () => props.showNavigation ?? true
  const showWeekdays = () => props.showWeekdays ?? true
  const selectableHeading = () => props.selectableHeading ?? true

  const months = () => getLocaleData(state().locale, 'monthsLong') as string[]
  const monthLabel = () => store.formatter.custom(state().placeholder, 'iMMMM')
  const togglePicker = (which: 'month' | 'year') => setPicker(current => (current === which ? null : which))
  const gregorianPrimary = () => state().showGregorian && state().dateEmphasis === 'gregorian'
  const hijriHeadingButtons = () => (
    <>
      <button
        type="button"
        class="taqwim-calendar-heading-button"
        data-taqwim-heading="month"
        aria-expanded={picker() === 'month'}
        onClick={() => togglePicker('month')}
      >
        {monthLabel()}
      </button>
      <button
        type="button"
        class="taqwim-calendar-heading-button"
        data-taqwim-heading="year"
        aria-expanded={picker() === 'year'}
        onClick={() => togglePicker('year')}
      >
        {state().placeholder.hy}
      </button>
    </>
  )

  // Day 1 keeps the jump inside the target month regardless of its length.
  const jumpTo = (part: Partial<HijriDateObject>) => {
    store.setPlaceholder({ ...state().placeholder, ...part, hd: 1 })
    setPicker(null)
  }

  return (
    <div class="taqwim-calendar-body">
      <HijriCalendarHeader class="taqwim-calendar-header">
        <Show when={showNavigation()}>
          <HijriCalendarPrev class="taqwim-calendar-nav-button">
            <Dynamic component={props.navigationIcons?.prev ?? ArrowLeft} />
          </HijriCalendarPrev>
        </Show>

        <HijriCalendarHeading class="taqwim-calendar-heading">
          {/*
            Keep keyed DOM outside the conditional. Solid's SSR transform
            allocates hydration ids for a JSX fallback eagerly while the
            client transform leaves it lazy, so putting this wrapper in either
            branch shifts the active branch's keys and aborts hydration.
          */}
          <div class="taqwim-calendar-heading-stack">
            <span
              class="taqwim-calendar-heading-primary"
              data-calendar-system={gregorianPrimary() ? 'gregorian' : 'hijri'}
            >
              <Show when={selectableHeading() && !gregorianPrimary()} fallback={state().headingValue}>
                {hijriHeadingButtons()}
              </Show>
            </span>
            <Show when={state().secondaryHeadingValue}>
              <span
                class="taqwim-calendar-heading-secondary"
                data-calendar-system={gregorianPrimary() ? 'hijri' : 'gregorian'}
              >
                <Show when={selectableHeading() && gregorianPrimary()} fallback={state().secondaryHeadingValue}>
                  {hijriHeadingButtons()}
                </Show>
              </span>
            </Show>
          </div>
        </HijriCalendarHeading>

        <Show when={showNavigation()}>
          <HijriCalendarNext class="taqwim-calendar-nav-button">
            <Dynamic component={props.navigationIcons?.next ?? ArrowRight} />
          </HijriCalendarNext>
        </Show>
      </HijriCalendarHeader>

      {/*
        Rendered inline rather than in a portal: the theme lives on this
        element's ancestors, so a portalled panel would lose it.
      */}
      <Show when={picker()}>
        <div class="taqwim-calendar-picker">
          <div class="taqwim-calendar-picker-grid">
            <Show when={picker() === 'month'}>
              <For each={months()}>
                {(month, index) => (
                  <button
                    type="button"
                    data-selected={state().placeholder.hm === index() + 1 ? '' : undefined}
                    onClick={() => jumpTo({ hm: index() + 1 })}
                  >
                    {month}
                  </button>
                )}
              </For>
            </Show>
            <Show when={picker() === 'year'}>
              <For each={YEARS}>
                {year => (
                  <button
                    type="button"
                    data-selected={state().placeholder.hy === year ? '' : undefined}
                    onClick={() => jumpTo({ hy: year })}
                  >
                    {year}
                  </button>
                )}
              </For>
            </Show>
          </div>
        </div>
      </Show>

      {/*
        `panel` keeps the grid mounted beside the picker. Every other
        layout unmounts it, so the grid is never merely hidden from
        sight while still reachable by Tab.
      */}
      <Show when={!picker() || layout() === 'panel'}>
        {/*
          `Index` throughout, never `For`.

          The store rebuilds its whole object graph on each snapshot, and
          `For` keys by reference — so any state change threw away every
          cell and built new ones. Solid delegates click to the document,
          so a button replaced between `mousedown` and `click` never
          fired its handler. Since a real browser focuses a button before
          clicking it, and the focus handler is itself a state change,
          selection was dead in the browser while passing in jsdom, where
          `fireEvent.click` sends no focus.

          `Index` keys by position instead and hands each item over as an
          accessor. The grid is a fixed shape whose contents change, which
          is exactly what it is for.
        */}
        <div class="taqwim-calendar-months">
          <Index each={state().months}>
            {month => (
              <HijriCalendarGrid month={month()}>
                <Show when={showWeekdays()}>
                  <HijriCalendarGridHead>
                    <HijriCalendarGridRow>
                      <Index each={state().weekDays}>
                        {(weekday, index) => (
                          <HijriCalendarHeadCell class="taqwim-calendar-weekday">
                            {props.renderWeekday ? props.renderWeekday({ weekday: weekday(), index }) : weekday()}
                          </HijriCalendarHeadCell>
                        )}
                      </Index>
                    </HijriCalendarGridRow>
                  </HijriCalendarGridHead>
                </Show>

                <HijriCalendarGridBody>
                  <Index each={month().weeks}>
                    {week => (
                      <HijriCalendarGridRow>
                        <Index each={week()}>
                          {day => (
                            <HijriCalendarCell day={day()}>
                              <HijriCalendarCellTrigger day={day()}>
                                {cell =>
                                  props.renderCell
                                    ? props.renderCell(cell)
                                    : renderDefaultCell(cell, state().dateEmphasis ?? 'hijri')
                                }
                              </HijriCalendarCellTrigger>
                            </HijriCalendarCell>
                          )}
                        </Index>
                      </HijriCalendarGridRow>
                    )}
                  </Index>
                </HijriCalendarGridBody>
              </HijriCalendarGrid>
            )}
          </Index>
        </div>
      </Show>
    </div>
  )
}

export function HijriCalendar(props: HijriCalendarProps): JSX.Element {
  const [local, options] = splitProps(props, [
    'theme',
    'size',
    'layout',
    'showNavigation',
    'showWeekdays',
    'selectableHeading',
    'navigationIcons',
    'renderCell',
    'renderWeekday',
  ])

  const theme = () => local.theme ?? 'default'
  const size = () => local.size ?? 'default'
  const layout = () => local.layout ?? 'default'

  return (
    <HijriCalendarRoot
      {...options}
      data-taqwim-theme={theme()}
      data-taqwim-size={size() === 'default' ? undefined : size()}
      data-taqwim-layout={layout() === 'default' ? undefined : layout()}
    >
      <HijriCalendarBody {...local} />
    </HijriCalendarRoot>
  )
}
