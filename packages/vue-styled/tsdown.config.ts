import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

export default defineConfig([
  {
    entry: ['./src/index.ts'],
    platform: 'neutral',
    plugins: [Vue({ isProduction: true })],
    // Same reason as @taqwim/vue: tsdown's SFC dts pipeline crashes the TS
    // compiler here, so vue-tsc emits declarations into dist/types instead.
    dts: false,
    // ESM only: a CJS bundle would need its own declarations, and every Vue 3
    // toolchain consumes ESM.
    format: ['esm'],
    target: 'esnext',
    external: ['vue', '@taqwim/core', '@taqwim/calendar-core', '@taqwim/vue', '@taqwim/themes'],
  },
])
