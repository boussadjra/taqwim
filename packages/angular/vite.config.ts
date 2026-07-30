import { defineConfig } from 'vite-plus'

/*
 * Angular libraries are compiled by `ngc` in partial-compilation mode, which is
 * what lets a consumer's own Angular version link them — so the build is a
 * plain compiler invocation rather than a bundle, unlike the other packages.
 *
 * There is no Vitest suite here. `@analogjs/vite-plugin-angular` cannot build
 * the Angular program under Vite 8 / Vitest 4, so a test file's `@Component`
 * decorators get handed to Vite's own transform and emitted as plain JS
 * decorators. Rather than pin the whole workspace's toolchain to work around
 * it, this adapter is verified two ways that matter more anyway: `ngc` with
 * `strictTemplates` compiles every component and template on each build, and
 * the shared Playwright suite exercises it at the DOM level against the same
 * specs as the other four frameworks.
 */
const afterDeps = [{ task: 'build', from: 'dependencies' as const }]

export default defineConfig({
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
        command: 'ngc -p tsconfig.build.json',
        dependsOn: afterDeps,
        input: ['src/**', 'tsconfig*.json', 'package.json'],
        output: ['dist/**'],
      },
    },
  },
})
