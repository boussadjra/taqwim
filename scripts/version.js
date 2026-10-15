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
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import semver from 'semver'
import { readManifest, releaseManifests } from './release-manifests.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

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
  const nextRaw = raw.replace(pattern, (_, prefix, _current, suffix) => `${prefix}${version}${suffix}`)
  if (JSON.parse(nextRaw).version !== version)
    throw new Error('top-level "version" field could not be replaced unambiguously')
  return nextRaw
}

export function versionWorkspace(options, rootPath = ROOT) {
  const manifests = releaseManifests(rootPath)
  const current = currentVersion(manifests)
  const next = computeNext(current, options)

  // The repo and docs are not published, but their versions should agree with
  // the packages they contain and describe.
  const root = readManifest(rootPath, 'package.json')
  const docs = readManifest(rootPath, 'docs/package.json')
  const targets = [...manifests, root, docs]
  // Validate every replacement before the first write. Dry runs exercise the
  // same preflight, so a malformed final manifest cannot leave a partial bump.
  const replacements = targets.map(manifest => ({ ...manifest, nextRaw: withVersion(manifest.raw, next) }))

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

  for (const manifest of replacements) {
    writeFileSync(manifest.path, manifest.nextRaw)
  }

  console.log(`\nWrote ${targets.length} manifests.`)
  if (semver.prerelease(next)) {
    console.log(
      `\n${next} is a prerelease. Preview the registry-backed plan with:\n\n  pnpm publish:packages --dry-run\n`,
    )
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    versionWorkspace(parseArgs(process.argv.slice(2)))
  } catch (error) {
    console.error(`\nError: ${error.message}`)
    process.exitCode = 1
  }
}
