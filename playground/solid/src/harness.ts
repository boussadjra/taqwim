/**
 * The query-string contract every playground's e2e harness implements.
 *
 * The shared spec drives all five adapters through one URL shape, so each
 * playground only has to turn these into props. Copied into each playground
 * rather than imported: the playgrounds are deliberately standalone apps, and
 * a shared runtime import would be one more thing that could differ between
 * them.
 */

export interface HarnessConfig {
  calendar: 'islamic-umalqura' | 'islamic-civil' | 'islamic-tbla'
  theme: string
  size: string
  locale: string
  dir: 'ltr' | 'rtl'
  weekStartsOn: number
  numberOfMonths: number
  fixedWeeks: boolean
  multiple: boolean
  preventDeselect: boolean
  disableDaysOutsideCurrentView: boolean
  disabled: boolean
  readonly: boolean
  initialFocus: boolean
  showGregorian: boolean
  dateEmphasis: 'hijri' | 'gregorian'
  gregorianLocale?: string
  placeholder?: { hy: number; hm: number; hd: number }
  value?: { hy: number; hm: number; hd: number }
  min?: { hy: number; hm: number; hd: number }
  max?: { hy: number; hm: number; hd: number }
}

export function parseDate(text: string | null) {
  if (!text) return undefined
  const [hy, hm, hd] = text.split('-').map(Number)
  return { hy, hm, hd }
}

export function readConfig(search: string): HarnessConfig {
  const params = new URLSearchParams(search)
  const calendar = params.get('calendar')
  const flag = (key: string) => params.get(key) === 'true' || params.get(key) === '1'
  const number = (key: string, fallback: number) => Number(params.get(key) ?? fallback)

  return {
    calendar: calendar === 'islamic-civil' || calendar === 'islamic-tbla' ? calendar : 'islamic-umalqura',
    theme: params.get('theme') ?? 'default',
    size: params.get('size') ?? 'default',
    locale: params.get('locale') ?? 'en',
    dir: params.get('dir') === 'rtl' ? 'rtl' : 'ltr',
    weekStartsOn: number('weekStartsOn', 0),
    numberOfMonths: number('numberOfMonths', 1),
    fixedWeeks: flag('fixedWeeks'),
    multiple: flag('multiple'),
    preventDeselect: flag('preventDeselect'),
    disableDaysOutsideCurrentView: flag('disableDaysOutsideCurrentView'),
    disabled: flag('disabled'),
    readonly: flag('readonly'),
    initialFocus: flag('initialFocus'),
    showGregorian: flag('showGregorian'),
    dateEmphasis: params.get('dateEmphasis') === 'gregorian' ? 'gregorian' : 'hijri',
    gregorianLocale: params.get('gregorianLocale') ?? undefined,
    placeholder: parseDate(params.get('placeholder')),
    value: parseDate(params.get('value')),
    min: parseDate(params.get('min')),
    max: parseDate(params.get('max')),
  }
}

/** How the harness reports the current selection back to the spec. */
export function formatSelection(value: unknown): string {
  const list = Array.isArray(value) ? value : value ? [value] : []
  return list
    .map(date => {
      const { hy, hm, hd } = date as { hy: number; hm: number; hd: number }
      return `${hy}-${String(hm).padStart(2, '0')}-${String(hd).padStart(2, '0')}`
    })
    .join(',')
}
