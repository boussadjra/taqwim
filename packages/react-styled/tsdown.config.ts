import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  platform: 'neutral',
  dts: true,
  format: ['esm', 'commonjs'],
  target: 'esnext',
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    '@taqwim/core',
    '@taqwim/calendar-core',
    '@taqwim/react',
    '@taqwim/themes',
  ],
})
