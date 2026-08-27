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
 *   - **The dist-tag is derived, not remembered.** A prerelease publishes under
 *     its own identifier (`0.1.0-beta.0` -> `beta`), so `pnpm add @taqwim/vue`
 *     cannot resolve to it by accident. Overridable with --tag.
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
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const REGISTRY = 'https://registry.npmjs.org'

/**
 * The lockstep set, read from .changeset/config.json rather than listed again.
 *
 * `scripts/version.js` keeps its own copy by directory name because it has to
 * find the manifests before it can read them. This script only needs the
 * published names, and `fixed` already is that list — a third copy would be one
 * more thing to forget to update.
 */
function lockstepPackages() {
  const config = JSON.parse(readFileSync(join(ROOT, '.changeset', 'config.json'), 'utf8'))
  const [fixed] = config.fixed ?? []
  if (!fixed?.length) throw new Error('no "fixed" group in .changeset/config.json')
  return fixed
}

function usage(message) {
  if (message) console.error(`\nError: ${message}`)
  console.error(`
Usage: node scripts/publish.js [options]

  Publishes every @taqwim/* package that is not already on the registry at the
  version in its package.json.

Options:
  --tag <tag>      dist-tag to publish under (default: derived from the version)
  --otp <code>     npm one-time password, if your account requires one
  --dry-run        print the plan and publish nothing
  --help
`)
  process.exit(message ? 1 : 0)
}

function parseArgs(argv) {
  const options = { tag: undefined, otp: undefined, dryRun: false }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--help' || arg === '-h') usage()
    else if (arg === '--dry-run') options.dryRun = true
    else if (arg === '--tag') options.tag = argv[++i] ?? usage('--tag needs a value')
    else if (arg.startsWith('--tag=')) options.tag = arg.slice('--tag='.length)
    else if (arg === '--otp') options.otp = argv[++i] ?? usage('--otp needs a value')
    else if (arg.startsWith('--otp=')) options.otp = arg.slice('--otp='.length)
    else usage(`unknown argument "${arg}"`)
  }

  return options
}

/**
 * The dist-tag a version should go out under.
 *
 * A prerelease publishing as `latest` is the mistake worth engineering away:
 * it makes `pnpm add @taqwim/vue` resolve to a beta for everyone. The
 * identifier is already in the version string, so read it from there rather
 * than trusting whoever typed the command to remember `--tag`.
 *
 * npm still forces a `latest` tag onto a package's very first publish whatever
 * this says. That resolves itself once a stable version exists to point it at.
 */
function tagFor(version) {
  const identifier = /-([a-z]+)\.\d+$/.exec(version)?.[1]
  return identifier ?? 'latest'
}

/** Asks the registry directly — `npm view` answers from a cache that lags a publish. */
async function publishedVersions(name) {
  const response = await fetch(`${REGISTRY}/${name.replace('/', '%2F')}`, {
    headers: { accept: 'application/vnd.npm.install-v1+json' },
  })
  if (response.status === 404) return new Set()
  if (!response.ok) throw new Error(`${name}: registry returned ${response.status}`)
  const body = await response.json()
  return new Set(Object.keys(body.versions ?? {}))
}

function publish(name, { tag, otp }) {
  const args = ['--filter', name, 'publish', '--access', 'public', '--tag', tag, '--no-git-checks']
  if (otp) args.push('--otp', otp)

  // shell: true because pnpm is a .cmd shim on Windows and spawn cannot launch
  // one directly. No argument here contains a space, so no quoting is needed.
  const result = spawnSync('pnpm', args, { cwd: ROOT, stdio: 'inherit', shell: true })
  return result.status === 0
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const names = lockstepPackages()

  const manifests = names.map(name => {
    const directory = name.replace('@taqwim/', '')
    const json = JSON.parse(readFileSync(join(ROOT, 'packages', directory, 'package.json'), 'utf8'))
    return { name, version: json.version }
  })

  const versions = [...new Set(manifests.map(m => m.version))]
  if (versions.length > 1) {
    usage(`packages are not in lockstep: ${versions.join(', ')}. Run pnpm version:set first.`)
  }

  const [version] = versions
  const tag = options.tag ?? tagFor(version)

  console.log(`Publishing ${version} under the "${tag}" tag\n`)

  const plan = []
  for (const manifest of manifests) {
    const published = await publishedVersions(manifest.name)
    plan.push({ ...manifest, alreadyPublished: published.has(version) })
  }

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
    if (!publish(entry.name, { tag, otp: options.otp })) failed.push(entry.name)
  }

  console.log('')
  for (const entry of pending) {
    const ok = !failed.includes(entry.name)
    console.log(`  ${ok ? '✓' : '✗'} ${entry.name}`)
  }

  if (failed.length > 0) {
    console.log(`\n${failed.length} of ${pending.length} failed. Re-run to retry just those:`)
    console.log('  node scripts/publish.js')
    process.exit(1)
  }

  console.log(`\nPublished ${pending.length} package${pending.length === 1 ? '' : 's'} at ${version}.`)
}

main().catch(error => {
  console.error(error.message)
  process.exit(1)
})
