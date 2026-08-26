/**
 * Builds `@taqwim/themes`.
 *
 * The stylesheets ship as authored — they are plain CSS with relative
 * `@import`s and no preprocessing, so copying is the correct "build". What is
 * generated: the Tailwind preset, derived from `src/variables.css`, and the
 * theme-name union, derived from the stylesheets in `src/themes/`.
 */

import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { layoutNames, parseTokens, tailwindThemeCss, tailwindThemeFromTokens, themeNames } from './tokens.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'src')
const dist = join(root, 'dist')

const BANNER = '// Generated from src/variables.css by scripts/build.js — do not edit.'
const NAMES_BANNER = '// Generated from src/themes/*.css and src/core.css by scripts/build.js — do not edit.'

async function main() {
  await rm(dist, { recursive: true, force: true })
  await cp(src, dist, { recursive: true })

  const tokens = parseTokens(await readFile(join(src, 'variables.css'), 'utf8'))
  const count = Object.keys(tokens).length

  if (count === 0) {
    throw new Error('parsed zero tokens from variables.css — the preset would be empty')
  }

  const tailwind = join(dist, 'tailwind')
  await mkdir(tailwind, { recursive: true })

  await writeFile(
    join(tailwind, 'tokens.js'),
    `${BANNER}\nexport const tokens = ${JSON.stringify(tokens, null, 2)}\n\nexport default tokens\n`,
  )

  await writeFile(
    join(tailwind, 'tokens.d.ts'),
    [
      BANNER,
      '',
      '/** Every Taqwim design token, keyed without the `--hc-` prefix. */',
      `export declare const tokens: Record<${Object.keys(tokens)
        .map(name => JSON.stringify(name))
        .join(' | ')}, string>`,
      '',
      'export default tokens',
      '',
    ].join('\n'),
  )

  await writeFile(
    join(tailwind, 'preset.js'),
    [
      BANNER,
      '',
      '/**',
      ' * Tailwind preset exposing the Taqwim tokens as `*-taqwim-*` utilities.',
      ' *',
      ' * Values are `var()` references, so switching `data-taqwim-theme` restyles',
      ' * the utilities at runtime with no rebuild.',
      ' */',
      `const preset = { theme: { extend: ${JSON.stringify(tailwindThemeFromTokens(tokens), null, 2)} } }`,
      '',
      'export default preset',
      '',
    ].join('\n'),
  )

  await writeFile(
    join(tailwind, 'preset.d.ts'),
    [
      BANNER,
      '',
      'declare const preset: { theme: { extend: Record<string, Record<string, Record<string, string>>> } }',
      '',
      'export default preset',
      '',
    ].join('\n'),
  )

  await writeFile(join(tailwind, 'theme.css'), tailwindThemeCss(tokens))

  /*
   * The name lists the styled packages accept, generated from the stylesheets
   * so the five of them stop hand-maintaining identical unions. Adding a preset
   * or a layout is then a CSS change; previously it was a dozen edits that
   * could silently disagree with what actually shipped.
   */
  const themes = themeNames(join(src, 'themes'))
  const layouts = layoutNames(await readFile(join(src, 'core.css'), 'utf8'))

  if (themes.length === 0) {
    throw new Error('found no theme stylesheets — the union would be empty')
  }

  const union = names => names.map(name => `'${name}'`).join(' | ')

  await writeFile(
    join(dist, 'names.js'),
    [
      NAMES_BANNER,
      `export const themeNames = ${JSON.stringify(themes, null, 2)}`,
      '',
      `export const layoutNames = ${JSON.stringify(layouts, null, 2)}`,
      '',
    ].join('\n'),
  )

  await writeFile(
    join(dist, 'names.d.ts'),
    [
      NAMES_BANNER,
      '',
      '/** Every bundled theme, as accepted by `theme` and by `data-taqwim-theme`. */',
      `export type HijriCalendarTheme = ${union(themes)}`,
      '',
      '/** Every layout variant, as accepted by `layout` and by `data-taqwim-layout`. */',
      `export type HijriCalendarLayout = ${union(layouts)}`,
      '',
      'export declare const themeNames: readonly HijriCalendarTheme[]',
      'export declare const layoutNames: readonly HijriCalendarLayout[]',
      '',
    ].join('\n'),
  )

  console.warn(
    `@taqwim/themes: ${count} tokens → dist/tailwind, ` +
      `${themes.length} themes and ${layouts.length} layouts → dist/names`,
  )
}

await main()
