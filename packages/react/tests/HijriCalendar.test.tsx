import { getDaysLengthInMonth, type HijriDateObject } from '@taqwim/core'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HijriCalendarNext, HijriCalendarRoot } from '../src'
import { TestCalendar } from './fixtures'

// Testing Library only registers its own cleanup when Vitest runs with
// `globals: true`; these queries read from `document`, so it has to be explicit.
afterEach(cleanup)

const RAMADAN_1445: HijriDateObject = { hy: 1445, hm: 9, hd: 1 }

function renderCalendar(props: Record<string, unknown> = {}) {
  return render(<TestCalendar defaultPlaceholder={RAMADAN_1445} {...props} />)
}

const triggers = () => [...document.querySelectorAll<HTMLElement>('[data-taqwim-calendar-cell-trigger]')]

const inMonthTriggers = () => triggers().filter(trigger => !trigger.hasAttribute('data-outside-month'))

function dayTrigger(dayInMonth: number) {
  const found = inMonthTriggers().find(trigger => trigger.textContent === String(dayInMonth))
  if (!found) throw new Error(`no in-month trigger for day ${dayInMonth}`)
  return found
}

const heading = () => screen.getByTestId('heading').textContent
const focusedValue = () => document.querySelector('[data-focused]')?.getAttribute('data-value')

describe('rendering', () => {
  it('renders the placeholder month', () => {
    renderCalendar()

    expect(heading()).toContain('1445')
    expect(document.querySelectorAll('[data-taqwim-calendar-grid]')).toHaveLength(1)
  })

  it('renders every day of the month', () => {
    renderCalendar()

    expect(inMonthTriggers()).toHaveLength(getDaysLengthInMonth(1445, 9))
  })

  it('leaves exactly one cell reachable with Tab before anything is focused', () => {
    renderCalendar()

    expect(triggers().filter(trigger => trigger.getAttribute('tabindex') === '0')).toHaveLength(1)
  })

  it('applies the accessibility contract to the root', () => {
    renderCalendar()
    const root = document.querySelector('[data-taqwim-calendar]')!

    expect(root.getAttribute('role')).toBe('application')
    expect(root.getAttribute('aria-label')).toBeTruthy()
    expect(root.getAttribute('dir')).toBe('ltr')
  })

  it('mirrors the reading direction', () => {
    renderCalendar({ dir: 'rtl' })

    expect(document.querySelector('[data-taqwim-calendar]')!.getAttribute('dir')).toBe('rtl')
  })
})

describe('previously inert props', () => {
  it('renders several months', () => {
    renderCalendar({ numberOfMonths: 3 })

    expect(document.querySelectorAll('[data-taqwim-calendar-grid]')).toHaveLength(3)
  })

  it('honours weekStartsOn', () => {
    const labels = () =>
      [...document.querySelectorAll('[data-taqwim-calendar-head-cell]')].map(cell => cell.textContent)

    const sunday = render(<TestCalendar defaultPlaceholder={RAMADAN_1445} weekStartsOn={0} />)
    const sundayLabels = labels()
    sunday.unmount()

    render(<TestCalendar defaultPlaceholder={RAMADAN_1445} weekStartsOn={1} />)

    expect(labels()[0]).toBe(sundayLabels[1])
  })

  it('always renders six rows under fixedWeeks', () => {
    renderCalendar({ fixedWeeks: true })

    expect(document.querySelectorAll('[data-taqwim-calendar-grid-body] [data-taqwim-calendar-grid-row]')).toHaveLength(
      6,
    )
  })

  it('disables days outside minValue/maxValue rather than only the paging buttons', () => {
    renderCalendar({ minValue: { hy: 1445, hm: 9, hd: 10 }, maxValue: { hy: 1445, hm: 9, hd: 20 } })

    expect(dayTrigger(5).hasAttribute('data-disabled')).toBe(true)
    expect(dayTrigger(15).hasAttribute('data-disabled')).toBe(false)
    expect(dayTrigger(25).hasAttribute('data-disabled')).toBe(true)
  })

  it('greys out adjacent days when disableDaysOutsideCurrentView is set', () => {
    renderCalendar({ fixedWeeks: true, disableDaysOutsideCurrentView: true })
    const outside = triggers().filter(trigger => trigger.hasAttribute('data-outside-month'))

    expect(outside.length).toBeGreaterThan(0)
    for (const trigger of outside) {
      expect(trigger.hasAttribute('data-disabled')).toBe(true)
    }
  })
})

