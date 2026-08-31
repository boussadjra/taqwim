<script lang="ts">
  /**
   * The Svelte playground.
   *
   * `/` is the shared end-to-end harness in every playground, so the extra
   * views hang off the hash instead of a router — Playwright drives `/?theme=…`
   * and must keep landing on the harness. It also keeps the playground
   * dependency-free, which is the point of these apps: they show what a
   * consumer gets, so the less scaffolding around the adapter the better.
   */
  import {
    getDayInWeek,
    islamicUmmAlQura,
    type HijriCalendarId,
    type HijriCalendarSystem,
    type HijriDateObject,
  } from '@taqwim/core'
  import { islamicCivil } from '@taqwim/core/calendars/islamic-civil'
  import { islamicTbla } from '@taqwim/core/calendars/islamic-tbla'
  import { layoutNames, themeNames } from '@taqwim/themes/names'
  import {
    HijriCalendar,
    HijriDatePicker,
    type HijriCalendarLayout,
    type HijriCalendarSize,
    type HijriCalendarTheme,
    type WeekStartsOn,
  } from '@taqwim/svelte-styled'
  import Harness from './Harness.svelte'

  const VIEWS = [
    { id: 'harness', label: 'Harness' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'datepicker', label: 'Date picker' },
  ] as const

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
  const WEEKDAY_OPTIONS = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ] as const satisfies readonly { value: WeekStartsOn; label: string }[]
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

  const presetLabel = (value: string) =>
    value
      .split('-')
      .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
      .join(' ')

  const requestedCalendarSystem = new URLSearchParams(window.location.search).get('calendar')
  let calendarSystemId = $state<HijriCalendarId>(
    HIJRI_CALENDAR_OPTIONS.some(option => option.id === requestedCalendarSystem)
      ? (requestedCalendarSystem as HijriCalendarId)
      : 'islamic-umalqura',
  )
  const calendarSystem = $derived(HIJRI_CALENDAR_SYSTEMS[calendarSystemId])

  const readView = () => window.location.hash.replace('#', '') || 'harness'
  let view = $state(readView())

  $effect(() => {
    const onChange = () => (view = readView())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  })

  let theme = $state<HijriCalendarTheme>('default')
  let layout = $state<HijriCalendarLayout>('default')
  let size = $state<HijriCalendarSize>('default')
  let locale = $state('en')
  let dir = $state<'ltr' | 'rtl'>('ltr')

  // Arabic reads right to left and its week starts on Saturday, so following
  // the locale means the RTL case is what you see when you pick Arabic.
  const pickLocale = (next: string) => {
    locale = next
    dir = next === 'ar' ? 'rtl' : 'ltr'
    weekStartsOn = next === 'ar' ? 6 : 0
  }

  // The store's own union, rather than an inline copy or an `as 0` cast: a cast
  // would have hidden the day the playground offered a day the calendar cannot
  // take.
  let weekStartsOn = $state<WeekStartsOn>(0)
  let numberOfMonths = $state(1)
  let fixedWeeks = $state(false)
  let pagedNavigation = $state(false)
  let multiple = $state(false)
  let preventDeselect = $state(false)
  let disableDaysOutsideCurrentView = $state(false)
  let disabled = $state(false)
  let readonly = $state(false)
  let bounded = $state(false)
  let noFridays = $state(false)

  let format = $state(FORMATS[0])
  let ariaLabel = $state('Appointment date')
  let inputPlaceholder = $state('')
  let editable = $state(true)

  let value = $state<HijriDateObject | HijriDateObject[] | undefined>()

  /*
   * The picker keeps its own selection: `multiple` is not part of its surface
   * in any adapter, because the input has room for one formatted value. Sharing
   * the calendar's would hand it a list it cannot render.
   */
  let pickedDate = $state<HijriDateObject | undefined>()

  const selection = $derived(JSON.stringify(value ?? null, null, 2))
  const pickedSelection = $derived(JSON.stringify(pickedDate ?? null, null, 2))
  const minValue = $derived(bounded ? { hy: 1446, hm: 1, hd: 5 } : undefined)
  const maxValue = $derived(bounded ? { hy: 1446, hm: 3, hd: 20 } : undefined)
  const isDateUnavailable = $derived(
    noFridays ? (date: HijriDateObject) => getDayInWeek(date, { calendarSystem }) === 5 : undefined,
  )
</script>

