import { describe, it, expect, vi } from 'vitest'
import { createCalendar } from '../src/store'

const DAY = { hy: 1446, hm: 3, hd: 10 }
const OTHER_DAY = { hy: 1446, hm: 3, hd: 12 }

describe('selection', () => {
  it('selects a date', () => {
    const onValueChange = vi.fn()
    const store = createCalendar({ defaultPlaceholder: DAY, onValueChange })

    store.select(DAY)

    expect(store.getSnapshot().value).toEqual(DAY)
    expect(onValueChange).toHaveBeenCalledWith(DAY)
  })

  it('deselects when the same date is chosen again', () => {
    const store = createCalendar({ defaultPlaceholder: DAY, defaultValue: DAY })

    store.select(DAY)

    expect(store.getSnapshot().value).toBeUndefined()
  })

  it('keeps the selection when preventDeselect is set', () => {
    const store = createCalendar({ defaultPlaceholder: DAY, defaultValue: DAY, preventDeselect: true })

    store.select(DAY)

    expect(store.getSnapshot().value).toEqual(DAY)
  })

  describe('multiple', () => {
    it('accumulates dates', () => {
      const store = createCalendar({ defaultPlaceholder: DAY, multiple: true })

      store.select(DAY)
      store.select(OTHER_DAY)

      expect(store.getSnapshot().value).toEqual([DAY, OTHER_DAY])
    })

    it('removes a date that is selected again', () => {
      const store = createCalendar({ defaultPlaceholder: DAY, multiple: true })

      store.select(DAY)
      store.select(OTHER_DAY)
      store.select(DAY)

      expect(store.getSnapshot().value).toEqual([OTHER_DAY])
    })

    it('clears to undefined rather than an empty array', () => {
      const store = createCalendar({ defaultPlaceholder: DAY, multiple: true })

      store.select(DAY)
      store.select(DAY)

      expect(store.getSnapshot().value).toBeUndefined()
    })
  })

  describe('guards', () => {
    // Previously `isDateUnavailable` was only checked in the cell's click
    // handler, so keyboard and programmatic selection bypassed it.
    it('refuses unavailable dates', () => {
      const onValueChange = vi.fn()
      const store = createCalendar({
        defaultPlaceholder: DAY,
        isDateUnavailable: date => date.hd === 10,
        onValueChange,
      })

      store.select(DAY)

      expect(store.getSnapshot().value).toBeUndefined()
      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('refuses disabled dates', () => {
      const store = createCalendar({ defaultPlaceholder: DAY, isDateDisabled: date => date.hd === 10 })

      store.select(DAY)

      expect(store.getSnapshot().value).toBeUndefined()
    })

    it('refuses everything when readonly', () => {
      const store = createCalendar({ defaultPlaceholder: DAY, readonly: true })

      store.select(DAY)

      expect(store.getSnapshot().value).toBeUndefined()
    })

    it('refuses everything when disabled', () => {
      const store = createCalendar({ defaultPlaceholder: DAY, disabled: true })

      store.select(DAY)

      expect(store.getSnapshot().value).toBeUndefined()
    })
  })

  describe('minValue and maxValue', () => {
    // Previously these gated only the prev/next buttons; out-of-range days
    // stayed fully selectable and `isInvalid` was hardcoded to false.
    it('disables days before minValue', () => {
      const store = createCalendar({ defaultPlaceholder: DAY, minValue: DAY })
      const days = store.getSnapshot().months[0].weeks.flat()

      expect(days.find(d => d.date.hd === 9 && !d.isOutsideMonth)?.isDisabled).toBe(true)
      expect(days.find(d => d.date.hd === 10 && !d.isOutsideMonth)?.isDisabled).toBe(false)
    })

    it('disables days after maxValue', () => {
      const store = createCalendar({ defaultPlaceholder: DAY, maxValue: DAY })
      const days = store.getSnapshot().months[0].weeks.flat()

      expect(days.find(d => d.date.hd === 11 && !d.isOutsideMonth)?.isDisabled).toBe(true)
      expect(days.find(d => d.date.hd === 10 && !d.isOutsideMonth)?.isDisabled).toBe(false)
    })

    it('refuses to select an out-of-range date', () => {
      const store = createCalendar({ defaultPlaceholder: DAY, minValue: DAY })

      store.select({ hy: 1446, hm: 3, hd: 9 })

      expect(store.getSnapshot().value).toBeUndefined()
    })

    it('reports isInvalid for a value outside the range', () => {
      const inRange = createCalendar({ defaultPlaceholder: DAY, value: DAY, minValue: DAY })
      expect(inRange.getSnapshot().isInvalid).toBe(false)

      const outOfRange = createCalendar({ defaultPlaceholder: DAY, value: { hy: 1446, hm: 3, hd: 9 }, minValue: DAY })
      expect(outOfRange.getSnapshot().isInvalid).toBe(true)
    })
  })

  describe('disableDaysOutsideCurrentView', () => {
    it('disables adjacent-month days when enabled', () => {
      const store = createCalendar({
        defaultPlaceholder: DAY,
        fixedWeeks: true,
        disableDaysOutsideCurrentView: true,
      })
      const outside = store
        .getSnapshot()
        .months[0].weeks.flat()
        .filter(d => d.isOutsideMonth)

      expect(outside.length).toBeGreaterThan(0)
      expect(outside.every(d => d.isDisabled)).toBe(true)
    })

    it('leaves them enabled by default', () => {
      const store = createCalendar({ defaultPlaceholder: DAY, fixedWeeks: true })
      const outside = store
        .getSnapshot()
        .months[0].weeks.flat()
        .filter(d => d.isOutsideMonth)

      expect(outside.every(d => !d.isDisabled)).toBe(true)
    })
  })

  it('marks the selected day in the grid', () => {
    const store = createCalendar({ defaultPlaceholder: DAY, defaultValue: DAY })
    const selected = store
      .getSnapshot()
      .months[0].weeks.flat()
      .filter(d => d.isSelected)

    expect(selected).toHaveLength(1)
    expect(selected[0].date).toEqual(DAY)
  })
})
