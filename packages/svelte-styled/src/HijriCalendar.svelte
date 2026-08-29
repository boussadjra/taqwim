<script lang="ts">
  import { getLocaleData, MAX_HIJRI_YEAR, MIN_HIJRI_YEAR, type HijriDateObject } from '@taqwim/core'
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
  } from '@taqwim/svelte'
  import ArrowLeft from './ArrowLeft.svelte'
  import ArrowRight from './ArrowRight.svelte'
  import type { HijriCalendarProps } from './types'

  let {
    theme = 'default',
    size = 'default',
    layout = 'default',
    showNavigation = true,
    showWeekdays = true,
    selectableHeading = true,
    navigationIcons,
    cell,
    weekday,
    ...options
  }: HijriCalendarProps = $props()

  let picker = $state<'month' | 'year' | null>(null)

  const months = $derived(getLocaleData(options.locale ?? 'en', 'monthsLong') as string[])

  /*
   * Bounded by what the Umm al-Qura table actually covers, rather than the
   * `new Date().getFullYear() + 579` approximation the pre-1.0 Vue version
   * used — that offered years the calendar cannot convert.
   */
  const years = Array.from({ length: MAX_HIJRI_YEAR - MIN_HIJRI_YEAR + 1 }, (_, i) => MIN_HIJRI_YEAR + i)

  const PrevIcon = $derived(navigationIcons?.prev ?? ArrowLeft)
  const NextIcon = $derived(navigationIcons?.next ?? ArrowRight)

  function togglePicker(which: 'month' | 'year') {
    if (!selectableHeading) return
    picker = picker === which ? null : which
  }
</script>

<HijriCalendarRoot
  {...options}
  data-taqwim-theme={theme}
  data-taqwim-size={size === 'default' ? undefined : size}
  data-taqwim-layout={layout === 'default' ? undefined : layout}
>
  {#snippet children({ months: visibleMonths, weekDays, state, store })}
    {@const jumpTo = (part: Partial<HijriDateObject>) => {
      // Day 1 keeps the jump inside the target month regardless of its length.
      store.setPlaceholder({ ...state.placeholder, ...part, hd: 1 })
      picker = null
    }}

    <HijriCalendarHeader class="taqwim-calendar-header">
      {#if showNavigation}
        <HijriCalendarPrev class="taqwim-calendar-nav-button">
          <PrevIcon />
        </HijriCalendarPrev>
      {/if}

      <HijriCalendarHeading class="taqwim-calendar-heading">
        {#if selectableHeading}
          <button
            type="button"
            class="taqwim-calendar-heading-button"
            data-taqwim-heading="month"
            aria-expanded={picker === 'month'}
            onclick={() => togglePicker('month')}
          >
            {months[state.placeholder.hm - 1]}
          </button>
          <button
            type="button"
            class="taqwim-calendar-heading-button"
            data-taqwim-heading="year"
            aria-expanded={picker === 'year'}
            onclick={() => togglePicker('year')}
          >
            {state.placeholder.hy}
          </button>
          {#if state.showGregorian && state.secondaryHeadingValue}
            <span class="taqwim-calendar-heading-secondary">{state.secondaryHeadingValue}</span>
          {/if}
        {:else}
          <span>{state.headingValue}</span>
          {#if state.secondaryHeadingValue}
            <span class="taqwim-calendar-heading-secondary">{state.secondaryHeadingValue}</span>
          {/if}
        {/if}
      </HijriCalendarHeading>

      {#if showNavigation}
        <HijriCalendarNext class="taqwim-calendar-nav-button">
          <NextIcon />
        </HijriCalendarNext>
      {/if}
    </HijriCalendarHeader>

    <!--
      Rendered inline rather than in a portal: the theme lives on this
      element's ancestors, so a portalled panel would lose it.
    -->
    {#if picker}
      <div class="taqwim-calendar-picker">
        <div class="taqwim-calendar-picker-grid">
          {#if picker === 'month'}
            {#each months as month, index (month)}
              <button
                type="button"
                data-selected={state.placeholder.hm === index + 1 ? '' : undefined}
                onclick={() => jumpTo({ hm: index + 1 })}
              >
                {month}
              </button>
            {/each}
          {:else}
            {#each years as year (year)}
              <button
                type="button"
                data-selected={state.placeholder.hy === year ? '' : undefined}
                onclick={() => jumpTo({ hy: year })}
              >
                {year}
              </button>
            {/each}
          {/if}
        </div>
      </div>
    {/if}

    {#if !picker || layout === 'panel'}
      <div class="taqwim-calendar-months">
        {#each visibleMonths as month (month.label)}
          <HijriCalendarGrid {month}>
            {#if showWeekdays}
              <HijriCalendarGridHead>
                <HijriCalendarGridRow>
                  {#each weekDays as label, index (label)}
                    <HijriCalendarHeadCell class="taqwim-calendar-weekday">
                      {#if weekday}{@render weekday({ weekday: label, index })}{:else}{label}{/if}
                    </HijriCalendarHeadCell>
                  {/each}
                </HijriCalendarGridRow>
              </HijriCalendarGridHead>
            {/if}

            <HijriCalendarGridBody>
              {#each month.weeks as week, index (index)}
                <HijriCalendarGridRow>
                  {#each week as day (`${day.date.hy}-${day.date.hm}-${day.date.hd}`)}
                    <HijriCalendarCell {day}>
                      <HijriCalendarCellTrigger {day}>
                        {#snippet children(cellProps)}
                          {#if cell}
                            {@render cell(cellProps)}
                          {:else if cellProps.secondaryDayValue}
                            <span class="taqwim-calendar-cell-dates">
                              <span
                                class="taqwim-calendar-cell-primary"
                                data-primary
                                data-calendar-system={state.dateEmphasis === 'gregorian' ? 'gregorian' : 'hijri'}
                              >
                                {cellProps.primaryDayValue}
                              </span>
                              <span
                                class="taqwim-calendar-cell-secondary"
                                data-secondary
                                data-calendar-system={state.dateEmphasis === 'gregorian' ? 'hijri' : 'gregorian'}
                              >
                                {cellProps.secondaryDayValue}
                              </span>
                            </span>
                          {:else}
                            {cellProps.dayValue}
                          {/if}
                        {/snippet}
                      </HijriCalendarCellTrigger>
                    </HijriCalendarCell>
                  {/each}
                </HijriCalendarGridRow>
              {/each}
            </HijriCalendarGridBody>
          </HijriCalendarGrid>
        {/each}
      </div>
    {/if}
  {/snippet}
</HijriCalendarRoot>
