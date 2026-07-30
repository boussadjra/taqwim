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
