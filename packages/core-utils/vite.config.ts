// vite.config.js
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: 'TaqwimCoreUtils',
      // the proper extensions will be added
      fileName: 'taqwim-core-utils',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['date-fns'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          'date-fns': 'dateFns',
        },
        manualChunks: undefined, // Disable manual chunks for library builds
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/lib/**/*'],
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
})
