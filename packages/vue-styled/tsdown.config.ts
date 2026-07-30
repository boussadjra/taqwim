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
    format: ['esm', 'commonjs'],
    target: 'esnext',
    external: ['vue', '@taqwim/core', '@taqwim/calendar-core', '@taqwim/vue', '@taqwim/themes'],
  },
])
