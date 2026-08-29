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
  const monthButton = () => document.querySelector('[data-taqwim-heading="month"]')!
  const yearButton = () => document.querySelector('[data-taqwim-heading="year"]')!

  it('shows the month and year as separate heading buttons', () => {
    render(<HijriCalendar defaultPlaceholder={RAMADAN_1445} />)

    expect(monthButton().textContent).toBe('Ramadan')
    expect(yearButton().textContent).toBe('1445')
  })

  it('promotes the Gregorian date span while keeping Hijri picker controls available', () => {
    render(<HijriCalendar defaultPlaceholder={RAMADAN_1445} showGregorian dateEmphasis="gregorian" />)

    const primary = document.querySelector('.taqwim-calendar-heading-primary')!
    const secondary = document.querySelector('.taqwim-calendar-heading-secondary')!

    expect(primary.getAttribute('data-calendar-system')).toBe('gregorian')
    expect(primary.textContent).toMatch(/March.*April.*2024/)
    expect(secondary.getAttribute('data-calendar-system')).toBe('hijri')
    expect(secondary.textContent).toContain('Ramadan')
    expect(secondary.contains(monthButton())).toBe(true)
  })

  it('opens the month grid from the month button', () => {
    render(<HijriCalendar defaultPlaceholder={RAMADAN_1445} />)
    fireEvent.click(monthButton())

    expect(document.querySelector('.taqwim-calendar-picker')).not.toBeNull()
    expect(monthButton().getAttribute('aria-expanded')).toBe('true')
  })

  it('stays closed when the heading is not selectable', () => {
    render(<HijriCalendar defaultPlaceholder={RAMADAN_1445} selectableHeading={false} />)
    fireEvent.click(document.querySelector('[data-taqwim-calendar-heading]')!)

    expect(document.querySelector('.taqwim-calendar-picker')).toBeNull()
    expect(document.querySelector('[data-taqwim-heading]')).toBeNull()
  })

  it('jumps to the chosen month', () => {
    const onPlaceholderChange = vi.fn()
    render(<HijriCalendar defaultPlaceholder={RAMADAN_1445} onPlaceholderChange={onPlaceholderChange} />)
    fireEvent.click(monthButton())

    // Rajab, the seventh month.
    fireEvent.click(document.querySelectorAll('.taqwim-calendar-picker-grid button')[6])

    expect(onPlaceholderChange).toHaveBeenCalledWith(expect.objectContaining({ hm: 7, hd: 1 }))
  })

  it('opens the year grid from the year button', () => {
    render(<HijriCalendar defaultPlaceholder={RAMADAN_1445} />)
    fireEvent.click(yearButton())

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

  it('shows paging and month/year heading buttons', () => {
    render(<HijriDatePicker defaultPlaceholder={RAMADAN_1445} />)
    fireEvent.focus(input())

    expect(screen.getByRole('button', { name: 'Previous page' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeTruthy()
    expect(document.querySelector('[data-taqwim-heading="month"]')?.textContent).toBe('Ramadan')
    expect(document.querySelector('[data-taqwim-heading="year"]')?.textContent).toBe('1445')
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

  it('pages months without closing the popover', () => {
    render(<HijriDatePicker defaultPlaceholder={RAMADAN_1445} />)
    fireEvent.focus(input())

    const start = document.querySelector('[data-taqwim-heading="month"]')!.textContent
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))

    expect(document.querySelector('[data-taqwim-calendar]')).not.toBeNull()
    expect(document.querySelector('[data-taqwim-heading="month"]')!.textContent).not.toBe(start)

    fireEvent.click(screen.getByRole('button', { name: 'Previous page' }))

    expect(document.querySelector('[data-taqwim-heading="month"]')!.textContent).toBe(start)
  })

  it('does not close when a focused cell unmounts', () => {
    render(<HijriDatePicker defaultPlaceholder={RAMADAN_1445} />)
    fireEvent.focus(input())

    fireEvent.focusOut(document.querySelector('.taqwim-datepicker')!, { relatedTarget: null })

    expect(document.querySelector('[data-taqwim-calendar]')).not.toBeNull()
  })

  it('opens month and year pickers from the heading', () => {
    render(<HijriDatePicker defaultPlaceholder={RAMADAN_1445} />)
    fireEvent.focus(input())

    fireEvent.click(document.querySelector('[data-taqwim-heading="month"]')!)
    expect(document.querySelector('.taqwim-calendar-picker')).not.toBeNull()

    fireEvent.click(document.querySelector('[data-taqwim-heading="year"]')!)
    expect(document.querySelector('[data-taqwim-heading="year"]')?.getAttribute('aria-expanded')).toBe('true')
    expect(document.querySelector('[data-taqwim-calendar]')).not.toBeNull()
  })
})
