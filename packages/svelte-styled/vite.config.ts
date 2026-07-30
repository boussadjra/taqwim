import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite-plus'

/*
 * Svelte libraries ship uncompiled `.svelte` files so the consumer's compiler
 * can target DOM or SSR, which is what `svelte-package` produces — there is no
 * bundling step here, unlike the other packages.
 */
const afterDeps = [{ task: 'build', from: 'dependencies' as const }]

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    // Vitest must load the browser build of Svelte, not the SSR one.
    conditions: ['browser'],
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
  },
  run: {
    tasks: {
      build: {
        command: 'svelte-package --input src --output dist',
        dependsOn: afterDeps,
        input: ['src/**', 'svelte.config.js', 'tsconfig.json', 'package.json'],
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
