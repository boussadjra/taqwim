import { defineConfig } from 'vite-plus'

// The stylesheets are copied as authored; only the Tailwind preset is
// generated. See scripts/build.js.
export default defineConfig({
  test: {
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
