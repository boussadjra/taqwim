import type { JSX } from 'solid-js'

/*
 * The chevrons always point "back" and "forward" in reading order — the
 * stylesheet mirrors them under `dir="rtl"` rather than the components
 * swapping, so a custom icon inherits the same behaviour.
 */

export function ArrowLeft(): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
      aria-hidden="true"
    >
      <path d="m15 5l-6 7l6 7" />
    </svg>
  )
}

export function ArrowRight(): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
      aria-hidden="true"
    >
      <path d="m9 5l6 7l-6 7" />
    </svg>
  )
}
