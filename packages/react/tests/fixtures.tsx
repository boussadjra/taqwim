import type { ReactNode } from 'react'
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
  type HijriCalendarRootProps,
} from '../src'

/**
 * The full compound surface, composed the way the README documents it — the
 * React counterpart of the Vue package's `TestCalendar.vue`.
 */
export function TestCalendar(props: Omit<HijriCalendarRootProps, 'children'>): ReactNode {
  return (
    <HijriCalendarRoot {...props}>
      {({ months, weekDays }) => (
        <>
          <HijriCalendarHeader>
            <HijriCalendarPrev data-testid="prev">‹</HijriCalendarPrev>
            <HijriCalendarHeading data-testid="heading" />
            <HijriCalendarNext data-testid="next">›</HijriCalendarNext>
          </HijriCalendarHeader>

          {months.map(month => (
            <HijriCalendarGrid key={month.label} month={month}>
              <HijriCalendarGridHead>
                <HijriCalendarGridRow>
                  {weekDays.map(day => (
                    <HijriCalendarHeadCell key={day}>{day}</HijriCalendarHeadCell>
                  ))}
                </HijriCalendarGridRow>
              </HijriCalendarGridHead>

              <HijriCalendarGridBody>
                {month.weeks.map((week, index) => (
                  <HijriCalendarGridRow key={index}>
                    {week.map(day => (
                      <HijriCalendarCell key={`${day.date.hy}-${day.date.hm}-${day.date.hd}`} day={day}>
                        <HijriCalendarCellTrigger day={day} />
                      </HijriCalendarCell>
                    ))}
                  </HijriCalendarGridRow>
                ))}
              </HijriCalendarGridBody>
            </HijriCalendarGrid>
          ))}
        </>
      )}
    </HijriCalendarRoot>
  )
}
