<script lang="ts">
  import {
    DEFAULT_GREGORIAN_FORMAT_OPTIONS,
    formatDatePickerValues,
    parseDatePickerDraft,
  } from '@taqwim/calendar-core'
  import type { HijriDateObject } from '@taqwim/core'
  import { onMount, untrack } from 'svelte'
  import HijriCalendar from './HijriCalendar.svelte'
  import type { HijriDatePickerProps } from './types'

  let {
    value,
    defaultValue,
    onValueChange,
    format = 'iYYYY-iMM-iDD',
    gregorianFormat = DEFAULT_GREGORIAN_FORMAT_OPTIONS,
    inputDisplay = 'hijri',
    inputPlaceholder,
    label = 'Hijri date',
    editable = true,
    trigger,
    ...calendarProps
  }: HijriDatePickerProps = $props()

  let uncontrolled = $state<HijriDateObject | undefined>(
    untrack(() => (Array.isArray(defaultValue) ? defaultValue[0] : defaultValue)),
  )
  const selected = $derived(value !== undefined ? value : uncontrolled)

  let isOpen = $state(false)
  let container = $state<HTMLDivElement>()

  // `role="combobox"` is only complete when it points at the popup it controls.
  const popoverId = $props.id()

  const formatOptions = $derived({
    hijriFormat: format,
    gregorianFormat,
    locale: calendarProps.locale ?? 'en',
    gregorianLocale: calendarProps.gregorianLocale ?? calendarProps.locale ?? 'en',
    inputDisplay,
    calendarSystem: calendarProps.calendarSystem,
  })

  const formatted = $derived(formatDatePickerValues(selected, formatOptions))

  // The draft only diverges from the selection while the user is mid-edit.
  let draft = $state('')
  $effect(() => {
    draft = formatted.value
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
    const parsed = parseDatePickerDraft(draft, inputDisplay, calendarProps.calendarSystem)
    if (parsed === 'empty') {
      commit(undefined)
      return
    }

    if (parsed) {
      commit(parsed)
    } else {
      // Unparseable input reverts rather than silently clearing the selection.
      draft = formatted.value
    }
  }

  /*
   * A month page unmounts the focused day cell, which fires `focusout` with
   * `relatedTarget === null`. Closing on that made prev/next dismiss the
   * popover before the new month could be seen. Close only when focus actually
   * moved to a node outside the picker; clicks on the page are handled below.
   */
  function onFocusOut(event: FocusEvent) {
    const next = event.relatedTarget as Node | null
    if (next && !container?.contains(next)) isOpen = false
  }

  function onDocumentPointerDown(event: PointerEvent) {
    if (!isOpen) return
    if (container?.contains(event.target as Node)) return
    isOpen = false
  }

  onMount(() => {
    document.addEventListener('pointerdown', onDocumentPointerDown, true)
    return () => document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  })
</script>

<div
  bind:this={container}
  class="taqwim-datepicker"
  data-taqwim-theme={calendarProps.theme ?? 'default'}
  data-open={isOpen ? '' : undefined}
  onfocusout={onFocusOut}
>
  {#if trigger}
    {@render trigger({
      value: formatted.value,
      hijriValue: formatted.hijriValue,
      gregorianValue: formatted.gregorianValue,
      open,
      isOpen,
    })}
  {:else}
    <input
      class="taqwim-datepicker-input"
      type="text"
      role="combobox"
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={popoverId}
      aria-label={label}
      placeholder={inputPlaceholder ?? format}
      readonly={!editable || calendarProps.readonly || inputDisplay === 'both'}
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
  {/if}

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
