import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
// @ts-expect-error -- plain ESM, shared with the build script; no types needed here.
import {
  declaredTokens,
  findTokenReferences,
  parseTokens,
  tailwindThemeCss,
  tailwindThemeFromTokens,
  themeNames,
} from '../scripts/tokens.js'

const src = join(dirname(fileURLToPath(import.meta.url)), '..', 'src')

const read = (...segments: string[]) => readFileSync(join(src, ...segments), 'utf8')

const variables = read('variables.css')
const core = read('core.css')
const tokens: Record<string, string> = parseTokens(variables)

const themeFiles = readdirSync(join(src, 'themes'))
  .filter(name => name.endsWith('.css') && name !== 'all.css')
  .sort()

describe('token contract', () => {
  it('parses every token declared in :root', () => {
    expect(Object.keys(tokens).length).toBeGreaterThan(40)
    expect(tokens.background).toBe('#ffffff')
    expect(tokens['font-weight-semibold']).toBe('600')
  })

  it('ignores the responsive and preference overrides', () => {
    // Those blocks re-declare existing tokens; they must not introduce new ones.
    const inRoot = new Set(Object.keys(tokens))
    for (const token of declaredTokens(variables)) {
      expect(inRoot.has(token), `${token} is declared outside the base :root block`).toBe(true)
    }
  })

  /*
   * This is the assertion that keeps the package honest. `core.css` carries no
   * literal colours, so a token it references but `variables.css` never defines
   * would silently render as nothing.
   */
  it('core.css references only defined tokens', () => {
    const undefined_ = findTokenReferences(core).filter((name: string) => !(name in tokens))
    expect(undefined_).toEqual([])
  })

  it('core.css contains no literal colours', () => {
    const literals = core.match(/#[0-9a-f]{3,8}\b|\brgba?\(/gi) ?? []
    expect(literals).toEqual([])
  })
})

describe('themes', () => {
  it.each(themeFiles)('%s scopes every rule to its own data-taqwim-theme value', file => {
    const css = read('themes', file)
    const name = file.replace(/\.css$/, '')
    const selectors = [...css.matchAll(/^([^@\s][^{]*)\{/gm)].map(match => match[1].trim())

    expect(selectors.length).toBeGreaterThan(0)
    for (const selector of selectors) {
      expect(selector).toContain(`[data-taqwim-theme='${name}']`)
    }
  })

  it.each(themeFiles)('%s sets only tokens the contract defines', file => {
    const unknown = declaredTokens(read('themes', file)).filter(name => !(name in tokens))
    expect(unknown).toEqual([])
  })

  it('all.css imports every theme', () => {
    const imported = [...read('themes', 'all.css').matchAll(/@import\s+'\.\/([\w-]+\.css)'/g)].map(match => match[1])
    expect(imported.sort()).toEqual(themeFiles)
  })

  it('never drops a theme the pre-1.0 stylesheets shipped', () => {
    /*
     * Renaming or dropping one silently breaks every existing `theme` prop, so
     * this list only ever grows. Asserted as a subset rather than an exact
     * match: adding a preset is meant to be one CSS file, and an equality
     * check here would make it two.
     */
    const PRE_1_0 = [
      'cyberpunk',
      'dark',
      'default',
      'islamic',
      'luxurious',
      'material',
      'minimal',
      'minimalist',
      'modern',
      'nature',
      'neon',
      'ocean',
      'sunset',
    ]

    expect(themeNames(join(src, 'themes'))).toEqual(expect.arrayContaining(PRE_1_0))
  })

  it('derives the same theme list the build generates from', () => {
    // The union shipped to the styled packages comes from `themeNames`; if it
    // and the directory ever disagree, a theme prop accepts a name that has no
    // stylesheet.
    expect(themeNames(join(src, 'themes'))).toEqual(themeFiles.map(file => file.replace(/\.css$/, '')))
  })
})

describe('tailwind preset', () => {
  const theme = tailwindThemeFromTokens(tokens)

  it('namespaces every scale under `taqwim`', () => {
    for (const [bucket, scale] of Object.entries(theme)) {
      expect(Object.keys(scale as object), bucket).toEqual(['taqwim'])
    }
  })

  it('maps values to var() references, never to literals', () => {
    for (const scale of Object.values(theme)) {
      for (const value of Object.values((scale as Record<string, Record<string, string>>).taqwim)) {
        expect(value).toMatch(/^var\(--hc-[\w-]+\)$/)
      }
    }
  })

  it('exposes the colours a calendar actually needs', () => {
    const colors = (theme.colors as Record<string, Record<string, string>>).taqwim
    for (const name of ['background', 'foreground', 'primary', 'selected', 'today', 'muted-foreground']) {
      expect(colors, name).toHaveProperty(name)
    }
  })

  it('strips the bucket prefix so utilities read naturally', () => {
    const fontSize = (theme.fontSize as Record<string, Record<string, string>>).taqwim
    expect(fontSize.lg).toBe('var(--hc-font-size-lg)')
    expect(fontSize).not.toHaveProperty('font-size-lg')
  })

  it('skips shorthand tokens that have no single-valued Tailwind bucket', () => {
    const flattened = Object.values(theme).flatMap(scale =>
      Object.keys((scale as Record<string, Record<string, string>>).taqwim),
    )
    expect(flattened).not.toContain('border')
    expect(flattened).not.toContain('transition')
  })

  it('emits a Tailwind v4 @theme block over the same tokens', () => {
    const css = tailwindThemeCss(tokens)
    expect(css).toContain('@theme {')
    expect(css).toContain('--color-taqwim-primary: var(--hc-primary);')
    expect(css).toContain('--text-taqwim-lg: var(--hc-font-size-lg);')
  })
})
