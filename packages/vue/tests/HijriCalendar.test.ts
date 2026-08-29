import { getDaysLengthInMonth, type HijriDateObject } from '@taqwim/core'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { HijriCalendarNext, HijriCalendarRoot, HijriCalendarCell, HijriCalendarCellTrigger } from '../src'
import TestCalendar from './fixtures/TestCalendar.vue'

const RAMADAN_1445: HijriDateObject = { hy: 1445, hm: 9, hd: 1 }

function mountCalendar(props: Record<string, unknown> = {}) {
  return mount(TestCalendar, {
    props: { defaultPlaceholder: RAMADAN_1445, ...props },
    attachTo: document.body,
  })
}

const triggers = (wrapper: VueWrapper) => wrapper.findAll('[data-taqwim-calendar-cell-trigger]')

/** The trigger for a given day of the visible month, ignoring adjacent months. */
function dayTrigger(wrapper: VueWrapper, dayInMonth: number) {
  const found = triggers(wrapper).find(
    trigger => trigger.attributes('data-outside-month') === undefined && trigger.text() === String(dayInMonth),
  )
  if (!found) throw new Error(`no in-month trigger for day ${dayInMonth}`)
  return found
}

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('rendering', () => {
  it('renders the placeholder month', () => {
    const wrapper = mountCalendar()

    expect(wrapper.get('[data-testid="heading"]').text()).toContain('1445')
    expect(wrapper.findAll('[data-taqwim-calendar-grid]')).toHaveLength(1)
  })

  it('renders every day of the month', () => {
    const wrapper = mountCalendar()
    const inMonth = triggers(wrapper).filter(trigger => trigger.attributes('data-outside-month') === undefined)

    expect(inMonth).toHaveLength(getDaysLengthInMonth(1445, 9))
  })

  it('leaves exactly one cell reachable with Tab before anything is focused', () => {
    // Without this the roving tabindex marks every cell -1 and a keyboard user
    // cannot enter the grid at all.
    const wrapper = mountCalendar()

    expect(triggers(wrapper).filter(trigger => trigger.attributes('tabindex') === '0')).toHaveLength(1)
  })

  it('applies the accessibility contract to the root', () => {
    const root = mountCalendar().get('[data-taqwim-calendar]')

    expect(root.attributes('role')).toBe('application')
    expect(root.attributes('aria-label')).toBeTruthy()
    expect(root.attributes('dir')).toBe('ltr')
  })

  it('mirrors the reading direction', () => {
    expect(mountCalendar({ dir: 'rtl' }).get('[data-taqwim-calendar]').attributes('dir')).toBe('rtl')
  })
})

describe('previously inert props', () => {
  // Each of these was accepted by the old component and did nothing.
  it('renders several months', () => {
    const wrapper = mountCalendar({ numberOfMonths: 3 })
    expect(wrapper.findAll('[data-taqwim-calendar-grid]')).toHaveLength(3)
  })

  it('honours weekStartsOn', () => {
    const sunday = mountCalendar({ weekStartsOn: 0 })
    const monday = mountCalendar({ weekStartsOn: 1 })

    const labels = (wrapper: VueWrapper) => wrapper.findAll('[data-taqwim-calendar-head-cell]').map(cell => cell.text())

    expect(labels(monday)[0]).toBe(labels(sunday)[1])
  })

  it('always renders six rows under fixedWeeks', () => {
    const wrapper = mountCalendar({ fixedWeeks: true })
    const rows = wrapper.findAll('[data-taqwim-calendar-grid-body] [data-taqwim-calendar-grid-row]')

    expect(rows).toHaveLength(6)
  })

  it('disables days outside minValue/maxValue rather than only the paging buttons', () => {
    const wrapper = mountCalendar({
      minValue: { hy: 1445, hm: 9, hd: 10 },
      maxValue: { hy: 1445, hm: 9, hd: 20 },
    })

    expect(dayTrigger(wrapper, 5).attributes('data-disabled')).toBe('')
    expect(dayTrigger(wrapper, 15).attributes('data-disabled')).toBeUndefined()
    expect(dayTrigger(wrapper, 25).attributes('data-disabled')).toBe('')
  })

  it('greys out adjacent days when disableDaysOutsideCurrentView is set', () => {
    const wrapper = mountCalendar({ fixedWeeks: true, disableDaysOutsideCurrentView: true })
    const outside = triggers(wrapper).filter(trigger => trigger.attributes('data-outside-month') !== undefined)

    expect(outside.length).toBeGreaterThan(0)
    for (const trigger of outside) {
      expect(trigger.attributes('data-disabled')).toBe('')
    }
  })
})

