<script lang="ts">
  /**
   * The live date picker, Svelte 5. One of four — see the sibling `demos/*`
   * directories, and `CalendarDemo.svelte` for why they are duplicated.
   */
  import type { DateEmphasis, DatePickerInputDisplay } from '@taqwim/calendar-core'
  import type { HijriDateObject } from '@taqwim/core'
  import { HijriDatePicker, type HijriCalendarTheme } from '@taqwim/svelte-styled'

  const FORMATS = ['iYYYY-iMM-iDD', 'iDD/iMM/iYYYY', 'iD iMMMM iYYYY', 'iEEEE, iD iMMMM iYYYY']

  let { theme = 'islamic' }: { theme?: HijriCalendarTheme } = $props()

  let format = $state(FORMATS[0])
  let locale = $state('en')
  let dir = $state<'ltr' | 'rtl'>('ltr')
  let editable = $state(true)
  let showGregorian = $state(true)
  let dateEmphasis = $state<DateEmphasis>('hijri')
  let inputDisplay = $state<DatePickerInputDisplay>('hijri')
  let value = $state<HijriDateObject | undefined>()

  const pickLocale = (next: string) => {
    locale = next
    dir = next === 'ar' ? 'rtl' : 'ltr'
  }

  const selected = $derived(
    value ? `${value.hy}-${String(value.hm).padStart(2, '0')}-${String(value.hd).padStart(2, '0')}` : '',
  )
</script>

<div class="demo not-content">
  <div class="demo-bar">
    <label class="demo-control">
      Format
      <select bind:value={format}>
        {#each FORMATS as pattern (pattern)}<option value={pattern}>{pattern}</option>{/each}
      </select>
    </label>

    <label class="demo-control">
      Locale
      <select value={locale} onchange={e => pickLocale((e.currentTarget as HTMLSelectElement).value)}>
        {#each ['en', 'ar', 'fr'] as name (name)}<option value={name}>{name}</option>{/each}
      </select>
    </label>

    <label class="demo-control"> <input type="checkbox" bind:checked={editable} /> editable </label>

    <label class="demo-control"> <input type="checkbox" bind:checked={showGregorian} /> showGregorian </label>

    <label class="demo-control">
      dateEmphasis
      <select bind:value={dateEmphasis} disabled={!showGregorian}>
        <option value="hijri">hijri</option>
        <option value="gregorian">gregorian</option>
      </select>
    </label>

    <label class="demo-control">
      inputDisplay
      <select bind:value={inputDisplay}>
        <option value="hijri">hijri</option>
        <option value="gregorian">gregorian</option>
        <option value="both">both</option>
      </select>
    </label>
  </div>

  <div class="demo-stage" data-tall>
    <HijriDatePicker
      {theme}
      {format}
      {locale}
      {dir}
      {editable}
      {showGregorian}
      {dateEmphasis}
      {inputDisplay}
      label="Appointment date"
      {value}
      onValueChange={next => (value = next)}
    />
  </div>

  <div class="demo-readout">
    <span>Selected</span>
    <code data-empty={selected ? undefined : ''}>{selected || 'nothing yet'}</code>
  </div>

  <p class="demo-caption">
    With <code>editable</code> on, the input accepts <code>1446-09-01</code> or <code>01/09/1446</code>. Text it cannot
    parse reverts to the last good value rather than clearing the selection. The trigger is a
    <code>combobox</code>: <kbd>Enter</kbd> opens the popup, <kbd>Escape</kbd> closes it and returns focus.
  </p>
</div>
