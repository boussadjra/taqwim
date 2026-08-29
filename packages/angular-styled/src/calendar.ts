import { getLocaleData, MAX_HIJRI_YEAR, MIN_HIJRI_YEAR, type HijriDateObject } from '@taqwim/core'
import { TAQWIM_CALENDAR, TaqwimCalendarService, type CalendarDay, type HijriCalendarInputs } from '@taqwim/angular'
import { Component, EventEmitter, Input, Output, computed, signal, type OnChanges } from '@angular/core'

/*
 * Generated from the stylesheets in @taqwim/themes, so a new preset is one
 * CSS file rather than an identical edit in all five styled packages.
 */
import type { HijriCalendarLayout, HijriCalendarTheme } from '@taqwim/themes/names'

export type { HijriCalendarLayout, HijriCalendarTheme }

export type HijriCalendarSize = 'compact' | 'default' | 'large'

/*
 * Bounded by what the Umm al-Qura table actually covers, rather than the
 * `new Date().getFullYear() + 579` approximation the pre-1.0 Vue version used —
 * that offered years the calendar cannot convert.
 */
const YEARS = Array.from({ length: MAX_HIJRI_YEAR - MIN_HIJRI_YEAR + 1 }, (_, i) => MIN_HIJRI_YEAR + i)

@Component({
  selector: 'taqwim-hijri-calendar',
  standalone: true,
  imports: [TAQWIM_CALENDAR],
  template: `
    <taqwim-calendar
      #root
      [attr.data-taqwim-theme]="theme"
      [attr.data-taqwim-size]="size === 'default' ? null : size"
      [attr.data-taqwim-layout]="layout === 'default' ? null : layout"
      [defaultValue]="defaultValue"
      [value]="value"
      [defaultPlaceholder]="defaultPlaceholder"
      [placeholder]="placeholder"
      [weekStartsOn]="weekStartsOn"
      [weekdayFormat]="weekdayFormat"
      [calendarLabel]="calendarLabel"
      [fixedWeeks]="fixedWeeks"
      [numberOfMonths]="numberOfMonths"
      [pagedNavigation]="pagedNavigation"
      [multiple]="multiple"
      [preventDeselect]="preventDeselect"
      [disableDaysOutsideCurrentView]="disableDaysOutsideCurrentView"
      [disabled]="disabled"
      [readonly]="readonly"
      [minValue]="minValue"
      [maxValue]="maxValue"
      [locale]="locale"
      [dir]="dir"
      [isDateDisabled]="isDateDisabled"
      [isDateUnavailable]="isDateUnavailable"
      [nextPage]="nextPage"
      [prevPage]="prevPage"
      [initialFocus]="initialFocus"
      (valueChange)="valueChange.emit($event)"
      (placeholderChange)="placeholderChange.emit($event)"
    >
      <taqwim-calendar-header class="taqwim-calendar-header">
        @if (showNavigation) {
          <button taqwimCalendarPrev class="taqwim-calendar-nav-button" aria-hidden="false">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              aria-hidden="true"
            >
              <path d="m15 5l-6 7l6 7" />
            </svg>
          </button>
        }

        <div
          class="taqwim-calendar-heading"
          data-taqwim-calendar-heading
          [attr.data-disabled]="root.state().disabled ? '' : null"
        >
          @if (selectableHeading) {
            <button
              type="button"
              class="taqwim-calendar-heading-button"
              data-taqwim-heading="month"
              [attr.aria-expanded]="picker() === 'month'"
              (click)="togglePicker('month')"
            >
              {{ months()[root.state().placeholder.hm - 1] }}
            </button>
            <button
              type="button"
              class="taqwim-calendar-heading-button"
              data-taqwim-heading="year"
              [attr.aria-expanded]="picker() === 'year'"
              (click)="togglePicker('year')"
            >
              {{ root.state().placeholder.hy }}
            </button>
          } @else {
            {{ root.state().headingValue }}
          }
        </div>

        @if (showNavigation) {
          <button taqwimCalendarNext class="taqwim-calendar-nav-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              aria-hidden="true"
            >
              <path d="m9 5l6 7l-6 7" />
            </svg>
          </button>
        }
      </taqwim-calendar-header>

      <!--
        Rendered inline rather than in an overlay: the theme lives on this
        element's ancestors, so a detached panel would lose it.
      -->
      @if (picker(); as active) {
        <div class="taqwim-calendar-picker">
          <div class="taqwim-calendar-picker-grid">
            @if (active === 'month') {
              @for (month of months(); track month; let index = $index) {
                <button
                  type="button"
                  [attr.data-selected]="root.state().placeholder.hm === index + 1 ? '' : null"
                  (click)="jumpTo(root, { hm: index + 1 })"
                >
                  {{ month }}
                </button>
              }
            } @else {
              @for (year of years; track year) {
                <button
                  type="button"
                  [attr.data-selected]="root.state().placeholder.hy === year ? '' : null"
                  (click)="jumpTo(root, { hy: year })"
                >
                  {{ year }}
                </button>
              }
            }
          </div>
        </div>
      }

      @if (!picker() || layout === 'panel') {
        <div class="taqwim-calendar-months">
          @for (month of root.months(); track month.label) {
            <taqwim-calendar-grid [month]="month">
              @if (showWeekdays) {
                <div taqwimCalendarGridHead>
                  <div taqwimCalendarGridRow>
                    @for (weekday of root.weekDays(); track weekday) {
                      <div taqwimCalendarHeadCell class="taqwim-calendar-weekday">{{ weekday }}</div>
                    }
                  </div>
                </div>
              }

              <div taqwimCalendarGridBody>
                @for (week of month.weeks; track $index) {
                  <div taqwimCalendarGridRow>
                    @for (day of week; track day.date.hy + '-' + day.date.hm + '-' + day.date.hd) {
                      <div [taqwimCalendarCell]="day">
                        <button [taqwimCalendarCellTrigger]="day"></button>
                      </div>
                    }
                  </div>
                }
              </div>
            </taqwim-calendar-grid>
          }
        </div>
      }
    </taqwim-calendar>
  `,
})
export class HijriCalendar implements OnChanges {
  /**
   * Which bundled theme to render with.
   *
   * Applied as `data-taqwim-theme`, so it can also be set on any ancestor to
   * theme a whole subtree, and changed at runtime without swapping stylesheets.
   */
  @Input() theme: HijriCalendarTheme = 'default'
  @Input() size: HijriCalendarSize = 'default'

