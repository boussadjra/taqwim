/**
 * Runs the `@taqwim/core` conformance checks under every JavaScript runtime the
 * package claims to support.
 *
 * `@taqwim/core` has no DOM access, no `node:` imports and no framework, so it
 * is *meant* to run anywhere a `Date` does. That claim was previously untested:
 * the Vitest suite runs `src/` under Node and nothing else, so "works in Deno"
 * and "works in Bun" were assertions about the source rather than observations
 * about the shipped artifact.
 *
 * This is the observation. The matrix is
 *
 *     runtime  x  module format  x  host time zone
 *
 * and every cell runs `checks.mjs` unchanged. The time-zone axis is not
 * padding: this library reads and writes *local* calendar parts on purpose
 * (`toGregorian` returns local midnight), so an off-by-one that only appears
 * west of UTC is a real and easy bug, and different runtimes carry different
 * ICU and tzdata builds.
 *
 * A runtime that is not installed is reported as skipped, never silently
 * dropped — see `e2e/KNOWN-GAPS.md` for the same rule applied to the adapters.
 * Under CI, or with `--require-all`, a skip is a failure instead.
 *
 *     node runtimes/run.mjs
 *     node runtimes/run.mjs --require-all
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { delimiter, dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const PACKAGE_DIR = resolve(HERE, '..')

/**
 * `--require-all` turns a missing runtime into a failure. CI implies it: a
 * machine that quietly lost its Deno install should fail the build, not report
 * a green matrix with two thirds of it missing.
 */
const REQUIRE_ALL = process.argv.includes('--require-all') || Boolean(process.env.CI)

const RUNTIMES = [
  {
    name: 'node',
    formats: ['esm', 'cjs'],
    argv: (script, entry) => [script, entry],
  },
  {
    name: 'deno',
    // Deno consumers reach the package as `npm:@taqwim/core`, which resolves
    // the `import` condition. There is no CommonJS path worth testing.
    //
    // --allow-read covers the dist files resolved from the built package;
    // --allow-env because Deno gates the TZ lookup behind it,
    // and the time-zone axis is the whole reason this matrix has three columns.
    formats: ['esm'],
    argv: (script, entry) => ['run', '--allow-read', '--allow-env', script, entry],
  },
  {
    name: 'bun',
    formats: ['esm', 'cjs'],
    argv: (script, entry) => ['run', script, entry],
  },
]

const TIME_ZONES = [
  // The baseline, and what most CI runners are set to.
  'UTC',
  // Positive offset, no DST. Where most of this library's users are, and where
  // a UTC-vs-local slip reads as an off-by-one day rather than an hour.
  'Asia/Riyadh',
  // Negative offset with DST, which is the direction that breaks flooring a
  // millisecond count into a day. Its transitions are at 02:00 local, so local
  // midnight always exists — a zone that shifts *at* midnight would fail these
  // checks for a reason that has nothing to do with the runtime.
  'America/Los_Angeles',
]

const ENTRY_SCRIPTS = {
  esm: join(HERE, 'esm.mjs'),
  cjs: join(HERE, 'cjs.cjs'),
}

/**
 * Locates an executable on PATH.
 *
 * Doubles as the "is this runtime installed?" probe, and on Windows it has to
 * walk PATHEXT itself: `spawn` cannot launch a bare name there, and since Node
 * 20.12 it refuses to launch a `.cmd`/`.bat` shim at all without a shell.
 */
function resolveExecutable(name) {
  const extensions = process.platform === 'win32' ? (process.env.PATHEXT ?? '.EXE;.CMD;.BAT').split(';') : ['']

  for (const dir of (process.env.PATH ?? '').split(delimiter)) {
    if (!dir) continue
    for (const extension of extensions) {
      const candidate = join(dir.replace(/^"|"$/g, ''), name + extension)
      if (existsSync(candidate)) return candidate
    }
  }

  return null
}

/**
 * The runtime's version, as a bare number.
 *
 * The three do not agree on what `--version` prints — `v24.20.0`, `1.3.9`, and
 * for Deno three lines beginning `deno 2.9.5 (stable, release, …)` — so pull
 * the number out rather than printing whatever each one felt like saying.
 */
function versionOf(executable) {
  const result = spawnSync(executable, ['--version'], { encoding: 'utf8', ...shellOptionsFor(executable) })
  const firstLine = (result.stdout ?? '').trim().split(/\r?\n/)[0] ?? ''
  return /\d+\.\d+\.\d+[\w.+-]*/.exec(firstLine)?.[0] ?? '?'
}

