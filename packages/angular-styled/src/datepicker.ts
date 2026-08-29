import {
  DEFAULT_GREGORIAN_FORMAT_OPTIONS,
  formatDatePickerValues,
  parseDatePickerDraft,
  type DateEmphasis,
  type DatePickerInputDisplay,
} from '@taqwim/calendar-core'
import type { HijriDateObject } from '@taqwim/core'
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
  type OnChanges,
  type OnDestroy,
} from '@angular/core'
import { HijriCalendar, type HijriCalendarLayout, type HijriCalendarSize, type HijriCalendarTheme } from './calendar'

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
      [readOnly]="!editable || !!readonly || inputDisplay === 'both'"
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
          [layout]="layout"
          [showNavigation]="showNavigation"
          [showWeekdays]="showWeekdays"
          [selectableHeading]="selectableHeading"
          [locale]="locale"
          [showGregorian]="showGregorian"
          [dateEmphasis]="dateEmphasis"
          [gregorianLocale]="gregorianLocale"
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
export class HijriDatePicker implements OnChanges, OnDestroy {
  @Input() theme: HijriCalendarTheme = 'default'
  @Input() size: HijriCalendarSize = 'default'
  @Input() layout: HijriCalendarLayout = 'default'
  @Input() showNavigation = true
  @Input() showWeekdays = true
  @Input() selectableHeading = true
  @Input() locale = 'en'
  @Input() showGregorian?: boolean
  @Input() dateEmphasis?: DateEmphasis
  @Input() gregorianLocale?: string
  @Input() dir?: 'ltr' | 'rtl'
  @Input() value?: HijriDateObject
  @Input() defaultValue?: HijriDateObject
  @Input() defaultPlaceholder?: HijriDateObject
  @Input() minValue?: HijriDateObject
  @Input() maxValue?: HijriDateObject
  @Input() disabled?: boolean
  @Input() readonly?: boolean
  /** Pattern used for the input's Hijri text, e.g. `'iD iMMMM iYYYY'`. */
  @Input() format = 'iYYYY-iMM-iDD'
  /** `Intl.DateTimeFormatOptions` for Gregorian input text. */
  @Input() gregorianFormat: Intl.DateTimeFormatOptions = DEFAULT_GREGORIAN_FORMAT_OPTIONS
  /** Which representation appears in the input. */
  @Input() inputDisplay: DatePickerInputDisplay = 'hijri'
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

  private readonly host = inject(ElementRef<HTMLElement>)
  private readonly uncontrolled = signal<HijriDateObject | undefined>(undefined)

  constructor() {
    if (typeof document === 'undefined') return
    document.addEventListener('pointerdown', this.onDocumentPointerDown, true)
  }

  ngOnDestroy(): void {
    if (typeof document === 'undefined') return
    document.removeEventListener('pointerdown', this.onDocumentPointerDown, true)
  }

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
    const parsed = parseDatePickerDraft(this.draft(), this.inputDisplay)
    if (parsed === 'empty') {
      this.commit(undefined)
      return
    }

    if (parsed) {
      this.commit(parsed)
    } else {
      // Unparseable input reverts rather than silently clearing the selection.
      this.draft.set(this.formatted())
    }
  }

  /*
   * A month page unmounts the focused day cell, which fires `focusout` with
   * `relatedTarget === null`. Closing on that made prev/next dismiss the
   * popover before the new month could be seen. Close only when focus actually
   * moved to a node outside the picker; clicks on the page are handled below.
   */
  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null
    const host = (event.currentTarget as HTMLElement) ?? null
    if (next && host && !host.contains(next)) this.isOpen.set(false)
  }

  private readonly onDocumentPointerDown = (event: PointerEvent): void => {
    if (!this.isOpen()) return
    if (this.host.nativeElement.contains(event.target as Node)) return
    this.isOpen.set(false)
  }

  private formatted(): string {
    return formatDatePickerValues(this.selected(), {
      hijriFormat: this.format,
      gregorianFormat: this.gregorianFormat,
      locale: this.locale,
      gregorianLocale: this.gregorianLocale ?? this.locale,
      inputDisplay: this.inputDisplay,
    }).value
  }

  private commit(next: HijriDateObject | undefined): void {
    if (this.value === undefined) this.uncontrolled.set(next)
    this.draft.set(
      formatDatePickerValues(next, {
        hijriFormat: this.format,
        gregorianFormat: this.gregorianFormat,
        locale: this.locale,
        gregorianLocale: this.gregorianLocale ?? this.locale,
        inputDisplay: this.inputDisplay,
      }).value,
    )
    this.valueChange.emit(next)
  }
}
