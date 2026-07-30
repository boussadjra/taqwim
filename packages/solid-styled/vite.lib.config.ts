import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

/**
 * The DOM-compiled fallback bundle.
 *
 * Solid's compiler is a Babel transform, so this cannot go through tsdown like
 * the other packages. The uncompiled source under `dist/source` — emitted by
 * `tsc` with `jsx: preserve` — is what a Solid application actually consumes,
 * via the `solid` export condition; this build serves bundlers that ignore it.
 */
export default defineConfig({
  plugins: [solid()],
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    // dist/source is written by `tsc` in the same task and must survive.
    emptyOutDir: false,
    rollupOptions: {
      external: [
        'solid-js',
        'solid-js/web',
        'solid-js/store',
        '@taqwim/core',
        '@taqwim/calendar-core',
        '@taqwim/solid',
        '@taqwim/themes',
      ],
    },
  },
})
