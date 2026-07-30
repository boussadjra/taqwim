<script lang="ts">
  /**
   * The Svelte end of the shared end-to-end harness.
   *
   * Configuration comes from the query string so one Playwright spec can put
   * every framework's adapter into the same state. See `e2e/harness.ts`.
   */
  import type { HijriDateObject } from '@taqwim/core'
  import { HijriCalendar, type HijriCalendarSize, type HijriCalendarTheme } from '@taqwim/svelte-styled'
  import { formatSelection, readConfig } from './harness'

  const config = readConfig(window.location.search)

  let theme = $state(config.theme as HijriCalendarTheme)
  let value = $state<HijriDateObject | HijriDateObject[] | undefined>(config.value)
</script>

<select data-testid="theme" bind:value={theme}>
  {#each ['default', 'dark', 'islamic', 'neon', 'ocean'] as name (name)}
    <option value={name}>{name}</option>
  {/each}
</select>

<HijriCalendar
  {theme}
  size={config.size as HijriCalendarSize}
  locale={config.locale}
  dir={config.dir}
  weekStartsOn={config.weekStartsOn as 0}
  numberOfMonths={config.numberOfMonths}
  fixedWeeks={config.fixedWeeks}
  multiple={config.multiple}
  preventDeselect={config.preventDeselect}
  disableDaysOutsideCurrentView={config.disableDaysOutsideCurrentView}
  disabled={config.disabled}
  readonly={config.readonly}
  initialFocus={config.initialFocus}
  defaultPlaceholder={config.placeholder}
  minValue={config.min}
  maxValue={config.max}
  {value}
  onValueChange={next => (value = next)}
/>

<output data-testid="selection">{formatSelection(value)}</output>
