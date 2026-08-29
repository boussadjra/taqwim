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
  renderCell?: (props: { dayValue: string; day: CalendarDay }) => JSX.Element
  /** Replaces a weekday label. */
  renderWeekday?: (props: { weekday: string; index: number }) => JSX.Element
}

/*
 * Bounded by what the Umm al-Qura table actually covers, rather than the
 * `new Date().getFullYear() + 579` approximation the pre-1.0 Vue version used —
 * that offered years the calendar cannot convert.
 */
const YEARS = Array.from({ length: MAX_HIJRI_YEAR - MIN_HIJRI_YEAR + 1 }, (_, i) => MIN_HIJRI_YEAR + i)

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

  const [picker, setPicker] = createSignal<'month' | 'year' | null>(null)

  const theme = () => local.theme ?? 'default'
  const size = () => local.size ?? 'default'
  const layout = () => local.layout ?? 'default'
  const showNavigation = () => local.showNavigation ?? true
  const showWeekdays = () => local.showWeekdays ?? true
  const selectableHeading = () => local.selectableHeading ?? true

  const months = () => getLocaleData(options.locale ?? 'en', 'monthsLong') as string[]
  const togglePicker = (which: 'month' | 'year') => setPicker(current => (current === which ? null : which))

  return (
    <HijriCalendarRoot
      {...options}
      data-taqwim-theme={theme()}
      data-taqwim-size={size() === 'default' ? undefined : size()}
      data-taqwim-layout={layout() === 'default' ? undefined : layout()}
    >
      {/*
        Never destructured. The root hands these over as getters so they stay
        live; pulling them out of the object reads each one once and freezes the
        grid at its first render — which looks fine on load and then silently
        stops updating.
      */}
      {rendered => {
        // Day 1 keeps the jump inside the target month regardless of its length.
        const jumpTo = (part: Partial<HijriDateObject>) => {
          rendered.store.setPlaceholder({ ...rendered.state.placeholder, ...part, hd: 1 })
          setPicker(null)
        }

        return (
          <>
            <HijriCalendarHeader class="taqwim-calendar-header">
              <Show when={showNavigation()}>
                <HijriCalendarPrev class="taqwim-calendar-nav-button">
                  <Dynamic component={local.navigationIcons?.prev ?? ArrowLeft} />
                </HijriCalendarPrev>
              </Show>

              <HijriCalendarHeading class="taqwim-calendar-heading">
                <Show when={selectableHeading()} fallback={rendered.state.headingValue}>
                  <>
                    <button
                      type="button"
                      class="taqwim-calendar-heading-button"
                      data-taqwim-heading="month"
                      aria-expanded={picker() === 'month'}
                      onClick={() => togglePicker('month')}
                    >
                      {months()[rendered.state.placeholder.hm - 1]}
                    </button>
                    <button
                      type="button"
                      class="taqwim-calendar-heading-button"
                      data-taqwim-heading="year"
                      aria-expanded={picker() === 'year'}
                      onClick={() => togglePicker('year')}
                    >
                      {rendered.state.placeholder.hy}
                    </button>
                  </>
                </Show>
              </HijriCalendarHeading>

              <Show when={showNavigation()}>
                <HijriCalendarNext class="taqwim-calendar-nav-button">
                  <Dynamic component={local.navigationIcons?.next ?? ArrowRight} />
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
                  <Show
                    when={picker() === 'month'}
                    fallback={
                      <For each={YEARS}>
                        {year => (
                          <button
                            type="button"
                            data-selected={rendered.state.placeholder.hy === year ? '' : undefined}
                            onClick={() => jumpTo({ hy: year })}
                          >
                            {year}
                          </button>
                        )}
                      </For>
                    }
                  >
                    <For each={months()}>
                      {(month, index) => (
                        <button
                          type="button"
                          data-selected={rendered.state.placeholder.hm === index() + 1 ? '' : undefined}
                          onClick={() => jumpTo({ hm: index() + 1 })}
                        >
                          {month}
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
                <Index each={rendered.months}>
                  {month => (
                    <HijriCalendarGrid month={month()}>
                      <Show when={showWeekdays()}>
                        <HijriCalendarGridHead>
                          <HijriCalendarGridRow>
                            <Index each={rendered.weekDays}>
                              {(weekday, index) => (
                                <HijriCalendarHeadCell class="taqwim-calendar-weekday">
                                  {local.renderWeekday ? local.renderWeekday({ weekday: weekday(), index }) : weekday()}
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
                                      {local.renderCell ?? undefined}
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
          </>
        )
      }}
    </HijriCalendarRoot>
  )
}
