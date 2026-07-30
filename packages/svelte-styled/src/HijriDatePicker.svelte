<script lang="ts">
  import { formatHijriDate, type HijriDateObject } from '@taqwim/core'
  import { untrack } from 'svelte'
  import HijriCalendar from './HijriCalendar.svelte'
  import { parseDraft } from './parseDraft'
  import type { HijriDatePickerProps } from './types'

  let {
    value,
    defaultValue,
    onValueChange,
    format = 'iYYYY-iMM-iDD',
    inputPlaceholder,
    label = 'Hijri date',
    editable = true,
    ...calendarProps
  }: HijriDatePickerProps = $props()

  // `defaultValue` is the uncontrolled seed by definition, so reading it once
  // is the intent; `untrack` says so rather than leaving a warning behind.
  let uncontrolled = $state<HijriDateObject | undefined>(
    untrack(() => (Array.isArray(defaultValue) ? defaultValue[0] : defaultValue)),
  )
  const selected = $derived(value !== undefined ? value : uncontrolled)

  let isOpen = $state(false)
  let container = $state<HTMLDivElement>()

  // `role="combobox"` is only complete when it points at the popup it controls.
  const popoverId = $props.id()

  const formatted = $derived(selected ? formatHijriDate(selected, format, calendarProps.locale ?? 'en') : '')

  // The draft only diverges from the selection while the user is mid-edit.
  let draft = $state('')
  $effect(() => {
    draft = formatted
  })

  function commit(next: HijriDateObject | undefined) {
    if (value === undefined) uncontrolled = next
    onValueChange?.(next)
  }

  function open() {
    if (calendarProps.disabled) return
    isOpen = true
  }

  function commitDraft() {
    if (draft.trim() === '') {
      commit(undefined)
      return
    }

    const parsed = parseDraft(draft)
    if (parsed) {
      commit(parsed)
    } else {
      // Unparseable input reverts rather than silently clearing the selection.
      draft = formatted
    }
  }
</script>

<div
  bind:this={container}
  class="taqwim-datepicker"
  data-taqwim-theme={calendarProps.theme ?? 'default'}
  data-open={isOpen ? '' : undefined}
  onfocusout={event => {
    const next = event.relatedTarget as Node | null
    if (next && container?.contains(next)) return
    isOpen = false
  }}
>
  <input
    class="taqwim-datepicker-input"
    type="text"
    role="combobox"
    aria-haspopup="dialog"
    aria-expanded={isOpen}
    aria-controls={popoverId}
    aria-label={label}
    placeholder={inputPlaceholder ?? format}
    readonly={!editable || calendarProps.readonly}
    disabled={calendarProps.disabled}
    bind:value={draft}
    onfocus={open}
    onclick={open}
    onchange={commitDraft}
    onkeydown={event => {
      if (event.key === 'Enter') {
        event.preventDefault()
        commitDraft()
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        open()
      } else if (event.key === 'Escape') {
        isOpen = false
      }
    }}
  />

  {#if isOpen}
    <div
      id={popoverId}
      class="taqwim-datepicker-popover"
      role="dialog"
      tabindex="-1"
      aria-label={label}
      onkeydown={event => {
        if (event.key === 'Escape') isOpen = false
      }}
    >
      <HijriCalendar
        {...calendarProps}
        value={selected}
        initialFocus
        onValueChange={next => {
          commit(Array.isArray(next) ? next[0] : next)
          isOpen = false
        }}
      />
    </div>
  {/if}
</div>
