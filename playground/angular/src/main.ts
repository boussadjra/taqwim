/**
 * The Angular end of the shared end-to-end harness.
 *
 * Configuration comes from the query string so one Playwright spec can put
 * every framework's adapter into the same state. See `e2e/harness.ts`.
 */
import '@angular/compiler'

import type { HijriDateObject } from '@taqwim/core'
import { HijriCalendar, type HijriCalendarSize, type HijriCalendarTheme } from '@taqwim/angular-styled'
import { Component, provideZonelessChangeDetection, signal } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { formatSelection, readConfig } from './harness'

const config = readConfig(window.location.search)

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HijriCalendar],
  template: `
    <select data-testid="theme" [value]="theme()" (change)="theme.set($any($event.target).value)">
      @for (name of themes; track name) {
        <option [value]="name">{{ name }}</option>
      }
    </select>

    <taqwim-hijri-calendar
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
      [defaultPlaceholder]="config.placeholder"
      [minValue]="config.min"
      [maxValue]="config.max"
      [value]="value()"
      (valueChange)="value.set($event)"
    />

    <output data-testid="selection">{{ selection() }}</output>
  `,
})
class AppRoot {
  protected readonly config = config
  protected readonly themes = ['default', 'dark', 'islamic', 'neon', 'ocean']
  protected readonly size = config.size as HijriCalendarSize

  protected readonly theme = signal(config.theme as HijriCalendarTheme)
  protected readonly value = signal<HijriDateObject | HijriDateObject[] | undefined>(config.value)

  protected selection(): string {
    return formatSelection(this.value())
  }
}

// Zoneless: the adapter is signal-driven, so there is nothing for zone.js to patch.
void bootstrapApplication(AppRoot, { providers: [provideZonelessChangeDetection()] })
