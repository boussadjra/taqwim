/**
 * The live calendar, Solid.
 *
 * One of four near-identical files — see `demos/vue`, `demos/react` and
 * `demos/svelte`. They are duplicated rather than abstracted for the same
 * reason the unit suites are: a reader on the Solid tab should be looking at
 * idiomatic Solid, and a difference between the four should mean a difference
 * in the adapters rather than in a shared wrapper.
 */
import type { DateEmphasis } from '@taqwim/calendar-core'
import type { HijriCalendarId, HijriDateObject } from '@taqwim/core'
import { themeNames } from '@taqwim/themes/names'
import { HijriCalendar, type HijriCalendarSize, type HijriCalendarTheme } from '@taqwim/solid-styled'
import { createSignal, For, type JSX } from 'solid-js'
import { HIJRI_CALENDAR_OPTIONS, HIJRI_CALENDAR_SYSTEMS } from '../calendarSystems'
import { DATE_EMPHASIS_OPTIONS, DIRECTION_OPTIONS, LANGUAGE_OPTIONS, presetLabel, SIZE_OPTIONS } from '../demoOptions'

export function CalendarDemo(props: { theme?: HijriCalendarTheme; multiple?: boolean }): JSX.Element {
  /*
   * Read once, not destructured into a local: Solid props are getters, and
   * these two are only ever the initial value of a signal the demo owns.
   */
  const [theme, setTheme] = createSignal<HijriCalendarTheme>(props.theme ?? 'default')
  const [size, setSize] = createSignal<HijriCalendarSize>('default')
  const [locale, setLocale] = createSignal('en')
  const [dir, setDir] = createSignal<'ltr' | 'rtl'>('ltr')
  const [multiple, setMultiple] = createSignal(props.multiple ?? false)
  const [showGregorian, setShowGregorian] = createSignal(false)
  const [dateEmphasis, setDateEmphasis] = createSignal<DateEmphasis>('hijri')
  const [calendarSystemId, setCalendarSystemId] = createSignal<HijriCalendarId>('islamic-umalqura')
  const [value, setValue] = createSignal<HijriDateObject | HijriDateObject[] | undefined>()

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

  const selected = () => {
    const current = value()
    const list = Array.isArray(current) ? current : current ? [current] : []
    return list.map(d => `${d.hy}-${String(d.hm).padStart(2, '0')}-${String(d.hd).padStart(2, '0')}`).join(', ')
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
          Theme
          <select value={theme()} onChange={e => setTheme(e.currentTarget.value as HijriCalendarTheme)}>
            <For each={themeNames}>
              {name => (
                <option value={name} selected={name === theme()}>
                  {presetLabel(name)}
                </option>
              )}
            </For>
          </select>
        </label>

        <label class="demo-control">
          Hijri calendar
          <select
            value={calendarSystemId()}
            data-calendar-system-select
            onChange={e => setCalendarSystemId(e.currentTarget.value as HijriCalendarId)}
          >
            <For each={HIJRI_CALENDAR_OPTIONS}>
              {option => (
                <option value={option.id} selected={option.id === calendarSystemId()}>
                  {option.label}
                </option>
              )}
            </For>
          </select>
        </label>

        <label class="demo-control">
          Size
          <select value={size()} onChange={e => setSize(e.currentTarget.value as HijriCalendarSize)}>
            <For each={SIZE_OPTIONS}>
              {option => (
                <option value={option.value} selected={option.value === size()}>
                  {option.label}
                </option>
              )}
            </For>
          </select>
        </label>

        <label class="demo-control">
          Language
          <select value={locale()} onChange={e => pickLocale(e.currentTarget.value)}>
            <For each={LANGUAGE_OPTIONS}>
              {option => (
                <option value={option.value} selected={option.value === locale()}>
                  {option.label}
                </option>
              )}
            </For>
          </select>
        </label>

        <label class="demo-control">
          Text direction
          <select value={dir()} onChange={e => setDir(e.currentTarget.value as 'ltr' | 'rtl')}>
            <For each={DIRECTION_OPTIONS}>
              {option => (
                <option value={option.value} selected={option.value === dir()}>
                  {option.label}
                </option>
              )}
            </For>
          </select>
        </label>

        <label class="demo-control">
          <input type="checkbox" checked={multiple()} onChange={e => pickMultiple(e.currentTarget.checked)} /> Select
          multiple dates
        </label>

        <label class="demo-control">
          <input type="checkbox" checked={showGregorian()} onChange={e => setShowGregorian(e.currentTarget.checked)} />{' '}
          Show Gregorian date
        </label>

        <label class="demo-control">
          Emphasize
          <select
            value={dateEmphasis()}
            disabled={!showGregorian()}
            onChange={e => setDateEmphasis(e.currentTarget.value as DateEmphasis)}
          >
            <For each={DATE_EMPHASIS_OPTIONS}>
              {option => (
                <option value={option.value} selected={option.value === dateEmphasis()}>
                  {option.label}
                </option>
              )}
            </For>
          </select>
        </label>
      </div>

      <div class="demo-stage">
        <HijriCalendar
          calendarSystem={HIJRI_CALENDAR_SYSTEMS[calendarSystemId()]}
          theme={theme()}
          size={size()}
          locale={locale()}
          dir={dir()}
          weekStartsOn={locale() === 'ar' ? 6 : 0}
          multiple={multiple()}
          showGregorian={showGregorian()}
          dateEmphasis={dateEmphasis()}
          value={value()}
          onValueChange={setValue}
        />
      </div>

      <div class="demo-readout">
        <span>Selected</span>
        <code data-empty={selected() ? undefined : ''}>{selected() || 'nothing yet'}</code>
      </div>

      <p class="demo-caption">
        Tab into the grid, then use the arrow keys, <kbd>Home</kbd>/<kbd>End</kbd>, <kbd>PageUp</kbd>/
        <kbd>PageDown</kbd> (with <kbd>Shift</kbd> for years) and <kbd>Enter</kbd> to select. Under{' '}
        <code>dir="rtl"</code> the horizontal keys mirror.
      </p>
    </div>
  )
}
