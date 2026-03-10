import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'
import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

export default defineConfig([
  {
    entry: ['./src/index.ts'],
    platform: 'neutral',

    plugins: [Vue({ isProduction: true })],
    dts: { vue: true },
    format: ['esm', 'commonjs'],
    target: 'esnext',
    onSuccess: () => {
      // Copy CSS files after build
      const styleDir = './dist/style'
      if (!existsSync(styleDir)) {
        mkdirSync(styleDir, { recursive: true })
      }

      const cssFiles = [
        'hijri-calendar-variables.css',
        'hijri-calendar.css',
        'hijri-calendar-dark.css',
        'hijri-calendar-default.css',
        'hijri-calendar-islamic.css',
        'hijri-calendar-modern.css',
        'hijri-calendar-neon.css',
        'hijri-calendar-ocean.css',
        'hijri-calendar-sunset.css',
        'hijri-calendar-cyberpunk.css',
        'hijri-calendar-nature.css',
        'hijri-calendar-minimalist.css',
        'hijri-calendar-luxurious.css',
        'hijri-calendar-material.css',
        'minimal.css',
      ]

      cssFiles.forEach(file => {
        try {
          copyFileSync(join('./src/style', file), join(styleDir, file))
          console.log(`Copied ${file} to dist/style/`)
        } catch (error) {
          console.warn(`Failed to copy ${file}:`, error.message)
        }
      })
    },
  },
])
