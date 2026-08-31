/**
 * The live calendar, React.
 *
 * One of four near-identical files — see `demos/vue`, `demos/svelte` and
 * `demos/solid`. They are duplicated rather than abstracted for the same
 * reason the unit suites are: a reader on the React tab should be looking at
 * idiomatic React, and a difference between the four should mean a difference
 * in the adapters rather than in a shared wrapper.
 */
import type { DateEmphasis } from '@taqwim/calendar-core'
import type { HijriCalendarId, HijriDateObject } from '@taqwim/core'
import { themeNames } from '@taqwim/themes/names'
import { HijriCalendar, type HijriCalendarSize, type HijriCalendarTheme } from '@taqwim/react-styled'
import { useState, type ReactNode } from 'react'
import { HIJRI_CALENDAR_OPTIONS, HIJRI_CALENDAR_SYSTEMS } from '../calendarSystems'
import { DATE_EMPHASIS_OPTIONS, DIRECTION_OPTIONS, LANGUAGE_OPTIONS, presetLabel, SIZE_OPTIONS } from '../demoOptions'

export function CalendarDemo({
  theme: initialTheme = 'default',
  multiple: initialMultiple = false,
}: {
  theme?: HijriCalendarTheme
  multiple?: boolean
}): ReactNode {
  const [theme, setTheme] = useState<HijriCalendarTheme>(initialTheme)
  const [size, setSize] = useState<HijriCalendarSize>('default')
  const [locale, setLocale] = useState('en')
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr')
  const [multiple, setMultiple] = useState(initialMultiple)
  const [showGregorian, setShowGregorian] = useState(false)
  const [dateEmphasis, setDateEmphasis] = useState<DateEmphasis>('hijri')
  const [calendarSystemId, setCalendarSystemId] = useState<HijriCalendarId>('islamic-umalqura')
  const [value, setValue] = useState<HijriDateObject | HijriDateObject[] | undefined>()

  // Arabic reads right to left and its week starts on Saturday, so picking it
  // shows the RTL case rather than leaving it as something to configure.
  const pickLocale = (next: string) => {
    setLocale(next)
    setDir(next === 'ar' ? 'rtl' : 'ltr')
  }

  // Switching between one date and a list leaves the old shape behind.
  const pickMultiple = (next: boolean) => {
    setMultiple(next)
    setValue(undefined)
  }

  const list = Array.isArray(value) ? value : value ? [value] : []
  const selected = list.map(d => `${d.hy}-${String(d.hm).padStart(2, '0')}-${String(d.hd).padStart(2, '0')}`).join(', ')

  return (
    <div className="demo not-content">
      <div className="demo-bar">
        <label className="demo-control">
          Theme
          <select value={theme} onChange={e => setTheme(e.target.value as HijriCalendarTheme)}>
            {themeNames.map(name => (
              <option key={name} value={name}>
                {presetLabel(name)}
              </option>
            ))}
          </select>
        </label>

        <label className="demo-control">
          Hijri calendar
          <select
            value={calendarSystemId}
            data-calendar-system-select
            onChange={e => setCalendarSystemId(e.target.value as HijriCalendarId)}
          >
            {HIJRI_CALENDAR_OPTIONS.map(option => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="demo-control">
          Size
          <select value={size} onChange={e => setSize(e.target.value as HijriCalendarSize)}>
            {SIZE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="demo-control">
          Language
          <select value={locale} onChange={e => pickLocale(e.target.value)}>
            {LANGUAGE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="demo-control">
          Text direction
          <select value={dir} onChange={e => setDir(e.target.value as 'ltr' | 'rtl')}>
            {DIRECTION_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="demo-control">
          <input type="checkbox" checked={multiple} onChange={e => pickMultiple(e.target.checked)} /> Select multiple
          dates
        </label>

        <label className="demo-control">
          <input type="checkbox" checked={showGregorian} onChange={e => setShowGregorian(e.target.checked)} /> Show
          Gregorian date
        </label>

        <label className="demo-control">
          Emphasize
          <select
            value={dateEmphasis}
            disabled={!showGregorian}
            onChange={e => setDateEmphasis(e.target.value as DateEmphasis)}
          >
            {DATE_EMPHASIS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="demo-stage">
        <HijriCalendar
          calendarSystem={HIJRI_CALENDAR_SYSTEMS[calendarSystemId]}
          theme={theme}
          size={size}
          locale={locale}
          dir={dir}
          weekStartsOn={locale === 'ar' ? 6 : 0}
          multiple={multiple}
          showGregorian={showGregorian}
          dateEmphasis={dateEmphasis}
          value={value}
          onValueChange={setValue}
        />
      </div>

      <div className="demo-readout">
        <span>Selected</span>
        <code data-empty={selected ? undefined : ''}>{selected || 'nothing yet'}</code>
      </div>

      <p className="demo-caption">
        Tab into the grid, then use the arrow keys, <kbd>Home</kbd>/<kbd>End</kbd>, <kbd>PageUp</kbd>/
        <kbd>PageDown</kbd> (with <kbd>Shift</kbd> for years) and <kbd>Enter</kbd> to select. Under{' '}
        <code>dir=&quot;rtl&quot;</code> the horizontal keys mirror.
      </p>
    </div>
  )
}
