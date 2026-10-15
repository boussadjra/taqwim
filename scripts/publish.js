#!/usr/bin/env node
/**
 * Publishes the thirteen @taqwim/* packages, one `pnpm publish` at a time.
 *
 * `pnpm -r publish` is the obvious tool and it does not work here: it stops at
 * the first package the registry rejects, and a partially-completed run leaves
 * the registry ahead of whatever the console last said. Recovering means
 * hand-assembling a filter of whatever did not make it, which is how a
 * thirteen-package release turns into an afternoon.
 *
 * So this drives one invocation per package instead — the thing that reliably
 * works — and adds the three properties the recursive form is missing:
 *
 *   - **Resumable.** Every package is checked against the registry first and
 *     skipped if that exact version is already there. Re-running after a
 *     failure picks up where it stopped; running twice publishes nothing twice.
 *   - **It does not stop at the first failure.** One package failing should not
 *     hide whether the other twelve would have worked. Failures are collected
 *     and reported together at the end.
 *   - **The dist-tag follows the release line.** Before a stable version exists,
 *     prereleases update `latest` so a bare install gets the current beta. Once
 *     stable exists, prereleases use their own identifier. Overridable with --tag.
 *
 *   node scripts/publish.js --dry-run
 *   node scripts/publish.js
 *   node scripts/publish.js --tag next
 *   node scripts/publish.js --otp 123456
 *
 * Note that --dry-run here prints and publishes nothing at all. It does not
 * shell out to `pnpm publish --dry-run`, which has been observed issuing a real
 * PUT to the registry.
 */
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import semver from 'semver'
import { releaseManifests } from './release-manifests.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const REGISTRY = 'https://registry.npmjs.org'

function usage() {
  console.log(`
Usage: node scripts/publish.js [options]

  Publishes every @taqwim/* package that is not already on the registry at the
  version in its package.json.

Options:
  --tag <tag>      dist-tag to publish under (default: latest until stable exists)
  --otp <code>     npm one-time password, if your account requires one
  --dry-run        print the plan and publish nothing
  --help
`)
}

function validTag(tag) {
  return typeof tag === 'string' && /^[a-z][a-z0-9._-]*$/i.test(tag) && !semver.validRange(tag)
}

export function parseArgs(argv) {
  const options = { tag: undefined, otp: undefined, dryRun: false, help: false }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--help' || arg === '-h') options.help = true
    else if (arg === '--dry-run') options.dryRun = true
    else if (arg === '--tag') options.tag = argv[++i]
    else if (arg.startsWith('--tag=')) options.tag = arg.slice('--tag='.length)
    else if (arg === '--otp') options.otp = argv[++i]
    else if (arg.startsWith('--otp=')) options.otp = arg.slice('--otp='.length)
    else throw new Error(`unknown argument "${arg}"`)

    if (arg === '--tag' || arg.startsWith('--tag=')) {
      if (!validTag(options.tag)) throw new Error('--tag needs a valid dist-tag, such as latest, beta or next')
    }
    if (arg === '--otp' || arg.startsWith('--otp=')) {
      if (typeof options.otp !== 'string' || !/^\d+$/.test(options.otp)) {
        throw new Error('--otp needs a numeric one-time password')
      }
    }
  }

  return options
}

/** Protect stable latest as soon as any member of the lockstep set has one. */
export function tagFor(version, published) {
  const prerelease = semver.prerelease(version)
  if (!prerelease) return 'latest'
  const stableExists = [...published].some(
    publishedVersion => semver.valid(publishedVersion) && !semver.prerelease(publishedVersion),
  )
  const identifier = prerelease[0]
  return stableExists ? (validTag(identifier) ? identifier : 'next') : 'latest'
}

/** Asks the registry directly — npm view can answer from a stale cache. */
async function publishedVersions(name) {
  const response = await fetch(`${REGISTRY}/${name.replace('/', '%2F')}`, {
    headers: { accept: 'application/vnd.npm.install-v1+json' },
    signal: AbortSignal.timeout(30_000),
  })
  if (response.status === 404) return new Set()
  if (!response.ok) throw new Error(`${name}: registry returned ${response.status}`)
  const body = await response.json()
  return new Set(Object.keys(body.versions ?? {}))
}

function publish(name, { tag, otp }) {
  const args = ['--filter', name, 'publish', '--access', 'public', '--tag', tag, '--no-git-checks']
  if (otp) args.push('--otp', otp)

  // Windows needs a shell for the .cmd shim. Manifest names and user-supplied
  // tag/OTP values are validated before reaching it; other platforms do not.
  const result = spawnSync('pnpm', args, { cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32' })
  if (result.error) console.error(`${name}: could not start pnpm (${result.error.code})`)
  return result.status === 0
}

export async function publishPackages(
  options,
  { rootPath = ROOT, versionsFor = publishedVersions, publishPackage = publish } = {},
) {
  const manifests = releaseManifests(rootPath).map(({ json }) => {
    if (Object.hasOwn(json.scripts ?? {}, 'publish')) {
      throw new Error(
        `${json.name}: remove scripts.publish; pnpm runs it after publishing and it would publish the same version twice`,
      )
    }
    return { name: json.name, version: json.version }
  })

  const versions = [...new Set(manifests.map(m => m.version))]
  if (versions.length > 1) {
    throw new Error(`packages are not in lockstep: ${versions.join(', ')}. Run pnpm version:set first.`)
  }

  const [version] = versions
  const plan = await Promise.all(
    manifests.map(async manifest => {
      const published = await versionsFor(manifest.name)
      return { ...manifest, published, alreadyPublished: published.has(version) }
    }),
  )
  const published = new Set(plan.flatMap(entry => [...entry.published]))
  const tag = options.tag ?? tagFor(version, published)

  console.log(`Publishing ${version} under the "${tag}" tag\n`)

  const width = Math.max(...plan.map(entry => entry.name.length))
  for (const entry of plan) {
    console.log(`  ${entry.name.padEnd(width)}  ${entry.alreadyPublished ? 'already on the registry' : 'to publish'}`)
  }

  const pending = plan.filter(entry => !entry.alreadyPublished)

  if (pending.length === 0) {
    console.log(`\nEvery package is already published at ${version}. Nothing to do.`)
    return
  }

  if (options.dryRun) {
    console.log(`\n--dry-run: ${pending.length} would be published, nothing was sent.`)
    return
  }

  const failed = []
  for (const [index, entry] of pending.entries()) {
    console.log(`\n── ${entry.name}  (${index + 1}/${pending.length}) ──`)
    if (!publishPackage(entry.name, { tag, otp: options.otp })) failed.push(entry.name)
  }

  console.log('')
  for (const entry of pending) {
    const ok = !failed.includes(entry.name)
    console.log(`  ${ok ? '✓' : '✗'} ${entry.name}`)
  }

  if (failed.length > 0) {
    throw new Error(`${failed.length} of ${pending.length} failed. Re-run node scripts/publish.js to retry just those.`)
  }

  console.log(`\nPublished ${pending.length} package${pending.length === 1 ? '' : 's'} at ${version}.`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const options = parseArgs(process.argv.slice(2))
    if (options.help) usage()
    else await publishPackages(options)
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
