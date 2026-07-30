<script lang="ts">
  /**
   * The full compound surface, composed the way the README documents it — the
   * Svelte counterpart of the Vue, React and Solid fixtures.
   */
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

  let props: HijriCalendarRootOptions = $props()
</script>

<HijriCalendarRoot {...props}>
  {#snippet children({ months, weekDays })}
    <HijriCalendarHeader>
      <HijriCalendarPrev data-testid="prev">‹</HijriCalendarPrev>
      <HijriCalendarHeading data-testid="heading" />
      <HijriCalendarNext data-testid="next">›</HijriCalendarNext>
    </HijriCalendarHeader>

    {#each months as month (month.label)}
      <HijriCalendarGrid {month}>
        <HijriCalendarGridHead>
          <HijriCalendarGridRow>
            {#each weekDays as day (day)}
              <HijriCalendarHeadCell>{day}</HijriCalendarHeadCell>
            {/each}
          </HijriCalendarGridRow>
        </HijriCalendarGridHead>

        <HijriCalendarGridBody>
          {#each month.weeks as week, index (index)}
            <HijriCalendarGridRow>
              {#each week as day (`${day.date.hy}-${day.date.hm}-${day.date.hd}`)}
                <HijriCalendarCell {day}>
                  <HijriCalendarCellTrigger {day} />
                </HijriCalendarCell>
              {/each}
            </HijriCalendarGridRow>
          {/each}
        </HijriCalendarGridBody>
      </HijriCalendarGrid>
    {/each}
  {/snippet}
</HijriCalendarRoot>
