import { brotliCompressSync, constants, gzipSync } from 'node:zlib'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { build } from 'vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const packages = {
  '@taqwim/core': resolve(root, 'packages/core/dist/index.mjs'),
  '@taqwim/core/calendars/islamic-civil': resolve(root, 'packages/core/dist/calendars/islamic-civil.mjs'),
  '@taqwim/core/calendars/islamic-tbla': resolve(root, 'packages/core/dist/calendars/islamic-tbla.mjs'),
  '@taqwim/core/calendars/islamic-umalqura': resolve(root, 'packages/core/dist/calendars/islamic-umalqura.mjs'),
  '@taqwim/calendar-core': resolve(root, 'packages/calendar-core/dist/index.js'),
  '@taqwim/vue': resolve(root, 'packages/vue/dist/index.js'),
  '@taqwim/react': resolve(root, 'packages/react/dist/index.js'),
}

const fixtures = [
  {
    name: 'Default conversion',
    source: `import { toGregorian, toHijri } from '@taqwim/core';
export const result = [toHijri(2026, 8, 30), toGregorian(1448, 3, 17)];`,
  },
  {
    name: 'Default arithmetic',
    source: `import { addHijri, addHijriBusinessDays, addHijriDays, addHijriMonths, addHijriYears, subHijri } from '@taqwim/core';
const date = { hy: 1448, hm: 3, hd: 17 };
export const result = [addHijri(date, { years: 1, months: 2, weeks: 3, days: 4 }), addHijriBusinessDays(date, 5), addHijriDays(date, 1), addHijriMonths(date, 1), addHijriYears(date, 1), subHijri(date, { years: 1, months: 2, weeks: 3, days: 4 })];`,
  },
  {
    name: 'Default formatter',
    source: `import { formatHijriDate } from '@taqwim/core';
export const result = formatHijriDate({ hy: 1448, hm: 3, hd: 17 }, 'iEEEE, iD iMMMM iYYYY — yyyy-MM-dd', 'ar');`,
  },
  {
    name: 'Representative core',
    source: `import { addHijriBusinessDays, formatHijriDate, getDayInWeek, getMonthAdjacentDays, isValidHijriDate, toGregorian, toHijri } from '@taqwim/core';
const date = toHijri(2026, 8, 30);
export const result = date && [toGregorian(date), addHijriBusinessDays(date, 10), formatHijriDate(date, 'iD iMMMM iYYYY', 'en'), getDayInWeek(date), getMonthAdjacentDays(date), isValidHijriDate(date)];`,
  },
  {
    name: 'calendar-core default',
    source: `import { createCalendar } from '@taqwim/calendar-core';
export const result = createCalendar({ defaultPlaceholder: { hy: 1448, hm: 3, hd: 1 }, showGregorian: true }).getSnapshot();`,
  },
  {
    name: 'React calendar default',
    source: `import { HijriCalendarRoot } from ${JSON.stringify(packages['@taqwim/react'].replaceAll('\\', '/'))};
globalThis.__taqwimBundleResult = HijriCalendarRoot;`,
    external: ['react', 'react-dom', 'react/jsx-runtime'],
  },
  {
    name: 'Civil opt-in',
    requires: ['@taqwim/core/calendars/islamic-civil'],
    source: `import { toGregorian, toHijri } from '@taqwim/core';
import { islamicCivil } from '@taqwim/core/calendars/islamic-civil';
export const result = [toHijri(2026, 8, 30, { calendarSystem: islamicCivil }), toGregorian(1448, 3, 17, { calendarSystem: islamicCivil })];`,
  },
  {
    name: 'TBLA opt-in',
    requires: ['@taqwim/core/calendars/islamic-tbla'],
    source: `import { toGregorian, toHijri } from '@taqwim/core';
import { islamicTbla } from '@taqwim/core/calendars/islamic-tbla';
export const result = [toHijri(2026, 8, 30, { calendarSystem: islamicTbla }), toGregorian(1448, 3, 17, { calendarSystem: islamicTbla })];`,
  },
  {
    name: 'All built-ins',
    requires: [
      '@taqwim/core/calendars/islamic-civil',
      '@taqwim/core/calendars/islamic-tbla',
      '@taqwim/core/calendars/islamic-umalqura',
    ],
    source: `import { toGregorian, toHijri } from '@taqwim/core';
import { islamicCivil } from '@taqwim/core/calendars/islamic-civil';
import { islamicTbla } from '@taqwim/core/calendars/islamic-tbla';
import { islamicUmmAlQura } from '@taqwim/core/calendars/islamic-umalqura';
const systems = [islamicUmmAlQura, islamicCivil, islamicTbla];
export const result = systems.map(calendarSystem => [toHijri(2026, 8, 30, { calendarSystem }), toGregorian(1448, 3, 17, { calendarSystem })]);`,
  },
]

function virtualFixture(source) {
  const id = '\0taqwim-bundle-fixture'
  return {
    name: 'taqwim-bundle-fixture',
    resolveId(specifier) {
      if (specifier === 'virtual:fixture') return id
      if (specifier in packages) return packages[specifier]
    },
    load(resolvedId) {
      if (resolvedId === id) return source
    },
  }
}

async function bundle(fixture, minify) {
  const output = await build({
    configFile: false,
    logLevel: 'silent',
    plugins: [virtualFixture(fixture.source)],
    build: {
      write: false,
      minify: minify ? 'esbuild' : false,
      target: 'esnext',
      rollupOptions: {
        input: 'virtual:fixture',
        external: fixture.external ?? [],
        output: { format: 'es', inlineDynamicImports: true },
      },
    },
  })

  const outputs = Array.isArray(output) ? output.flatMap(item => item.output) : output.output
  return outputs
    .filter(item => item.type === 'chunk')
    .map(item => item.code)
    .join('\n')
}

function compressedSizes(code) {
  const bytes = Buffer.byteLength(code)
  return {
    bytes,
    gzip: gzipSync(code, { level: 9 }).byteLength,
    brotli: brotliCompressSync(code, {
      params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
    }).byteLength,
  }
}

const results = []
for (const fixture of fixtures) {
  if (fixture.requires?.some(specifier => !existsSync(packages[specifier]))) {
    results.push({ scenario: fixture.name, available: false })
    continue
  }

  const raw = compressedSizes(await bundle(fixture, false))
  const minified = compressedSizes(await bundle(fixture, true))
  results.push({
    scenario: fixture.name,
    available: true,
    rawEsm: raw.bytes,
    minified: minified.bytes,
    gzip: minified.gzip,
    brotli: minified.brotli,
  })
}

console.table(results)
console.log(JSON.stringify(results, null, 2))
