#!/usr/bin/env node
/**
 * Lockstep versioning for the @taqwim/* packages.
 *
 * The thirteen published packages only make sense together — an adapter and the
 * store it binds to must never be a version apart — so they carry one version
 * and move as a unit. This script is the tool that moves them.
 *
 * It is deliberately the *only* thing that writes a version number during the
 * pre-1.0 alpha. Changesets is still the release mechanism for 1.0.0 and after
 * (`.changeset/config.json` declares the same thirteen as `fixed`), and the
 * pending changesets stay on disk describing that release; they are consumed
 * when the project graduates. Running `changeset version` before then would
 * apply those pending bumps and overwrite whatever is set here — see
 * CONTRIBUTING.md, "Releasing".
 *
 * Internal dependencies are all `workspace:*`, which pnpm rewrites to the real
 * version at publish time, so only the `version` field needs touching.
 *
 *   node scripts/version.js 0.1.0-alpha.1        explicit version
 *   node scripts/version.js prerelease --preid alpha
 *   node scripts/version.js preminor --preid beta
 *   node scripts/version.js minor                 graduate out of prerelease
 *   node scripts/version.js patch --dry-run
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import semver from 'semver'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * The lockstep set, by directory name under packages/.
 *
 * Listed rather than globbed so that adding a package is a deliberate decision
 * recorded in a diff, and so this stays in step with the `fixed` array in
 * .changeset/config.json. `legacy/*` is excluded on purpose: those are the
 * already-published `taqwim-vue` and `taqwim-core-utils`, frozen at the
 * versions npm has, and moving them would claim a release that never happened.
 */
const PACKAGES = [
  'core',
  'calendar-core',
  'themes',
  'vue',
  'vue-styled',
  'react',
  'react-styled',
  'svelte',
  'svelte-styled',
  'solid',
  'solid-styled',
  'angular',
  'angular-styled',
]

const RELEASE_TYPES = new Set(['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease'])

const PREIDS = new Set(['alpha', 'beta', 'rc'])

function usage(message) {
  if (message) console.error(`\nError: ${message}`)
  console.error(`
Usage: node scripts/version.js <version|release-type> [options]

  <version>        An exact version, e.g. 0.1.0-alpha.1
  <release-type>   ${[...RELEASE_TYPES].join(', ')}

Options:
  --preid <id>     Prerelease identifier: ${[...PREIDS].join(', ')} (default: alpha
                   for pre* types, or the current one when continuing a series)
  --dry-run        Print what would change and write nothing
  --help

Examples:
  node scripts/version.js 0.1.0-alpha.1     set every package to 0.1.0-alpha.1
  node scripts/version.js prerelease        0.1.0-alpha.1 -> 0.1.0-alpha.2
  node scripts/version.js prerelease --preid beta
                                            0.1.0-alpha.2 -> 0.1.0-beta.0
  node scripts/version.js preminor --preid beta
                                            0.1.0-alpha.2 -> 0.2.0-beta.0
  node scripts/version.js minor             0.1.0-alpha.2 -> 0.1.0 (graduate)
`)
  process.exit(message ? 1 : 0)
}

function parseArgs(argv) {
  const options = { target: undefined, preid: undefined, dryRun: false }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--help' || arg === '-h') usage()
    else if (arg === '--dry-run') options.dryRun = true
    else if (arg === '--preid') {
      options.preid = argv[++i]
      if (!options.preid) usage('--preid needs a value')
      if (!PREIDS.has(options.preid)) {
        usage(`unknown --preid "${options.preid}". Expected one of: ${[...PREIDS].join(', ')}`)
      }
    } else if (arg.startsWith('--preid=')) {
      options.preid = arg.slice('--preid='.length)
      if (!PREIDS.has(options.preid)) {
        usage(`unknown --preid "${options.preid}". Expected one of: ${[...PREIDS].join(', ')}`)
      }
    } else if (arg.startsWith('-')) usage(`unknown option "${arg}"`)
    else if (options.target === undefined) options.target = arg
    else usage(`unexpected argument "${arg}"`)
  }

  if (!options.target) usage('a version or release type is required')
  return options
}

/** Reads a package.json, keeping enough context to write it back untouched. */
function readManifest(relativePath) {
  const path = join(ROOT, relativePath)
  const raw = readFileSync(path, 'utf8')
  return { path, relativePath, raw, json: JSON.parse(raw) }
}

