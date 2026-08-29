import type { CalendarDay, CalendarMonth, CellProps } from '@taqwim/calendar-core'
import { getCellDisplayValues } from '@taqwim/calendar-core'
import type { HijriDateObject } from '@taqwim/core'
import {
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  computed,
  effect,
  inject,
  input,
  type AfterViewInit,
  type OnChanges,
} from '@angular/core'
import { TaqwimCalendarService } from './calendar.service'
import type { HijriCalendarInputs, Matcher, WeekDayFormat, WeekStartsOn } from './types'

/*
 * Every part below binds attributes the store computed. Because those are the
 * same `data-*` and `aria-*` attributes the other four adapters emit,
 * `@taqwim/themes` styles all of them and one Playwright spec covers all of
 * them.
 */

@Component({
  selector: 'taqwim-calendar',
  standalone: true,
  providers: [TaqwimCalendarService],
  host: {
    role: 'application',
    '[attr.aria-label]': 'state().fullCalendarLabel',
    '[attr.dir]': 'state().dir',
    '[attr.data-taqwim-calendar]': '""',
    '[attr.data-show-gregorian]': "state().showGregorian ? '' : null",
    '[attr.data-date-emphasis]': 'state().showGregorian ? state().dateEmphasis : null',
    '[attr.data-disabled]': "state().disabled ? '' : null",
    '[attr.data-readonly]': "state().readonly ? '' : null",
    '[attr.data-invalid]': "state().isInvalid ? '' : null",
    '(keydown)': 'onKeydown($event)',
  },
  template: `
    <ng-content />

    <!-- Inlined rather than classed: the headless package must not require a stylesheet. -->
    <div
      style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0"
    >
      <div role="heading" aria-level="2">{{ state().fullCalendarLabel }}</div>
    </div>
  `,
})
export class HijriCalendarRoot implements OnChanges, AfterViewInit {
  private readonly calendar = inject(TaqwimCalendarService)
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef)

  readonly store = this.calendar.store
  readonly state = this.calendar.state

  readonly months = computed(() => this.state().months)
  readonly weekDays = computed(() => this.state().weekDays)
  readonly gregorianValue = computed(() => this.state().gregorianValue)

  @Input() defaultValue?: HijriCalendarInputs['defaultValue']
  @Input() value?: HijriCalendarInputs['value']
  @Input() defaultPlaceholder?: HijriDateObject
  @Input() placeholder?: HijriDateObject
  @Input() weekStartsOn?: WeekStartsOn
  @Input() weekdayFormat?: WeekDayFormat
  @Input() calendarLabel?: string
  @Input() fixedWeeks?: boolean
  @Input() numberOfMonths?: number
  @Input() pagedNavigation?: boolean
  @Input() multiple?: boolean
  @Input() preventDeselect?: boolean
  @Input() disableDaysOutsideCurrentView?: boolean
  @Input() disabled?: boolean
  @Input() readonly?: boolean
  @Input() minValue?: HijriDateObject
  @Input() maxValue?: HijriDateObject
  @Input() locale?: string
  @Input() showGregorian?: boolean
  @Input() dateEmphasis?: HijriCalendarInputs['dateEmphasis']
  @Input() gregorianLocale?: string
  @Input() dir?: 'ltr' | 'rtl'
  @Input() isDateDisabled?: Matcher
  @Input() isDateUnavailable?: Matcher
  @Input() nextPage?: (placeholder: HijriDateObject) => HijriDateObject
  @Input() prevPage?: (placeholder: HijriDateObject) => HijriDateObject
  @Input() initialFocus = false

  @Output() readonly valueChange = new EventEmitter<HijriDateObject | HijriDateObject[] | undefined>()
  @Output() readonly placeholderChange = new EventEmitter<HijriDateObject>()

  // Set by the store when the roving focus moves; consumed after the render.
  private pendingFocus: string | undefined

  constructor() {
    this.pushOptions()

    /*
     * The store owns which date has focus; the adapter owns the DOM. Running
     * in an effect means the target cell exists even when the move paged the
     * calendar into a month that was not rendered a moment ago.
     */
    effect(() => {
      // Read the state so this re-runs on every change.
      this.state()
      if (!this.pendingFocus) return

      const value = this.pendingFocus
      this.pendingFocus = undefined
      queueMicrotask(() => {
        this.host.nativeElement
          .querySelector<HTMLElement>(`[data-taqwim-calendar-cell-trigger][data-value="${value}"]`)
          ?.focus()
      })
    })
  }

  ngOnChanges(): void {
    this.pushOptions()
  }

  ngAfterViewInit(): void {
    if (this.initialFocus) this.store.focusInitial()
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.store.handleKeydown(event)) event.preventDefault()
  }

  private pushOptions(): void {
    this.calendar.setOptions({
      defaultValue: this.defaultValue,
      value: this.value,
      defaultPlaceholder: this.defaultPlaceholder,
      placeholder: this.placeholder,
      weekStartsOn: this.weekStartsOn,
      weekdayFormat: this.weekdayFormat,
      calendarLabel: this.calendarLabel,
      fixedWeeks: this.fixedWeeks,
      numberOfMonths: this.numberOfMonths,
      pagedNavigation: this.pagedNavigation,
      multiple: this.multiple,
      preventDeselect: this.preventDeselect,
      disableDaysOutsideCurrentView: this.disableDaysOutsideCurrentView,
      disabled: this.disabled,
      readonly: this.readonly,
      minValue: this.minValue,
      maxValue: this.maxValue,
      locale: this.locale,
      showGregorian: this.showGregorian,
      dateEmphasis: this.dateEmphasis,
      gregorianLocale: this.gregorianLocale,
      dir: this.dir,
      isDateDisabled: this.isDateDisabled,
      isDateUnavailable: this.isDateUnavailable,
      nextPage: this.nextPage,
      prevPage: this.prevPage,
      onValueChange: next => this.valueChange.emit(next),
      onPlaceholderChange: next => this.placeholderChange.emit(next),
      onFocusedDateChange: date => {
        this.pendingFocus = date ? this.store.formatter.isoDate(date) : undefined
      },
    })
  }
}

