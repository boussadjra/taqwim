import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, ref } from 'vue'
import { HijriCalendarRoot, injectHijriCalendarRootContext } from '../src/HijriCalendar'

// Mock taqwim-core-utils
vi.mock('taqwim-core-utils', () => ({
  toHijri: vi.fn(() => ({ hy: 1446, hm: 1, hd: 15 })),
  formatHijriDate: vi.fn((date, format) => {
    if (format === 'iD') return date.hd.toString()
    if (format === 'iYYYY-iMM-iDD')
      return `${date.hy}-${date.hm.toString().padStart(2, '0')}-${date.hd.toString().padStart(2, '0')}`
    if (format === 'iEEEE, iDD iMMMM iYYYY') return `الاثنين، ${date.hd} محرم ${date.hy}`
    if (format === 'iMMM iYYYY') return `محرم ${date.hy}`
    return ''
  }),
  isEqual: vi.fn((a, b) => a.hy === b.hy && a.hm === b.hm && a.hd === b.hd),
  getDaysLengthInMonth: vi.fn(() => 30),
  getDayInWeek: vi.fn(() => 1),
  getMonthAdjacentDays: vi.fn(() => ({
    prevMonthDays: [],
    nextMonthDays: [],
  })),
  addHijriMonths: vi.fn((date, months) => ({ ...date, hm: date.hm + months })),
  subHijriMonths: vi.fn((date, months) => ({ ...date, hm: date.hm - months })),
  getLocaleData: vi.fn(() => ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']),
}))

describe('HijriCalendarRoot', () => {
  const defaultProps = {
    locale: 'ar',
    weekStartsOn: 0 as const,
    weekdayFormat: 'weekDaysMedium' as const,
    fixedWeeks: false,
    multiple: false,
    numberOfMonths: 1,
    disabled: false,
    readonly: false,
    initialFocus: false,
    pagedNavigation: false,
    preventDeselect: false,
    disableDaysOutsideCurrentView: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly with default props', () => {
    const wrapper = mount(HijriCalendarRoot, {
      props: defaultProps,
      slots: {
        default: ({ grid, weekDays }) =>
          h('div', { 'data-testid': 'calendar-content' }, [
            h('div', { 'data-testid': 'weekdays' }, weekDays.join(',')),
            h('div', { 'data-testid': 'grid' }, String(grid.length)),
          ]),
      },
    })

    expect(wrapper.find('[data-testid="calendar-content"]').exists()).toBe(true)
    expect(wrapper.find('[role="application"]').exists()).toBe(true)
  })

  it('sets the correct aria-label', () => {
    const wrapper = mount(HijriCalendarRoot, {
      props: {
        ...defaultProps,
        calendarLabel: 'Custom Calendar',
      },
      slots: {
        default: () => '<div>Calendar Content</div>',
      },
    })

    const applicationElement = wrapper.find('[role="application"]')
    expect(applicationElement.attributes('aria-label')).toContain('Custom Calendar')
  })

  it('handles modelValue updates correctly', async () => {
    const modelValue = ref()
    const onUpdate = vi.fn()

    const wrapper = mount(HijriCalendarRoot, {
      props: {
        ...defaultProps,
        modelValue: modelValue.value,
        'onUpdate:modelValue': onUpdate,
      },
      slots: {
        default: () => '<div>Calendar Content</div>',
      },
    })

    // Simulate date selection
    const component = wrapper.vm as any
    component.onDateChange({ hy: 1446, hm: 1, hd: 20 })

    expect(onUpdate).toHaveBeenCalledWith({ hy: 1446, hm: 1, hd: 20 })
  })

  it('handles multiple date selection when multiple=true', async () => {
    const modelValue = ref([])
    const onUpdate = vi.fn()

    const wrapper = mount(HijriCalendarRoot, {
      props: {
        ...defaultProps,
        multiple: true,
        modelValue: modelValue.value,
        'onUpdate:modelValue': onUpdate,
      },
      slots: {
        default: () => '<div>Calendar Content</div>',
      },
    })

    const component = wrapper.vm as any
    component.onDateChange({ hy: 1446, hm: 1, hd: 20 })

    expect(onUpdate).toHaveBeenCalledWith([{ hy: 1446, hm: 1, hd: 20 }])
  })

  it('prevents deselection when preventDeselect=true', async () => {
    const modelValue = ref({ hy: 1446, hm: 1, hd: 20 })
    const onUpdate = vi.fn()

    const wrapper = mount(HijriCalendarRoot, {
      props: {
        ...defaultProps,
        preventDeselect: true,
        modelValue: modelValue.value,
        'onUpdate:modelValue': onUpdate,
      },
      slots: {
        default: () => '<div>Calendar Content</div>',
      },
    })

    const component = wrapper.vm as any
    // Try to click the same date again
    component.onDateChange({ hy: 1446, hm: 1, hd: 20 })

    // Should update to the same date, not deselect
    expect(onUpdate).toHaveBeenCalledWith({ hy: 1446, hm: 1, hd: 20 })
  })

  it('applies disabled state correctly', () => {
    const wrapper = mount(HijriCalendarRoot, {
      props: {
        ...defaultProps,
        disabled: true,
      },
      slots: {
        default: () => '<div>Calendar Content</div>',
      },
    })

    expect(wrapper.find('[data-disabled]').exists()).toBe(true)
  })

  it('applies readonly state correctly', () => {
    const wrapper = mount(HijriCalendarRoot, {
      props: {
        ...defaultProps,
        readonly: true,
      },
      slots: {
        default: () => '<div>Calendar Content</div>',
      },
    })

    expect(wrapper.find('[data-readonly]').exists()).toBe(true)
  })

  it('handles placeholder changes correctly', async () => {
    const placeholder = ref({ hy: 1446, hm: 1, hd: 15 })
    const onPlaceholderUpdate = vi.fn()

    const wrapper = mount(HijriCalendarRoot, {
      props: {
        ...defaultProps,
        placeholder: placeholder.value,
        'onUpdate:placeholder': onPlaceholderUpdate,
      },
      slots: {
        default: () => '<div>Calendar Content</div>',
      },
    })

    const component = wrapper.vm as any
    component.onPlaceholderChange({ hy: 1446, hm: 2, hd: 1 })

    expect(onPlaceholderUpdate).toHaveBeenCalledWith({ hy: 1446, hm: 2, hd: 1 })
  })

  it('supports RTL direction', () => {
    const wrapper = mount(HijriCalendarRoot, {
      props: {
        ...defaultProps,
        dir: 'rtl',
      },
      slots: {
        default: () => '<div>Calendar Content</div>',
      },
    })

    expect(wrapper.find('[dir="rtl"]').exists()).toBe(true)
  })

  it('handles date disabled function correctly', () => {
    const isDateDisabled = vi.fn(() => true)

    const wrapper = mount(HijriCalendarRoot, {
      props: {
        ...defaultProps,
        isDateDisabled,
      },
      slots: {
        default: () => '<div>Calendar Content</div>',
      },
    })

    const component = wrapper.vm as any
    const result = component.isDateDisabled({ hy: 1446, hm: 1, hd: 20 })

    expect(isDateDisabled).toHaveBeenCalledWith({ hy: 1446, hm: 1, hd: 20 })
    expect(result).toBe(true)
  })

  it('handles date unavailable function correctly', () => {
    const isDateUnavailable = vi.fn(() => true)

    const wrapper = mount(HijriCalendarRoot, {
      props: {
        ...defaultProps,
        isDateUnavailable,
      },
      slots: {
        default: () => '<div>Calendar Content</div>',
      },
    })

    const component = wrapper.vm as any
    const result = component.isDateUnavailable({ hy: 1446, hm: 1, hd: 20 })

    expect(isDateUnavailable).toHaveBeenCalledWith({ hy: 1446, hm: 1, hd: 20 })
    expect(result).toBe(true)
  })

  it('provides correct context to children', () => {
    let receivedContext: any

    const ChildComponent = {
      setup() {
        receivedContext = injectHijriCalendarRootContext()
        return () => h('div', 'Child')
      },
    }

    mount(HijriCalendarRoot, {
      props: defaultProps,
      slots: {
        default: () => h(ChildComponent),
      },
    })

    expect(receivedContext).toBeDefined()
    expect(receivedContext.locale).toBeDefined()
    expect(receivedContext.grid).toBeDefined()
    expect(receivedContext.weekDays).toBeDefined()
  })
})
