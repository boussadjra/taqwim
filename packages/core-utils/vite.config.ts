import { defineConfig } from 'vite-plus'

// No bundler config here: the library is built by tsdown (tsdown.config.ts).
// This file declares the `vp run` task graph for the package.
export default defineConfig({
  run: {
    tasks: {
      build: {
        command: 'tsdown',
        input: ['src/**', 'tsdown.config.ts', 'tsconfig.json', 'package.json'],
        output: ['dist/**'],
      },
      test: {
        command: 'vitest run',
        input: ['src/**', 'tests/**', 'vitest.config.ts', 'package.json'],
      },
      'test:coverage': {
        command: 'vitest run --coverage',
        input: ['src/**', 'tests/**', 'vitest.config.ts', 'package.json'],
        output: ['coverage/**'],
      },
    },
  },
})
