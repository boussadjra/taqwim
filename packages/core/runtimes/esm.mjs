/**
 * The ESM leg of the runtime matrix: loads the package's `import` entry and
 * runs `checks.mjs` against it.
 *
 * `run.mjs` passes the entry as a `file:` URL rather than a path, because a
 * bare Windows path is not a valid specifier for a dynamic `import()`.
 *
 * Argument access is the one thing the three runtimes spell differently:
 * Deno exposes `Deno.args`, and reading `process.argv` there would need
 * `--allow-env`-adjacent permissions for no gain.
 */
import { exit, report } from './checks.mjs'

const [entryUrl] = globalThis.Deno ? globalThis.Deno.args : globalThis.process.argv.slice(2)

if (!entryUrl) {
  console.log('FAIL harness: no entry URL was passed; run this through runtimes/run.mjs')
  console.log('RESULT esm 0 1 0')
  exit(1)
}

const taqwim = await import(entryUrl)

exit(report(taqwim, 'esm'))
