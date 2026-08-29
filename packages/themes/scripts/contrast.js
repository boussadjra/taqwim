/**
 * WCAG contrast audit for the bundled themes.
 *
 * `core.css` decides which token is painted on which surface; this file encodes
 * those pairings and measures them. It exists because the end-to-end suite runs
 * axe against the `default` theme only — twelve themes shipped unverified, and
 * eleven of them had failures.
 *
 * Two rules make the numbers trustworthy:
 *
 *   - Worst case, not average case. A theme is only as legible as the worst
 *     point of its gradient, so `parseColorSamples` walks the whole sweep.
 *   - Surfaces are composited bottom-up before anything is measured. Several
 *     themes set translucent tokens (`--muted: rgb(0 61 130 / 0.6)`), and
 *     judging text against the raw declared value is simply wrong.
 */

import { composite, contrastRatio, formatColor, parseColorSamples } from './color.js'
import { parseThemeBlock, parseTokens } from './tokens.js'

/** @typedef {import('./color.js').Rgba} Rgba */

/**
 * @typedef {object} ContrastPair
 * @property {string} id
 * @property {string} description
 * @property {string} rule            the selector in core.css this comes from
 * @property {string} foreground      token name, prefix stripped
 * @property {string[]} surface       layer stack, bottom first
 * @property {number} minimum         4.5 for text, 3 for non-text (WCAG 1.4.11)
 */

/**
 * Every text-on-surface pairing `core.css` produces.
 *
 * The surface stacks matter as much as the tokens. A nav button is
 * `secondary` painted on the header's `muted`, which is itself painted on the
 * calendar's `background` — measuring it against `background` alone would pass
 * things that are unreadable in the header.
 *
 * @type {ContrastPair[]}
 */
export const PAIRS = [
  {
    id: 'calendar-text',
    description: 'day numbers (foreground on the calendar surface)',
    rule: '[data-taqwim-calendar]',
    foreground: 'foreground',
    surface: ['background'],
    minimum: 4.5,
  },
  {
    id: 'heading',
    description: 'month heading (foreground on the header)',
    rule: '.taqwim-calendar-heading',
    foreground: 'foreground',
    surface: ['background', 'muted'],
    minimum: 4.5,
  },
  {
    id: 'weekday-label',
    description: 'weekday label (muted-foreground on the calendar surface)',
    rule: '.taqwim-calendar-weekday',
    foreground: 'muted-foreground',
    surface: ['background'],
    minimum: 4.5,
  },
  {
    id: 'secondary-date',
    description: 'secondary date in a dual-date cell (secondary-date-color on the calendar surface)',
    rule: '.taqwim-calendar-cell-secondary',
    foreground: 'secondary-date-color',
    surface: ['background'],
    minimum: 4.5,
  },
  {
    id: 'outside-month',
    description: 'adjacent-month day (outside-month on the calendar surface)',
    rule: '[data-taqwim-calendar-cell-trigger][data-outside-month]',
    foreground: 'outside-month',
    surface: ['background'],
    minimum: 4.5,
  },
  {
    id: 'unavailable',
    description: 'unavailable day (unavailable on the calendar surface)',
    rule: '[data-taqwim-calendar-cell-trigger][data-unavailable]',
    foreground: 'unavailable',
    surface: ['background'],
    minimum: 4.5,
  },
  {
    id: 'nav-button',
    description: 'navigation button (secondary-foreground on secondary, in the header)',
    rule: '.taqwim-calendar-nav-button',
    foreground: 'secondary-foreground',
    surface: ['background', 'muted', 'secondary'],
    minimum: 4.5,
  },
  {
    id: 'nav-button-hover',
    description: 'navigation button, hovered (foreground on secondary-hover)',
    rule: '.taqwim-calendar-nav-button:hover',
    foreground: 'foreground',
    surface: ['background', 'muted', 'secondary-hover'],
    minimum: 4.5,
  },
  {
    id: 'heading-button-hover',
    description: 'month/year heading button, hovered (foreground on secondary-hover, in the header)',
    rule: '.taqwim-calendar-heading-button:hover',
    foreground: 'foreground',
    surface: ['background', 'muted', 'secondary-hover'],
    minimum: 4.5,
  },
  {
    id: 'heading-button-open',
    description: 'month/year heading button, expanded (secondary-foreground on secondary, in the header)',
    rule: '.taqwim-calendar-heading-button[aria-expanded="true"]',
    foreground: 'secondary-foreground',
    surface: ['background', 'muted', 'secondary'],
    minimum: 4.5,
  },
  {
    id: 'selected-cell',
    description: 'selected day (selected-foreground on selected)',
    rule: '[data-taqwim-calendar-cell-trigger][data-selected]',
    foreground: 'selected-foreground',
    surface: ['background', 'selected'],
    minimum: 4.5,
  },
  {
    id: 'selected-cell-hover',
    // `:hover` overrides only the background; the text colour stays put.
    description: 'selected day, hovered (selected-foreground on selected-hover)',
    rule: '[data-taqwim-calendar-cell-trigger][data-selected]:hover',
    foreground: 'selected-foreground',
    surface: ['background', 'selected-hover'],
    minimum: 4.5,
  },
  {
    id: 'today-cell',
    description: 'today (today-foreground on today)',
    rule: '[data-taqwim-calendar-cell-trigger][data-today]',
    foreground: 'today-foreground',
    surface: ['background', 'today'],
    minimum: 4.5,
  },
  {
    id: 'cell-hover',
    description: 'hovered day (foreground on hover)',
    rule: '[data-taqwim-calendar-cell-trigger]:hover',
    foreground: 'foreground',
    surface: ['background', 'hover'],
    minimum: 4.5,
  },
  {
    id: 'day-cell-tooltip',
    description: 'day cell tooltip (tooltip-foreground on tooltip-background)',
    rule: '[data-taqwim-calendar-cell][data-tooltip]::after',
    foreground: 'tooltip-foreground',
    surface: ['tooltip-background'],
    minimum: 4.5,
  },
  {
    id: 'focus-ring',
    // Non-text contrast: WCAG 1.4.11 asks for 3:1 on a focus indicator.
    description: 'focus ring (focus-ring-color against the calendar surface)',
    rule: '[data-taqwim-calendar-cell-trigger]:focus-visible',
    foreground: 'focus-ring-color',
    surface: ['background'],
    minimum: 3,
  },
]

