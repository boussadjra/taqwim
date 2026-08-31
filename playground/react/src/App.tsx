import { layoutNames, themeNames } from '@taqwim/themes/names'
import {
  HijriCalendar,
  HijriDatePicker,
  type HijriCalendarLayout,
  type HijriCalendarSize,
  type HijriCalendarTheme,
  type WeekStartsOn,
} from '@taqwim/react-styled'
import {
  getDayInWeek,
  islamicUmmAlQura,
  type HijriCalendarId,
  type HijriCalendarSystem,
  type HijriDateObject,
} from '@taqwim/core'
import { islamicCivil } from '@taqwim/core/calendars/islamic-civil'
import { islamicTbla } from '@taqwim/core/calendars/islamic-tbla'
import { useEffect, useState, type ReactNode } from 'react'
import { Harness } from './HarnessView'

/**
 * The React playground.
 *
 * `/` is the shared end-to-end harness in every playground, so the extra views
 * hang off the hash instead of a router — Playwright drives `/?theme=…` and
 * must keep landing on the harness. It also keeps the playground dependency
 * -free, which is the point of these apps: they show what a consumer gets, so
 * the less scaffolding around the adapter the better.
 */
type View = 'harness' | 'calendar' | 'datepicker'

const VIEWS: { id: View; label: string }[] = [
  { id: 'harness', label: 'Harness' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'datepicker', label: 'Date picker' },
]

const FORMATS = ['iYYYY-iMM-iDD', 'iDD/iMM/iYYYY', 'iD iMMMM iYYYY', 'iEEEE, iD iMMMM iYYYY']
const SIZE_OPTIONS = [
  { value: 'compact', label: 'Compact' },
  { value: 'default', label: 'Default' },
  { value: 'large', label: 'Large' },
] as const
const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
  { value: 'fr', label: 'French' },
] as const
const DIRECTION_OPTIONS = [
  { value: 'ltr', label: 'Left to right' },
  { value: 'rtl', label: 'Right to left' },
] as const
const WEEKDAY_OPTIONS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const
const HIJRI_CALENDAR_OPTIONS = [
  { id: 'islamic-umalqura', label: 'Umm al-Qura' },
  { id: 'islamic-civil', label: 'Civil' },
  { id: 'islamic-tbla', label: 'TBLA' },
] as const satisfies readonly { id: HijriCalendarId; label: string }[]
const HIJRI_CALENDAR_SYSTEMS = {
  'islamic-umalqura': islamicUmmAlQura,
  'islamic-civil': islamicCivil,
  'islamic-tbla': islamicTbla,
} satisfies Record<HijriCalendarId, HijriCalendarSystem>

function presetLabel(value: string): string {
  return value
    .split('-')
    .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ')
}

function calendarSystemIdFromSearch(): HijriCalendarId {
  const requested = new URLSearchParams(window.location.search).get('calendar')
  return HIJRI_CALENDAR_OPTIONS.some(option => option.id === requested)
    ? (requested as HijriCalendarId)
    : 'islamic-umalqura'
}

function useHashView(): View {
  const read = () => (window.location.hash.replace('#', '') || 'harness') as View
  const [view, setView] = useState<View>(read)

  useEffect(() => {
    const onChange = () => setView(read())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return view
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="pg-field">
      {label}
      {children}
    </label>
  )
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: ReactNode
  checked: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <label className="pg-check">
      <input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} />
      {label}
    </label>
  )
}