  /**
   * How the calendar is arranged.
   *
   * Applied as `data-taqwim-layout`, orthogonal to `theme` and `size`.
   * `panel` keeps the grid visible while the month/year picker is open.
   */
  @Input() layout: HijriCalendarLayout = 'default'
  /** Show the previous/next paging buttons. */
  @Input() showNavigation = true
  /** Show the weekday label row. */
  @Input() showWeekdays = true
  /** Show the month and year as separate heading buttons that open their pickers. */
  @Input() selectableHeading = true

  @Input() defaultValue?: HijriCalendarInputs['defaultValue']
  @Input() value?: HijriCalendarInputs['value']
  @Input() defaultPlaceholder?: HijriDateObject
  @Input() placeholder?: HijriDateObject
  @Input() weekStartsOn?: HijriCalendarInputs['weekStartsOn']
  @Input() weekdayFormat?: HijriCalendarInputs['weekdayFormat']
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
  @Input() locale = 'en'
  @Input() dir?: 'ltr' | 'rtl'
  @Input() isDateDisabled?: HijriCalendarInputs['isDateDisabled']
  @Input() isDateUnavailable?: HijriCalendarInputs['isDateUnavailable']
  @Input() nextPage?: (placeholder: HijriDateObject) => HijriDateObject
  @Input() prevPage?: (placeholder: HijriDateObject) => HijriDateObject
  @Input() initialFocus = false

  @Output() readonly valueChange = new EventEmitter<HijriDateObject | HijriDateObject[] | undefined>()
  @Output() readonly placeholderChange = new EventEmitter<HijriDateObject>()

  protected readonly picker = signal<'month' | 'year' | null>(null)
  protected readonly years = YEARS

  private readonly localeSignal = signal('en')
  protected readonly months = computed(() => getLocaleData(this.localeSignal(), 'monthsLong') as string[])

  ngOnChanges(): void {
    this.localeSignal.set(this.locale)
  }

  protected togglePicker(which: 'month' | 'year'): void {
    if (!this.selectableHeading) return
    this.picker.update(current => (current === which ? null : which))
  }

  protected jumpTo(
    root: { store: TaqwimCalendarService['store']; state: () => { placeholder: HijriDateObject } },
    part: Partial<HijriDateObject>,
  ): void {
    // Day 1 keeps the jump inside the target month regardless of its length.
    root.store.setPlaceholder({ ...root.state().placeholder, ...part, hd: 1 })
    this.picker.set(null)
  }
}

export type { CalendarDay }
