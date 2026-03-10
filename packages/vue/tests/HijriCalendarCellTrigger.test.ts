import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { ref } from 'vue'
import { HijriCalendarCellTrigger } from '../src/HijriCalendar'

// Mock the context injection
const mockContext = {
  locale: ref('ar'),
  disabled: ref(false),
  isDateSelected: vi.fn(() => false),
  isDateDisabled: vi.fn(() => false),
  isDateUnavailable: vi.fn(() => false),
  isOutsideVisibleView: vi.fn(() => false),
  disableDaysOutsideCurrentView: ref(false),
  onDateChange: vi.fn(),
}

vi.mock('../src/HijriCalendar/HijriCalendarRoot.vue', () => ({
  injectHijriCalendarRootContext: () => mockContext,
}))

// Mock taqwim-core-utils
vi.mock('taqwim-core-utils', () => ({
  toHijri: vi.fn(() => ({ hy: 1446, hm: 1, hd: 15 })),
  formatHijriDate: vi.fn((date, format) => {
    if (format === 'iD') return date.hd.toString()
    if (format === 'iYYYY-iMM-iDD')
      return `${date.hy}-${date.hm.toString().padStart(2, '0')}-${date.hd.toString().padStart(2, '0')}`
    if (format === 'iEEEE, iDD iMMMM iYYYY') return `الاثنين، ${date.hd} محرم ${date.hy}`
    return ''
  }),
  isEqual: vi.fn((a, b) => a.hy === b.hy && a.hm === b.hm && a.hd === b.hd),
}))

