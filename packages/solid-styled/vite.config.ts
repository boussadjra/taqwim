import { defineConfig } from 'vite-plus'
import solid from 'vite-plugin-solid'

// The library build lives in vite.lib.config.ts. This file provides the Solid
// plugin for Vitest, plus the `vp run` task graph.
const afterDeps = [{ task: 'build', from: 'dependencies' as const }]

export default defineConfig({
  // `hot: false` keeps solid-refresh out of the test transform; its virtual
  // module has no real path and Vitest's loader rejects it.
  plugins: [solid({ hot: false })],
  resolve: {
    // Vitest must load the browser build of Solid, not the SSR one.
    conditions: ['development', 'browser'],
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.tsx'],
  },
  run: {
    tasks: {
      /*
       * publint checks the export map and the files list; attw checks that the
       * types resolve under every module resolution a consumer might use.
       * With thirteen packages this is the likeliest shipping bug, and neither
       * the build nor the tests would notice one.
       *
       * The two ignored rules are artefacts of packing a workspace package
       * whose @taqwim/* siblings are not on npm yet, so their types cannot
       * resolve from inside the tarball. Remove them after the first publish —
       * at that point they would be reporting something real.
       */
      'verify-package': {
        command: [
          'publint --strict',
          'attw --pack . --profile esm-only --ignore-rules internal-resolution-error no-resolution',
        ],
        dependsOn: ['build'],
        input: ['dist/**', 'package.json'],
      },
      build: {
        // tsc emits the uncompiled source plus declarations; vite adds the
        // DOM-compiled fallback. Order matters — vite must not clear dist.
        command: ['tsc -p tsconfig.build.json', 'vite build -c vite.lib.config.ts'],
        dependsOn: afterDeps,
        input: ['src/**', 'tsconfig*.json', 'vite.lib.config.ts', 'package.json'],
        output: ['dist/**'],
      },
      test: {
        command: 'vitest run',
        dependsOn: afterDeps,
        input: ['src/**', 'tests/**', 'vite.config.ts', 'package.json'],
      },
    },
  },
})
