import type { CalendarDay, HijriCalendarRootProps } from '@taqwim/react'
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
} from '@taqwim/react'
import { getLocaleData, MAX_HIJRI_YEAR, MIN_HIJRI_YEAR, type HijriDateObject } from '@taqwim/core'
import { useState, type ComponentType, type ReactNode } from 'react'
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

export interface HijriCalendarProps extends Omit<HijriCalendarRootProps, 'children'> {
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
  navigationIcons?: { prev?: ComponentType; next?: ComponentType }
  /** Replaces the contents of a day cell. */
  renderCell?: (props: HijriCalendarCellRenderProps) => ReactNode
  /** Replaces a weekday label. */
  renderWeekday?: (props: { weekday: string; index: number }) => ReactNode
}

function renderDefaultCell(cell: HijriCalendarCellRenderProps, dateEmphasis: 'hijri' | 'gregorian'): ReactNode {
  if (cell.secondaryDayValue) {
    return (
      <span className="taqwim-calendar-cell-dates">
        <span
          className="taqwim-calendar-cell-primary"
          data-primary
          data-calendar-system={dateEmphasis === 'gregorian' ? 'gregorian' : 'hijri'}
        >
          {cell.primaryDayValue}
        </span>
        <span
          className="taqwim-calendar-cell-secondary"
          data-secondary
          data-calendar-system={dateEmphasis === 'gregorian' ? 'hijri' : 'gregorian'}
        >
          {cell.secondaryDayValue}
        </span>
      </span>
    )
  }

  return cell.dayValue
}

/*
 * Bounded by what the Umm al-Qura table actually covers. The Vue version
 * previously derived this from `new Date().getFullYear() + 579`, offering years
 * the calendar cannot convert.
 */
const YEARS = Array.from({ length: MAX_HIJRI_YEAR - MIN_HIJRI_YEAR + 1 }, (_, i) => MIN_HIJRI_YEAR + i)

