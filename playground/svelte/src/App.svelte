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
  import { getDayInWeek, type HijriDateObject } from '@taqwim/core'
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
  const DAYS: WeekStartsOn[] = [0, 1, 2, 3, 4, 5, 6]

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
  const isDateUnavailable = $derived(noFridays ? (date: HijriDateObject) => getDayInWeek(date) === 5 : undefined)
</script>

{#snippet appearance()}
  <fieldset class="pg-group">
    <legend>Appearance</legend>
    <label class="pg-field">
      Theme
      <select bind:value={theme}>
        {#each themeNames as name (name)}<option value={name}>{name}</option>{/each}
      </select>
    </label>
    <label class="pg-field">
      Layout
      <select bind:value={layout}>
        {#each layoutNames as name (name)}<option value={name}>{name}</option>{/each}
      </select>
    </label>
    <label class="pg-field">
      Size
      <select bind:value={size}>
        {#each ['compact', 'default', 'large'] as name (name)}<option value={name}>{name}</option>{/each}
      </select>
    </label>
  </fieldset>
{/snippet}

{#snippet localeControls()}
  <fieldset class="pg-group">
    <legend>Locale</legend>
    <label class="pg-field">
      Locale
      <select value={locale} onchange={e => pickLocale((e.currentTarget as HTMLSelectElement).value)}>
        {#each ['en', 'ar', 'fr'] as name (name)}<option value={name}>{name}</option>{/each}
      </select>
    </label>
    <label class="pg-field">
      Direction
      <select bind:value={dir}>
        <option value="ltr">ltr</option>
        <option value="rtl">rtl</option>
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
              {#each DAYS as day (day)}<option value={day}>{day}</option>{/each}
            </select>
          </label>
          <label class="pg-field">
            Months
            <input type="number" min="1" max="4" bind:value={numberOfMonths} />
          </label>
          <label class="pg-check"><input type="checkbox" bind:checked={fixedWeeks} /> <code>fixedWeeks</code></label>
          <label class="pg-check">
            <input type="checkbox" bind:checked={pagedNavigation} /> <code>pagedNavigation</code>
          </label>
          <label class="pg-check">
            <input type="checkbox" bind:checked={disableDaysOutsideCurrentView} />
            <code>disableDaysOutsideCurrentView</code>
          </label>
        </fieldset>

        <fieldset class="pg-group">
          <legend>Selection</legend>
          <label class="pg-check"><input type="checkbox" bind:checked={multiple} /> <code>multiple</code></label>
          <label class="pg-check">
            <input type="checkbox" bind:checked={preventDeselect} /> <code>preventDeselect</code>
          </label>
        </fieldset>

        <fieldset class="pg-group">
          <legend>Constraints</legend>
          <label class="pg-check"><input type="checkbox" bind:checked={disabled} /> <code>disabled</code></label>
          <label class="pg-check"><input type="checkbox" bind:checked={readonly} /> <code>readonly</code></label>
          <label class="pg-check">
            <input type="checkbox" bind:checked={bounded} /> min/max (1446-01-05 … 1446-03-20)
          </label>
          <label class="pg-check">
            <input type="checkbox" bind:checked={noFridays} /> <code>isDateUnavailable</code> (Fridays)
          </label>
        </fieldset>
      </aside>

      <section class="pg-stage">
        <div class="pg-preview">
          <HijriCalendar
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
            Format
            <select bind:value={format}>
              {#each FORMATS as pattern (pattern)}<option value={pattern}>{pattern}</option>{/each}
            </select>
          </label>
          <label class="pg-field">
            aria-label
            <input type="text" bind:value={ariaLabel} />
          </label>
          <label class="pg-field">
            Placeholder
            <input type="text" bind:value={inputPlaceholder} />
          </label>
          <label class="pg-check"><input type="checkbox" bind:checked={editable} /> <code>editable</code></label>
        </fieldset>

        {@render localeControls()}

        <fieldset class="pg-group">
          <legend>State</legend>
          <label class="pg-check"><input type="checkbox" bind:checked={disabled} /> <code>disabled</code></label>
          <label class="pg-check"><input type="checkbox" bind:checked={readonly} /> <code>readonly</code></label>
        </fieldset>
      </aside>

      <section class="pg-stage">
        <div class="pg-preview">
          <HijriDatePicker
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
