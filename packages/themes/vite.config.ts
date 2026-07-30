import { defineConfig } from 'vite-plus'

// The stylesheets are copied as authored; only the Tailwind preset is
// generated. See scripts/build.js.
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
  },
  run: {
    tasks: {
      build: {
        command: 'node scripts/build.js',
        input: ['src/**', 'scripts/**', 'package.json'],
        output: ['dist/**'],
      },
      test: {
        command: 'vitest run',
        input: ['src/**', 'scripts/**', 'tests/**', 'vite.config.ts', 'package.json'],
      },
    },
  },
})
