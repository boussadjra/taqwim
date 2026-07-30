import type { CalendarOptions, CalendarState, CalendarStore } from '@taqwim/calendar-core'
import { createCalendar } from '@taqwim/calendar-core'
import { DestroyRef, Injectable, inject, signal, type Signal } from '@angular/core'

/**
 * Wraps a `@taqwim/calendar-core` store as an injectable, so the compound
 * directives below can reach it through Angular's DI rather than a context
 * object.
 *
 * Provided by `HijriCalendarRoot`, never at the root injector: one instance per
 * calendar.
 */
@Injectable()
export class TaqwimCalendarService {
  readonly store: CalendarStore = createCalendar()

  private readonly snapshot = signal<CalendarState>(this.store.getSnapshot())

  /** The store's snapshot as a signal, for templates and `computed`. */
  readonly state: Signal<CalendarState> = this.snapshot.asReadonly()

  constructor() {
    const unsubscribe = this.store.subscribe(() => this.snapshot.set(this.store.getSnapshot()))
    inject(DestroyRef).onDestroy(unsubscribe)
  }

  /**
   * Merge new options in.
   *
   * Safe to call from `ngOnChanges` on every change: the store compares the
   * state it builds and stays quiet when nothing observable moved.
   */
  setOptions(options: Partial<CalendarOptions>): void {
    this.store.setOptions(options)
  }
}
