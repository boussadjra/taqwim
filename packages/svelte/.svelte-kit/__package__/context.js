import { getContext, setContext } from 'svelte'
const KEY = Symbol('taqwim-calendar')
export function setHijriCalendarContext(value) {
  setContext(KEY, value)
}
export function getHijriCalendarContext() {
  const context = getContext(KEY)
  if (!context) {
    throw new Error('Taqwim calendar parts must be rendered inside <HijriCalendarRoot>')
  }
  return context
}
