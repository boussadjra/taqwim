/**
 * Builds `@taqwim/themes`.
 *
 * The stylesheets ship as authored — they are plain CSS with relative
 * `@import`s and no preprocessing, so copying is the correct "build". The only
 * generated output is the Tailwind preset, derived from `src/variables.css`.
 */

import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseTokens, tailwindThemeCss, tailwindThemeFromTokens } from './tokens.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'src')
const dist = join(root, 'dist')

const BANNER = '// Generated from src/variables.css by scripts/build.js — do not edit.'

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
      '/** Every Taqwim design token, keyed without the `--hijri-calendar-` prefix. */',
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

  console.warn(`@taqwim/themes: ${count} tokens → dist/tailwind`)
}

await main()
