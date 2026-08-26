/**
 * Parses the design-token contract out of `src/variables.css`.
 *
 * `variables.css` is the single source of truth. The Tailwind preset is
 * generated from it at build time rather than hand-maintained, because a
 * hand-maintained copy is guaranteed to drift the first time a token is added.
 *
 * Kept as plain ESM (not TS) so both the build script and the tests can run it
 * without a compile step.
 */

import { readdirSync } from 'node:fs'

const PREFIX = '--hc-'

/**
 * Extracts the custom properties declared in the top-level `:root` block.
 *
 * Deliberately only the first `:root` — the responsive/`prefers-*` blocks lower
 * down re-declare a subset, and those are runtime overrides of the same tokens,
 * not new ones.
 *
 * @param {string} css
 * @returns {Record<string, string>} token name (without the `--hc-` prefix) → declared value
 */
export function parseTokens(css) {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const rootStart = withoutComments.indexOf(':root')

  if (rootStart === -1) {
    throw new Error('variables.css declares no :root block')
  }

  const open = withoutComments.indexOf('{', rootStart)
  const close = withoutComments.indexOf('}', open)

  if (open === -1 || close === -1) {
    throw new Error('variables.css has an unterminated :root block')
  }

  return parseDeclarations(withoutComments.slice(open + 1, close))
}

/**
 * The `--hc-*` declarations in a block body.
 *
 * @param {string} body
 * @returns {Record<string, string>}
 */
function parseDeclarations(body) {
  /** @type {Record<string, string>} */
  const tokens = {}

  for (const declaration of body.split(';')) {
    const separator = declaration.indexOf(':')
    if (separator === -1) continue

    const name = declaration.slice(0, separator).trim()
    if (!name.startsWith(PREFIX)) continue

    tokens[name.slice(PREFIX.length)] = declaration
      .slice(separator + 1)
      .trim()
      .replace(/\s+/g, ' ')
  }

  return tokens
}

/**
 * The tokens a theme stylesheet sets, from its `[data-taqwim-theme='…']` block.
 *
 * Themes are a single block by contract — `tokens.test.ts` asserts every rule in
 * a theme file is scoped to that one selector — so the first block is the theme.
 *
 * @param {string} css
 * @returns {Record<string, string>}
 */
export function parseThemeBlock(css) {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const start = withoutComments.indexOf('[data-taqwim-theme=')

  if (start === -1) {
    throw new Error('no [data-taqwim-theme=…] block found')
  }

  const open = withoutComments.indexOf('{', start)
  const close = withoutComments.indexOf('}', open)

  if (open === -1 || close === -1) {
    throw new Error('unterminated [data-taqwim-theme=…] block')
  }

  return parseDeclarations(withoutComments.slice(open + 1, close))
}

/**
 * The bundled theme names, from the stylesheets themselves.
 *
 * The filesystem is the source of truth for what themes exist, so that adding
 * a preset is one file rather than an edit in every package that names one.
 *
 * @param {string} themesDir
 * @returns {string[]} alphabetical, `all.css` excluded
 */
export function themeNames(themesDir) {
  return readdirSync(themesDir)
    .filter(name => name.endsWith('.css') && name !== 'all.css')
    .map(name => name.replace(/\.css$/, ''))
    .sort()
}

/**
 * The layout variants, from the stylesheet that implements them.
 *
 * Derived rather than listed for the same reason as `themeNames`: the CSS is
 * what actually decides which values do anything, so a hand-kept list can only
 * ever be wrong. `default` is always first and never appears in `core.css` —
 * it is the absence of any layout rule.
 *
 * @param {string} coreCss
 * @returns {string[]}
 */
export function layoutNames(coreCss) {
  const found = new Set()

  for (const match of coreCss.matchAll(/\[data-taqwim-layout='([\w-]+)'\]/g)) {
    found.add(match[1])
  }

  return ['default', ...[...found].sort()]
}

/**
 * Custom properties a stylesheet *declares*, as opposed to references.
 *
 * @param {string} css
 * @returns {string[]} sorted, deduped, prefix stripped
 */
export function declaredTokens(css) {
  /** @type {Set<string>} */
  const declared = new Set()

  for (const match of css.matchAll(/^\s*--hc-([\w-]+)\s*:/gm)) {
    declared.add(match[1])
  }

  return [...declared].sort()
}

/**
 * Every `var(--hc-*)` reference in a stylesheet.
 *
 * Used by the contract test to prove `core.css` consumes nothing that
 * `variables.css` does not define.
 *
 * @param {string} css
 * @returns {string[]} token names, without the prefix, deduplicated and sorted
 */