/** Everything the calendar and the date picker share. */
function useCommonState() {
  const [theme, setTheme] = useState<HijriCalendarTheme>('default')
  const [layout, setLayout] = useState<HijriCalendarLayout>('default')
  const [size, setSize] = useState<HijriCalendarSize>('default')
  const [locale, setLocale] = useState('en')
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr')
  const [calendarSystemId, setCalendarSystemId] = useState<HijriCalendarId>(calendarSystemIdFromSearch)
  // The store's own union, rather than an inline copy or an `as 0` cast: a cast
  // would have hidden the day the playground offered a day the calendar cannot
  // take.
  const [weekStartsOn, setWeekStartsOn] = useState<WeekStartsOn>(0)

  // Arabic reads right to left and its week starts on Saturday, so following
  // the locale means the RTL case is what you see when you pick Arabic.
  const pickLocale = (next: string) => {
    setLocale(next)
    setDir(next === 'ar' ? 'rtl' : 'ltr')
    setWeekStartsOn(next === 'ar' ? 6 : 0)
  }

  const appearance = (
    <fieldset className="pg-group">
      <legend>Appearance</legend>
      <Field label="Theme">
        <select value={theme} onChange={e => setTheme(e.target.value as HijriCalendarTheme)}>
          {themeNames.map(name => (
            <option key={name} value={name}>
              {presetLabel(name)}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Hijri calendar">
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
      </Field>
      <Field label="Layout">
        <select value={layout} onChange={e => setLayout(e.target.value as HijriCalendarLayout)}>
          {layoutNames.map(name => (
            <option key={name} value={name}>
              {presetLabel(name)}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Size">
        <select value={size} onChange={e => setSize(e.target.value as HijriCalendarSize)}>
          {SIZE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>
    </fieldset>
  )

  const localeControls = (
    <fieldset className="pg-group">
      <legend>Language and direction</legend>
      <Field label="Language">
        <select value={locale} onChange={e => pickLocale(e.target.value)}>
          {LANGUAGE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Text direction">
        <select value={dir} onChange={e => setDir(e.target.value as 'ltr' | 'rtl')}>
          {DIRECTION_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>
    </fieldset>
  )

  return {
    theme,
    layout,
    size,
    locale,
    dir,
    setDir,
    weekStartsOn,
    setWeekStartsOn,
    calendarSystem: HIJRI_CALENDAR_SYSTEMS[calendarSystemId],
    appearance,
    localeControls,
  }
}

function CalendarPlayground() {
  const common = useCommonState()
  const [numberOfMonths, setNumberOfMonths] = useState(1)
  const [fixedWeeks, setFixedWeeks] = useState(false)
  const [pagedNavigation, setPagedNavigation] = useState(false)
  const [multiple, setMultiple] = useState(false)
  const [preventDeselect, setPreventDeselect] = useState(false)
  const [disableDaysOutsideCurrentView, setOutside] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [readonly, setReadonly] = useState(false)
  const [bounded, setBounded] = useState(false)
  const [noFridays, setNoFridays] = useState(false)
  const [value, setValue] = useState<HijriDateObject | HijriDateObject[] | undefined>()

  return (
    <div className="pg">
      <aside className="pg-controls">
        {common.appearance}
        {common.localeControls}

        <fieldset className="pg-group">
          <legend>Grid</legend>
          <Field label="Week starts on">
            <select
              value={common.weekStartsOn}
              onChange={e => common.setWeekStartsOn(Number(e.target.value) as WeekStartsOn)}
            >
              {WEEKDAY_OPTIONS.map((label, day) => (
                <option key={day} value={day}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Months shown">
            <input
              type="number"
              min={1}
              max={4}
              value={numberOfMonths}
              onChange={e => setNumberOfMonths(Number(e.target.value))}
            />
          </Field>
          <Check label="Always show six weeks" checked={fixedWeeks} onChange={setFixedWeeks} />
          <Check label="Move all months together" checked={pagedNavigation} onChange={setPagedNavigation} />
          <Check
            label="Disable dates outside visible months"
            checked={disableDaysOutsideCurrentView}
            onChange={setOutside}
          />
        </fieldset>

        <fieldset className="pg-group">
          <legend>Selection</legend>
          <Check label="Select multiple dates" checked={multiple} onChange={setMultiple} />
          <Check label="Keep at least one date selected" checked={preventDeselect} onChange={setPreventDeselect} />
        </fieldset>

        <fieldset className="pg-group">
          <legend>Constraints</legend>
          <Check label="Disable calendar" checked={disabled} onChange={setDisabled} />
          <Check label="Read-only" checked={readonly} onChange={setReadonly} />
          <Check label="Limit dates to 1446-01-05–1446-03-20" checked={bounded} onChange={setBounded} />
          <Check label="Disable Fridays" checked={noFridays} onChange={setNoFridays} />
        </fieldset>
      </aside>

      <section className="pg-stage">
        <div className="pg-preview">
          <HijriCalendar
            calendarSystem={common.calendarSystem}
            theme={common.theme}
            layout={common.layout}
            size={common.size}
            locale={common.locale}
            dir={common.dir}
            weekStartsOn={common.weekStartsOn}
            numberOfMonths={numberOfMonths}
            fixedWeeks={fixedWeeks}
            pagedNavigation={pagedNavigation}
            multiple={multiple}
            preventDeselect={preventDeselect}
            disableDaysOutsideCurrentView={disableDaysOutsideCurrentView}
            disabled={disabled}
            readonly={readonly}
            minValue={bounded ? { hy: 1446, hm: 1, hd: 5 } : undefined}
            maxValue={bounded ? { hy: 1446, hm: 3, hd: 20 } : undefined}
            isDateUnavailable={
              noFridays ? date => getDayInWeek(date, { calendarSystem: common.calendarSystem }) === 5 : undefined
            }
            value={value}
            onValueChange={setValue}
          />
        </div>

        <pre className="pg-output">{JSON.stringify(value ?? null, null, 2)}</pre>

        <p className="pg-hint">
          Tab into the grid, then use the arrow keys, <code>Home</code>/<code>End</code>, <code>PageUp</code>/
          <code>PageDown</code> (<code>Shift</code> for years) and <code>Enter</code> to select. Under{' '}
          <code>dir=&quot;rtl&quot;</code> the horizontal keys mirror.
        </p>
      </section>
    </div>
  )
}

function DatePickerPlayground() {
  const common = useCommonState()
  const [format, setFormat] = useState(FORMATS[0])
  const [ariaLabel, setAriaLabel] = useState('Appointment date')
  const [inputPlaceholder, setInputPlaceholder] = useState('')
  const [editable, setEditable] = useState(true)
  const [disabled, setDisabled] = useState(false)
  const [readonly, setReadonly] = useState(false)
  // The picker holds one date: `multiple` is not part of its surface in any
  // adapter, because the input has room for a single formatted value.
  const [value, setValue] = useState<HijriDateObject | undefined>()

  return (
    <div className="pg">
      <aside className="pg-controls">
        {common.appearance}

        <fieldset className="pg-group">
          <legend>Input</legend>
          <Field label="Date format">
            <select value={format} onChange={e => setFormat(e.target.value)}>
              {FORMATS.map(pattern => (
                <option key={pattern} value={pattern}>
                  {pattern}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Accessible label">
            <input type="text" value={ariaLabel} onChange={e => setAriaLabel(e.target.value)} />
          </Field>
          <Field label="Placeholder">
            <input type="text" value={inputPlaceholder} onChange={e => setInputPlaceholder(e.target.value)} />
          </Field>
          <Check label="Allow typing" checked={editable} onChange={setEditable} />
        </fieldset>

        {common.localeControls}

        <fieldset className="pg-group">
          <legend>State</legend>
          <Check label="Disable date picker" checked={disabled} onChange={setDisabled} />
          <Check label="Read-only" checked={readonly} onChange={setReadonly} />
        </fieldset>
      </aside>

      <section className="pg-stage">
        <div className="pg-preview">
          <HijriDatePicker
            calendarSystem={common.calendarSystem}
            theme={common.theme}
            layout={common.layout}
            size={common.size}
            locale={common.locale}
            dir={common.dir}
            format={format}
            label={ariaLabel}
            inputPlaceholder={inputPlaceholder || undefined}
            editable={editable}
            disabled={disabled}
            readonly={readonly}
            value={value}
            onValueChange={setValue}
          />
        </div>

        <pre className="pg-output">{JSON.stringify(value ?? null, null, 2)}</pre>

        <p className="pg-hint">
          With <code>editable</code> on, the input accepts <code>1446-09-01</code> or <code>01/09/1446</code>. Text it
          cannot parse reverts to the last good value rather than clearing the selection. Previous/next page the month;
          the heading is two buttons — month and year — that open their pickers.
        </p>
      </section>
    </div>
  )
}

export function App() {
  const view = useHashView()

  return (
    <>
      <header className="pg-header">
        <strong>Taqwim — React playground</strong>
        <nav>
          {VIEWS.map(({ id, label }) => (
            <a key={id} href={`#${id}`} aria-current={view === id ? 'page' : undefined}>
              {label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        {view === 'calendar' ? <CalendarPlayground /> : view === 'datepicker' ? <DatePickerPlayground /> : <Harness />}
      </main>
    </>
  )
}
