import { defineConfig } from 'vite-plus'

// No bundler config here: the library is built by tsdown (tsdown.config.ts).
// This file carries the Vitest config and the `vp run` task graph.
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    benchmark: {
      include: ['bench/**/*.bench.ts'],
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/lib/**'],
      // hDates.ts is a 159-row data table with no branches worth covering.
      exclude: ['**/*.d.ts', 'src/lib/hDates.ts'],
      // Flat thresholds; the `thresholds.global` nesting was removed in Vitest 2.
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
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
        command: ['publint --strict', 'attw --pack . --ignore-rules internal-resolution-error no-resolution'],
        dependsOn: ['build'],
        input: ['dist/**', 'package.json'],
      },
      build: {
        command: 'tsdown',
        input: ['src/**', 'tsdown.config.ts', 'tsconfig.json', 'package.json'],
        output: ['dist/**'],
      },
      test: {
        command: 'vitest run',
        input: ['src/**', 'tests/**', 'vite.config.ts', 'package.json'],
      },
      'test:coverage': {
        command: 'vitest run --coverage',
        input: ['src/**', 'tests/**', 'vite.config.ts', 'package.json'],
        output: ['coverage/**'],
      },
      bench: {
        command: 'vitest bench --run',
        cache: false,
      },
    },
  },
})
