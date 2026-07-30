import { formatHijriDate, isValidHijriDate, type HijriDateObject } from '@taqwim/core'
import { createEffect, createSignal, createUniqueId, Show, splitProps, type JSX } from 'solid-js'
import { HijriCalendar, type HijriCalendarProps } from './HijriCalendar'

export interface HijriDatePickerProps extends Omit<HijriCalendarProps, 'value' | 'onValueChange' | 'multiple'> {
  /** Controlled selection. */
  value?: HijriDateObject
  onValueChange?: (value: HijriDateObject | undefined) => void
  /** Pattern used for the input's text, e.g. `'iD iMMMM iYYYY'`. @default 'iYYYY-iMM-iDD' */
  format?: string
  /** Placeholder text for the empty input. */
  inputPlaceholder?: string
  /** Accessible label for the input. @default 'Hijri date' */
  label?: string
  /** Let the user type a date as well as pick one. @default true */
  editable?: boolean
}

/*
 * Deliberately not `@taqwim/core`'s `parseDateString`: that throws on bad input
 * and resolves an empty string to today, neither of which suits an input the
 * user is still typing into.
 */
const YMD = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/
const DMY = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/

function parseDraft(text: string): HijriDateObject | null {
  const trimmed = text.trim()

  const ymd = YMD.exec(trimmed)
  const dmy = ymd ? null : DMY.exec(trimmed)
  if (!ymd && !dmy) return null

  const [hy, hm, hd] = ymd
    ? [Number(ymd[1]), Number(ymd[2]), Number(ymd[3])]
    : [Number(dmy![3]), Number(dmy![2]), Number(dmy![1])]

  const candidate = { hy, hm, hd }
  return isValidHijriDate(candidate) ? candidate : null
}

export function HijriDatePicker(props: HijriDatePickerProps): JSX.Element {
  const [local, calendarProps] = splitProps(props, [
    'value',
    'defaultValue',
    'onValueChange',
    'format',
    'inputPlaceholder',
    'label',
    'editable',
  ])

  const format = () => local.format ?? 'iYYYY-iMM-iDD'
  const label = () => local.label ?? 'Hijri date'
  const editable = () => local.editable ?? true

  const [uncontrolled, setUncontrolled] = createSignal<HijriDateObject | undefined>(
    Array.isArray(local.defaultValue) ? local.defaultValue[0] : local.defaultValue,
  )
  const selected = () => (local.value !== undefined ? local.value : uncontrolled())

  const [isOpen, setIsOpen] = createSignal(false)
  // `role="combobox"` is only complete when it points at the popup it controls.
  const popoverId = createUniqueId()
  const formatted = () => {
    const value = selected()
    return value ? formatHijriDate(value, format(), calendarProps.locale ?? 'en') : ''
  }

  const [draft, setDraft] = createSignal(formatted())
  // The draft only diverges from the selection while the user is mid-edit.
  createEffect(() => setDraft(formatted()))

  let container: HTMLDivElement | undefined

  function commit(next: HijriDateObject | undefined) {
    if (local.value === undefined) setUncontrolled(next)
    local.onValueChange?.(next)
  }

  function open() {
    if (calendarProps.disabled) return
    setIsOpen(true)
  }

  function commitDraft() {
    if (draft().trim() === '') {
      commit(undefined)
      return
    }

    const parsed = parseDraft(draft())
    if (parsed) {
      commit(parsed)
    } else {
      // Unparseable input reverts rather than silently clearing the selection.
      setDraft(formatted())
    }
  }

  return (
    <div
      ref={container}
      class="taqwim-datepicker"
      data-taqwim-theme={calendarProps.theme ?? 'default'}
      data-open={isOpen() ? '' : undefined}
      onFocusOut={event => {
        const next = event.relatedTarget as Node | null
        if (next && container?.contains(next)) return
        setIsOpen(false)
      }}
      onKeyDown={event => {
        if (event.key === 'Escape') setIsOpen(false)
      }}
    >
      <input
        class="taqwim-datepicker-input"
        type="text"
        role="combobox"
        aria-haspopup="dialog"
        aria-expanded={isOpen()}
        aria-controls={popoverId}
        aria-label={label()}
        placeholder={local.inputPlaceholder ?? format()}
        readOnly={!editable() || calendarProps.readonly}
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
