/**
 * The Angular end of the shared end-to-end harness.
 *
 * Configuration comes from the query string so one Playwright spec can put
 * every framework's adapter into the same state. See `e2e/harness.ts`.
 */
import '@angular/compiler'

import { islamicUmmAlQura, type HijriDateObject } from '@taqwim/core'
import { islamicCivil } from '@taqwim/core/calendars/islamic-civil'
import { islamicTbla } from '@taqwim/core/calendars/islamic-tbla'
import { HijriCalendar, type HijriCalendarSize, type HijriCalendarTheme } from '@taqwim/angular-styled'
import { Component, provideZonelessChangeDetection, signal } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { formatSelection, readConfig } from './harness'
import { CalendarPlayground, DatePickerPlayground } from './playground'
import './playground.css'
// One import, every theme. Selection happens with `data-taqwim-theme`, not
// by choosing which stylesheet to load.
import '@taqwim/themes'

const config = readConfig(window.location.search)

@Component({
  selector: 'app-harness',
  standalone: true,
  imports: [HijriCalendar],
  template: `
    <select data-testid="theme" [value]="theme()" (change)="theme.set($any($event.target).value)">
      @for (name of themes; track name) {
        <option [value]="name">{{ name }}</option>
      }
    </select>

    <taqwim-hijri-calendar
      [calendarSystem]="calendarSystem"
      [theme]="theme()"
      [size]="size"
      [locale]="config.locale"
      [dir]="config.dir"
      [weekStartsOn]="$any(config.weekStartsOn)"
      [numberOfMonths]="config.numberOfMonths"
      [fixedWeeks]="config.fixedWeeks"
      [multiple]="config.multiple"
      [preventDeselect]="config.preventDeselect"
      [disableDaysOutsideCurrentView]="config.disableDaysOutsideCurrentView"
      [disabled]="config.disabled"
      [readonly]="config.readonly"
      [initialFocus]="config.initialFocus"
      [showGregorian]="config.showGregorian"
      [dateEmphasis]="config.dateEmphasis"
      [gregorianLocale]="config.gregorianLocale"
      [defaultPlaceholder]="config.placeholder"
      [minValue]="config.min"
      [maxValue]="config.max"
      [value]="value()"
      (valueChange)="value.set($event)"
    />

    <output data-testid="selection">{{ selection() }}</output>
  `,
})
export class AppHarness {
  protected readonly config = config
  protected readonly themes = ['default', 'dark', 'islamic', 'neon', 'ocean']
  protected readonly size = config.size as HijriCalendarSize
  protected readonly calendarSystem = {
    'islamic-umalqura': islamicUmmAlQura,
    'islamic-civil': islamicCivil,
    'islamic-tbla': islamicTbla,
  }[config.calendar]

  protected readonly theme = signal(config.theme as HijriCalendarTheme)
  protected readonly value = signal<HijriDateObject | HijriDateObject[] | undefined>(config.value)

  protected selection(): string {
    return formatSelection(this.value())
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppHarness, CalendarPlayground, DatePickerPlayground],
  template: `
    <header class="pg-header">
      <strong>Taqwim — Angular playground</strong>
      <nav>
        @for (item of views; track item.id) {
          <a [href]="'#' + item.id" [attr.aria-current]="view() === item.id ? 'page' : null">{{ item.label }}</a>
        }
      </nav>
    </header>

    <main>
      @switch (view()) {
        @case ('calendar') {
          <app-calendar-playground />
        }
        @case ('datepicker') {
          <app-datepicker-playground />
        }
        @default {
          <app-harness />
        }
      }
    </main>
  `,
})
class AppRoot {
  protected readonly views = [
    { id: 'harness', label: 'Harness' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'datepicker', label: 'Date picker' },
  ]

  protected readonly view = signal(this.read())

  constructor() {
    window.addEventListener('hashchange', () => this.view.set(this.read()))
  }

  private read(): string {
    return window.location.hash.replace('#', '') || 'harness'
  }
}

// Zoneless: the adapter is signal-driven, so there is nothing for zone.js to patch.
void bootstrapApplication(AppRoot, { providers: [provideZonelessChangeDetection()] })
