/**
 * The live calendar, React.
 *
 * One of four near-identical files — see `demos/vue`, `demos/svelte` and
 * `demos/solid`. They are duplicated rather than abstracted for the same
 * reason the unit suites are: a reader on the React tab should be looking at
 * idiomatic React, and a difference between the four should mean a difference
 * in the adapters rather than in a shared wrapper.
 */
import type { HijriDateObject } from '@taqwim/core'
import { themeNames } from '@taqwim/themes/names'
import { HijriCalendar, type HijriCalendarSize, type HijriCalendarTheme } from '@taqwim/react-styled'
import { useState, type ReactNode } from 'react'

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
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className="demo-control">
          Size
          <select value={size} onChange={e => setSize(e.target.value as HijriCalendarSize)}>
            {['compact', 'default', 'large'].map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className="demo-control">
          Locale
          <select value={locale} onChange={e => pickLocale(e.target.value)}>
            {['en', 'ar', 'fr'].map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className="demo-control">
          Direction
          <select value={dir} onChange={e => setDir(e.target.value as 'ltr' | 'rtl')}>
            <option value="ltr">ltr</option>
            <option value="rtl">rtl</option>
          </select>
        </label>

        <label className="demo-control">
          <input type="checkbox" checked={multiple} onChange={e => pickMultiple(e.target.checked)} /> multiple
        </label>
      </div>

      <div className="demo-stage">
        <HijriCalendar
          theme={theme}
          size={size}
          locale={locale}
          dir={dir}
          weekStartsOn={locale === 'ar' ? 6 : 0}
          multiple={multiple}
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