@Component({
  selector: 'taqwim-calendar-header',
  standalone: true,
  host: {
    role: 'group',
    '[attr.aria-label]': 'calendar.state().fullCalendarLabel',
    '[attr.data-taqwim-calendar-header]': '""',
  },
  template: '<ng-content />',
})
export class HijriCalendarHeader {
  protected readonly calendar = inject(TaqwimCalendarService)
}

@Component({
  selector: 'taqwim-calendar-heading',
  standalone: true,
  host: {
    '[attr.data-taqwim-calendar-heading]': '""',
    '[attr.data-disabled]': "calendar.state().disabled ? '' : null",
  },
  template: '{{ calendar.state().headingValue }}',
})
export class HijriCalendarHeading {
  protected readonly calendar = inject(TaqwimCalendarService)
}

@Component({
  selector: 'button[taqwimCalendarPrev]',
  standalone: true,
  host: {
    type: 'button',
    role: 'button',
    'aria-label': 'Previous page',
    '[attr.aria-disabled]': 'calendar.state().isPrevDisabled',
    '[attr.data-disabled]': "calendar.state().isPrevDisabled ? '' : null",
    '[disabled]': 'calendar.state().isPrevDisabled',
    '(click)': 'calendar.store.prevPage()',
  },
  template: '<ng-content />',
})
export class HijriCalendarPrev {
  protected readonly calendar = inject(TaqwimCalendarService)
}

@Component({
  selector: 'button[taqwimCalendarNext]',
  standalone: true,
  host: {
    type: 'button',
    role: 'button',
    'aria-label': 'Next page',
    '[attr.aria-disabled]': 'calendar.state().isNextDisabled',
    '[attr.data-disabled]': "calendar.state().isNextDisabled ? '' : null",
    '[disabled]': 'calendar.state().isNextDisabled',
    '(click)': 'calendar.store.nextPage()',
  },
  template: '<ng-content />',
})
export class HijriCalendarNext {
  protected readonly calendar = inject(TaqwimCalendarService)
}

@Component({
  selector: 'taqwim-calendar-grid',
  standalone: true,
  host: {
    role: 'grid',
    tabindex: '-1',
    '[attr.aria-label]': 'resolved().label',
    '[attr.aria-readonly]': "calendar.state().readonly ? 'true' : null",
    '[attr.aria-disabled]': "calendar.state().disabled ? 'true' : null",
    '[attr.data-taqwim-calendar-grid]': '""',
    '[attr.data-readonly]': "calendar.state().readonly ? '' : null",
    '[attr.data-disabled]': "calendar.state().disabled ? '' : null",
  },
  template: '<ng-content />',
})
export class HijriCalendarGrid {
  protected readonly calendar = inject(TaqwimCalendarService)

  /** Optional for the single-month case, where it defaults to the only month. */
  readonly month = input<CalendarMonth | undefined>(undefined)

  protected readonly resolved = computed(() => this.month() ?? this.calendar.state().months[0])
}

@Directive({
  selector: '[taqwimCalendarGridHead]',
  standalone: true,
  // The weekday row duplicates each cell's accessible label, so it is hidden
  // from assistive technology rather than read out twice.
  host: { 'aria-hidden': 'true', '[attr.data-taqwim-calendar-grid-head]': '""' },
})
export class HijriCalendarGridHead {}

@Directive({
  selector: '[taqwimCalendarGridBody]',
  standalone: true,
  host: { '[attr.data-taqwim-calendar-grid-body]': '""' },
})
export class HijriCalendarGridBody {}

