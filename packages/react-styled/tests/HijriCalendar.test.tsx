import type { HijriDateObject } from '@taqwim/core'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HijriCalendar, HijriDatePicker } from '../src'

afterEach(cleanup)

const RAMADAN_1445: HijriDateObject = { hy: 1445, hm: 9, hd: 1 }

const root = () => document.querySelector('[data-taqwim-calendar]')!

const inMonthTrigger = (dayInMonth: number) => {
  const found = [...document.querySelectorAll<HTMLElement>('[data-taqwim-calendar-cell-trigger]')].find(
    trigger => !trigger.hasAttribute('data-outside-month') && trigger.textContent === String(dayInMonth),
  )
  if (!found) throw new Error(`no in-month trigger for day ${dayInMonth}`)
  return found
}

describe('theming', () => {
  it('selects the theme by attribute rather than by stylesheet', () => {
    render(<HijriCalendar defaultPlaceholder={RAMADAN_1445} theme="islamic" />)

    expect(root().getAttribute('data-taqwim-theme')).toBe('islamic')
  })

  it('switches theme at runtime', () => {
    const { rerender } = render(<HijriCalendar defaultPlaceholder={RAMADAN_1445} theme="dark" />)
    rerender(<HijriCalendar defaultPlaceholder={RAMADAN_1445} theme="neon" />)

    expect(root().getAttribute('data-taqwim-theme')).toBe('neon')
  })

  it('leaves the size attribute off at the default size', () => {
    render(<HijriCalendar defaultPlaceholder={RAMADAN_1445} />)

    expect(root().hasAttribute('data-taqwim-size')).toBe(false)
  })

  it('marks non-default sizes', () => {
    render(<HijriCalendar defaultPlaceholder={RAMADAN_1445} size="compact" />)

    expect(root().getAttribute('data-taqwim-size')).toBe('compact')
  })
})

describe('composition', () => {
  it('forwards headless props to the calendar', () => {
    render(<HijriCalendar defaultPlaceholder={RAMADAN_1445} numberOfMonths={2} />)

    expect(document.querySelectorAll('[data-taqwim-calendar-grid]')).toHaveLength(2)
  })

  it('hides navigation and weekdays on request', () => {
    render(<HijriCalendar defaultPlaceholder={RAMADAN_1445} showNavigation={false} showWeekdays={false} />)

    expect(document.querySelector('.taqwim-calendar-nav-button')).toBeNull()
    expect(document.querySelector('[data-taqwim-calendar-grid-head]')).toBeNull()
  })

  it('reports the selection', () => {
    const onValueChange = vi.fn()
    render(<HijriCalendar defaultPlaceholder={RAMADAN_1445} onValueChange={onValueChange} />)

    fireEvent.click(inMonthTrigger(10))

    expect(onValueChange).toHaveBeenCalledWith({ hy: 1445, hm: 9, hd: 10 })
  })
})

describe('month and year picker', () => {
  const openPicker = () => fireEvent.click(document.querySelector('[data-taqwim-calendar-heading]')!)

  it('opens from the heading', () => {
    render(<HijriCalendar defaultPlaceholder={RAMADAN_1445} />)
    openPicker()

    expect(document.querySelector('.taqwim-calendar-picker')).not.toBeNull()
  })

  it('stays closed when the heading is not selectable', () => {
    render(<HijriCalendar defaultPlaceholder={RAMADAN_1445} selectableHeading={false} />)
    openPicker()

    expect(document.querySelector('.taqwim-calendar-picker')).toBeNull()
  })

  it('jumps to the chosen month', () => {
    const onPlaceholderChange = vi.fn()
    render(<HijriCalendar defaultPlaceholder={RAMADAN_1445} onPlaceholderChange={onPlaceholderChange} />)
    openPicker()

    // Rajab, the seventh month.
    fireEvent.click(document.querySelectorAll('.taqwim-calendar-picker-grid button')[6])

    expect(onPlaceholderChange).toHaveBeenCalledWith(expect.objectContaining({ hm: 7, hd: 1 }))
  })

  it('offers only years the conversion table covers', () => {
    render(<HijriCalendar defaultPlaceholder={RAMADAN_1445} />)
    openPicker()
    fireEvent.click(document.querySelectorAll('.taqwim-calendar-picker-tabs button')[1])

    const years = [...document.querySelectorAll('.taqwim-calendar-picker-grid button')].map(button =>
      Number(button.textContent),
    )

    expect(years[0]).toBe(1343)
    expect(years.at(-1)).toBe(1500)
  })
})

describe('date picker', () => {
  const input = () => screen.getByRole('combobox') as HTMLInputElement

  it('renders the value in the configured format', () => {
    render(<HijriDatePicker value={RAMADAN_1445} />)

    expect(input().value).toBe('1445-09-01')
  })

  it.each([
    ['1446-03-15', { hy: 1446, hm: 3, hd: 15 }],
    ['15/3/1446', { hy: 1446, hm: 3, hd: 15 }],
  ])('accepts %s', (text, expected) => {
    const onValueChange = vi.fn()
    render(<HijriDatePicker onValueChange={onValueChange} />)

    fireEvent.change(input(), { target: { value: text } })
    fireEvent.blur(input())

    expect(onValueChange).toHaveBeenCalledWith(expected)
  })

  it('reverts unparseable text rather than clearing the selection', () => {
    const onValueChange = vi.fn()
    render(<HijriDatePicker value={RAMADAN_1445} onValueChange={onValueChange} />)

    fireEvent.change(input(), { target: { value: 'not a date' } })
    fireEvent.blur(input())

    expect(onValueChange).not.toHaveBeenCalled()
    expect(input().value).toBe('1445-09-01')
  })

  it('rejects dates outside the Hijri calendar', () => {
    const onValueChange = vi.fn()
    render(<HijriDatePicker onValueChange={onValueChange} />)

    fireEvent.change(input(), { target: { value: '1446-13-01' } })
    fireEvent.blur(input())

    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('opens on focus and shows a calendar', () => {
    render(<HijriDatePicker />)
    fireEvent.focus(input())

    expect(input().getAttribute('aria-expanded')).toBe('true')
    expect(document.querySelector('[data-taqwim-calendar]')).not.toBeNull()
  })

  it('does not open while disabled', () => {
    render(<HijriDatePicker disabled />)
    fireEvent.focus(input())

    expect(document.querySelector('[data-taqwim-calendar]')).toBeNull()
  })

  it('closes after picking a date', () => {
    render(<HijriDatePicker defaultPlaceholder={RAMADAN_1445} />)
    fireEvent.focus(input())

    fireEvent.click(inMonthTrigger(9))

    expect(input().value).toBe('1445-09-09')
    expect(document.querySelector('[data-taqwim-calendar]')).toBeNull()
  })

  it('is read-only when editing is disabled', () => {
    render(<HijriDatePicker editable={false} />)

    expect(input().readOnly).toBe(true)
  })
})
