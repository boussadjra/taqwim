/**
 * The live date picker, React. One of four — see the sibling `demos/*`
 * directories, and `CalendarDemo.tsx` for why they are duplicated.
 */
import type { DateEmphasis, DatePickerInputDisplay } from '@taqwim/calendar-core'
import type { HijriDateObject } from '@taqwim/core'
import { HijriDatePicker, type HijriCalendarTheme } from '@taqwim/react-styled'
import { useState, type ReactNode } from 'react'

const FORMATS = ['iYYYY-iMM-iDD', 'iDD/iMM/iYYYY', 'iD iMMMM iYYYY', 'iEEEE, iD iMMMM iYYYY']

export function DatePickerDemo({ theme = 'islamic' }: { theme?: HijriCalendarTheme }): ReactNode {
  const [format, setFormat] = useState(FORMATS[0])
  const [locale, setLocale] = useState('en')
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr')
  const [editable, setEditable] = useState(true)
  const [showGregorian, setShowGregorian] = useState(true)
  const [dateEmphasis, setDateEmphasis] = useState<DateEmphasis>('hijri')
  const [inputDisplay, setInputDisplay] = useState<DatePickerInputDisplay>('hijri')
  const [value, setValue] = useState<HijriDateObject | undefined>()

  const pickLocale = (next: string) => {
    setLocale(next)
    setDir(next === 'ar' ? 'rtl' : 'ltr')
  }

  const selected = value ? `${value.hy}-${String(value.hm).padStart(2, '0')}-${String(value.hd).padStart(2, '0')}` : ''

  return (
    <div className="demo not-content">
      <div className="demo-bar">
        <label className="demo-control">
          Format
          <select value={format} onChange={e => setFormat(e.target.value)}>
            {FORMATS.map(pattern => (
              <option key={pattern} value={pattern}>
                {pattern}
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
          <input type="checkbox" checked={editable} onChange={e => setEditable(e.target.checked)} /> editable
        </label>

        <label className="demo-control">
          <input type="checkbox" checked={showGregorian} onChange={e => setShowGregorian(e.target.checked)} />{' '}
          showGregorian
        </label>

        <label className="demo-control">
          dateEmphasis
          <select
            value={dateEmphasis}
            disabled={!showGregorian}
            onChange={e => setDateEmphasis(e.target.value as DateEmphasis)}
          >
            <option value="hijri">hijri</option>
            <option value="gregorian">gregorian</option>
          </select>
        </label>

        <label className="demo-control">
          inputDisplay
          <select value={inputDisplay} onChange={e => setInputDisplay(e.target.value as DatePickerInputDisplay)}>
            <option value="hijri">hijri</option>
            <option value="gregorian">gregorian</option>
            <option value="both">both</option>
          </select>
        </label>
      </div>

      <div className="demo-stage" data-tall>
        <HijriDatePicker
          theme={theme}
          format={format}
          locale={locale}
          dir={dir}
          editable={editable}
          showGregorian={showGregorian}
          dateEmphasis={dateEmphasis}
          inputDisplay={inputDisplay}
          label="Appointment date"
          value={value}
          onValueChange={setValue}
        />
      </div>

      <div className="demo-readout">
        <span>Selected</span>
        <code data-empty={selected ? undefined : ''}>{selected || 'nothing yet'}</code>
      </div>

      <p className="demo-caption">
        With <code>editable</code> on, the input accepts <code>1446-09-01</code> or <code>01/09/1446</code>. Text it
        cannot parse reverts to the last good value rather than clearing the selection. The trigger is a{' '}
        <code>combobox</code>: <kbd>Enter</kbd> opens the popup, <kbd>Escape</kbd> closes it and returns focus.
      </p>
    </div>
  )
}