@Directive({
  selector: '[taqwimCalendarGridRow]',
  standalone: true,
  host: { role: 'row', '[attr.data-taqwim-calendar-grid-row]': '""' },
})
export class HijriCalendarGridRow {}

@Directive({
  selector: '[taqwimCalendarHeadCell]',
  standalone: true,
  host: { '[attr.data-taqwim-calendar-head-cell]': '""' },
})
export class HijriCalendarHeadCell {}

@Directive({
  selector: '[taqwimCalendarCell]',
  standalone: true,
  host: {
    role: 'gridcell',
    '[attr.aria-selected]': "day().isSelected ? 'true' : null",
    '[attr.aria-disabled]': "day().isDisabled || day().isUnavailable ? 'true' : null",
    '[attr.data-taqwim-calendar-cell]': '""',
    '[attr.data-tooltip]': "cellProps()['data-tooltip']",
    '[attr.title]': "cellProps()['data-tooltip']",
    '[attr.data-disabled]': "day().isDisabled ? '' : null",
    '[attr.data-outside-month]': "day().isOutsideMonth ? '' : null",
  },
})
export class HijriCalendarCell {
  private readonly calendar = inject(TaqwimCalendarService)

  readonly day = input.required<CalendarDay>({ alias: 'taqwimCalendarCell' })

  protected readonly cellProps = computed((): CellProps => this.calendar.store.getCellProps(this.day()))
}

@Component({
  selector: 'button[taqwimCalendarCellTrigger]',
  standalone: true,
  host: {
    type: 'button',
    role: 'button',
    '[attr.tabindex]': 'props().tabindex',
    '[attr.aria-label]': "props()['aria-label']",
    '[attr.aria-disabled]': "props()['aria-disabled']",
    '[attr.data-tooltip]': "props()['data-tooltip']",
    '[attr.data-value]': "props()['data-value']",
    '[attr.data-gregorian-value]': "props()['data-gregorian-value'] ?? null",
    '[attr.data-taqwim-calendar-cell-trigger]': '""',
    '[attr.data-selected]': "day().isSelected ? '' : null",
    '[attr.data-disabled]': "day().isDisabled ? '' : null",
    '[attr.data-unavailable]': "day().isUnavailable ? '' : null",
    '[attr.data-today]': "day().isToday ? '' : null",
    '[attr.data-outside-month]': "day().isOutsideMonth ? '' : null",
    '[attr.data-focused]': "day().isFocused ? '' : null",
    '(click)': 'onClick()',
    '(focus)': 'onFocus()',
  },
  template: `
    @if (display().secondaryDayValue) {
      <span class="taqwim-calendar-cell-primary" data-primary [attr.data-calendar-system]="primarySystem()">{{
        display().primaryDayValue
      }}</span>
      <span class="taqwim-calendar-cell-secondary" data-secondary [attr.data-calendar-system]="secondarySystem()">{{
        display().secondaryDayValue
      }}</span>
    } @else {
      {{ display().dayValue }}
    }
  `,
})
export class HijriCalendarCellTrigger {
  private readonly calendar = inject(TaqwimCalendarService)

  readonly day = input.required<CalendarDay>({ alias: 'taqwimCalendarCellTrigger' })

  protected readonly props = computed(() => this.calendar.store.getCellTriggerProps(this.day()))
  protected readonly display = computed(() =>
    getCellDisplayValues(
      this.day(),
      this.calendar.store.formatter,
      this.calendar.state().showGregorian,
      this.calendar.state().dateEmphasis,
    ),
  )
  protected readonly primarySystem = computed(() =>
    this.calendar.state().dateEmphasis === 'gregorian' ? 'gregorian' : 'hijri',
  )
  protected readonly secondarySystem = computed(() =>
    this.calendar.state().dateEmphasis === 'gregorian' ? 'hijri' : 'gregorian',
  )

  onClick(): void {
    // `select` re-checks these itself; this only avoids the pointless call.
    const day = this.day()
    if (day.isDisabled || day.isUnavailable) return
    this.calendar.store.select(day.date)
  }

  onFocus(): void {
    // Tabbing or clicking into a cell makes it the roving-focus target.
    // Re-reporting a date the store already holds would echo its own
    // programmatic `.focus()` back at it, so that case is skipped.
    const day = this.day()
    if (day.isDisabled || day.isFocused) return
    this.calendar.store.focusDate(day.date)
  }
}

/** Every part, for `imports: [TAQWIM_CALENDAR]` in a standalone component. */
export const TAQWIM_CALENDAR = [
  HijriCalendarRoot,
  HijriCalendarHeader,
  HijriCalendarHeading,
  HijriCalendarPrev,
  HijriCalendarNext,
  HijriCalendarGrid,
  HijriCalendarGridHead,
  HijriCalendarGridBody,
  HijriCalendarGridRow,
  HijriCalendarHeadCell,
  HijriCalendarCell,
  HijriCalendarCellTrigger,
] as const
