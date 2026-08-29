import { HijriCalendar, type HijriCalendarSize, type HijriCalendarTheme } from '@taqwim/react-styled'
import type { HijriDateObject } from '@taqwim/core'
import { useState } from 'react'
import { formatSelection, readConfig } from './harness'

/**
 * The React end of the shared end-to-end harness.
 *
 * Configuration comes from the query string so one Playwright spec can put
 * every framework's adapter into the same state. See `e2e/harness.ts`.
 */
export function Harness() {
  const config = readConfig(window.location.search)
  const [theme, setTheme] = useState<HijriCalendarTheme>(config.theme as HijriCalendarTheme)
  const [value, setValue] = useState<HijriDateObject | HijriDateObject[] | undefined>(config.value)

  return (
    <>
      <select data-testid="theme" value={theme} onChange={event => setTheme(event.target.value as HijriCalendarTheme)}>
        {['default', 'dark', 'islamic', 'neon', 'ocean'].map(name => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      <HijriCalendar
        theme={theme}
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
        showGregorian={config.showGregorian}
        dateEmphasis={config.dateEmphasis}
        gregorianLocale={config.gregorianLocale}
        defaultPlaceholder={config.placeholder}
        minValue={config.min}
        maxValue={config.max}
        value={value}
        onValueChange={setValue}
      />

      <output data-testid="selection">{formatSelection(value)}</output>
    </>
  )
}
