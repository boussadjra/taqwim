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
