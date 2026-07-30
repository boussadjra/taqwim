import type { ReactNode } from 'react'

const shared = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 1.5,
} as const

/*
 * The chevrons always point "back" and "forward" in reading order — the
 * stylesheet mirrors them under `dir="rtl"` rather than the components
 * swapping, so a custom icon inherits the same behaviour.
 */

export function ArrowLeft(): ReactNode {
  return (
    <svg {...shared} aria-hidden="true">
      <path d="m15 5l-6 7l6 7" />
    </svg>
  )
}

export function ArrowRight(): ReactNode {
  return (
    <svg {...shared} aria-hidden="true">
      <path d="m9 5l6 7l-6 7" />
    </svg>
  )
}
