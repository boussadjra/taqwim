/**
 * The Angular playground views.
 *
 * `/` stays the shared end-to-end harness in every playground, so these hang
 * off the hash instead of a router — Playwright drives `/?theme=…` and must
 * keep landing on the harness. It also keeps the playground free of
 * `@angular/router`, which is scaffolding a consumer of the adapter does not
 * need to see.
 */
import { getDayInWeek, type HijriDateObject } from '@taqwim/core'
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

/** Everything both views share, so the two stay in step. */
abstract class PlaygroundBase {
  protected readonly themeNames = themeNames
  protected readonly layoutNames = layoutNames
  protected readonly sizes: HijriCalendarSize[] = ['compact', 'default', 'large']
  protected readonly locales = ['en', 'ar', 'fr']

  protected readonly theme = signal<HijriCalendarTheme>('default')
  protected readonly layout = signal<HijriCalendarLayout>('default')
  protected readonly size = signal<HijriCalendarSize>('default')
  protected readonly locale = signal('en')
  protected readonly dir = signal<'ltr' | 'rtl'>('ltr')
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
}

const APPEARANCE = `
  <fieldset class="pg-group">
    <legend>Appearance</legend>
    <label class="pg-field">
      Theme
      <select [value]="theme()" (change)="setFrom($event, theme)">
        @for (name of themeNames; track name) { <option [value]="name">{{ name }}</option> }
      </select>
    </label>
    <label class="pg-field">
      Layout
      <select [value]="layout()" (change)="setFrom($event, layout)">
        @for (name of layoutNames; track name) { <option [value]="name">{{ name }}</option> }
      </select>
    </label>
    <label class="pg-field">
      Size
      <select [value]="size()" (change)="setFrom($event, size)">
        @for (name of sizes; track name) { <option [value]="name">{{ name }}</option> }
      </select>
    </label>
  </fieldset>`

const LOCALE = `
  <fieldset class="pg-group">
    <legend>Locale</legend>
    <label class="pg-field">
      Locale
      <select [value]="locale()" (change)="pickLocale($any($event.target).value)">
        @for (name of locales; track name) { <option [value]="name">{{ name }}</option> }
      </select>
    </label>
    <label class="pg-field">
      Direction
      <select [value]="dir()" (change)="setFrom($event, dir)">
        <option value="ltr">ltr</option>
        <option value="rtl">rtl</option>
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
              @for (day of days; track day) {
                <option [value]="day">{{ day }}</option>
              }
            </select>
          </label>
          <label class="pg-field">
            Months
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
            <code>fixedWeeks</code>
          </label>
          <label class="pg-check">
            <input type="checkbox" [checked]="pagedNavigation()" (change)="setChecked($event, pagedNavigation)" />
            <code>pagedNavigation</code>
          </label>
          <label class="pg-check">
            <input type="checkbox" [checked]="outside()" (change)="setChecked($event, outside)" />
            <code>disableDaysOutsideCurrentView</code>
          </label>
        </fieldset>

        <fieldset class="pg-group">
          <legend>Selection</legend>
          <label class="pg-check">
            <input type="checkbox" [checked]="multiple()" (change)="setChecked($event, multiple)" />
            <code>multiple</code>
          </label>
          <label class="pg-check">
            <input type="checkbox" [checked]="preventDeselect()" (change)="setChecked($event, preventDeselect)" />
            <code>preventDeselect</code>
          </label>
        </fieldset>

        <fieldset class="pg-group">
          <legend>Constraints</legend>
          <label class="pg-check">
            <input type="checkbox" [checked]="disabled()" (change)="setChecked($event, disabled)" />
            <code>disabled</code>
          </label>
          <label class="pg-check">
            <input type="checkbox" [checked]="readonly()" (change)="setChecked($event, readonly)" />
            <code>readonly</code>
          </label>
          <label class="pg-check">
            <input type="checkbox" [checked]="bounded()" (change)="setChecked($event, bounded)" /> min/max
          </label>
          <label class="pg-check">
            <input type="checkbox" [checked]="noFridays()" (change)="setChecked($event, noFridays)" />
            <code>isDateUnavailable</code> (Fridays)
          </label>
        </fieldset>
      </aside>

      <section class="pg-stage">
        <div class="pg-preview">
          <taqwim-hijri-calendar
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

  protected readonly days = [0, 1, 2, 3, 4, 5, 6]
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
    this.noFridays() ? (date: HijriDateObject) => getDayInWeek(date) === 5 : undefined,
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
            Format
            <select [value]="format()" (change)="setFrom($event, format)">
              @for (pattern of formats; track pattern) {
                <option [value]="pattern">{{ pattern }}</option>
              }
            </select>
          </label>
          <label class="pg-field">
            aria-label
            <input type="text" [value]="ariaLabel()" (input)="setFrom($event, ariaLabel)" />
          </label>
          <label class="pg-field">
            Placeholder
            <input type="text" [value]="inputPlaceholder()" (input)="setFrom($event, inputPlaceholder)" />
          </label>
          <label class="pg-check">
            <input type="checkbox" [checked]="editable()" (change)="setChecked($event, editable)" />
            <code>editable</code>
          </label>
        </fieldset>

        ${LOCALE}

        <fieldset class="pg-group">
          <legend>State</legend>
          <label class="pg-check">
            <input type="checkbox" [checked]="disabled()" (change)="setChecked($event, disabled)" />
            <code>disabled</code>
          </label>
          <label class="pg-check">
            <input type="checkbox" [checked]="readonly()" (change)="setChecked($event, readonly)" />
            <code>readonly</code>
          </label>
        </fieldset>
      </aside>

      <section class="pg-stage">
        <div class="pg-preview">
          <taqwim-hijri-datepicker
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
          cannot parse reverts to the last good value rather than clearing the selection.
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