describe('selection', () => {
  it('selects a day on click and reports the value', () => {
    const onValueChange = vi.fn()
    renderCalendar({ onValueChange })

    fireEvent.click(dayTrigger(12))

    expect(onValueChange).toHaveBeenCalledWith({ hy: 1445, hm: 9, hd: 12 })
    expect(dayTrigger(12).hasAttribute('data-selected')).toBe(true)
  })

  it('deselects when the same day is clicked again', () => {
    renderCalendar()

    fireEvent.click(dayTrigger(12))
    fireEvent.click(dayTrigger(12))

    expect(dayTrigger(12).hasAttribute('data-selected')).toBe(false)
  })

  it('keeps the selection when preventDeselect is set', () => {
    renderCalendar({ preventDeselect: true })

    fireEvent.click(dayTrigger(12))
    fireEvent.click(dayTrigger(12))

    expect(dayTrigger(12).hasAttribute('data-selected')).toBe(true)
  })

  it('accumulates selections when multiple is set', () => {
    renderCalendar({ multiple: true })

    fireEvent.click(dayTrigger(3))
    fireEvent.click(dayTrigger(7))

    expect(document.querySelectorAll('[data-selected]')).toHaveLength(2)
  })

  it('refuses dates the consumer marks unavailable', () => {
    renderCalendar({ isDateUnavailable: (date: HijriDateObject) => date.hd === 13 })

    expect(dayTrigger(13).hasAttribute('data-unavailable')).toBe(true)

    fireEvent.click(dayTrigger(13))
    expect(dayTrigger(13).hasAttribute('data-selected')).toBe(false)
  })

  it('does not select while readonly', () => {
    renderCalendar({ readonly: true })

    fireEvent.click(dayTrigger(12))

    expect(document.querySelector('[data-selected]')).toBeNull()
  })
})

describe('paging', () => {
  it('moves forward and back a month', () => {
    renderCalendar()
    const start = heading()

    fireEvent.click(screen.getByTestId('next'))
    expect(heading()).not.toBe(start)

    fireEvent.click(screen.getByTestId('prev'))
    expect(heading()).toBe(start)
  })

  it('disables paging past the bounds', () => {
    renderCalendar({ minValue: RAMADAN_1445, maxValue: { hy: 1445, hm: 9, hd: 30 } })

    expect(screen.getByTestId('prev').hasAttribute('data-disabled')).toBe(true)
    expect(screen.getByTestId('next').hasAttribute('data-disabled')).toBe(true)
  })

  it('uses a custom paging function when given one', () => {
    renderCalendar({ nextPage: (date: HijriDateObject) => ({ ...date, hy: date.hy + 1 }) })

    fireEvent.click(screen.getByTestId('next'))

    expect(heading()).toContain('1446')
  })
})