describe('selection', () => {
  it('selects a day on click and emits the value', async () => {
    const wrapper = mountCalendar()
    await dayTrigger(wrapper, 12).trigger('click')

    expect(wrapper.findComponent({ name: 'HijriCalendarRoot' }).emitted('update:modelValue')?.at(-1)?.[0]).toEqual({
      hy: 1445,
      hm: 9,
      hd: 12,
    })
    expect(dayTrigger(wrapper, 12).attributes('data-selected')).toBe('')
  })

  it('deselects when the same day is clicked again', async () => {
    const wrapper = mountCalendar()

    await dayTrigger(wrapper, 12).trigger('click')
    await dayTrigger(wrapper, 12).trigger('click')

    expect(dayTrigger(wrapper, 12).attributes('data-selected')).toBeUndefined()
  })

  it('keeps the selection when preventDeselect is set', async () => {
    const wrapper = mountCalendar({ preventDeselect: true })

    await dayTrigger(wrapper, 12).trigger('click')
    await dayTrigger(wrapper, 12).trigger('click')

    expect(dayTrigger(wrapper, 12).attributes('data-selected')).toBe('')
  })

  it('accumulates selections when multiple is set', async () => {
    const wrapper = mountCalendar({ multiple: true })

    await dayTrigger(wrapper, 3).trigger('click')
    await dayTrigger(wrapper, 7).trigger('click')

    expect(wrapper.findAll('[data-selected]')).toHaveLength(2)
  })

  it('refuses dates the consumer marks unavailable', async () => {
    const wrapper = mountCalendar({
      isDateUnavailable: (date: HijriDateObject) => date.hd === 13,
    })

    const trigger = dayTrigger(wrapper, 13)
    expect(trigger.attributes('data-unavailable')).toBe('')

    await trigger.trigger('click')
    expect(dayTrigger(wrapper, 13).attributes('data-selected')).toBeUndefined()
  })

  it('does not select while readonly', async () => {
    const wrapper = mountCalendar({ readonly: true })
    await dayTrigger(wrapper, 12).trigger('click')

    expect(wrapper.find('[data-selected]').exists()).toBe(false)
  })
})

describe('paging', () => {
  it('moves forward and back a month', async () => {
    const wrapper = mountCalendar()
    const heading = () => wrapper.get('[data-testid="heading"]').text()
    const start = heading()

    await wrapper.get('[data-testid="next"]').trigger('click')
    expect(heading()).not.toBe(start)

    await wrapper.get('[data-testid="prev"]').trigger('click')
    expect(heading()).toBe(start)
  })

  it('disables paging past the bounds', () => {
    const wrapper = mountCalendar({
      minValue: RAMADAN_1445,
      maxValue: { hy: 1445, hm: 9, hd: 30 },
    })

    expect(wrapper.get('[data-testid="prev"]').attributes('data-disabled')).toBe('')
    expect(wrapper.get('[data-testid="next"]').attributes('data-disabled')).toBe('')
  })

  it('pages by numberOfMonths under pagedNavigation', async () => {
    const wrapper = mountCalendar({ numberOfMonths: 2, pagedNavigation: true })
    const firstHeading = () => wrapper.findAll('[data-taqwim-calendar-grid]')[0].attributes('aria-label')

    const before = firstHeading()
    await wrapper.get('[data-testid="next"]').trigger('click')

    // Two months on, so the new first grid is the old second grid's successor.
    expect(firstHeading()).not.toBe(before)
    expect(wrapper.findAll('[data-taqwim-calendar-grid]')[1].attributes('aria-label')).not.toBe(before)
  })

  it('uses a custom paging function when given one', async () => {
    const wrapper = mountCalendar({
      nextPage: (date: HijriDateObject) => ({ ...date, hy: date.hy + 1 }),
    })

    await wrapper.get('[data-testid="next"]').trigger('click')
    expect(wrapper.get('[data-testid="heading"]').text()).toContain('1446')
  })
})

describe('keyboard navigation', () => {
  // None of this existed before: `initialFocus` resolved to a TODO and no
  // arrow handling was implemented, so the calendar could not be operated
  // without a mouse.
  const press = (wrapper: VueWrapper, key: string, options: Record<string, unknown> = {}) =>
    wrapper.get('[data-taqwim-calendar]').trigger('keydown', { key, ...options })

  const focusedValue = (wrapper: VueWrapper) => wrapper.find('[data-focused]').attributes('data-value')

  it('gives exactly one cell a tabindex of 0', async () => {
    const wrapper = mountCalendar({ initialFocus: true })
    await wrapper.vm.$nextTick()

    expect(triggers(wrapper).filter(trigger => trigger.attributes('tabindex') === '0')).toHaveLength(1)
  })

  it.each([
    ['ArrowRight', 1],
    ['ArrowLeft', -1],
    ['ArrowDown', 7],
    ['ArrowUp', -7],
  ])('moves focus on %s', async (key, offset) => {
    const wrapper = mountCalendar({ defaultValue: { hy: 1445, hm: 9, hd: 15 }, initialFocus: true })
    await wrapper.vm.$nextTick()

    await press(wrapper, key)
    expect(focusedValue(wrapper)).toContain(String(15 + offset).padStart(2, '0'))
  })

  it('mirrors the horizontal keys under rtl', async () => {
    const wrapper = mountCalendar({
      dir: 'rtl',
      defaultValue: { hy: 1445, hm: 9, hd: 15 },
      initialFocus: true,
    })
    await wrapper.vm.$nextTick()

    await press(wrapper, 'ArrowRight')
    expect(focusedValue(wrapper)).toContain('14')
  })

  it('selects the focused day on Enter', async () => {
    const wrapper = mountCalendar({ defaultValue: { hy: 1445, hm: 9, hd: 15 }, initialFocus: true })
    await wrapper.vm.$nextTick()

    await press(wrapper, 'ArrowRight')
    await press(wrapper, 'Enter')

    expect(dayTrigger(wrapper, 16).attributes('data-selected')).toBe('')
  })

  it('pages the calendar when focus leaves the visible month', async () => {
    const wrapper = mountCalendar({ initialFocus: true })
    await wrapper.vm.$nextTick()

    const before = wrapper.get('[data-testid="heading"]').text()
    await press(wrapper, 'PageDown')

    expect(wrapper.get('[data-testid="heading"]').text()).not.toBe(before)
  })

  it('jumps a year on Shift+PageDown', async () => {
    const wrapper = mountCalendar({ initialFocus: true })
    await wrapper.vm.$nextTick()

    await press(wrapper, 'PageDown', { shiftKey: true })
    expect(wrapper.get('[data-testid="heading"]').text()).toContain('1446')
  })

  it('moves DOM focus to follow the store', async () => {
    const wrapper = mountCalendar({ defaultValue: { hy: 1445, hm: 9, hd: 15 }, initialFocus: true })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    await press(wrapper, 'ArrowRight')
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(document.activeElement?.getAttribute('data-value')).toBe(focusedValue(wrapper))
  })

  it('ignores keys it does not handle', async () => {
    const wrapper = mountCalendar({ initialFocus: true })
    await wrapper.vm.$nextTick()

    const before = focusedValue(wrapper)
    await press(wrapper, 'a')

    expect(focusedValue(wrapper)).toBe(before)
  })
})