/** A `.cmd`/`.bat` shim needs a shell, and a shell needs the arguments quoted — this repo lives under a path with a space in it. */
function shellOptionsFor(executable) {
  return /\.(cmd|bat)$/i.test(executable) ? { shell: true } : {}
}

function spawnCheck(executable, argv, timeZone) {
  const options = shellOptionsFor(executable)
  const quote = value => (options.shell ? `"${value}"` : value)

  return spawnSync(quote(executable), argv.map(quote), {
    encoding: 'utf8',
    env: { ...process.env, TZ: timeZone },
    ...options,
  })
}

/** Resolves the package's own export map, so this tests what a consumer would actually load. */
function resolveEntryPoints() {
  const pkg = JSON.parse(readFileSync(join(PACKAGE_DIR, 'package.json'), 'utf8'))
  const root = pkg.exports['.']
  const entries = { esm: resolve(PACKAGE_DIR, root.import), cjs: resolve(PACKAGE_DIR, root.require) }

  for (const [format, path] of Object.entries(entries)) {
    if (!existsSync(path)) {
      console.error(`The ${format} entry declared in package.json is missing: ${path}`)
      console.error('Build the package first:  vp run -F @taqwim/core build')
      process.exit(1)
    }
  }

  return entries
}

const entryPoints = resolveEntryPoints()
const rows = []
const skipped = []
let failed = 0

console.log(`@taqwim/core runtime conformance — ${TIME_ZONES.length} time zones per module format\n`)

for (const runtime of RUNTIMES) {
  const executable = resolveExecutable(runtime.name)

  if (!executable) {
    skipped.push(runtime.name)
    rows.push({ label: runtime.name, status: 'skip', detail: 'not installed on this machine' })
    continue
  }

  const version = versionOf(executable)

  for (const format of runtime.formats) {
    // CommonJS takes a path; ESM needs a URL, because a bare Windows path is
    // not a valid dynamic-import specifier.
    const entry = format === 'esm' ? pathToFileURL(entryPoints.esm).href : entryPoints.cjs

    for (const timeZone of TIME_ZONES) {
      const result = spawnCheck(executable, runtime.argv(ENTRY_SCRIPTS[format], entry), timeZone)
      const stdout = result.stdout ?? ''
      const summary = /^RESULT (\S+) (\d+) (\d+) (\d+)$/m.exec(stdout)
      const label = `${runtime.name} ${version}  ${format}  ${timeZone}`

      if (result.status === 0 && summary) {
        rows.push({ label, status: 'pass', detail: `${summary[2]} checks in ${summary[4]}ms` })
        continue
      }

      failed++
      const reported = stdout
        .split(/\r?\n/)
        .filter(line => line.startsWith('FAIL '))
        .map(line => line.slice('FAIL '.length))

      rows.push({
        label,
        status: 'fail',
        detail: summary ? `${summary[3]} of ${Number(summary[2]) + Number(summary[3])} checks failed` : 'did not run',
        lines: reported.length > 0 ? reported : [(result.stderr ?? '').trim() || `exit code ${result.status}`],
      })
    }
  }
}

const width = Math.max(...rows.map(row => row.label.length))
const MARKS = { pass: '✓', fail: '✗', skip: '-' }

for (const row of rows) {
  console.log(`  ${MARKS[row.status]} ${row.label.padEnd(width)}  ${row.detail}`)
  for (const line of row.lines ?? []) {
    console.log(`      ${line}`)
  }
}

if (skipped.length > 0) {
  const one = skipped.length === 1
  console.log(
    `\n${skipped.join(' and ')} ${one ? 'is' : 'are'} not installed here, so ${one ? 'that leg' : 'those legs'} did not run.`,
  )
  console.log('CI runs the full matrix. To close the gap locally:  https://deno.com/  ·  https://bun.com/')
}

if (failed > 0) {
  console.log(`\n${failed} of ${rows.length} matrix cells failed.`)
  process.exit(1)
}

if (skipped.length > 0 && REQUIRE_ALL) {
  console.log('\n--require-all (implied by CI) was set, so a missing runtime is a failure.')
  process.exit(1)
}

console.log(`\nAll ${rows.length - skipped.length} matrix cells passed.`)
