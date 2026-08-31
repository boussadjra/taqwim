/**
 * The Angular playground views.
 *
 * `/` stays the shared end-to-end harness in every playground, so these hang
 * off the hash instead of a router — Playwright drives `/?theme=…` and must
 * keep landing on the harness. It also keeps the playground free of
 * `@angular/router`, which is scaffolding a consumer of the adapter does not
 * need to see.
 */
import {
  getDayInWeek,
  islamicUmmAlQura,
  type HijriCalendarId,
  type HijriCalendarSystem,
  type HijriDateObject,
} from '@taqwim/core'
import { islamicCivil } from '@taqwim/core/calendars/islamic-civil'
import { islamicTbla } from '@taqwim/core/calendars/islamic-tbla'
import { layoutNames, themeNames } from '@taqwim/themes/names'
import {
  HijriCalendar,
  HijriDatePicker,
  type HijriCalendarLayout,
  type HijriCalendarSize,
  type HijriCalendarTheme,
} from '@taqwim/angular-styled'
import { Component, computed, signal } from '@angular/core'

const FORMATS = ['iYYYY-iMM-iDD', 'iDD/iMM/iYYYY', 'iD iMMMM iYYYY', 'iEEEE, iD iMMMM iYYYY']
const SIZE_OPTIONS = [
  { value: 'compact', label: 'Compact' },
  { value: 'default', label: 'Default' },
  { value: 'large', label: 'Large' },
] as const satisfies readonly { value: HijriCalendarSize; label: string }[]
const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
  { value: 'fr', label: 'French' },
] as const
const DIRECTION_OPTIONS = [
  { value: 'ltr', label: 'Left to right' },
  { value: 'rtl', label: 'Right to left' },
] as const
const WEEKDAY_OPTIONS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
] as const
const HIJRI_CALENDAR_OPTIONS = [
  { id: 'islamic-umalqura', label: 'Umm al-Qura' },
  { id: 'islamic-civil', label: 'Civil' },
  { id: 'islamic-tbla', label: 'TBLA' },
] as const satisfies readonly { id: HijriCalendarId; label: string }[]
const HIJRI_CALENDAR_SYSTEMS = {
  'islamic-umalqura': islamicUmmAlQura,
  'islamic-civil': islamicCivil,
  'islamic-tbla': islamicTbla,
} satisfies Record<HijriCalendarId, HijriCalendarSystem>

function calendarSystemIdFromSearch(): HijriCalendarId {
  const requested = new URLSearchParams(window.location.search).get('calendar')
  return HIJRI_CALENDAR_OPTIONS.some(option => option.id === requested)
    ? (requested as HijriCalendarId)
    : 'islamic-umalqura'
}

/** Everything both views share, so the two stay in step. */
abstract class PlaygroundBase {
  protected readonly themeNames = themeNames
  protected readonly layoutNames = layoutNames
  protected readonly sizeOptions = SIZE_OPTIONS
  protected readonly languageOptions = LANGUAGE_OPTIONS
  protected readonly directionOptions = DIRECTION_OPTIONS
  protected readonly calendarSystemOptions = HIJRI_CALENDAR_OPTIONS

  protected readonly theme = signal<HijriCalendarTheme>('default')
  protected readonly layout = signal<HijriCalendarLayout>('default')
  protected readonly size = signal<HijriCalendarSize>('default')
  protected readonly locale = signal('en')
  protected readonly dir = signal<'ltr' | 'rtl'>('ltr')
  protected readonly calendarSystemId = signal<HijriCalendarId>(calendarSystemIdFromSearch())
  protected readonly calendarSystem = computed(() => HIJRI_CALENDAR_SYSTEMS[this.calendarSystemId()])
  protected readonly weekStartsOn = signal(0)

  protected readonly disabled = signal(false)
  protected readonly readonly = signal(false)

  /*
   * The selection itself is *not* shared. The calendar's is a date or a list
   * of them; the picker's is one date, because `multiple` is not part of the
   * picker's surface in any adapter — the input has room for one formatted
   * value. Declaring it here would force the picker to widen to a type it
   * cannot receive.
   */

  /*
   * Arabic reads right to left and its week starts on Saturday. Following the
   * locale means the RTL case is what you see when you pick Arabic, rather
   * than something you have to remember to configure.
   */
  protected pickLocale(next: string): void {
    this.locale.set(next)
    this.dir.set(next === 'ar' ? 'rtl' : 'ltr')
    this.weekStartsOn.set(next === 'ar' ? 6 : 0)
  }

  protected setFrom(event: Event, target: { set: (value: never) => void }): void {
    target.set((event.target as HTMLSelectElement | HTMLInputElement).value as never)
  }

  protected setChecked(event: Event, target: { set: (value: boolean) => void }): void {
    target.set((event.target as HTMLInputElement).checked)
  }

  protected presetLabel(value: string): string {
    return value
      .split('-')
      .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
      .join(' ')
  }
}