/**
 * Foregrounds in `core.css` that are deliberately not audited.
 *
 * `disabled` is the only one. `core.css` also fades disabled cells with
 * `opacity: 0.5`, and WCAG 1.4.3 exempts inactive user-interface components —
 * enforcing a ratio here would mandate a misleadingly prominent colour for a
 * day you cannot pick.
 */
export const UNAUDITED_FOREGROUNDS = new Set(['disabled'])

/**
 * Pairs excused from the audit, each with the reason it cannot be measured.
 *
 * Only `minimal` qualifies: it sets `background: transparent`,
 * `foreground: inherit` and `primary: currentcolor` on purpose, so the host
 * page supplies the colours and its contrast is the host's responsibility.
 * Every other theme must resolve statically — see `auditTheme`, where an
 * unresolvable value in a non-exempt theme is a failure rather than a skip.
 *
 * @type {Record<string, string>}
 */
export const EXEMPTIONS = Object.fromEntries(
  PAIRS.map(pair => [
    `minimal:${pair.id}`,
    'minimal inherits the host page surface by design, so its contrast is the host’s to check',
  ]),
)

/**
 * Resolves a token to its declared value, following `var()` indirection.
 *
 * `variables.css` derives most state colours (`--selected: var(--primary)`),
 * which is why a theme can set three tokens and restyle ten.
 *
 * @param {string} name token name, prefix stripped
 * @param {Record<string, string>} theme
 * @param {Record<string, string>} defaults
 * @param {Set<string>} [seen] cycle guard
 * @returns {string | null}
 */
export function resolveToken(name, theme, defaults, seen = new Set()) {
  if (seen.has(name)) return null
  seen.add(name)

  const value = theme[name] ?? defaults[name]
  if (value === undefined) return null

  const reference = value.match(/^var\(\s*--hc-([\w-]+)\s*(?:,\s*(.+))?\)$/)
  if (!reference) return value

  return resolveToken(reference[1], theme, defaults, seen) ?? reference[2] ?? null
}

/**
 * The colours a token can paint as, or null when it resolves against the host.
 *
 * @param {string} name
 * @param {Record<string, string>} theme
 * @param {Record<string, string>} defaults
 * @returns {Rgba[] | null}
 */
export function tokenSamples(name, theme, defaults) {
  const value = resolveToken(name, theme, defaults)
  return value === null ? null : parseColorSamples(value)
}

