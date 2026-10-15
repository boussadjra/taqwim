/** Makes TypeDoc's Markdown valid, navigable Starlight content. */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const API = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content', 'docs', 'api')

function* markdownFiles(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry)
    if (statSync(path).isDirectory()) yield* markdownFiles(path)
    else if (entry.endsWith('.md')) yield path
  }
}

const quote = text => `'${text.replace(/'/g, "''")}'`

function preparePage(source) {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source)
  if (frontmatter) {
    const fields = /^editUrl:/m.test(frontmatter[1])
      ? frontmatter[1].replace(/^editUrl:.*$/m, 'editUrl: false')
      : `${frontmatter[1]}\neditUrl: false`
    return { fields, body: source.slice(frontmatter[0].length).trimStart() }
  }
  const heading = /^#\s+(.+)$/m.exec(source)
  const title = heading ? heading[1].trim() : 'API'
  const body = heading ? source.replace(heading[0], '').trimStart() : source
  return { fields: `title: ${quote(title)}\neditUrl: false`, body }
}

export function prepareApiDocs(api = API) {
  const files = [...markdownFiles(api)]
  const targets = new Set(files.map(file => resolve(file)))
  // Resolve every link before writing, so a missing TypeDoc page cannot leave
  // the generated collection partially prepared for Astro.
  const pages = files.map(file => {
    const source = readFileSync(file, 'utf8')
    const { fields, body } = preparePage(source)
    const content = body.replace(/\]\(([^)\s]+\.md)(#[^)\s]*)?\)/g, (link, href, fragment = '') => {
      if (/^[a-z]+:|^\//i.test(href)) return link
      const target = resolve(dirname(file), decodeURIComponent(href))
      const fromApi = relative(api, target).replaceAll('\\', '/')
      if (isAbsolute(fromApi) || fromApi.startsWith('../') || !targets.has(target)) {
        throw new Error(`${relative(api, file)}: unresolved generated API link ${href}`)
      }
      // Astro's default collection slugs lowercase TypeDoc's identifier names.
      const slug = fromApi
        .replace(/\.md$/i, '')
        .toLowerCase()
        .replace(/(?:^|\/)index$/, '')
      return `](/api/${slug ? `${slug}/` : ''}${fragment})`
    })
    return { file, source, prepared: `---\n${fields}\n---\n\n${content}` }
  })

  let count = 0
  for (const { file, source, prepared } of pages) {
    if (prepared === source) continue
    writeFileSync(file, prepared)
    count++
  }
  return count
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.warn(`docs: prepared ${prepareApiDocs()} generated API pages`)
}