describe('HijriCalendarCellTrigger', () => {
  const defaultProps = {
    day: { hy: 1446, hm: 1, hd: 20 },
    month: { hy: 1446, hm: 1, hd: 1 },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset mock context to defaults
    mockContext.disabled.value = false
    mockContext.isDateSelected.mockReturnValue(false)
    mockContext.isDateDisabled.mockReturnValue(false)
    mockContext.isDateUnavailable.mockReturnValue(false)
    mockContext.isOutsideVisibleView.mockReturnValue(false)
    mockContext.disableDaysOutsideCurrentView.value = false
  })

  it('renders correctly with default props', () => {
    const wrapper = mount(HijriCalendarCellTrigger, {
      props: defaultProps,
    })

    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').attributes('role')).toBe('button')
    expect(wrapper.text()).toBe('20') // day value
  })

  it('applies correct data attributes', () => {
    const wrapper = mount(HijriCalendarCellTrigger, {
      props: defaultProps,
    })

    const button = wrapper.find('button')
    expect(button.attributes('data-value')).toBe('1446-01-20')
    expect(button.attributes('data-reka-calendar-cell-trigger')).toBe('')
  })

  it('shows selected state correctly', () => {
    mockContext.isDateSelected.mockReturnValue(true)

    const wrapper = mount(HijriCalendarCellTrigger, {
      props: defaultProps,
    })

    const button = wrapper.find('button')
    expect(button.attributes('data-selected')).toBe('')
    expect(button.attributes('aria-selected')).toBe('true')
  })

  it('shows disabled state correctly', () => {
    mockContext.isDateDisabled.mockReturnValue(true)

    const wrapper = mount(HijriCalendarCellTrigger, {
      props: defaultProps,
    })

    const button = wrapper.find('button')
    expect(button.attributes('data-disabled')).toBe('')
    expect(button.attributes('aria-disabled')).toBe('true')
    expect(button.attributes('tabindex')).toBe('-1')
  })

  it('shows unavailable state correctly', () => {
    mockContext.isDateUnavailable.mockReturnValue(true)

    const wrapper = mount(HijriCalendarCellTrigger, {
      props: defaultProps,
    })

    const button = wrapper.find('button')
    expect(button.attributes('data-unavailable')).toBe('')
    expect(button.attributes('aria-disabled')).toBe('true')
  })

  it('shows today state correctly', () => {
    // Mock toHijri to return the same date as props.day
    const { toHijri } = require('taqwim-core-utils')
    toHijri.mockReturnValue({ hy: 1446, hm: 1, hd: 20 })

    const wrapper = mount(HijriCalendarCellTrigger, {
      props: defaultProps,
    })

    const button = wrapper.find('button')
    expect(button.attributes('data-today')).toBe('')
  })

  it('shows outside view state correctly', () => {
    mockContext.isOutsideVisibleView.mockReturnValue(true)

    const wrapper = mount(HijriCalendarCellTrigger, {
      props: defaultProps,
    })

    const button = wrapper.find('button')
    expect(button.attributes('data-outside-view')).toBe('')
  })

  it('shows outside visible view state correctly', () => {
    const wrapper = mount(HijriCalendarCellTrigger, {
      props: {
        day: { hy: 1446, hm: 2, hd: 1 }, // Different month
        month: { hy: 1446, hm: 1, hd: 1 },
      },
    })

    const button = wrapper.find('button')
    expect(button.attributes('data-outside-visible-view')).toBe('')
  })

  it('handles click events correctly', async () => {
    const wrapper = mount(HijriCalendarCellTrigger, {
      props: defaultProps,
    })

    await wrapper.find('button').trigger('click')

    expect(mockContext.onDateChange).toHaveBeenCalledWith(defaultProps.day)
  })

  it('prevents click when disabled', async () => {
    mockContext.isDateDisabled.mockReturnValue(true)

    const wrapper = mount(HijriCalendarCellTrigger, {
      props: defaultProps,
    })

    await wrapper.find('button').trigger('click')

    expect(mockContext.onDateChange).not.toHaveBeenCalled()
  })

  it('prevents click when unavailable', async () => {
    mockContext.isDateUnavailable.mockReturnValue(true)

    const wrapper = mount(HijriCalendarCellTrigger, {
      props: defaultProps,
    })

    await wrapper.find('button').trigger('click')

    expect(mockContext.onDateChange).not.toHaveBeenCalled()
  })

  it('renders custom slot content correctly', () => {
    const wrapper = mount(HijriCalendarCellTrigger, {
      props: defaultProps,
      slots: {
        default: ({ dayValue, selected, disabled }) =>
          `<span class="custom">${dayValue} ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}</span>`,
      },
    })

    expect(wrapper.find('.custom').exists()).toBe(true)
    expect(wrapper.text()).toContain('20')
  })

  it('provides correct slot props', () => {
    let slotProps: any

    mount(HijriCalendarCellTrigger, {
      props: defaultProps,
      slots: {
        default: (props: any) => {
          slotProps = props
          return `<span>${props.dayValue}</span>`
        },
      },
    })

    expect(slotProps).toBeDefined()
    expect(slotProps.dayValue).toBe('20')
    expect(slotProps.disabled).toBe(false)
    expect(slotProps.selected).toBe(false)
    expect(slotProps.today).toBeDefined()
    expect(slotProps.outsideView).toBe(false)
    expect(slotProps.outsideVisibleView).toBe(false)
    expect(slotProps.unavailable).toBe(false)
  })

  it('applies correct aria-label', () => {
    const wrapper = mount(HijriCalendarCellTrigger, {
      props: defaultProps,
    })

    const button = wrapper.find('button')
    expect(button.attributes('aria-label')).toBe('الاثنين، 20 محرم 1446')
  })

  it('handles disabled from context correctly', () => {
    mockContext.disabled.value = true

    const wrapper = mount(HijriCalendarCellTrigger, {
      props: defaultProps,
    })

    const button = wrapper.find('button')
    expect(button.attributes('data-disabled')).toBe('')
    expect(button.attributes('tabindex')).toBe('-1')
  })

  it('handles outside view disabled correctly', () => {
    mockContext.disableDaysOutsideCurrentView.value = true
    mockContext.isOutsideVisibleView.mockReturnValue(true)

    const wrapper = mount(HijriCalendarCellTrigger, {
      props: defaultProps,
    })

    const button = wrapper.find('button')
    expect(button.attributes('data-disabled')).toBe('')
  })
})
