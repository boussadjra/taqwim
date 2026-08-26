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
  import type { HijriDateObject } from '@taqwim/core'
  import { themeNames } from '@taqwim/themes/names'
  import { HijriCalendar, type HijriCalendarSize, type HijriCalendarTheme } from '@taqwim/svelte-styled'

  let { theme: initialTheme = 'default', multiple: initialMultiple = false }: {
    theme?: HijriCalendarTheme
    multiple?: boolean
  } = $props()

  let theme = $state<HijriCalendarTheme>(initialTheme)
  let size = $state<HijriCalendarSize>('default')
  let locale = $state('en')
  let dir = $state<'ltr' | 'rtl'>('ltr')
  let multiple = $state(initialMultiple)
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
        {#each themeNames as name (name)}<option value={name}>{name}</option>{/each}
      </select>
    </label>

    <label class="demo-control">
      Size
      <select bind:value={size}>
        {#each ['compact', 'default', 'large'] as name (name)}<option value={name}>{name}</option>{/each}
      </select>
    </label>

    <label class="demo-control">
      Locale
      <select value={locale} onchange={e => pickLocale((e.currentTarget as HTMLSelectElement).value)}>
        {#each ['en', 'ar', 'fr'] as name (name)}<option value={name}>{name}</option>{/each}
      </select>
    </label>

    <label class="demo-control">
      Direction
      <select bind:value={dir}>
        <option value="ltr">ltr</option>
        <option value="rtl">rtl</option>
      </select>
    </label>

    <label class="demo-control">
      <input
        type="checkbox"
        checked={multiple}
        onchange={e => pickMultiple((e.currentTarget as HTMLInputElement).checked)}
      /> multiple
    </label>
  </div>

  <div class="demo-stage">
    <HijriCalendar {theme} {size} {locale} {dir} {weekStartsOn} {multiple} {value} onValueChange={next => (value = next)} />
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