export function findTokenReferences(css) {
  const references = new Set()

  for (const match of css.matchAll(/var\(\s*--hc-([\w-]+)/g)) {
    references.add(match[1])
  }

  return [...references].sort()
}

/**
 * How a token maps into Tailwind's theme.
 *
 * Ordered — the first matching rule wins, so the more specific suffixes
 * (`-border-radius`, `-foreground`) must precede the broader ones.
 *
 * `null` means "expose the raw value in `tokens`, but do not invent a Tailwind
 * utility for it": shorthand properties like `border: 1px solid #e5e7eb` and
 * `transition: all 0.15s ease-in-out` have no single-valued Tailwind bucket.
 */
const BUCKETS = [
  [/^font-family$/, 'fontFamily'],
  [/^font-size-/, 'fontSize'],
  [/^font-weight-/, 'fontWeight'],
  [/border-radius$/, 'borderRadius'],
  [/^shadow$/, 'boxShadow'],
  [/^z-index$/, 'zIndex'],
  [/^spacing-/, 'spacing'],
  [/-(size|gap|padding)$/, 'spacing'],
  [/^focus-ring-(width|offset)$/, 'spacing'],
  [/-?border$/, null],
  [/^transition/, null],
  [
    /^(background|foreground|hover|selected|today|accent|muted|primary|secondary|disabled|unavailable|outside-month|focus-ring-color)/,
    'colors',
  ],
]

/** @param {string} token */
function bucketFor(token) {
  for (const [pattern, bucket] of BUCKETS) {
    if (pattern.test(token)) return bucket
  }
  return null
}

/**
 * Strips the bucket's own prefix so the utility reads naturally:
 * `font-size-lg` under `fontSize` becomes `lg`, giving `text-taqwim-lg`.
 *
 * @param {string} token
 * @param {string} bucket
 */
function keyFor(token, bucket) {
  if (bucket === 'fontSize') return token.replace(/^font-size-/, '')
  if (bucket === 'fontWeight') return token.replace(/^font-weight-/, '')
  if (bucket === 'spacing') return token.replace(/^spacing-/, '')
  if (bucket === 'borderRadius') return token === 'border-radius' ? 'DEFAULT' : token.replace(/-border-radius$/, '')
  if (bucket === 'fontFamily' || bucket === 'boxShadow' || bucket === 'zIndex') return 'DEFAULT'
  return token
}

/**
 * Builds the Tailwind `theme.extend` object.
 *
 * Values are `var()` references rather than the literal colours, which is the
 * whole point: a `data-taqwim-theme` change on any ancestor restyles the
 * Tailwind utilities too, with no rebuild.
 *
 * @param {Record<string, string>} tokens
 */
export function tailwindThemeFromTokens(tokens) {
  /** @type {Record<string, Record<string, string>>} */
  const theme = {}

  for (const token of Object.keys(tokens)) {
    const bucket = bucketFor(token)
    if (!bucket) continue

    theme[bucket] ??= {}
    theme[bucket][keyFor(token, bucket)] = `var(${PREFIX}${token})`
  }

  // Namespace every scale under `taqwim` so the preset can never collide with
  // an application's own theme: `bg-taqwim-primary`, `text-taqwim-lg`.
  /** @type {Record<string, Record<string, unknown>>} */
  const namespaced = {}
  for (const [bucket, scale] of Object.entries(theme)) {
    namespaced[bucket] = { taqwim: scale }
  }

  return namespaced
}

/**
 * The Tailwind v4 `@theme` block, for the CSS-first configuration style.
 *
 * @param {Record<string, string>} tokens
 */
export function tailwindThemeCss(tokens) {
  const lines = []

  for (const token of Object.keys(tokens)) {
    const bucket = bucketFor(token)
    if (!bucket) continue

    const namespace = {
      colors: '--color-taqwim',
      borderRadius: '--radius-taqwim',
      boxShadow: '--shadow-taqwim',
      fontSize: '--text-taqwim',
      fontWeight: '--font-weight-taqwim',
      fontFamily: '--font-taqwim',
      spacing: '--spacing-taqwim',
      zIndex: '--z-taqwim',
    }[bucket]

    const key = keyFor(token, bucket)
    const name = key === 'DEFAULT' ? namespace : `${namespace}-${key}`
    lines.push(`  ${name}: var(${PREFIX}${token});`)
  }

  return [
    '/* Generated from variables.css by scripts/build.js — do not edit. */',
    '',
    '@theme {',
    ...lines,
    '}',
    '',
  ].join('\n')
}

export { PREFIX }
