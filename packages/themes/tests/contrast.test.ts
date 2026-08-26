import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
// @ts-expect-error -- plain ESM, shared with the build script; no types needed here.
import { contrastRatio, parseColor, parseColorSamples, relativeLuminance } from '../scripts/color.js'
import {
  auditTheme,
  EXEMPTIONS,
  formatFindings,
  PAIRS,
  UNAUDITED_FOREGROUNDS,
  // @ts-expect-error -- as above.
} from '../scripts/contrast.js'

const src = join(dirname(fileURLToPath(import.meta.url)), '..', 'src')
const read = (...segments: string[]) => readFileSync(join(src, ...segments), 'utf8')

const variables = read('variables.css')
const core = read('core.css')

const themeFiles = readdirSync(join(src, 'themes'))
  .filter(name => name.endsWith('.css') && name !== 'all.css')
  .sort()

interface Finding {
  status: 'fail' | 'unresolvable'
  pair: { id: string }
}

/**
 * The gate. `core.css` decides which token lands on which surface; the pair
 * table in `contrast.js` encodes those pairings and this measures them.
 *
 * This exists because axe only ever ran against `default` in the end-to-end
 * suite, which let eleven of the thirteen themes ship below AA.
 */
describe('WCAG contrast', () => {
  it.each(themeFiles)('%s meets AA on every audited pair', file => {
    const name = file.replace(/\.css$/, '')
    const findings: Finding[] = auditTheme(name, read('themes', file), variables)

    // The formatted report is the assertion message — a bare boolean tells a
    // maintainer nothing about which colour to change or by how much.
    expect(findings.length, `\n\n${formatFindings(findings)}\n`).toBe(0)
  })
})

/**
 * Guards against the pair table silently falling behind `core.css`. Without
 * these, someone adds a rule painting a new token and the audit ignores it.
 */
describe('the pair table covers core.css', () => {
  const referenced = (property: string) =>
    new Set([...core.matchAll(new RegExp(`${property}:[^;]*var\\(--hc-([\\w-]+)`, 'g'))].map(match => match[1]))

  it('audits every foreground core.css paints', () => {
    const audited = new Set<string>(PAIRS.map((pair: { foreground: string }) => pair.foreground))
    const unaudited = [...referenced('color')].filter(token => !audited.has(token) && !UNAUDITED_FOREGROUNDS.has(token))

    expect(unaudited, 'add these to PAIRS, or to UNAUDITED_FOREGROUNDS with a reason').toEqual([])
  })

  it('reaches every surface core.css paints', () => {
    const surfaces = new Set<string>(PAIRS.flatMap((pair: { surface: string[] }) => pair.surface))
    // `transparent` is a literal, not a token, so it never appears here.
    const unreached = [...referenced('background')].filter(token => !surfaces.has(token))

    expect(unreached, 'add these to some pair’s surface stack').toEqual([])
  })
})

describe('exemptions', () => {
  /*
   * `minimal` is the only theme that cannot be measured — it sets
   * `foreground: inherit` and `background: transparent` so the host page
   * supplies the colours. Pinning the list to that one theme means any future
   * exemption has to change this test, which is the review trigger.
   */
  it('excuses only minimal, and always with a reason', () => {
    for (const [key, reason] of Object.entries(EXEMPTIONS)) {
      expect(key.startsWith('minimal:'), `${key} is exempt but is not minimal`).toBe(true)
      expect(String(reason).length).toBeGreaterThan(20)
    }
  })

  it('names real pairs', () => {
    const ids = new Set<string>(PAIRS.map((pair: { id: string }) => pair.id))
    for (const key of Object.keys(EXEMPTIONS)) {
      expect(ids.has(key.split(':')[1]), `${key} names no pair in PAIRS`).toBe(true)
    }
  })
})

/** The checker itself has to be right, or every result above is worthless. */
describe('colour maths', () => {
  const white = { r: 255, g: 255, b: 255, a: 1 }
  const black = { r: 0, g: 0, b: 0, a: 1 }

  it('puts black on white at 21:1', () => {
    expect(contrastRatio(black, white)).toBeCloseTo(21, 5)
  })

  it('agrees with the WCAG reference on the classic dual-safe grey', () => {
    expect(contrastRatio(parseColor('#767676'), white)).toBeCloseTo(4.54, 2)
  })

  it('parses both rgb() syntaxes and hex shorthand', () => {
    expect(parseColor('rgb(0 119 190 / 0.6)')).toEqual({ r: 0, g: 119, b: 190, a: 0.6 })
    expect(parseColor('rgba(0, 119, 190, 0.6)')).toEqual({ r: 0, g: 119, b: 190, a: 0.6 })
    expect(parseColor('#fff')).toEqual(white)
    expect(parseColor('#ffffff80')?.a).toBeCloseTo(0.502, 2)
  })

  it('reports host-dependent values as unresolvable rather than guessing', () => {
    for (const value of ['transparent', 'inherit', 'currentcolor', 'none']) {
      expect(parseColorSamples(value), value).toBeNull()
    }
  })

  it('samples along a gradient, not only its stops', () => {
    const samples = parseColorSamples('linear-gradient(135deg, #000000 0%, #ffffff 100%)')

    expect(samples.length).toBeGreaterThan(2)
    // A midpoint exists that is neither endpoint — the reason stop-only
    // sampling misses failures.
    expect(samples.some((c: { r: number }) => c.r > 10 && c.r < 245)).toBe(true)
  })

  it('orders luminance the way sRGB does', () => {
    expect(relativeLuminance(white)).toBeCloseTo(1, 5)
    expect(relativeLuminance(black)).toBeCloseTo(0, 5)
    expect(relativeLuminance(parseColor('#0077be'))).toBeLessThan(relativeLuminance(parseColor('#00d4ff')))
  })
})