const APPEARANCE = `
  <fieldset class="pg-group">
    <legend>Appearance</legend>
    <label class="pg-field">
      Theme
      <select [value]="theme()" (change)="setFrom($event, theme)">
        @for (name of themeNames; track name) { <option [value]="name">{{ presetLabel(name) }}</option> }
      </select>
    </label>
    <label class="pg-field">
      Hijri calendar
      <select
        [value]="calendarSystemId()"
        data-calendar-system-select
        (change)="setFrom($event, calendarSystemId)"
      >
        @for (option of calendarSystemOptions; track option.id) {
          <option [value]="option.id">{{ option.label }}</option>
        }
      </select>
    </label>
    <label class="pg-field">
      Layout
      <select [value]="layout()" (change)="setFrom($event, layout)">
        @for (name of layoutNames; track name) { <option [value]="name">{{ presetLabel(name) }}</option> }
      </select>
    </label>
    <label class="pg-field">
      Size
      <select [value]="size()" (change)="setFrom($event, size)">
        @for (option of sizeOptions; track option.value) {
          <option [value]="option.value">{{ option.label }}</option>
        }
      </select>
    </label>
  </fieldset>`

const LOCALE = `
  <fieldset class="pg-group">
    <legend>Language and direction</legend>
    <label class="pg-field">
      Language
      <select [value]="locale()" (change)="pickLocale($any($event.target).value)">
        @for (option of languageOptions; track option.value) {
          <option [value]="option.value">{{ option.label }}</option>
        }
      </select>
    </label>
    <label class="pg-field">
      Text direction
      <select [value]="dir()" (change)="setFrom($event, dir)">
        @for (option of directionOptions; track option.value) {
          <option [value]="option.value">{{ option.label }}</option>
        }
      </select>
    </label>
  </fieldset>`

@Component({
  selector: 'app-calendar-playground',
  standalone: true,
  imports: [HijriCalendar],
  template: `
    <div class="pg">
      <aside class="pg-controls">
        ${APPEARANCE} ${LOCALE}

        <fieldset class="pg-group">
          <legend>Grid</legend>
          <label class="pg-field">
            Week starts on
            <select [value]="weekStartsOn()" (change)="weekStartsOn.set(+$any($event.target).value)">
              @for (option of weekdayOptions; track option.value) {
                <option [value]="option.value">{{ option.label }}</option>
              }
            </select>
          </label>
          <label class="pg-field">
            Months shown
            <input
              type="number"
              min="1"
              max="4"
              [value]="numberOfMonths()"
              (input)="numberOfMonths.set(+$any($event.target).value)"
            />
          </label>
          <label class="pg-check">
            <input type="checkbox" [checked]="fixedWeeks()" (change)="setChecked($event, fixedWeeks)" />
            Always show six weeks
          </label>
          <label class="pg-check">
            <input type="checkbox" [checked]="pagedNavigation()" (change)="setChecked($event, pagedNavigation)" />
            Move all months together
          </label>
          <label class="pg-check">
            <input type="checkbox" [checked]="outside()" (change)="setChecked($event, outside)" />
            Disable dates outside visible months
          </label>
        </fieldset>

        <fieldset class="pg-group">
          <legend>Selection</legend>
          <label class="pg-check">
            <input type="checkbox" [checked]="multiple()" (change)="setChecked($event, multiple)" />
            Select multiple dates
          </label>
          <label class="pg-check">
            <input type="checkbox" [checked]="preventDeselect()" (change)="setChecked($event, preventDeselect)" />
            Keep at least one date selected
          </label>
        </fieldset>

        <fieldset class="pg-group">
          <legend>Constraints</legend>
          <label class="pg-check">
            <input type="checkbox" [checked]="disabled()" (change)="setChecked($event, disabled)" />
            Disable calendar
          </label>
          <label class="pg-check">
            <input type="checkbox" [checked]="readonly()" (change)="setChecked($event, readonly)" />
            Read-only
          </label>
          <label class="pg-check">
            <input type="checkbox" [checked]="bounded()" (change)="setChecked($event, bounded)" />
            Limit dates to 1446-01-05–1446-03-20
          </label>
          <label class="pg-check">
            <input type="checkbox" [checked]="noFridays()" (change)="setChecked($event, noFridays)" />
            Disable Fridays
          </label>
        </fieldset>
      </aside>

      <section class="pg-stage">
        <div class="pg-preview">
          <taqwim-hijri-calendar
            [calendarSystem]="calendarSystem()"
            [theme]="theme()"
            [layout]="layout()"
            [size]="size()"
            [locale]="locale()"
            [dir]="dir()"
            [weekStartsOn]="$any(weekStartsOn())"
            [numberOfMonths]="numberOfMonths()"
            [fixedWeeks]="fixedWeeks()"
            [pagedNavigation]="pagedNavigation()"
            [multiple]="multiple()"
            [preventDeselect]="preventDeselect()"
            [disableDaysOutsideCurrentView]="outside()"
            [disabled]="disabled()"
            [readonly]="readonly()"
            [minValue]="minValue()"
            [maxValue]="maxValue()"
            [isDateUnavailable]="isDateUnavailable()"
            [value]="value()"
            (valueChange)="value.set($event)"
          />
        </div>
        <pre class="pg-output">{{ selection() }}</pre>
        <p class="pg-hint">
          Tab into the grid, then use the arrow keys, <code>Home</code>/<code>End</code>, <code>PageUp</code>/<code
            >PageDown</code
          >
          (<code>Shift</code> for years) and <code>Enter</code> to select. Under <code>dir="rtl"</code> the horizontal
          keys mirror.
        </p>
      </section>
    </div>
  `,
})
export class CalendarPlayground extends PlaygroundBase {
  protected readonly multiple = signal(false)
  protected readonly value = signal<HijriDateObject | HijriDateObject[] | undefined>(undefined)
  protected readonly selection = computed(() => JSON.stringify(this.value() ?? null, null, 2))