describe('controlled use', () => {
  it('follows the bound model value', async () => {
    const wrapper = mountCalendar({ modelValue: { hy: 1445, hm: 9, hd: 5 } })
    expect(dayTrigger(wrapper, 5).attributes('data-selected')).toBe('')

    await wrapper.setProps({ modelValue: { hy: 1445, hm: 9, hd: 6 } })
    expect(dayTrigger(wrapper, 5).attributes('data-selected')).toBeUndefined()
    expect(dayTrigger(wrapper, 6).attributes('data-selected')).toBe('')
  })

  it('asks the parent to move a controlled placeholder rather than moving it', async () => {
    // Mounted directly rather than through the fixture: a controlled binding
    // needs the listener on the Root itself, and the fixture would forward the
    // prop but not the handler.
    const onUpdate = vi.fn()
    const wrapper = mount(HijriCalendarRoot, {
      props: { placeholder: RAMADAN_1445, 'onUpdate:placeholder': onUpdate },
      slots: { default: () => h(HijriCalendarNext, { 'data-testid': 'next' }, () => '>') },
    })

    await wrapper.get('[data-testid="next"]').trigger('click')

    // The store asks; the parent decides. Nothing moved on its own.
    expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ hy: 1445, hm: 10 }))
    expect(wrapper.props('placeholder')).toEqual(RAMADAN_1445)
  })
})

describe('today', () => {
  it('marks the current Hijri day', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 2, 15))

    const wrapper = mountCalendar({ defaultPlaceholder: undefined })
    expect(wrapper.findAll('[data-today]')).toHaveLength(1)

    vi.useRealTimers()
  })
})

describe('dual calendar presentation', () => {
  it('defaults to Hijri-only presentation', () => {
    const wrapper = mountCalendar()
    expect(wrapper.get('[data-taqwim-calendar]').attributes('data-show-gregorian')).toBeUndefined()
  })

  it('exposes derived Gregorian selection in the root slot', () => {
    let gregorian: Date | undefined
    mount(HijriCalendarRoot, {
      props: {
        modelValue: { hy: 1445, hm: 9, hd: 1 },
        defaultPlaceholder: RAMADAN_1445,
        showGregorian: true,
      },
      slots: {
        default: (props: { gregorianValue?: Date }) => {
          gregorian = props.gregorianValue
          return h('div')
        },
      },
      attachTo: document.body,
    })

    expect(gregorian).toBeInstanceOf(Date)
  })

  it('exposes secondary day values from the cell trigger slot', () => {
    const wrapper = mount(HijriCalendarRoot, {
      props: { defaultPlaceholder: RAMADAN_1445, showGregorian: true },
      slots: {
        default: ({ months }: { months: { weeks: { date: { hy: number; hm: number; hd: number } }[][] }[] }) =>
          h(
            HijriCalendarCell,
            { day: months[0]!.weeks.flat().find(d => d.date.hd === 9)! },
            {
              default: () =>
                h(
                  HijriCalendarCellTrigger,
                  {
                    day: months[0]!.weeks.flat().find(d => d.date.hd === 9)!,
                  },
                  {
                    default: (slot: { secondaryDayValue?: string }) =>
                      h('span', { 'data-testid': 'secondary' }, slot.secondaryDayValue ?? ''),
                  },
                ),
            },
          ),
      },
      attachTo: document.body,
    })

    expect(wrapper.get('[data-testid="secondary"]').text()).toBeTruthy()
  })
})
