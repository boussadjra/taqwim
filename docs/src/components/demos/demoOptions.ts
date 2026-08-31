export const SIZE_OPTIONS = [
  { value: 'compact', label: 'Compact' },
  { value: 'default', label: 'Default' },
  { value: 'large', label: 'Large' },
] as const

export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
  { value: 'fr', label: 'French' },
] as const

export const DIRECTION_OPTIONS = [
  { value: 'ltr', label: 'Left to right' },
  { value: 'rtl', label: 'Right to left' },
] as const

export const DATE_EMPHASIS_OPTIONS = [
  { value: 'hijri', label: 'Hijri date' },
  { value: 'gregorian', label: 'Gregorian date' },
] as const

export const INPUT_DISPLAY_OPTIONS = [
  { value: 'hijri', label: 'Hijri date' },
  { value: 'gregorian', label: 'Gregorian date' },
  { value: 'both', label: 'Both dates' },
] as const

export function presetLabel(value: string): string {
  return value
    .split('-')
    .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ')
}
