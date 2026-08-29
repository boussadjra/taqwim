import { getDayInWeek, type HijriDateObject } from '@taqwim/core'
import { layoutNames, themeNames } from '@taqwim/themes/names'
import {
  HijriCalendar,
  HijriDatePicker,
  type HijriCalendarLayout,
  type HijriCalendarSize,
  type HijriCalendarTheme,
  type WeekStartsOn,
} from '@taqwim/solid-styled'
import { createSignal, For, JSX, onCleanup, Show } from 'solid-js'
import { HarnessView } from './HarnessView'

/**
 * The Solid playground.
 *
 * `/` is the shared end-to-end harness in every playground, so the extra views
 * hang off the hash instead of a router — Playwright drives `/?theme=…` and
 * must keep landing on the harness. It also keeps the playground
 * dependency-free, which is the point of these apps: they show what a consumer
 * gets, so the less scaffolding around the adapter the better.
 */
const VIEWS = [
  { id: 'harness', label: 'Harness' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'datepicker', label: 'Date picker' },
] as const

const FORMATS = ['iYYYY-iMM-iDD', 'iDD/iMM/iYYYY', 'iD iMMMM iYYYY', 'iEEEE, iD iMMMM iYYYY']

export function App(): JSX.Element {
  const readView = () => window.location.hash.replace('#', '') || 'harness'
  const [view, setView] = createSignal(readView())

  const onHashChange = () => setView(readView())
  window.addEventListener('hashchange', onHashChange)
  onCleanup(() => window.removeEventListener('hashchange', onHashChange))

  const [theme, setTheme] = createSignal<HijriCalendarTheme>('default')
  const [layout, setLayout] = createSignal<HijriCalendarLayout>('default')
  const [size, setSize] = createSignal<HijriCalendarSize>('default')
  const [locale, setLocale] = createSignal('en')
  const [dir, setDir] = createSignal<'ltr' | 'rtl'>('ltr')
  // The store's own union, rather than an inline copy or an `as 0` cast: a cast
  // would have hidden the day the playground offered a day the calendar cannot
  // take.
  const [weekStartsOn, setWeekStartsOn] = createSignal<WeekStartsOn>(0)

  // Arabic reads right to left and its week starts on Saturday, so following
  // the locale means the RTL case is what you see when you pick Arabic.
  const pickLocale = (next: string) => {
    setLocale(next)
    setDir(next === 'ar' ? 'rtl' : 'ltr')
    setWeekStartsOn(next === 'ar' ? 6 : 0)
  }

  const [numberOfMonths, setNumberOfMonths] = createSignal(1)
  const [fixedWeeks, setFixedWeeks] = createSignal(false)
  const [pagedNavigation, setPagedNavigation] = createSignal(false)
  const [multiple, setMultiple] = createSignal(false)
  const [preventDeselect, setPreventDeselect] = createSignal(false)
  const [outside, setOutside] = createSignal(false)
  const [disabled, setDisabled] = createSignal(false)
  const [readonly, setReadonly] = createSignal(false)
  const [bounded, setBounded] = createSignal(false)
  const [noFridays, setNoFridays] = createSignal(false)

  const [format, setFormat] = createSignal(FORMATS[0])
  const [ariaLabel, setAriaLabel] = createSignal('Appointment date')
  const [inputPlaceholder, setInputPlaceholder] = createSignal('')
  const [editable, setEditable] = createSignal(true)

  const [value, setValue] = createSignal<HijriDateObject | HijriDateObject[] | undefined>()
  const selection = () => JSON.stringify(value() ?? null, null, 2)

  /*
   * The picker keeps its own selection: `multiple` is not part of its surface
   * in any adapter, because the input has room for one formatted value. Sharing
   * the calendar's would hand it a list it cannot render.
   */
  const [pickedDate, setPickedDate] = createSignal<HijriDateObject | undefined>()
  const pickedSelection = () => JSON.stringify(pickedDate() ?? null, null, 2)

  /*
   * `label` is a node, not a string: most of these name a prop and belong in a
   * `<code>`, but `min/max` names two and reads as prose. Wrapping every label
   * in `<code>` marked the prose ones up as code in the Solid playground alone.
   */
  const check = (label: JSX.Element, get: () => boolean, set: (next: boolean) => void) => (
    <label class="pg-check">
      <input type="checkbox" checked={get()} onChange={event => set(event.currentTarget.checked)} />
      {label}
    </label>
  )

  const appearance = () => (
    <fieldset class="pg-group">
      <legend>Appearance</legend>
      <label class="pg-field">
        Theme
        <select value={theme()} onChange={e => setTheme(e.currentTarget.value as HijriCalendarTheme)}>
          <For each={themeNames}>{name => <option value={name}>{name}</option>}</For>
        </select>
      </label>
      <label class="pg-field">
        Layout
        <select value={layout()} onChange={e => setLayout(e.currentTarget.value as HijriCalendarLayout)}>
          <For each={layoutNames}>{name => <option value={name}>{name}</option>}</For>
        </select>
      </label>
      <label class="pg-field">
        Size
        <select value={size()} onChange={e => setSize(e.currentTarget.value as HijriCalendarSize)}>
          <For each={['compact', 'default', 'large']}>{name => <option value={name}>{name}</option>}</For>
        </select>
      </label>
    </fieldset>
  )

  const localeControls = () => (
    <fieldset class="pg-group">
      <legend>Locale</legend>
      <label class="pg-field">
        Locale
        <select value={locale()} onChange={e => pickLocale(e.currentTarget.value)}>
          <For each={['en', 'ar', 'fr']}>{name => <option value={name}>{name}</option>}</For>
        </select>
      </label>
      <label class="pg-field">
        Direction
        <select value={dir()} onChange={e => setDir(e.currentTarget.value as 'ltr' | 'rtl')}>
          <option value="ltr">ltr</option>
          <option value="rtl">rtl</option>
        </select>
      </label>
    </fieldset>
  )

  return (
    <>
      <header class="pg-header">
        <strong>Taqwim — Solid playground</strong>
        <nav>
          <For each={VIEWS}>
            {item => (
              <a href={`#${item.id}`} aria-current={view() === item.id ? 'page' : undefined}>
                {item.label}
              </a>
            )}
          </For>
        </nav>
      </header>

      <main>
        <Show when={view() === 'calendar'}>
          <div class="pg">
            <aside class="pg-controls">
              {appearance()}
              {localeControls()}

              <fieldset class="pg-group">
                <legend>Grid</legend>
                <label class="pg-field">
                  Week starts on
                  <select
                    value={weekStartsOn()}
                    onChange={e => setWeekStartsOn(Number(e.currentTarget.value) as WeekStartsOn)}
                  >
                    <For each={[0, 1, 2, 3, 4, 5, 6]}>{day => <option value={day}>{day}</option>}</For>
                  </select>
                </label>
                <label class="pg-field">
                  Months
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={numberOfMonths()}
                    onInput={e => setNumberOfMonths(Number(e.currentTarget.value))}
                  />
                </label>
                {check(<code>fixedWeeks</code>, fixedWeeks, setFixedWeeks)}
                {check(<code>pagedNavigation</code>, pagedNavigation, setPagedNavigation)}
                {check(<code>disableDaysOutsideCurrentView</code>, outside, setOutside)}
              </fieldset>

              <fieldset class="pg-group">
                <legend>Selection</legend>
                {check(<code>multiple</code>, multiple, setMultiple)}
                {check(<code>preventDeselect</code>, preventDeselect, setPreventDeselect)}
              </fieldset>

              <fieldset class="pg-group">
                <legend>Constraints</legend>
                {check(<code>disabled</code>, disabled, setDisabled)}
                {check(<code>readonly</code>, readonly, setReadonly)}
                {check(<>min/max (1446-01-05 … 1446-03-20)</>, bounded, setBounded)}
                {check(
                  <>
                    <code>isDateUnavailable</code> (Fridays)
                  </>,
                  noFridays,
                  setNoFridays,
                )}
              </fieldset>
            </aside>

            <section class="pg-stage">
              <div class="pg-preview">
                <HijriCalendar
                  theme={theme()}
                  layout={layout()}
                  size={size()}
                  locale={locale()}
                  dir={dir()}
                  weekStartsOn={weekStartsOn()}
                  numberOfMonths={numberOfMonths()}
                  fixedWeeks={fixedWeeks()}
                  pagedNavigation={pagedNavigation()}
                  multiple={multiple()}
                  preventDeselect={preventDeselect()}
                  disableDaysOutsideCurrentView={outside()}
                  disabled={disabled()}
                  readonly={readonly()}
                  minValue={bounded() ? { hy: 1446, hm: 1, hd: 5 } : undefined}
                  maxValue={bounded() ? { hy: 1446, hm: 3, hd: 20 } : undefined}
                  isDateUnavailable={noFridays() ? date => getDayInWeek(date) === 5 : undefined}
                  value={value()}
                  onValueChange={setValue}
                />
              </div>
              <pre class="pg-output">{selection()}</pre>
              <p class="pg-hint">
                Tab into the grid, then use the arrow keys, <code>Home</code>/<code>End</code>, <code>PageUp</code>/
                <code>PageDown</code> (<code>Shift</code> for years) and <code>Enter</code> to select. Under{' '}
                <code>dir="rtl"</code> the horizontal keys mirror.
              </p>
            </section>
          </div>
        </Show>

        <Show when={view() === 'datepicker'}>
          <div class="pg">
            <aside class="pg-controls">
              {appearance()}

              <fieldset class="pg-group">
                <legend>Input</legend>
                <label class="pg-field">
                  Format
                  <select value={format()} onChange={e => setFormat(e.currentTarget.value)}>
                    <For each={FORMATS}>{pattern => <option value={pattern}>{pattern}</option>}</For>
                  </select>
                </label>
                <label class="pg-field">
                  aria-label
                  <input type="text" value={ariaLabel()} onInput={e => setAriaLabel(e.currentTarget.value)} />
                </label>
                <label class="pg-field">
                  Placeholder
                  <input
                    type="text"
                    value={inputPlaceholder()}
                    onInput={e => setInputPlaceholder(e.currentTarget.value)}
                  />
                </label>
                {check(<code>editable</code>, editable, setEditable)}
              </fieldset>

              {localeControls()}

              <fieldset class="pg-group">
                <legend>State</legend>
                {check(<code>disabled</code>, disabled, setDisabled)}
                {check(<code>readonly</code>, readonly, setReadonly)}
              </fieldset>
            </aside>

            <section class="pg-stage">
              <div class="pg-preview">
                <HijriDatePicker
                  theme={theme()}
                  layout={layout()}
                  size={size()}
                  locale={locale()}
                  dir={dir()}
                  format={format()}
                  label={ariaLabel()}
                  inputPlaceholder={inputPlaceholder() || undefined}
                  editable={editable()}
                  disabled={disabled()}
                  readonly={readonly()}
                  value={pickedDate()}
                  onValueChange={setPickedDate}
                />
              </div>
              <pre class="pg-output">{pickedSelection()}</pre>
              <p class="pg-hint">
                With <code>editable</code> on, the input accepts <code>1446-09-01</code> or <code>01/09/1446</code>.
                Text it cannot parse reverts to the last good value rather than clearing the selection. Previous/next
                page the month; the heading is two buttons — month and year — that open their pickers.
              </p>
            </section>
          </div>
        </Show>

        <Show when={view() !== 'calendar' && view() !== 'datepicker'}>
          <HarnessView />
        </Show>
      </main>
    </>
  )
}
