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
  /** Show the previous/next paging buttons. @default true */
  showNavigation?: boolean
  /** Show the weekday label row. @default true */
  showWeekdays?: boolean
  /** Let the heading open month and year pickers. @default true */
  selectableHeading?: boolean
  /** Replace the default chevrons. */
  navigationIcons?: { prev?: ComponentType; next?: ComponentType }
  /** Replaces the contents of a day cell. */
  renderCell?: (props: { dayValue: string; day: CalendarDay }) => ReactNode
  /** Replaces a weekday label. */
  renderWeekday?: (props: { weekday: string; index: number }) => ReactNode
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
    <HijriCalendarRoot {...options} data-taqwim-theme={theme} data-taqwim-size={size === 'default' ? undefined : size}>
      {({ months: visibleMonths, weekDays, state, store }) => {
        // Day 1 keeps the jump inside the target month regardless of its length.
        const jumpTo = (part: Partial<HijriDateObject>) => {
          store.setPlaceholder({ ...state.placeholder, ...part, hd: 1 })
          setPicker(null)
        }
        const toggleMonthPicker = () => setPicker(current => (current === 'month' ? null : 'month'))

        return (
          <>
            <HijriCalendarHeader className="taqwim-calendar-header">
              {showNavigation && (
                <HijriCalendarPrev className="taqwim-calendar-nav-button">
                  <PrevIcon />
                </HijriCalendarPrev>
              )}

              <HijriCalendarHeading
                className="taqwim-calendar-heading"
                role={selectableHeading ? 'button' : undefined}
                tabIndex={selectableHeading ? 0 : undefined}
                onClick={selectableHeading ? toggleMonthPicker : undefined}
                onKeyDown={
                  selectableHeading
                    ? event => {
                        if (event.key !== 'Enter') return
                        event.preventDefault()
                        toggleMonthPicker()
                      }
                    : undefined
                }
              />

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
            {picker ? (
              <div className="taqwim-calendar-picker">
                <div className="taqwim-calendar-picker-tabs">
                  <button
                    type="button"
                    data-active={picker === 'month' ? '' : undefined}
                    onClick={() => setPicker('month')}
                  >
                    {state.headingValue.split(' ')[0]}
                  </button>
                  <button
                    type="button"
                    data-active={picker === 'year' ? '' : undefined}
                    onClick={() => setPicker('year')}
                  >
                    {state.placeholder.hy}
                  </button>
                </div>

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
            ) : (
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
                              <HijriCalendarCellTrigger day={day}>{renderCell ?? undefined}</HijriCalendarCellTrigger>
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