export function HijriCalendar({
  theme = 'default',
  size = 'default',
  layout = 'default',
  showNavigation = true,
  showWeekdays = true,
  selectableHeading = true,
  navigationIcons,
  renderCell,
  renderWeekday,
  ...options
}: HijriCalendarProps): ReactNode {
  const [picker, setPicker] = useState<'month' | 'year' | null>(null)

  const months = getLocaleData(options.locale ?? 'en', 'monthsLong') as string[]
  const PrevIcon = navigationIcons?.prev ?? ArrowLeft
  const NextIcon = navigationIcons?.next ?? ArrowRight

  return (
    <HijriCalendarRoot
      {...options}
      data-taqwim-theme={theme}
      data-taqwim-size={size === 'default' ? undefined : size}
      data-taqwim-layout={layout === 'default' ? undefined : layout}
    >
      {({ months: visibleMonths, weekDays, state, store }) => {
        // Day 1 keeps the jump inside the target month regardless of its length.
        const jumpTo = (part: Partial<HijriDateObject>) => {
          store.setPlaceholder({ ...state.placeholder, ...part, hd: 1 })
          setPicker(null)
        }
        const togglePicker = (which: 'month' | 'year') => setPicker(current => (current === which ? null : which))
        const gregorianPrimary = state.showGregorian && state.dateEmphasis === 'gregorian'
        const hijriHeadingButtons = () => (
          <>
            <button
              type="button"
              className="taqwim-calendar-heading-button"
              data-taqwim-heading="month"
              aria-expanded={picker === 'month'}
              onClick={() => togglePicker('month')}
            >
              {months[state.placeholder.hm - 1]}
            </button>
            <button
              type="button"
              className="taqwim-calendar-heading-button"
              data-taqwim-heading="year"
              aria-expanded={picker === 'year'}
              onClick={() => togglePicker('year')}
            >
              {state.placeholder.hy}
            </button>
          </>
        )

        return (
          <>
            <HijriCalendarHeader className="taqwim-calendar-header">
              {showNavigation && (
                <HijriCalendarPrev className="taqwim-calendar-nav-button">
                  <PrevIcon />
                </HijriCalendarPrev>
              )}

              <HijriCalendarHeading className="taqwim-calendar-heading">
                {selectableHeading ? (
                  <>
                    <span
                      className="taqwim-calendar-heading-primary"
                      data-calendar-system={gregorianPrimary ? 'gregorian' : 'hijri'}
                    >
                      {gregorianPrimary ? state.headingValue : hijriHeadingButtons()}
                    </span>
                    {state.showGregorian && state.secondaryHeadingValue && (
                      <span
                        className="taqwim-calendar-heading-secondary"
                        data-calendar-system={gregorianPrimary ? 'hijri' : 'gregorian'}
                      >
                        {gregorianPrimary ? hijriHeadingButtons() : state.secondaryHeadingValue}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span
                      className="taqwim-calendar-heading-primary"
                      data-calendar-system={gregorianPrimary ? 'gregorian' : 'hijri'}
                    >
                      {state.headingValue}
                    </span>
                    {state.secondaryHeadingValue && (
                      <span
                        className="taqwim-calendar-heading-secondary"
                        data-calendar-system={gregorianPrimary ? 'hijri' : 'gregorian'}
                      >
                        {state.secondaryHeadingValue}
                      </span>
                    )}
                  </>
                )}
              </HijriCalendarHeading>

              {showNavigation && (
                <HijriCalendarNext className="taqwim-calendar-nav-button">
                  <NextIcon />
                </HijriCalendarNext>
              )}
            </HijriCalendarHeader>

            {/*
              Rendered inline rather than in a portal: the theme lives on this
              element's ancestors, so a portalled panel would lose it.
            */}
            {picker && (
              <div className="taqwim-calendar-picker">
                <div className="taqwim-calendar-picker-grid">
                  {picker === 'month'
                    ? months.map((month, index) => (
                        <button
                          key={month}
                          type="button"
                          data-selected={state.placeholder.hm === index + 1 ? '' : undefined}
                          onClick={() => jumpTo({ hm: index + 1 })}
                        >
                          {month}
                        </button>
                      ))
                    : YEARS.map(year => (
                        <button
                          key={year}
                          type="button"
                          data-selected={state.placeholder.hy === year ? '' : undefined}
                          onClick={() => jumpTo({ hy: year })}
                        >
                          {year}
                        </button>
                      ))}
                </div>
              </div>
            )}

            {(!picker || layout === 'panel') && (
              <div className="taqwim-calendar-months">
                {visibleMonths.map(month => (
                  <HijriCalendarGrid key={month.label} month={month}>
                    {showWeekdays && (
                      <HijriCalendarGridHead>
                        <HijriCalendarGridRow>
                          {weekDays.map((weekday, index) => (
                            <HijriCalendarHeadCell key={weekday} className="taqwim-calendar-weekday">
                              {renderWeekday ? renderWeekday({ weekday, index }) : weekday}
                            </HijriCalendarHeadCell>
                          ))}
                        </HijriCalendarGridRow>
                      </HijriCalendarGridHead>
                    )}

                    <HijriCalendarGridBody>
                      {month.weeks.map((week, index) => (
                        <HijriCalendarGridRow key={index}>
                          {week.map(day => (
                            <HijriCalendarCell key={`${day.date.hy}-${day.date.hm}-${day.date.hd}`} day={day}>
                              <HijriCalendarCellTrigger day={day}>
                                {cell =>
                                  renderCell ? renderCell(cell) : renderDefaultCell(cell, state.dateEmphasis ?? 'hijri')
                                }
                              </HijriCalendarCellTrigger>
                            </HijriCalendarCell>
                          ))}
                        </HijriCalendarGridRow>
                      ))}
                    </HijriCalendarGridBody>
                  </HijriCalendarGrid>
                ))}
              </div>
            )}
          </>
        )
      }}
    </HijriCalendarRoot>
  )
}
