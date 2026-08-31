/**
 * The live date picker, React. One of four — see the sibling `demos/*`
 * directories, and `CalendarDemo.tsx` for why they are duplicated.
 */
import type { DateEmphasis, DatePickerInputDisplay } from '@taqwim/calendar-core'
import type { HijriCalendarId, HijriDateObject } from '@taqwim/core'
import { HijriDatePicker, type HijriCalendarTheme } from '@taqwim/react-styled'
import { useState, type ReactNode } from 'react'
import { HIJRI_CALENDAR_OPTIONS, HIJRI_CALENDAR_SYSTEMS } from '../calendarSystems'
import { DATE_EMPHASIS_OPTIONS, INPUT_DISPLAY_OPTIONS, LANGUAGE_OPTIONS } from '../demoOptions'

const FORMATS = ['iYYYY-iMM-iDD', 'iDD/iMM/iYYYY', 'iD iMMMM iYYYY', 'iEEEE, iD iMMMM iYYYY']

export function DatePickerDemo({ theme = 'islamic' }: { theme?: HijriCalendarTheme }): ReactNode {
  const [format, setFormat] = useState(FORMATS[0])
  const [locale, setLocale] = useState('en')
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr')
  const [editable, setEditable] = useState(true)
  const [showGregorian, setShowGregorian] = useState(true)
  const [dateEmphasis, setDateEmphasis] = useState<DateEmphasis>('hijri')
  const [inputDisplay, setInputDisplay] = useState<DatePickerInputDisplay>('hijri')
  const [calendarSystemId, setCalendarSystemId] = useState<HijriCalendarId>('islamic-umalqura')
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
          Date format
          <select value={format} onChange={e => setFormat(e.target.value)}>
            {FORMATS.map(pattern => (
              <option key={pattern} value={pattern}>
                {pattern}
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
          <input type="checkbox" checked={editable} onChange={e => setEditable(e.target.checked)} /> Allow typing
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

        <label className="demo-control">
          Input shows
          <select value={inputDisplay} onChange={e => setInputDisplay(e.target.value as DatePickerInputDisplay)}>
            {INPUT_DISPLAY_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="demo-stage" data-tall>
        <HijriDatePicker
          calendarSystem={HIJRI_CALENDAR_SYSTEMS[calendarSystemId]}
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
