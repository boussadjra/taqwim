import { formatHijriDate, isValidHijriDate, type HijriDateObject } from '@taqwim/core'
import { Component, EventEmitter, Input, Output, signal, type OnChanges } from '@angular/core'
import { HijriCalendar, type HijriCalendarSize, type HijriCalendarTheme } from './calendar'

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

let instances = 0

@Component({
  selector: 'taqwim-hijri-datepicker',
  standalone: true,
  imports: [HijriCalendar],
  host: {
    class: 'taqwim-datepicker',
    '[attr.data-taqwim-theme]': 'theme',
    '[attr.data-open]': "isOpen() ? '' : null",
    '(focusout)': 'onFocusOut($event)',
  },
  template: `
    <input
      class="taqwim-datepicker-input"
      type="text"
      role="combobox"
      aria-haspopup="dialog"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-controls]="popoverId"
      [attr.aria-label]="label"
      [attr.placeholder]="inputPlaceholder ?? format"
      [readOnly]="!editable || !!readonly"
      [disabled]="!!disabled"
      [value]="draft()"
      (input)="draft.set($any($event.target).value)"
      (focus)="open()"
      (click)="open()"
      (change)="commitDraft()"
      (keydown.enter)="$event.preventDefault(); commitDraft()"
      (keydown.arrowdown)="$event.preventDefault(); open()"
      (keydown.escape)="isOpen.set(false)"
    />

    @if (isOpen()) {
      <div
        [id]="popoverId"
        class="taqwim-datepicker-popover"
        role="dialog"
        tabindex="-1"
        [attr.aria-label]="label"
        (keydown.escape)="isOpen.set(false)"
      >
        <taqwim-hijri-calendar
          [theme]="theme"
          [size]="size"
          [locale]="locale"
          [dir]="dir"
          [value]="selected()"
          [defaultPlaceholder]="defaultPlaceholder"
          [minValue]="minValue"
          [maxValue]="maxValue"
          [disabled]="disabled"
          [readonly]="readonly"
          [initialFocus]="true"
          (valueChange)="onSelect($any($event))"
        />
      </div>
    }
  `,
})
export class HijriDatePicker implements OnChanges {
  @Input() theme: HijriCalendarTheme = 'default'
  @Input() size: HijriCalendarSize = 'default'
  @Input() locale = 'en'
  @Input() dir?: 'ltr' | 'rtl'
  @Input() value?: HijriDateObject
  @Input() defaultValue?: HijriDateObject
  @Input() defaultPlaceholder?: HijriDateObject
  @Input() minValue?: HijriDateObject
  @Input() maxValue?: HijriDateObject
  @Input() disabled?: boolean
  @Input() readonly?: boolean
  /** Pattern used for the input's text, e.g. `'iD iMMMM iYYYY'`. */
  @Input() format = 'iYYYY-iMM-iDD'
  /** Placeholder text for the empty input. */
  @Input() inputPlaceholder?: string
  /** Accessible label for the input. */
  @Input() label = 'Hijri date'
  /** Let the user type a date as well as pick one. */
  @Input() editable = true

  @Output() readonly valueChange = new EventEmitter<HijriDateObject | undefined>()

  /** `role="combobox"` is only complete when it points at the popup it controls. */
  protected readonly popoverId = `taqwim-datepicker-${++instances}`

  protected readonly isOpen = signal(false)
  protected readonly draft = signal('')

  private readonly uncontrolled = signal<HijriDateObject | undefined>(undefined)

  protected selected(): HijriDateObject | undefined {
    return this.value !== undefined ? this.value : this.uncontrolled()
  }

  ngOnChanges(): void {
    if (this.uncontrolled() === undefined && this.defaultValue) {
      this.uncontrolled.set(this.defaultValue)
    }
    // The draft only diverges from the selection while the user is mid-edit.
    this.draft.set(this.formatted())
  }

  protected open(): void {
    if (this.disabled) return
    this.isOpen.set(true)
  }

  protected onSelect(next: HijriDateObject | HijriDateObject[] | undefined): void {
    this.commit(Array.isArray(next) ? next[0] : next)
    this.isOpen.set(false)
  }

  protected commitDraft(): void {
    if (this.draft().trim() === '') {
      this.commit(undefined)
      return
    }

    const parsed = parseDraft(this.draft())
    if (parsed) {
      this.commit(parsed)
    } else {
      // Unparseable input reverts rather than silently clearing the selection.
      this.draft.set(this.formatted())
    }
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null
    const host = (event.currentTarget as HTMLElement) ?? null
    if (next && host?.contains(next)) return
    this.isOpen.set(false)
  }

  private formatted(): string {
    const value = this.selected()
    return value ? formatHijriDate(value, this.format, this.locale) : ''
  }

  private commit(next: HijriDateObject | undefined): void {
    if (this.value === undefined) this.uncontrolled.set(next)
    this.draft.set(next ? formatHijriDate(next, this.format, this.locale) : '')
    this.valueChange.emit(next)
  }
}
