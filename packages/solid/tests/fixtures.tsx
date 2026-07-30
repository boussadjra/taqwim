import { For, Index, type JSX } from 'solid-js'
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
  type HijriCalendarRootOptions,
} from '../src'

/**
 * The full compound surface, composed the way the README documents it — the
 * Solid counterpart of the Vue and React fixtures.
 */
export function TestCalendar(props: HijriCalendarRootOptions): JSX.Element {
  return (
    <HijriCalendarRoot {...props}>
      {({ months, weekDays }) => (
        <>
          <HijriCalendarHeader>
            <HijriCalendarPrev data-testid="prev">‹</HijriCalendarPrev>
            <HijriCalendarHeading data-testid="heading" />
            <HijriCalendarNext data-testid="next">›</HijriCalendarNext>
          </HijriCalendarHeader>

          <For each={months}>
            {month => (
              <HijriCalendarGrid month={month}>
                <HijriCalendarGridHead>
                  <HijriCalendarGridRow>
                    <For each={weekDays}>{day => <HijriCalendarHeadCell>{day}</HijriCalendarHeadCell>}</For>
                  </HijriCalendarGridRow>
                </HijriCalendarGridHead>

                <HijriCalendarGridBody>
                  {/*  keys by position;  keys by reference and
                      would re-create every button on each snapshot. */}
                  <Index each={month.weeks}>
                    {week => (
                      <HijriCalendarGridRow>
                        <Index each={week()}>
                          {day => (
                            <HijriCalendarCell day={day()}>
                              <HijriCalendarCellTrigger day={day()} />
                            </HijriCalendarCell>
                          )}
                        </Index>
                      </HijriCalendarGridRow>
                    )}
                  </Index>
                </HijriCalendarGridBody>
              </HijriCalendarGrid>
            )}
          </For>
        </>
      )}
    </HijriCalendarRoot>
  )
}
