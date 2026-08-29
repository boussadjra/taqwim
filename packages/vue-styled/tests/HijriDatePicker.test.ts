import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import HijriDatePicker from '../src/HijriDatePicker.vue'

const RAMADAN_1445 = { hy: 1445, hm: 9, hd: 1 }

const mountPicker = (props: Record<string, unknown> = {}) => mount(HijriDatePicker, { props, attachTo: document.body })

describe('input', () => {
  it('renders the model value in the configured format', () => {
    const input = mountPicker({ modelValue: RAMADAN_1445 }).get('input')

    expect(input.element.value).toBe('1445-09-01')
  })

  it('honours a custom format', () => {
    const input = mountPicker({ modelValue: RAMADAN_1445, format: 'iD iMMMM iYYYY' }).get('input')

    expect(input.element.value).toContain('Ramadan')
  })

  it('describes itself to assistive technology', () => {
    const input = mountPicker({ label: 'Appointment' }).get('input')

    expect(input.attributes('role')).toBe('combobox')
    expect(input.attributes('aria-label')).toBe('Appointment')
    expect(input.attributes('aria-expanded')).toBe('false')
  })
})

describe('parsing typed input', () => {
  it.each([
    ['1446-03-15', { hy: 1446, hm: 3, hd: 15 }],
    ['1446/03/15', { hy: 1446, hm: 3, hd: 15 }],
    ['15-03-1446', { hy: 1446, hm: 3, hd: 15 }],
    ['15/3/1446', { hy: 1446, hm: 3, hd: 15 }],
  ])('accepts %s', async (text, expected) => {
    const wrapper = mountPicker()
    const input = wrapper.get('input')

    await input.setValue(text)
    await input.trigger('change')

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual(expected)
  })

  it('reverts unparseable text rather than clearing the selection', async () => {
    const wrapper = mountPicker({ modelValue: RAMADAN_1445 })
    const input = wrapper.get('input')

    // `setValue` fires `change` itself, so no separate trigger is needed —
    // committing twice would just re-commit the already-reverted text.
    await input.setValue('not a date')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(input.element.value).toBe('1445-09-01')
  })

  it('rejects dates outside the Hijri calendar', async () => {
    const wrapper = mountPicker()
    const input = wrapper.get('input')

    await input.setValue('1446-13-01')
    await input.trigger('change')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('clears the selection on an empty input', async () => {
    const wrapper = mountPicker({ modelValue: RAMADAN_1445 })
    const input = wrapper.get('input')

    await input.setValue('')
    await input.trigger('change')

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBeUndefined()
  })

  it('is read-only when editing is disabled', () => {
    expect(mountPicker({ editable: false }).get('input').attributes('readonly')).toBeDefined()
  })
})

describe('popover', () => {
  it('opens on focus and shows a calendar', async () => {
    const wrapper = mountPicker()
    await wrapper.get('input').trigger('focus')

    expect(wrapper.get('input').attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('[data-taqwim-calendar]').exists()).toBe(true)
  })

  /*
   * Vue treats optional boolean props as `false` unless `withDefaults` says
   * otherwise. The picker used to forward that into HijriCalendar, so the
   * popover opened with no chevrons and a static heading.
   */
  it('shows paging and month/year heading buttons', async () => {
    const wrapper = mountPicker({ defaultPlaceholder: RAMADAN_1445 })
    await wrapper.get('input').trigger('focus')

    expect(wrapper.find('[aria-label="Previous page"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="Next page"]').exists()).toBe(true)
    expect(wrapper.get('[data-taqwim-heading="month"]').text()).toBe('Ramadan')
    expect(wrapper.get('[data-taqwim-heading="year"]').text()).toBe('1445')
  })

  it('does not open while disabled', async () => {
    const wrapper = mountPicker({ disabled: true })
    await wrapper.get('input').trigger('focus')

    expect(wrapper.find('[data-taqwim-calendar]').exists()).toBe(false)
  })

  it('closes on Escape', async () => {
    const wrapper = mountPicker()
    await wrapper.get('input').trigger('focus')
    await wrapper.get('.taqwim-datepicker').trigger('keydown', { key: 'Escape' })

    expect(wrapper.find('[data-taqwim-calendar]').exists()).toBe(false)
  })

  it('closes after picking a date', async () => {
    const wrapper = mountPicker({ defaultPlaceholder: RAMADAN_1445 })
    await wrapper.get('input').trigger('focus')

    const day = wrapper
      .findAll('[data-taqwim-calendar-cell-trigger]')
      .find(trigger => trigger.attributes('data-outside-month') === undefined && trigger.text() === '9')!
    await day.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual({ hy: 1445, hm: 9, hd: 9 })
    expect(wrapper.find('[data-taqwim-calendar]').exists()).toBe(false)
  })

  /*
   * The picker used to accept `multiple` and stay open in it, keeping only
   * `value[0]` — so a second pick silently kept the first date. React, Svelte
   * and Solid all omit `multiple` from their picker's props; Vue now does too,
   * and this pins the single-select contract the four share.
   */
  it('replaces the selection rather than accumulating one', async () => {
    const wrapper = mountPicker({ defaultPlaceholder: RAMADAN_1445 })

    const pick = async (text: string) => {
      await wrapper.get('input').trigger('focus')
      const day = wrapper
        .findAll('[data-taqwim-calendar-cell-trigger]')
        .find(trigger => trigger.attributes('data-outside-month') === undefined && trigger.text() === text)!
      await day.trigger('click')
    }

    await pick('9')
    await pick('12')

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual({ hy: 1445, hm: 9, hd: 12 })
  })

  it('pages months without closing the popover', async () => {
    const wrapper = mountPicker({ defaultPlaceholder: RAMADAN_1445 })
    await wrapper.get('input').trigger('focus')

    const start = wrapper.get('[data-taqwim-heading="month"]').text()
    await wrapper.get('[aria-label="Next page"]').trigger('click')

    expect(wrapper.find('[data-taqwim-calendar]').exists()).toBe(true)
    expect(wrapper.get('[data-taqwim-heading="month"]').text()).not.toBe(start)

    await wrapper.get('[aria-label="Previous page"]').trigger('click')

    expect(wrapper.get('[data-taqwim-heading="month"]').text()).toBe(start)
  })

  it('does not close when a focused cell unmounts', async () => {
    const wrapper = mountPicker({ defaultPlaceholder: RAMADAN_1445 })
    await wrapper.get('input').trigger('focus')

    // A month page removes the focused cell; the browser then fires focusout
    // with relatedTarget null. That used to dismiss the popover.
    await wrapper.get('.taqwim-datepicker').trigger('focusout', { relatedTarget: null })

    expect(wrapper.find('[data-taqwim-calendar]').exists()).toBe(true)
  })

  it('closes when focus moves outside', async () => {
    const wrapper = mountPicker()
    await wrapper.get('input').trigger('focus')

    const outside = document.createElement('button')
    document.body.append(outside)
    await wrapper.get('.taqwim-datepicker').trigger('focusout', { relatedTarget: outside })
    outside.remove()

    expect(wrapper.find('[data-taqwim-calendar]').exists()).toBe(false)
  })

  it('opens month and year pickers from the heading', async () => {
    const wrapper = mountPicker({ defaultPlaceholder: RAMADAN_1445 })
    await wrapper.get('input').trigger('focus')

    await wrapper.get('[data-taqwim-heading="month"]').trigger('click')
    expect(wrapper.find('.taqwim-calendar-picker').exists()).toBe(true)

    await wrapper.get('[data-taqwim-heading="year"]').trigger('click')
    expect(wrapper.get('[data-taqwim-heading="year"]').attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('[data-taqwim-calendar]').exists()).toBe(true)
  })
})
