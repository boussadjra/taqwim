import {
  DEFAULT_GREGORIAN_FORMAT_OPTIONS,
  formatDatePickerValues,
  parseDatePickerDraft,
  type DatePickerInputDisplay,
} from '@taqwim/calendar-core'
import type { HijriDateObject } from '@taqwim/core'
import { useEffect, useId, useMemo, useRef, useState, type FocusEvent, type ReactNode } from 'react'
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
  }) => ReactNode
}

export function HijriDatePicker({
  value,
  defaultValue,
  onValueChange,
  format = 'iYYYY-iMM-iDD',
  gregorianFormat = DEFAULT_GREGORIAN_FORMAT_OPTIONS,
  inputDisplay = 'hijri',
  inputPlaceholder,
  label = 'Hijri date',
  editable = true,
  renderTrigger,
  ...calendarProps
}: HijriDatePickerProps): ReactNode {
  const { theme = 'default', disabled, readonly, locale = 'en', gregorianLocale } = calendarProps

  const [uncontrolled, setUncontrolled] = useState<HijriDateObject | undefined>(
    Array.isArray(defaultValue) ? defaultValue[0] : defaultValue,
  )
  const selected = value !== undefined ? value : uncontrolled

  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  // `role="combobox"` is only complete when it points at the popup it controls.
  const popoverId = useId()

  const formatOptions = useMemo(
    () => ({
      hijriFormat: format,
      gregorianFormat,
      locale,
      gregorianLocale: gregorianLocale ?? locale,
      inputDisplay,
    }),
    [format, gregorianFormat, locale, gregorianLocale, inputDisplay],
  )

  const formatted = useMemo(() => formatDatePickerValues(selected, formatOptions), [selected, formatOptions])
  const [draft, setDraft] = useState(formatted.value)

  // The draft only diverges from the selection while the user is mid-edit.
  useEffect(() => setDraft(formatted.value), [formatted.value])

  function commit(next: HijriDateObject | undefined) {
    if (value === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  function open() {
    if (disabled) return
    setIsOpen(true)
  }

  function commitDraft() {
    const parsed = parseDatePickerDraft(draft, inputDisplay)
    if (parsed === 'empty') {
      commit(undefined)
      return
    }

    if (parsed) {
      commit(parsed)
    } else {
      // Unparseable input reverts rather than silently clearing the selection.
      setDraft(formatted.value)
    }
  }

  /*
   * A month page unmounts the focused day cell, which fires `focusout` with
   * `relatedTarget === null`. Closing on that made prev/next dismiss the
   * popover before the new month could be seen. Close only when focus actually
   * moved to a node outside the picker; clicks on the page are handled below.
   */
  function onBlurCapture(event: FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget as Node | null
    if (next && !containerRef.current?.contains(next)) setIsOpen(false)
  }

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!isOpen) return
      if (containerRef.current?.contains(event.target as Node)) return
      setIsOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  }, [isOpen])

  const triggerProps = {
    value: formatted.value,
    hijriValue: formatted.hijriValue,
    gregorianValue: formatted.gregorianValue,
    open,
    isOpen,
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
      {renderTrigger ? (
        renderTrigger(triggerProps)
      ) : (
        <input
          className="taqwim-datepicker-input"
          type="text"
          role="combobox"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={popoverId}
          aria-label={label}
          placeholder={inputPlaceholder ?? format}
          readOnly={!editable || readonly || inputDisplay === 'both'}
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
      )}

      {isOpen && (
        <div id={popoverId} className="taqwim-datepicker-popover" role="dialog" tabIndex={-1} aria-label={label}>
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
