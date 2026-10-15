import { afterEach, describe, expect, it, vi } from 'vitest'
import { toHijri } from '@taqwim/core'
import { islamicCivil } from '@taqwim/core/calendars/islamic-civil'
import { todayHijri } from '../src/dateUtils'

afterEach(() => vi.useRealTimers())

describe('todayHijri', () => {
  it.each([0, 1, 42, 99])('preserves local Gregorian year %i for a proleptic strategy', year => {
    const today = new Date(0)
    today.setFullYear(year, 1, 28)
    today.setHours(13, 30, 0, 0)
    vi.useFakeTimers()
    vi.setSystemTime(today)
    expect(todayHijri(islamicCivil)).toEqual(toHijri(today, { calendarSystem: islamicCivil }))
  })
})
