/**
 * Guards `astro dev` against stale linked `@taqwim/*` builds.
 *
 * The live examples import workspace packages by `dist/`. `vp` may replay a
 * cached build that predates a source change, and Vite's pre-bundle cache can
 * then keep serving the old module graph — Astro surfaces that as a generic
 * "Unable to render SolidCalendarDemo" SSR failure with no inner cause.
 */

import { createCalendar } from '@taqwim/calendar-core'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const reactEntry = fileURLToPath(new URL('../../packages/react/dist/index.js', import.meta.url))

const store = createCalendar({})
const day = store
  .getSnapshot()
  .months[0]?.weeks?.flatMap(week => week)
  .find(cell => cell && !cell.isOutsideMonth)

if (typeof store.getCellProps !== 'function') {
  throw new Error(
    [
      'Stale @taqwim/calendar-core build: store.getCellProps is missing.',
      'Rebuild the workspace, then restart docs:',
      '  vp run -F @taqwim/calendar-core -F @taqwim/react -F @taqwim/solid -F @taqwim/solid-styled build',
    ].join('\n'),
  )
}

if (!day) {
  throw new Error('Could not sample a calendar day while verifying @taqwim/calendar-core.')
}

const tooltip = store.getCellProps(day)['data-tooltip']
if (typeof tooltip !== 'string' || tooltip.length === 0) {
  throw new Error('Stale @taqwim/calendar-core build: getCellProps() did not return a tooltip label.')
}

const reactSource = readFileSync(reactEntry, 'utf8')
if (reactSource.includes('void state()')) {
  throw new Error(
    [
      'Stale @taqwim/react build: HijriCalendarCell still calls state() as a Solid accessor.',
      'Rebuild React, then restart docs:',
      '  vp run -F @taqwim/react -F @taqwim/react-styled build',
    ].join('\n'),
  )
}

// Resolve succeeds only when the styled entry exists on disk.
require.resolve('@taqwim/solid-styled')
