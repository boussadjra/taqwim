import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite-plus'

const afterDeps = [{ task: 'build', from: 'dependencies' as const }]

export default defineConfig({
  plugins: [svelte()],
  server: { port: 5175 },
  preview: { port: 5175 },
  run: {
    tasks: {
      build: { command: 'vite build', dependsOn: afterDeps, output: ['dist/**'] },
      'type-check': {
        /*
         * svelte-check, not tsc: `.svelte` files are not TypeScript, and tsc
         * skips them silently rather than failing, which would make the task
         * look green while checking only `harness.ts`.
         */
        command: 'svelte-check --tsconfig ./tsconfig.json',
        dependsOn: afterDeps,
        input: ['src/**', 'env.d.ts', 'tsconfig.json', 'svelte.config.js', 'package.json'],
      },
    },
  },
})
