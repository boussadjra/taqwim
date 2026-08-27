import { defineConfig } from 'vite-plus'

// Astro owns the build; this file only declares the `vp run` task graph so the
// docs rebuild when the packages they document do.
const afterDeps = [{ task: 'build', from: 'dependencies' as const }]

export default defineConfig({
  run: {
    tasks: {
      build: {
        /*
         * Two content directories are generated before Astro sees them: the
         * token reference from @taqwim/themes, and the API reference from
         * @taqwim/core via TypeDoc.
         *
         * The TypeDoc step used to be missing, and the build only worked
         * because `src/content/docs/api` was left on disk by a manual
         * `pnpm api:build`. That directory is gitignored, so every clean
         * checkout — CI, Vercel, a new contributor's first clone — died in
         * `prepare-api-docs.js` with an ENOENT on a directory nothing had
         * created yet. The build has to be self-contained.
         *
         * `pnpm -w exec` runs it from the workspace root, which is where
         * typedoc.json lives and what its `entryPoints` and `out` paths are
         * relative to.
         */
        command: [
          'node scripts/generate-tokens-page.js',
          /*
           * One array element, so `vp` caches the pair as a single unit. Split
           * in two, it will replay TypeDoc's raw Markdown from cache and skip
           * the frontmatter step that follows it, leaving every API page
           * without the `title` Starlight's schema requires — the build then
           * dies on `api/readme data does not match collection schema`.
           * TypeDoc's output is only ever valid content once this has run over
           * it, so the two are one operation.
           */
          'pnpm -w exec typedoc --excludeNotDocumented && node scripts/prepare-api-docs.js',
          'astro build',
        ],
        dependsOn: afterDeps,
        /*
         * Uncacheable, and it cannot be otherwise: two of the three steps
         * *generate content into `src/`*, which is the only honest `input` this
         * task could declare. Output inside input means the hash changes
         * halfway through every run, and `vp` is documented to serve a stale
         * cache when input and output are not declared truthfully — so the
         * truthful declaration here is that it has no usable cache key.
         *
         * Cached, it failed in two different ways on the second run: replaying
         * the generation steps while re-running `astro build` over content they
         * had not produced, and replaying the whole task after the command
         * above had changed. The second of those is how a docs build that could
         * never work on a clean checkout kept passing locally for weeks.
         *
         * The cost is ~10s per `vp run -r build`. The dependency builds above
         * are still cached; only this task re-runs.
         */
        cache: false,
      },
    },
  },
})
