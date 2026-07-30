import { formatHijriDate, isValidHijriDate, type HijriDateObject } from '@taqwim/core'
import { useEffect, useRef, useState, type FocusEvent, type ReactNode } from 'react'
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

export function HijriDatePicker({
  value,
  defaultValue,
  onValueChange,
  format = 'iYYYY-iMM-iDD',
  inputPlaceholder,
  label = 'Hijri date',
  editable = true,
  ...calendarProps
}: HijriDatePickerProps): ReactNode {
  const { theme = 'default', disabled, readonly, locale = 'en' } = calendarProps

  const [uncontrolled, setUncontrolled] = useState<HijriDateObject | undefined>(
    Array.isArray(defaultValue) ? defaultValue[0] : defaultValue,
  )
  const selected = value !== undefined ? value : uncontrolled

  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const formatted = selected ? formatHijriDate(selected, format, locale) : ''
  const [draft, setDraft] = useState(formatted)

  // The draft only diverges from the selection while the user is mid-edit.
  useEffect(() => setDraft(formatted), [formatted])

  function commit(next: HijriDateObject | undefined) {
    if (value === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  function open() {
    if (disabled) return
    setIsOpen(true)
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
      setDraft(formatted)
    }
  }

  function onBlurCapture(event: FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget as Node | null
    if (next && containerRef.current?.contains(next)) return
    setIsOpen(false)
  }

  return (
    <div
      ref={containerRef}
      className="taqwim-datepicker"
      data-taqwim-theme={theme}
      data-open={isOpen ? '' : undefined}
      onBlur={onBlurCapture}
      onKeyDown={event => {
        if (event.key === 'Escape') setIsOpen(false)
      }}
    >
      <input
        className="taqwim-datepicker-input"
        type="text"
        role="combobox"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={label}
        placeholder={inputPlaceholder ?? format}
        readOnly={!editable || readonly}
        disabled={disabled}
        value={draft}
        onChange={event => setDraft(event.target.value)}
        onFocus={open}
        onClick={open}
        onBlur={commitDraft}
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

      {isOpen && (
        <div className="taqwim-datepicker-popover" role="dialog" aria-label={label}>
          <HijriCalendar
            {...calendarProps}
            value={selected}
            initialFocus
            onValueChange={next => {
              commit(Array.isArray(next) ? next[0] : next)
              setIsOpen(false)
            }}
          />
        </div>
      )}
    </div>
  )
}
