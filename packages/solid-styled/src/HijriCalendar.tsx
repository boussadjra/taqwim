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

export type HijriCalendarTheme =
  | 'default'
  | 'dark'
  | 'modern'
  | 'islamic'
  | 'minimal'
  | 'minimalist'
  | 'neon'
  | 'ocean'
  | 'sunset'
  | 'cyberpunk'
  | 'nature'
  | 'luxurious'
  | 'material'

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
  /** Show the previous/next paging buttons. @default true */
  showNavigation?: boolean
  /** Show the weekday label row. @default true */
  showWeekdays?: boolean
  /** Let the heading open month and year pickers. @default true */
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
  const showNavigation = () => local.showNavigation ?? true
  const showWeekdays = () => local.showWeekdays ?? true
  const selectableHeading = () => local.selectableHeading ?? true

  const months = () => getLocaleData(options.locale ?? 'en', 'monthsLong') as string[]
  const toggleMonthPicker = () => setPicker(current => (current === 'month' ? null : 'month'))

  return (
    <HijriCalendarRoot
      {...options}
      data-taqwim-theme={theme()}
      data-taqwim-size={size() === 'default' ? undefined : size()}
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

              <HijriCalendarHeading
                class="taqwim-calendar-heading"
                role={selectableHeading() ? 'button' : undefined}
                tabindex={selectableHeading() ? 0 : undefined}
                onClick={() => selectableHeading() && toggleMonthPicker()}
                onKeyDown={(event: KeyboardEvent) => {
                  if (!selectableHeading() || event.key !== 'Enter') return
                  event.preventDefault()
                  toggleMonthPicker()
                }}
              />

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
            <Show
              when={picker()}
              fallback={
                /*
                 * `Index` throughout, never `For`.
                 *
                 * The store rebuilds its whole object graph on each snapshot,
                 * and `For` keys by reference — so any state change threw away
                 * every cell and built new ones. Solid delegates click to the
                 * document, so a button replaced between `mousedown` and
                 * `click` never fired its handler. Since a real browser focuses
                 * a button before clicking it, and the focus handler is itself
                 * a state change, selection was dead in the browser while
                 * passing in jsdom, where `fireEvent.click` sends no focus.
                 *
                 * `Index` keys by position instead and hands each item over as
                 * an accessor. The grid is a fixed shape whose contents change,
                 * which is exactly what it is for.
                 */
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
                                    {local.renderWeekday
                                      ? local.renderWeekday({ weekday: weekday(), index })
                                      : weekday()}
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
              }
            >
              <div class="taqwim-calendar-picker">
                <div class="taqwim-calendar-picker-tabs">
                  <button
                    type="button"
                    data-active={picker() === 'month' ? '' : undefined}
                    onClick={() => setPicker('month')}
                  >
                    {rendered.state.headingValue.split(' ')[0]}
                  </button>
                  <button
                    type="button"
                    data-active={picker() === 'year' ? '' : undefined}
                    onClick={() => setPicker('year')}
                  >
                    {rendered.state.placeholder.hy}
                  </button>
                </div>

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
          </>
        )
      }}
    </HijriCalendarRoot>
  )
}
