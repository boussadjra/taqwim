import {
  DEFAULT_GREGORIAN_FORMAT_OPTIONS,
  formatDatePickerValues,
  parseDatePickerDraft,
  type DatePickerInputDisplay,
} from '@taqwim/calendar-core'
import type { HijriDateObject } from '@taqwim/core'
import {
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  onCleanup,
  onMount,
  Show,
  splitProps,
  type JSX,
} from 'solid-js'
import { HijriCalendar, type HijriCalendarProps } from './HijriCalendar'

export interface HijriDatePickerProps extends Omit<HijriCalendarProps, 'value' | 'onValueChange' | 'multiple'> {
  /** Controlled selection. */
  value?: HijriDateObject
  onValueChange?: (value: HijriDateObject | undefined) => void
  /** Pattern used for the input's Hijri text, e.g. `'iD iMMMM iYYYY'`. @default 'iYYYY-iMM-iDD' */
  format?: string
  /** `Intl.DateTimeFormatOptions` for Gregorian input text. @default ISO-like `YYYY-MM-DD` */
  gregorianFormat?: Intl.DateTimeFormatOptions
  /** Which representation appears in the input. @default 'hijri' */
  inputDisplay?: DatePickerInputDisplay
  /** Placeholder text for the empty input. */
  inputPlaceholder?: string
  /** Accessible label for the input. @default 'Hijri date' */
  label?: string
  /** Let the user type a date as well as pick one. @default true */
  editable?: boolean
  /** Replaces the trigger input entirely. */
  renderTrigger?: (props: {
    value: string
    hijriValue: string
    gregorianValue: string
    open: () => void
    isOpen: boolean
  }) => JSX.Element
}

export function HijriDatePicker(props: HijriDatePickerProps): JSX.Element {
  const [local, calendarProps] = splitProps(props, [
    'value',
    'defaultValue',
    'onValueChange',
    'format',
    'gregorianFormat',
    'inputDisplay',
    'inputPlaceholder',
    'label',
    'editable',
    'renderTrigger',
  ])

  const format = () => local.format ?? 'iYYYY-iMM-iDD'
  const gregorianFormat = () => local.gregorianFormat ?? DEFAULT_GREGORIAN_FORMAT_OPTIONS
  const inputDisplay = () => local.inputDisplay ?? 'hijri'
  const label = () => local.label ?? 'Hijri date'
  const editable = () => local.editable ?? true

  const [uncontrolled, setUncontrolled] = createSignal<HijriDateObject | undefined>(
    Array.isArray(local.defaultValue) ? local.defaultValue[0] : local.defaultValue,
  )
  const selected = () => (local.value !== undefined ? local.value : uncontrolled())

  const [isOpen, setIsOpen] = createSignal(false)
  // `role="combobox"` is only complete when it points at the popup it controls.
  const popoverId = createUniqueId()

  const formatOptions = createMemo(() => ({
    hijriFormat: format(),
    gregorianFormat: gregorianFormat(),
    locale: calendarProps.locale ?? 'en',
    gregorianLocale: calendarProps.gregorianLocale ?? calendarProps.locale ?? 'en',
    inputDisplay: inputDisplay(),
    calendarSystem: calendarProps.calendarSystem,
  }))

  const formatted = createMemo(() => formatDatePickerValues(selected(), formatOptions()))

  const [draft, setDraft] = createSignal(formatted().value)
  // The draft only diverges from the selection while the user is mid-edit.
  createEffect(() => setDraft(formatted().value))

  let container: HTMLDivElement | undefined

  /*
   * A month page unmounts the focused day cell, which fires `focusout` with
   * `relatedTarget === null`. Closing on that made prev/next dismiss the
   * popover before the new month could be seen. Close only when focus actually
   * moved to a node outside the picker; clicks on the page are handled below.
   */
  function onFocusOut(event: FocusEvent) {
    const next = event.relatedTarget as Node | null
    if (next && !container?.contains(next)) setIsOpen(false)
  }

  function onDocumentPointerDown(event: PointerEvent) {
    if (!isOpen()) return
    if (container?.contains(event.target as Node)) return
    setIsOpen(false)
  }

  /*
   * `onCleanup` at the top level of a Solid component runs when the SSR owner
   * is disposed, and `document` does not exist there. Nesting it inside
   * `onMount` keeps the listener a client-only concern — Astro islands still
   * server-render this picker.
   */
  onMount(() => {
    document.addEventListener('pointerdown', onDocumentPointerDown, true)
    onCleanup(() => document.removeEventListener('pointerdown', onDocumentPointerDown, true))
  })

  function commit(next: HijriDateObject | undefined) {
    if (local.value === undefined) setUncontrolled(next)
    local.onValueChange?.(next)
  }

  function open() {
    if (calendarProps.disabled) return
    setIsOpen(true)
  }

  function commitDraft() {
    const parsed = parseDatePickerDraft(draft(), inputDisplay(), calendarProps.calendarSystem)
    if (parsed === 'empty') {
      commit(undefined)
      return
    }

    if (parsed) {
      commit(parsed)
    } else {
      // Unparseable input reverts rather than silently clearing the selection.
      setDraft(formatted().value)
    }
  }

  return (
    <div
      ref={container}
      class="taqwim-datepicker"
      data-taqwim-theme={calendarProps.theme ?? 'default'}
      data-open={isOpen() ? '' : undefined}
      onFocusOut={onFocusOut}
      onKeyDown={event => {
        if (event.key === 'Escape') setIsOpen(false)
      }}
    >
      {local.renderTrigger ? (
        local.renderTrigger({
          value: formatted().value,
          hijriValue: formatted().hijriValue,
          gregorianValue: formatted().gregorianValue,
          open,
          isOpen: isOpen(),
        })
      ) : (
        <input
          class="taqwim-datepicker-input"
          type="text"
          role="combobox"
          aria-haspopup="dialog"
          aria-expanded={isOpen()}
          aria-controls={popoverId}
          aria-label={label()}
          placeholder={local.inputPlaceholder ?? format()}
          readOnly={!editable() || calendarProps.readonly || inputDisplay() === 'both'}
          disabled={calendarProps.disabled}
          value={draft()}
          onInput={event => setDraft(event.currentTarget.value)}
          onFocus={open}
          onClick={open}
          onChange={commitDraft}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault()
              commitDraft()
            } else if (event.key === 'ArrowDown') {
              event.preventDefault()
              open()
            }
          }}
        />
      )}

      <Show when={isOpen()}>
        <div id={popoverId} class="taqwim-datepicker-popover" role="dialog" tabindex={-1} aria-label={label()}>
          <HijriCalendar
            {...calendarProps}
            value={selected()}
            initialFocus
            onValueChange={next => {
              commit(Array.isArray(next) ? next[0] : next)
              setIsOpen(false)
            }}
          />
        </div>
      </Show>
    </div>
  )
}
