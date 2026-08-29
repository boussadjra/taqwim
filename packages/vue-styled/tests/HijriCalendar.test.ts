import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import HijriCalendar from '../src/HijriCalendar.vue'

const RAMADAN_1445 = { hy: 1445, hm: 9, hd: 1 }

const mountCalendar = (props: Record<string, unknown> = {}) =>
  mount(HijriCalendar, { props: { defaultPlaceholder: RAMADAN_1445, ...props }, attachTo: document.body })

describe('theming', () => {
  it('selects the theme by attribute rather than by stylesheet', () => {
    const root = mountCalendar({ theme: 'islamic' }).get('[data-taqwim-calendar]')

    expect(root.attributes('data-taqwim-theme')).toBe('islamic')
  })

  it('switches theme at runtime', async () => {
    const wrapper = mountCalendar({ theme: 'dark' })
    await wrapper.setProps({ theme: 'neon' })

    expect(wrapper.get('[data-taqwim-calendar]').attributes('data-taqwim-theme')).toBe('neon')
  })

  it('leaves the size attribute off at the default size', () => {
    const root = mountCalendar().get('[data-taqwim-calendar]')

    expect(root.attributes('data-taqwim-size')).toBeUndefined()
  })

  it('marks non-default sizes', () => {
    const root = mountCalendar({ size: 'compact' }).get('[data-taqwim-calendar]')

    expect(root.attributes('data-taqwim-size')).toBe('compact')
  })
})

describe('composition', () => {
  it('forwards headless props to the calendar', () => {
    const wrapper = mountCalendar({ numberOfMonths: 2 })

    expect(wrapper.findAll('[data-taqwim-calendar-grid]')).toHaveLength(2)
  })

  it('does not leak presentational props onto the root', () => {
    const root = mountCalendar({ theme: 'ocean', size: 'large' }).get('[data-taqwim-calendar]')

    // `theme`/`size` are this component's own; forwarding them into the
    // headless root would render them as stray attributes.
    expect(root.attributes('theme')).toBeUndefined()
    expect(root.attributes('size')).toBeUndefined()
  })

  it('hides navigation and weekdays on request', () => {
    const wrapper = mountCalendar({ showNavigation: false, showWeekdays: false })

    expect(wrapper.find('.taqwim-calendar-nav-button').exists()).toBe(false)
    expect(wrapper.find('[data-taqwim-calendar-grid-head]').exists()).toBe(false)
  })

  it('selects a date through the v-model', async () => {
    const wrapper = mountCalendar()
    const day = wrapper
      .findAll('[data-taqwim-calendar-cell-trigger]')
      .find(trigger => trigger.attributes('data-outside-month') === undefined && trigger.text() === '10')!

    await day.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual({ hy: 1445, hm: 9, hd: 10 })
  })
})

describe('month and year picker', () => {
  const monthButton = (wrapper: ReturnType<typeof mountCalendar>) => wrapper.get('[data-taqwim-heading="month"]')
  const yearButton = (wrapper: ReturnType<typeof mountCalendar>) => wrapper.get('[data-taqwim-heading="year"]')

  const openMonthPicker = async (wrapper: ReturnType<typeof mountCalendar>) => {
    await monthButton(wrapper).trigger('click')
    return wrapper
  }

  it('shows the month and year as separate heading buttons', () => {
    const wrapper = mountCalendar()

    expect(monthButton(wrapper).text()).toBe('Ramadan')
    expect(yearButton(wrapper).text()).toBe('1445')
  })

  it('promotes the Gregorian date span while keeping Hijri picker controls available', () => {
    const wrapper = mountCalendar({ showGregorian: true, dateEmphasis: 'gregorian' })
    const primary = wrapper.get('.taqwim-calendar-heading-primary')
    const secondary = wrapper.get('.taqwim-calendar-heading-secondary')

    expect(primary.attributes('data-calendar-system')).toBe('gregorian')
    expect(primary.text()).toMatch(/March.*April.*2024/)
    expect(secondary.attributes('data-calendar-system')).toBe('hijri')
    expect(secondary.text()).toContain('Ramadan')
    expect(secondary.element.contains(monthButton(wrapper).element)).toBe(true)
  })

  it('opens the month grid from the month button', async () => {
    const wrapper = await openMonthPicker(mountCalendar())

    expect(wrapper.find('.taqwim-calendar-picker').exists()).toBe(true)
    expect(monthButton(wrapper).attributes('aria-expanded')).toBe('true')
  })

  it('opens the year grid from the year button', async () => {
    const wrapper = mountCalendar()
    await yearButton(wrapper).trigger('click')

    const years = wrapper.findAll('.taqwim-calendar-picker-grid button').map(button => Number(button.text()))

    expect(years[0]).toBe(1343)
    expect(years.at(-1)).toBe(1500)
  })

  it('stays closed when the heading is not selectable', async () => {
    const wrapper = mountCalendar({ selectableHeading: false })
    await wrapper.get('[data-taqwim-calendar-heading]').trigger('click')

    expect(wrapper.find('.taqwim-calendar-picker').exists()).toBe(false)
    expect(wrapper.find('[data-taqwim-heading]').exists()).toBe(false)
  })

  it('jumps to the chosen month', async () => {
    const wrapper = await openMonthPicker(mountCalendar())
    const buttons = wrapper.findAll('.taqwim-calendar-picker-grid button')

    // Rajab, the seventh month.
    await buttons[6].trigger('click')

    expect(wrapper.emitted('update:placeholder')?.at(-1)?.[0]).toEqual(expect.objectContaining({ hm: 7, hd: 1 }))
  })
})