/**
 * Composites a layer stack into every opaque surface it can produce.
 *
 * Layers are bottom-first. Each layer may itself be a gradient, so this is a
 * cartesian product — with two gradient layers the count multiplies, which is
 * intended: every combination is something a pixel somewhere actually is.
 *
 * @param {string[]} layers
 * @param {Record<string, string>} theme
 * @param {Record<string, string>} defaults
 * @param {Rgba} page the colour behind the calendar
 * @returns {Rgba[] | null}
 */
export function surfaceSamples(layers, theme, defaults, page) {
  let surfaces = [page]

  for (const layer of layers) {
    const samples = tokenSamples(layer, theme, defaults)
    if (samples === null) return null

    const next = []
    for (const backdrop of surfaces) {
      for (const sample of samples) next.push(composite(sample, backdrop))
    }
    surfaces = next
  }

  return surfaces
}

/**
 * @typedef {object} Finding
 * @property {string} theme
 * @property {ContrastPair} pair
 * @property {'fail' | 'unresolvable'} status
 * @property {number | null} ratio
 * @property {string} [foregroundDeclared]
 * @property {string} [foregroundSample]
 * @property {string} [surfaceDeclared]
 * @property {string} [surfaceSample]
 */

/**
 * Audits one theme. An empty array means it passes.
 *
 * @param {string} name theme name
 * @param {string} themeCss
 * @param {string} variablesCss
 * @param {{ page?: Rgba }} [options] the colour behind the calendar; white by default
 * @returns {Finding[]}
 */
export function auditTheme(name, themeCss, variablesCss, options = {}) {
  const page = options.page ?? { r: 255, g: 255, b: 255, a: 1 }
  const defaults = parseTokens(variablesCss)
  const theme = parseThemeBlock(themeCss)

  /** @type {Finding[]} */
  const findings = []

  for (const pair of PAIRS) {
    if (EXEMPTIONS[`${name}:${pair.id}`]) continue

    const foregrounds = tokenSamples(pair.foreground, theme, defaults)
    const surfaces = surfaceSamples(pair.surface, theme, defaults, page)

    // Silence must not equal success: a value this cannot resolve is reported,
    // not skipped, so a typo in a new theme fails loudly.
    if (foregrounds === null || surfaces === null) {
      findings.push({ theme: name, pair, status: 'unresolvable', ratio: null })
      continue
    }

    let worst = Number.POSITIVE_INFINITY
    let worstForeground = foregrounds[0]
    let worstSurface = surfaces[0]

    for (const surface of surfaces) {
      for (const foreground of foregrounds) {
        const painted = composite(foreground, surface)
        const ratio = contrastRatio(painted, surface)
        if (ratio < worst) {
          worst = ratio
          worstForeground = painted
          worstSurface = surface
        }
      }
    }

    if (worst < pair.minimum) {
      findings.push({
        theme: name,
        pair,
        status: 'fail',
        ratio: worst,
        foregroundDeclared: resolveToken(pair.foreground, theme, defaults) ?? '(unset)',
        foregroundSample: formatColor(worstForeground),
        surfaceDeclared: pair.surface
          .map(layer => `${layer}: ${resolveToken(layer, theme, defaults) ?? '(unset)'}`)
          .join(' over '),
        surfaceSample: formatColor(worstSurface),
      })
    }
  }

  return findings
}

/**
 * Renders findings as a message a maintainer can act on without opening a
 * colour picker.
 *
 * @param {Finding[]} findings
 * @returns {string}
 */
export function formatFindings(findings) {
  return findings
    .map(finding => {
      if (finding.status === 'unresolvable') {
        return [
          `${finding.theme} · ${finding.pair.description}`,
          `  cannot be resolved statically — a token is transparent, inherit or currentcolor.`,
          `  Give it a real colour, or add "${finding.theme}:${finding.pair.id}" to EXEMPTIONS with a reason.`,
          `  rule        ${finding.pair.rule} in core.css`,
        ].join('\n')
      }

      const ratio = /** @type {number} */ (finding.ratio)
      return [
        `${finding.theme} · ${finding.pair.description}`,
        `  measured ${ratio.toFixed(2)}:1, needs ${finding.pair.minimum.toFixed(2)}:1` +
          ` (short by ${(finding.pair.minimum - ratio).toFixed(2)})`,
        `  foreground  --hc-${finding.pair.foreground}: ${finding.foregroundDeclared}`,
        `              → ${finding.foregroundSample} once composited`,
        `  surface     ${finding.surfaceDeclared}`,
        `              → worst sample ${finding.surfaceSample}`,
        `  rule        ${finding.pair.rule} in core.css`,
      ].join('\n')
    })
    .join('\n\n')
}
