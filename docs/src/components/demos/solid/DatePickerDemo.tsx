/**
 * The live date picker, Solid. One of four — see the sibling `demos/*`
 * directories, and `CalendarDemo.tsx` for why they are duplicated.
 */
import type { DateEmphasis, DatePickerInputDisplay } from '@taqwim/calendar-core'
import type { HijriDateObject } from '@taqwim/core'
import { HijriDatePicker, type HijriCalendarTheme } from '@taqwim/solid-styled'
import { createSignal, For, type JSX } from 'solid-js'

const FORMATS = ['iYYYY-iMM-iDD', 'iDD/iMM/iYYYY', 'iD iMMMM iYYYY', 'iEEEE, iD iMMMM iYYYY']

export function DatePickerDemo(props: { theme?: HijriCalendarTheme }): JSX.Element {
  const [format, setFormat] = createSignal(FORMATS[0])
  const [locale, setLocale] = createSignal('en')
  const [dir, setDir] = createSignal<'ltr' | 'rtl'>('ltr')
  const [editable, setEditable] = createSignal(true)
  const [showGregorian, setShowGregorian] = createSignal(true)
  const [dateEmphasis, setDateEmphasis] = createSignal<DateEmphasis>('hijri')
  const [inputDisplay, setInputDisplay] = createSignal<DatePickerInputDisplay>('hijri')
  const [value, setValue] = createSignal<HijriDateObject | undefined>()

  const pickLocale = (next: string) => {
    setLocale(next)
    setDir(next === 'ar' ? 'rtl' : 'ltr')
  }

  const selected = () => {
    const current = value()
    return current ? `${current.hy}-${String(current.hm).padStart(2, '0')}-${String(current.hd).padStart(2, '0')}` : ''
  }

  return (
    <div class="demo not-content">
      {/*
        `selected` on each option, not `value` on the select alone: Solid assigns
        the select's value before <For> has inserted the options, so the browser
        finds no match and falls back to the first one. The controls then showed
        "amber"/"compact" while the calendar rendered islamic/default.
      */}
      <div class="demo-bar">
        <label class="demo-control">
          Format
          <select value={format()} onChange={e => setFormat(e.currentTarget.value)}>
            <For each={FORMATS}>
              {pattern => (
                <option value={pattern} selected={pattern === format()}>
                  {pattern}
                </option>
              )}
            </For>
          </select>
        </label>

        <label class="demo-control">
          Locale
          <select value={locale()} onChange={e => pickLocale(e.currentTarget.value)}>
            <For each={['en', 'ar', 'fr']}>
              {name => (
                <option value={name} selected={name === locale()}>
                  {name}
                </option>
              )}
            </For>
          </select>
        </label>

        <label class="demo-control">
          <input type="checkbox" checked={editable()} onChange={e => setEditable(e.currentTarget.checked)} /> editable
        </label>

        <label class="demo-control">
          <input type="checkbox" checked={showGregorian()} onChange={e => setShowGregorian(e.currentTarget.checked)} />{' '}
          showGregorian
        </label>

        <label class="demo-control">
          dateEmphasis
          <select
            value={dateEmphasis()}
            disabled={!showGregorian()}
            onChange={e => setDateEmphasis(e.currentTarget.value as DateEmphasis)}
          >
            <option value="hijri" selected={dateEmphasis() === 'hijri'}>
              hijri
            </option>
            <option value="gregorian" selected={dateEmphasis() === 'gregorian'}>
              gregorian
            </option>
          </select>
        </label>

        <label class="demo-control">
          inputDisplay
          <select
            value={inputDisplay()}
            onChange={e => setInputDisplay(e.currentTarget.value as DatePickerInputDisplay)}
          >
            <option value="hijri" selected={inputDisplay() === 'hijri'}>
              hijri
            </option>
            <option value="gregorian" selected={inputDisplay() === 'gregorian'}>
              gregorian
            </option>
            <option value="both" selected={inputDisplay() === 'both'}>
              both
            </option>
          </select>
        </label>
      </div>

      <div class="demo-stage" data-tall>
        <HijriDatePicker
          theme={props.theme ?? 'islamic'}
          format={format()}
          locale={locale()}
          dir={dir()}
          editable={editable()}
          showGregorian={showGregorian()}
          dateEmphasis={dateEmphasis()}
          inputDisplay={inputDisplay()}
          label="Appointment date"
          value={value()}
          onValueChange={setValue}
        />
      </div>

      <div class="demo-readout">
        <span>Selected</span>
        <code data-empty={selected() ? undefined : ''}>{selected() || 'nothing yet'}</code>
      </div>

      <p class="demo-caption">
        With <code>editable</code> on, the input accepts <code>1446-09-01</code> or <code>01/09/1446</code>. Text it
        cannot parse reverts to the last good value rather than clearing the selection. The trigger is a{' '}
        <code>combobox</code>: <kbd>Enter</kbd> opens the popup, <kbd>Escape</kbd> closes it and returns focus.
      </p>
    </div>
  )
}
