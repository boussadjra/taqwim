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