describe('keyboard navigation', () => {
  const press = (key: string, options: Record<string, unknown> = {}) =>
    fireEvent.keyDown(document.querySelector('[data-taqwim-calendar]')!, { key, ...options })

  it.each([
    ['ArrowRight', 1],
    ['ArrowLeft', -1],
    ['ArrowDown', 7],
    ['ArrowUp', -7],
  ])('moves focus on %s', (key, offset) => {
    renderCalendar({ defaultValue: { hy: 1445, hm: 9, hd: 15 }, initialFocus: true })

    press(key)

    expect(focusedValue()).toBe(`1445-09-${String(15 + offset).padStart(2, '0')}`)
  })

  it('mirrors the horizontal keys under rtl', () => {
    renderCalendar({ dir: 'rtl', defaultValue: { hy: 1445, hm: 9, hd: 15 }, initialFocus: true })

    press('ArrowRight')

    expect(focusedValue()).toBe('1445-09-14')
  })

  it('selects the focused day on Enter', () => {
    renderCalendar({ defaultValue: { hy: 1445, hm: 9, hd: 15 }, initialFocus: true })

    press('ArrowRight')
    press('Enter')

    expect(dayTrigger(16).hasAttribute('data-selected')).toBe(true)
  })

  it('pages the calendar when focus leaves the visible month', () => {
    renderCalendar({ initialFocus: true })
    const before = heading()

    press('PageDown')

    expect(heading()).not.toBe(before)
  })

  it('jumps a year on Shift+PageDown', () => {
    renderCalendar({ initialFocus: true })

    press('PageDown', { shiftKey: true })

    expect(heading()).toContain('1446')
  })

  it('moves DOM focus to follow the store', () => {
    renderCalendar({ defaultValue: { hy: 1445, hm: 9, hd: 15 }, initialFocus: true })

    press('ArrowRight')

    expect(document.activeElement?.getAttribute('data-value')).toBe(focusedValue())
  })

  it('ignores keys it does not handle', () => {
    renderCalendar({ initialFocus: true })
    const before = focusedValue()

    press('a')

    expect(focusedValue()).toBe(before)
  })
})

describe('controlled use', () => {
  function Controlled() {
    const [value, setValue] = useState<HijriDateObject | undefined>({ hy: 1445, hm: 9, hd: 5 })

    return (
      <>
        <button type="button" data-testid="external" onClick={() => setValue({ hy: 1445, hm: 9, hd: 6 })}>
          set
        </button>
        <TestCalendar
          defaultPlaceholder={RAMADAN_1445}
          value={value}
          onValueChange={next => setValue(next as HijriDateObject | undefined)}
        />
      </>
    )
  }

  it('follows the controlled value', () => {
    render(<Controlled />)
    expect(dayTrigger(5).hasAttribute('data-selected')).toBe(true)

    fireEvent.click(screen.getByTestId('external'))

    expect(dayTrigger(5).hasAttribute('data-selected')).toBe(false)
    expect(dayTrigger(6).hasAttribute('data-selected')).toBe(true)
  })

  it('asks the parent to move a controlled placeholder rather than moving it', () => {
    const onPlaceholderChange = vi.fn()
    render(
      <HijriCalendarRoot placeholder={RAMADAN_1445} onPlaceholderChange={onPlaceholderChange}>
        <HijriCalendarNext data-testid="next">›</HijriCalendarNext>
      </HijriCalendarRoot>,
    )

    fireEvent.click(screen.getByTestId('next'))

    expect(onPlaceholderChange).toHaveBeenCalledWith(expect.objectContaining({ hy: 1445, hm: 10 }))
  })
})

describe('re-render safety', () => {
  /*
   * The store notifies on every option push. If a push that changes nothing
   * still invalidated the snapshot, `useSyncExternalStore` would re-render,
   * which would push again — a loop that renders until React bails out.
   */
  it('does not loop when the parent re-renders with inline callbacks', () => {
    let renders = 0

    function Counting() {
      renders++
      return (
        <TestCalendar
          defaultPlaceholder={RAMADAN_1445}
          isDateDisabled={date => date.hd === 1}
          onValueChange={() => {}}
        />
      )
    }

    render(<Counting />)

    expect(renders).toBeLessThan(5)
  })

  it('picks up a changed matcher even though its identity changes every render', () => {
    function Toggling() {
      const [limit, setLimit] = useState(5)

      return (
        <>
          <button type="button" data-testid="raise" onClick={() => setLimit(20)}>
            raise
          </button>
          <TestCalendar defaultPlaceholder={RAMADAN_1445} isDateDisabled={date => date.hd < limit} />
        </>
      )
    }

    render(<Toggling />)
    expect(dayTrigger(10).hasAttribute('data-disabled')).toBe(false)

    fireEvent.click(screen.getByTestId('raise'))

    // Comparing built state rather than option identity is what makes this
    // work: the matcher is a new function each render either way.
    expect(dayTrigger(10).hasAttribute('data-disabled')).toBe(true)
  })
})
