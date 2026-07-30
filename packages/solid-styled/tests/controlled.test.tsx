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
   * A known defect, asserted rather than hidden. `it.fails` keeps the suite
   * green today and turns it red the moment this starts working — at which
   * point drop the `.fails` and the entry in e2e/KNOWN-GAPS.md.
   *
   * `HijriCalendarGrid` renders `renderChildren(local.children, month())`,
   * which reads the store snapshot, so Solid discards and rebuilds the whole
   * grid on every change. A real browser focuses a button before it clicks it,
   * that focus is itself a state change, and Solid delegates click to the
   * document — so the click is dispatched at a node that has already been
   * replaced and the handler never runs. The test above passes only because it
   * looks the cell up again; this one holds the original reference, the way a
   * real pointer does. jsdom's `fireEvent.click` sends no focus at all, which
   * is why every other unit test misses this.
   *
   * The fix is to hand the child function an accessor instead of a value. That
   * cannot be done while the render prop is `children`: Solid resolves children
   * by calling them with no arguments. It needs the render props to move to
   * named props, which is an API change rather than a patch.
   */
  it.fails('keeps a click working on a cell reference held across a focus', () => {
    const value = renderControlled()

    const cell = dayTrigger(12)
    fireEvent.focus(cell)
    fireEvent.click(cell)

    expect(value()).toEqual({ hy: 1445, hm: 9, hd: 12 })
  })
})
