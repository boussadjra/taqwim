import { fileURLToPath, URL } from 'node:url'
import * as path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import { visualizer } from 'rollup-plugin-visualizer'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
    // dts({
    //   insertTypesEntry: true,
    //   include: ['src/**/*'],
    //   exclude: ['src/**/__tests__/*', 'src/**/test*'],
    //   copyDtsFiles: true,
    //   entryRoot: './src',
    // }),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'TaqwimVue',
      fileName: 'taqwim-vue',
    },
    rollupOptions: {
      external: ['vue', 'taqwim-core-utils'],
      output: {
        globals: {
          vue: 'Vue',
          'taqwim-core-utils': 'TaqwimCoreUtils',
        },
        // Extract CSS to separate file
        assetFileNames: assetInfo => {
          if (assetInfo.name === 'style.css') return 'style.css'
          return assetInfo.name || 'unknown'
        },
      },
    },
    cssCodeSplit: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
