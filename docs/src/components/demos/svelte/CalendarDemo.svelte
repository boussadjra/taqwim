<script lang="ts">
  /**
   * The live calendar, Svelte 5.
   *
   * One of four near-identical files — see `demos/vue`, `demos/react` and
   * `demos/solid`. They are duplicated rather than abstracted for the same
   * reason the unit suites are: a reader on the Svelte tab should be looking
   * at idiomatic Svelte, and a difference between the four should mean a
   * difference in the adapters rather than in a shared wrapper.
   */
  import type { DateEmphasis } from '@taqwim/calendar-core'
  import type { HijriCalendarId, HijriDateObject } from '@taqwim/core'
  import { themeNames } from '@taqwim/themes/names'
  import { HijriCalendar, type HijriCalendarSize, type HijriCalendarTheme } from '@taqwim/svelte-styled'
  import { HIJRI_CALENDAR_OPTIONS, HIJRI_CALENDAR_SYSTEMS } from '../calendarSystems'
  import { DATE_EMPHASIS_OPTIONS, DIRECTION_OPTIONS, LANGUAGE_OPTIONS, presetLabel, SIZE_OPTIONS } from '../demoOptions'

  let { theme: initialTheme = 'default', multiple: initialMultiple = false }: {
    theme?: HijriCalendarTheme
    multiple?: boolean
  } = $props()

  let theme = $state<HijriCalendarTheme>(initialTheme)
  let size = $state<HijriCalendarSize>('default')
  let locale = $state('en')
  let dir = $state<'ltr' | 'rtl'>('ltr')
  let multiple = $state(initialMultiple)
  let showGregorian = $state(false)
  let dateEmphasis = $state<DateEmphasis>('hijri')
  let calendarSystemId = $state<HijriCalendarId>('islamic-umalqura')
  const calendarSystem = $derived(HIJRI_CALENDAR_SYSTEMS[calendarSystemId])
  let value = $state<HijriDateObject | HijriDateObject[] | undefined>()

  // Arabic reads right to left and its week starts on Saturday, so picking it
  // shows the RTL case rather than leaving it as something to configure.
  const pickLocale = (next: string) => {
    locale = next
    dir = next === 'ar' ? 'rtl' : 'ltr'
  }

  // Switching between one date and a list leaves the old shape behind.
  const pickMultiple = (next: boolean) => {
    multiple = next
    value = undefined
  }

  const weekStartsOn = $derived<0 | 6>(locale === 'ar' ? 6 : 0)
  const selected = $derived(
    (Array.isArray(value) ? value : value ? [value] : [])
      .map(d => `${d.hy}-${String(d.hm).padStart(2, '0')}-${String(d.hd).padStart(2, '0')}`)
      .join(', '),
  )
</script>

<div class="demo not-content">
  <div class="demo-bar">
    <label class="demo-control">
      Theme
      <select bind:value={theme}>
        {#each themeNames as name (name)}<option value={name}>{presetLabel(name)}</option>{/each}
      </select>
    </label>

    <label class="demo-control">
      Hijri calendar
      <select bind:value={calendarSystemId} data-calendar-system-select>
        {#each HIJRI_CALENDAR_OPTIONS as option (option.id)}
          <option value={option.id}>{option.label}</option>
        {/each}
      </select>
    </label>

    <label class="demo-control">
      Size
      <select bind:value={size}>
        {#each SIZE_OPTIONS as option (option.value)}<option value={option.value}>{option.label}</option>{/each}
      </select>
    </label>

    <label class="demo-control">
      Language
      <select value={locale} onchange={e => pickLocale((e.currentTarget as HTMLSelectElement).value)}>
        {#each LANGUAGE_OPTIONS as option (option.value)}<option value={option.value}>{option.label}</option>{/each}
      </select>
    </label>

    <label class="demo-control">
      Text direction
      <select bind:value={dir}>
        {#each DIRECTION_OPTIONS as option (option.value)}<option value={option.value}>{option.label}</option>{/each}
      </select>
    </label>

    <label class="demo-control">
      <input
        type="checkbox"
        checked={multiple}
        onchange={e => pickMultiple((e.currentTarget as HTMLInputElement).checked)}
      /> Select multiple dates
    </label>

    <label class="demo-control">
      <input type="checkbox" bind:checked={showGregorian} /> Show Gregorian date
    </label>

    <label class="demo-control">
      Emphasize
      <select bind:value={dateEmphasis} disabled={!showGregorian}>
        {#each DATE_EMPHASIS_OPTIONS as option (option.value)}<option value={option.value}>{option.label}</option>{/each}
      </select>
    </label>
  </div>

  <div class="demo-stage">
    <HijriCalendar
      {calendarSystem}
      {theme}
      {size}
      {locale}
      {dir}
      {weekStartsOn}
      {multiple}
      {showGregorian}
      {dateEmphasis}
      {value}
      onValueChange={next => (value = next)}
    />
  </div>

  <div class="demo-readout">
    <span>Selected</span>
    <code data-empty={selected ? undefined : ''}>{selected || 'nothing yet'}</code>
  </div>

  <p class="demo-caption">
    Tab into the grid, then use the arrow keys, <kbd>Home</kbd>/<kbd>End</kbd>,
    <kbd>PageUp</kbd>/<kbd>PageDown</kbd> (with <kbd>Shift</kbd> for years) and <kbd>Enter</kbd> to select. Under
    <code>dir="rtl"</code> the horizontal keys mirror.
  </p>
</div>
