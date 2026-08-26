import type { HijriDateObject } from '@taqwim/core'
import { cleanup, fireEvent, render } from '@solidjs/testing-library'
import { createSignal } from 'solid-js'
import { afterEach, describe, expect, it } from 'vitest'
import { HijriCalendar } from '../src'

afterEach(cleanup)

const RAMADAN_1445: HijriDateObject = { hy: 1445, hm: 9, hd: 1 }

const dayTrigger = (dayInMonth: number) => {
  const found = [...document.querySelectorAll<HTMLElement>('[data-taqwim-calendar-cell-trigger]')].find(
    trigger => !trigger.hasAttribute('data-outside-month') && trigger.textContent === String(dayInMonth),
  )
  if (!found) throw new Error(`no in-month trigger for day ${dayInMonth}`)
  return found
}

function renderControlled() {
  const [value, setValue] = createSignal<HijriDateObject | HijriDateObject[] | undefined>()

  render(() => (
    <HijriCalendar defaultPlaceholder={RAMADAN_1445} value={value()} onValueChange={next => setValue(next)} />
  ))

  return value
}

describe('selection with a controlled value', () => {
  it('reflects a selection handed straight back through onValueChange', () => {
    const value = renderControlled()

    fireEvent.click(dayTrigger(12))

    expect(value()).toEqual({ hy: 1445, hm: 9, hd: 12 })
    expect(dayTrigger(12).hasAttribute('data-selected')).toBe(true)
  })

  it('re-reads the cell after focus, which is what actually happens on screen', () => {
    const value = renderControlled()

    fireEvent.focus(dayTrigger(12))
    fireEvent.click(dayTrigger(12))

    expect(value()).toEqual({ hy: 1445, hm: 9, hd: 12 })
  })

  /*
   * The regression test for the defect that made Solid the odd adapter out:
   * clicking a date did nothing in a real browser while every jsdom test
   * passed, because `fireEvent.click` sends no focus.
   *
   * The test above looks the cell up again after focusing it, so it passes
   * either way. This one holds the original reference, which is what a pointer
   * does — and it fails the moment `HijriCalendarGrid` starts rebuilding its
   * subtree on a state change again.
   */
  it('keeps a click working on a cell reference held across a focus', () => {
    const value = renderControlled()

    const cell = dayTrigger(12)
    fireEvent.focus(cell)
    fireEvent.click(cell)

    expect(value()).toEqual({ hy: 1445, hm: 9, hd: 12 })
  })
})
