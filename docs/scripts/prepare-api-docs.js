/**
 * Makes TypeDoc's Markdown legible to Starlight's content collection.
 *
 * TypeDoc emits a bare `# Heading` with no frontmatter; Starlight requires a
 * `title`. Rather than hand-editing forty generated files, this derives the
 * title from that first heading and removes it from the body, so the page is
 * not titled twice.
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const api = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content', 'docs', 'api')

function* markdownFiles(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry)
    if (statSync(path).isDirectory()) yield* markdownFiles(path)
    else if (entry.endsWith('.md')) yield path
  }
}

/** YAML-safe: titles contain `<`, `\`` and other characters that need quoting. */
const quote = text => `'${text.replace(/'/g, "''")}'`

let count = 0

for (const file of markdownFiles(api)) {
  const source = readFileSync(file, 'utf8')
  if (source.startsWith('---')) continue

  const heading = /^#\s+(.+)$/m.exec(source)
  const title = heading ? heading[1].trim() : 'API'
  const body = heading ? source.replace(heading[0], '').trimStart() : source

  writeFileSync(file, `---\ntitle: ${quote(title)}\n---\n\n${body}`)
  count++
}

console.warn(`docs: added frontmatter to ${count} generated API pages`)