  protected readonly weekdayOptions = WEEKDAY_OPTIONS
  protected readonly numberOfMonths = signal(1)
  protected readonly fixedWeeks = signal(false)
  protected readonly pagedNavigation = signal(false)
  protected readonly preventDeselect = signal(false)
  protected readonly outside = signal(false)
  protected readonly bounded = signal(false)
  protected readonly noFridays = signal(false)

  protected readonly minValue = computed(() => (this.bounded() ? { hy: 1446, hm: 1, hd: 5 } : undefined))
  protected readonly maxValue = computed(() => (this.bounded() ? { hy: 1446, hm: 3, hd: 20 } : undefined))
  protected readonly isDateUnavailable = computed(() =>
    this.noFridays()
      ? (date: HijriDateObject) => getDayInWeek(date, { calendarSystem: this.calendarSystem() }) === 5
      : undefined,
  )
}

@Component({
  selector: 'app-datepicker-playground',
  standalone: true,
  imports: [HijriDatePicker],
  template: `
    <div class="pg">
      <aside class="pg-controls">
        ${APPEARANCE}

        <fieldset class="pg-group">
          <legend>Input</legend>
          <label class="pg-field">
            Date format
            <select [value]="format()" (change)="setFrom($event, format)">
              @for (pattern of formats; track pattern) {
                <option [value]="pattern">{{ pattern }}</option>
              }
            </select>
          </label>
          <label class="pg-field">
            Accessible label
            <input type="text" [value]="ariaLabel()" (input)="setFrom($event, ariaLabel)" />
          </label>
          <label class="pg-field">
            Placeholder
            <input type="text" [value]="inputPlaceholder()" (input)="setFrom($event, inputPlaceholder)" />
          </label>
          <label class="pg-check">
            <input type="checkbox" [checked]="editable()" (change)="setChecked($event, editable)" />
            Allow typing
          </label>
        </fieldset>

        ${LOCALE}

        <fieldset class="pg-group">
          <legend>State</legend>
          <label class="pg-check">
            <input type="checkbox" [checked]="disabled()" (change)="setChecked($event, disabled)" />
            Disable date picker
          </label>
          <label class="pg-check">
            <input type="checkbox" [checked]="readonly()" (change)="setChecked($event, readonly)" />
            Read-only
          </label>
        </fieldset>
      </aside>

      <section class="pg-stage">
        <div class="pg-preview">
          <taqwim-hijri-datepicker
            [calendarSystem]="calendarSystem()"
            [theme]="theme()"
            [layout]="layout()"
            [size]="size()"
            [locale]="locale()"
            [dir]="dir()"
            [format]="format()"
            [label]="ariaLabel()"
            [inputPlaceholder]="inputPlaceholder()"
            [editable]="editable()"
            [disabled]="disabled()"
            [readonly]="readonly()"
            [value]="value()"
            (valueChange)="value.set($event)"
          />
        </div>
        <pre class="pg-output">{{ selection() }}</pre>
        <p class="pg-hint">
          With <code>editable</code> on, the input accepts <code>1446-09-01</code> or <code>01/09/1446</code>. Text it
          cannot parse reverts to the last good value rather than clearing the selection. Previous/next page the month;
          the heading is two buttons — month and year — that open their pickers.
        </p>
      </section>
    </div>
  `,
})
export class DatePickerPlayground extends PlaygroundBase {
  protected readonly value = signal<HijriDateObject | undefined>(undefined)
  protected readonly selection = computed(() => JSON.stringify(this.value() ?? null, null, 2))

  protected readonly formats = FORMATS
  protected readonly format = signal(FORMATS[0])
  protected readonly ariaLabel = signal('Appointment date')
  protected readonly inputPlaceholder = signal('')
  protected readonly editable = signal(true)
}
