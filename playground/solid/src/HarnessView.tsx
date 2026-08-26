import type { HijriDateObject } from '@taqwim/core'
import { HijriCalendar, type HijriCalendarSize, type HijriCalendarTheme } from '@taqwim/solid-styled'
import { createSignal, For } from 'solid-js'
import { formatSelection, readConfig } from './harness'

/**
 * The Solid end of the shared end-to-end harness.
 *
 * Configuration comes from the query string so one Playwright spec can put
 * every framework's adapter into the same state. See `e2e/harness.ts`.
 */
export function HarnessView() {
  const config = readConfig(window.location.search)
  const [theme, setTheme] = createSignal<HijriCalendarTheme>(config.theme as HijriCalendarTheme)
  const [value, setValue] = createSignal<HijriDateObject | HijriDateObject[] | undefined>(config.value)

  return (
    <>
      <select
        data-testid="theme"
        value={theme()}
        onChange={event => setTheme(event.currentTarget.value as HijriCalendarTheme)}
      >
        <For each={['default', 'dark', 'islamic', 'neon', 'ocean']}>{name => <option value={name}>{name}</option>}</For>
      </select>

      <HijriCalendar
        theme={theme()}
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
        value={value()}
        onValueChange={setValue}
      />

      <output data-testid="selection">{formatSelection(value())}</output>
    </>
  )
}