function collectManifests() {
  const manifests = PACKAGES.map(name => readManifest(join('packages', name, 'package.json')))
  const missing = manifests.filter(m => !m.json.version)
  if (missing.length) {
    throw new Error(`no version field in: ${missing.map(m => m.relativePath).join(', ')}`)
  }
  return manifests
}

/**
 * The version the bump is computed from.
 *
 * Every package is supposed to agree; if they have drifted, the highest wins,
 * because bumping from a lower one would reuse a version some package has
 * already claimed.
 */
function currentVersion(manifests) {
  const versions = [...new Set(manifests.map(m => m.json.version))]
  const invalid = manifests.filter(m => !semver.valid(m.json.version))
  if (invalid.length) {
    throw new Error(`not a valid semver version: ${invalid.map(m => `${m.json.name}@${m.json.version}`).join(', ')}`)
  }

  const highest = versions.sort(semver.rcompare)[0]
  if (versions.length > 1) {
    console.warn(`! Packages are not in lockstep — found ${versions.length} versions:`)
    for (const version of versions.sort(semver.rcompare)) {
      const names = manifests.filter(m => m.json.version === version).map(m => m.json.name)
      console.warn(`    ${version.padEnd(16)} ${names.join(', ')}`)
    }
    console.warn(`  Bumping from the highest (${highest}); this run puts them back in lockstep.\n`)
  }
  return highest
}

/** Chooses the prerelease identifier for a bump that needs one. */
function resolvePreid(current, { target, preid }) {
  if (preid) return preid
  if (!target.startsWith('pre')) return undefined
  const currentPre = semver.prerelease(current)
  if (currentPre && typeof currentPre[0] === 'string' && PREIDS.has(currentPre[0])) {
    return currentPre[0]
  }
  return 'alpha'
}

function computeNext(current, options) {
  if (semver.valid(options.target)) {
    const next = semver.parse(options.target).version
    if (semver.lt(next, current)) {
      console.warn(`! ${next} is lower than the current ${current}. Setting it anyway.\n`)
    }
    return next
  }

  if (!RELEASE_TYPES.has(options.target)) {
    usage(`"${options.target}" is neither a valid version nor a release type`)
  }

  const preid = resolvePreid(current, options)
  const next = semver.inc(current, options.target, preid)
  if (!next) throw new Error(`could not apply "${options.target}" to ${current}`)
  return next
}

/**
 * Rewrites just the version string, leaving the rest of the file byte for byte
 * as it was. JSON.stringify would reformat every manifest and bury the change.
 */
function withVersion(raw, version) {
  // Two-space indent pins this to the top-level key: anything nested sits at
  // four or more, so a "version" inside some config object cannot be hit.
  const pattern = /^(  "version": ")([^"]*)(")/m
  if (!pattern.test(raw)) throw new Error('no "version" field found to replace')
  return raw.replace(pattern, `$1${version}$3`)
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  const manifests = collectManifests()
  const current = currentVersion(manifests)
  const next = computeNext(current, options)

  // The repo itself is not published, but it carries a version and it is
  // confusing when it disagrees with everything it contains.
  const root = readManifest('package.json')
  const targets = [...manifests, root]

  console.log(`${current}  ->  ${next}\n`)
  const width = Math.max(...targets.map(m => (m.json.name ?? '').length))
  for (const manifest of targets) {
    const from = manifest.json.version ?? '(none)'
    console.log(`  ${(manifest.json.name ?? '?').padEnd(width)}  ${from.padStart(16)}  ->  ${next}`)
  }

  if (options.dryRun) {
    console.log('\n--dry-run: nothing written.')
    return
  }

  for (const manifest of targets) {
    writeFileSync(manifest.path, withVersion(manifest.raw, next))
  }

  console.log(`\nWrote ${targets.length} manifests.`)
  if (semver.prerelease(next)) {
    const tag = semver.prerelease(next)[0]
    console.log(
      `\n${next} is a prerelease. Publish it under its own dist-tag so that\n` +
        `\`npm install @taqwim/vue\` does not resolve to it:\n\n` +
        `  pnpm -r --filter "@taqwim/*" publish --access public --tag ${tag} --no-git-checks\n`,
    )
  }
}

try {
  main()
} catch (error) {
  console.error(`\nError: ${error.message}`)
  process.exit(1)
}