{#snippet appearance()}
  <fieldset class="pg-group">
    <legend>Appearance</legend>
    <label class="pg-field">
      Theme
      <select bind:value={theme}>
        {#each themeNames as name (name)}<option value={name}>{presetLabel(name)}</option>{/each}
      </select>
    </label>
    <label class="pg-field">
      Hijri calendar
      <select bind:value={calendarSystemId} data-calendar-system-select>
        {#each HIJRI_CALENDAR_OPTIONS as option (option.id)}
          <option value={option.id}>{option.label}</option>
        {/each}
      </select>
    </label>
    <label class="pg-field">
      Layout
      <select bind:value={layout}>
        {#each layoutNames as name (name)}<option value={name}>{presetLabel(name)}</option>{/each}
      </select>
    </label>
    <label class="pg-field">
      Size
      <select bind:value={size}>
        {#each SIZE_OPTIONS as option (option.value)}<option value={option.value}>{option.label}</option>{/each}
      </select>
    </label>
  </fieldset>
{/snippet}

{#snippet localeControls()}
  <fieldset class="pg-group">
    <legend>Language and direction</legend>
    <label class="pg-field">
      Language
      <select value={locale} onchange={e => pickLocale((e.currentTarget as HTMLSelectElement).value)}>
        {#each LANGUAGE_OPTIONS as option (option.value)}<option value={option.value}>{option.label}</option>{/each}
      </select>
    </label>
    <label class="pg-field">
      Text direction
      <select bind:value={dir}>
        {#each DIRECTION_OPTIONS as option (option.value)}<option value={option.value}>{option.label}</option>{/each}
      </select>
    </label>
  </fieldset>
{/snippet}

<header class="pg-header">
  <strong>Taqwim — Svelte playground</strong>
  <nav>
    {#each VIEWS as item (item.id)}
      <a href="#{item.id}" aria-current={view === item.id ? 'page' : undefined}>{item.label}</a>
    {/each}
  </nav>
</header>

<main>
  {#if view === 'calendar'}
    <div class="pg">
      <aside class="pg-controls">
        {@render appearance()}
        {@render localeControls()}

        <fieldset class="pg-group">
          <legend>Grid</legend>
          <label class="pg-field">
            Week starts on
            <select bind:value={weekStartsOn}>
              {#each WEEKDAY_OPTIONS as option (option.value)}<option value={option.value}>{option.label}</option>{/each}
            </select>
          </label>
          <label class="pg-field">
            Months shown
            <input type="number" min="1" max="4" bind:value={numberOfMonths} />
          </label>
          <label class="pg-check"><input type="checkbox" bind:checked={fixedWeeks} /> Always show six weeks</label>
          <label class="pg-check">
            <input type="checkbox" bind:checked={pagedNavigation} /> Move all months together
          </label>
          <label class="pg-check">
            <input type="checkbox" bind:checked={disableDaysOutsideCurrentView} />
            Disable dates outside visible months
          </label>
        </fieldset>

        <fieldset class="pg-group">
          <legend>Selection</legend>
          <label class="pg-check"><input type="checkbox" bind:checked={multiple} /> Select multiple dates</label>
          <label class="pg-check">
            <input type="checkbox" bind:checked={preventDeselect} /> Keep at least one date selected
          </label>
        </fieldset>

        <fieldset class="pg-group">
          <legend>Constraints</legend>
          <label class="pg-check"><input type="checkbox" bind:checked={disabled} /> Disable calendar</label>
          <label class="pg-check"><input type="checkbox" bind:checked={readonly} /> Read-only</label>
          <label class="pg-check">
            <input type="checkbox" bind:checked={bounded} /> Limit dates to 1446-01-05–1446-03-20
          </label>
          <label class="pg-check">
            <input type="checkbox" bind:checked={noFridays} /> Disable Fridays
          </label>
        </fieldset>
      </aside>

      <section class="pg-stage">
        <div class="pg-preview">
          <HijriCalendar
            {calendarSystem}
            {theme}
            {layout}
            {size}
            {locale}
            {dir}
            {weekStartsOn}
            {numberOfMonths}
            {fixedWeeks}
            {pagedNavigation}
            {multiple}
            {preventDeselect}
            {disableDaysOutsideCurrentView}
            {disabled}
            {readonly}
            {minValue}
            {maxValue}
            {isDateUnavailable}
            {value}
            onValueChange={next => (value = next)}
          />
        </div>
        <pre class="pg-output">{selection}</pre>
        <p class="pg-hint">
          Tab into the grid, then use the arrow keys, <code>Home</code>/<code>End</code>,
          <code>PageUp</code>/<code>PageDown</code>
          (<code>Shift</code> for years) and <code>Enter</code> to select. Under <code>dir="rtl"</code> the horizontal
          keys mirror.
        </p>
      </section>
    </div>
  {:else if view === 'datepicker'}
    <div class="pg">
      <aside class="pg-controls">
        {@render appearance()}

        <fieldset class="pg-group">
          <legend>Input</legend>
          <label class="pg-field">
            Date format
            <select bind:value={format}>
              {#each FORMATS as pattern (pattern)}<option value={pattern}>{pattern}</option>{/each}
            </select>
          </label>
          <label class="pg-field">
            Accessible label
            <input type="text" bind:value={ariaLabel} />
          </label>
          <label class="pg-field">
            Placeholder
            <input type="text" bind:value={inputPlaceholder} />
          </label>
          <label class="pg-check"><input type="checkbox" bind:checked={editable} /> Allow typing</label>
        </fieldset>

        {@render localeControls()}

        <fieldset class="pg-group">
          <legend>State</legend>
          <label class="pg-check"><input type="checkbox" bind:checked={disabled} /> Disable date picker</label>
          <label class="pg-check"><input type="checkbox" bind:checked={readonly} /> Read-only</label>
        </fieldset>
      </aside>

      <section class="pg-stage">
        <div class="pg-preview">
          <HijriDatePicker
            {calendarSystem}
            {theme}
            {layout}
            {size}
            {locale}
            {dir}
            {format}
            label={ariaLabel}
            inputPlaceholder={inputPlaceholder || undefined}
            {editable}
            {disabled}
            {readonly}
            value={pickedDate}
            onValueChange={next => (pickedDate = next)}
          />
        </div>
        <pre class="pg-output">{pickedSelection}</pre>
        <p class="pg-hint">
          With <code>editable</code> on, the input accepts <code>1446-09-01</code> or <code>01/09/1446</code>. Text it
          cannot parse reverts to the last good value rather than clearing the selection. Previous/next page the
          month; the heading is two buttons — month and year — that open their pickers.
        </p>
      </section>
    </div>
  {:else}
    <Harness />
  {/if}
</main>
