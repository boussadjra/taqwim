# Taqwim

[![npm version](https://img.shields.io/npm/v/@taqwim/core.svg)](https://www.npmjs.com/package/@taqwim/core)
[![CI Status](https://github.com/boussadjra/taqwim/workflows/CI/badge.svg)](https://github.com/boussadjra/taqwim/actions)
[![Vue Version](https://img.shields.io/badge/vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive Hijri (Islamic) date library for JavaScript applications, providing accurate Umm al-Qura calendar conversion, date arithmetic, formatting, and Vue 3 components.

## Features

- 🗓️ **Accurate Conversion**: Hijri ↔ Gregorian using the Umm al-Qura calendar
- 📦 **Tree-shakeable**: Import only what you need — each function is independently importable
- 🧮 **Full Date Arithmetic**: Add/subtract days, weeks, months, quarters, years, and business days
- 📐 **Comparison & Validation**: Equality, ordering, and date validation utilities
- 🎨 **14 Themes**: Dark, modern, Islamic, neon, ocean, cyberpunk, and more
- 🧩 **Headless Calendar**: Compound component API for full layout control
- 📚 **TypeScript**: Strict types with full declaration files
- 🌍 **i18n**: Arabic, English, French — with RTL support
- ⚡ **Lightweight**: Optimized bundle size, zero framework deps in core
- 🧪 **Well Tested**: Vitest unit tests + Playwright E2E

## Packages

| Package                           | Version                                                                                             | Description                            |
| --------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------- |
| [`@taqwim/core`](./packages/core) | [![npm](https://img.shields.io/npm/v/@taqwim/core.svg)](https://www.npmjs.com/package/@taqwim/core) | Core Hijri date utilities              |
| [`taqwim-vue`](./packages/vue)    | [![npm](https://img.shields.io/npm/v/taqwim-vue.svg)](https://www.npmjs.com/package/taqwim-vue)     | Vue 3 calendar & datepicker components |

## Quick Start

### Core Utils

```bash
npm install @taqwim/core
# or
pnpm add @taqwim/core
```

```typescript
import { toHijri, toGregorian, formatHijriDate } from '@taqwim/core'

// Convert Gregorian to Hijri
const hijriDate = toHijri(new Date('2024-03-11'))
// => { hy: 1445, hm: 9, hd: 1 }

// Convert Hijri to Gregorian (local midnight)
const gregorian = toGregorian({ hy: 1445, hm: 9, hd: 1 })
// => Mon Mar 11 2024 00:00:00

// Format with locale
const formatted = formatHijriDate(hijriDate, 'iYYYY/iMM/iDD', 'ar')
// => ١٤٤٥/٠٩/٠١
```

### Vue Components

```bash
npm install taqwim-vue
# or
pnpm add taqwim-vue
```

```vue
<template>
  <HijriCalendar v-model="selectedDate" theme="islamic" locale="ar" />
</template>

<script setup>
import { ref } from 'vue'
import { HijriCalendar } from 'taqwim-vue'
import 'taqwim-vue/style.css'

const selectedDate = ref({ hy: 1446, hm: 1, hd: 1 })
</script>
```

## Core API Reference

### Types

```typescript
interface HijriDateObject {
  hy: number
  hm: number
  hd: number
}
interface HijriDuration {
  years: number
  months: number
  days: number
  weeks: number
}
type ValidHijriDate = HijriDateObject | `${number}/${'/' | '-'}${number}/${'/' | '-'}${number}`
```

### Date Conversion

| Function                 | Description                                            |
| ------------------------ | ------------------------------------------------------ |
| `toHijri(date)`          | Convert `Date`, string, or number to `HijriDateObject` |
| `toGregorian(hijriDate)` | Convert `HijriDateObject` to `Date`                    |

### Date Arithmetic — Addition

| Function                               | Description                                         |
| -------------------------------------- | --------------------------------------------------- |
| `addHijri(date, duration)`             | Add years, months, weeks, and days in one call      |
| `addHijriDays(date, n)`                | Add `n` days                                        |
| `addHijriWeeks(date, n)`               | Add `n` weeks                                       |
| `addHijriMonths(date, n)`              | Add `n` months (adjusts day-of-month)               |
| `addHijriQuarters(date, n)`            | Add `n` quarters (3-month periods)                  |
| `addHijriYears(date, n)`               | Add `n` years                                       |
| `addHijriBusinessDays(date, n, opts?)` | Add `n` business days (weekend defaults to Fri–Sat) |

### Date Arithmetic — Subtraction

| Function                               | Description                                              |
| -------------------------------------- | -------------------------------------------------------- |
| `subHijri(date, duration)`             | Subtract years, months, weeks, and days in one call      |
| `subHijriDays(date, n)`                | Subtract `n` days                                        |
| `subHijriWeeks(date, n)`               | Subtract `n` weeks                                       |
| `subHijriMonths(date, n)`              | Subtract `n` months                                      |
| `subHijriQuarters(date, n)`            | Subtract `n` quarters                                    |
| `subHijriYears(date, n)`               | Subtract `n` years                                       |
| `subHijriBusinessDays(date, n, opts?)` | Subtract `n` business days (weekend defaults to Fri–Sat) |

Business days skip the weekend, which defaults to **Friday and Saturday** — the
working week across most of the Arab world. Pass a different one where needed:

```typescript
import { addHijriBusinessDays } from '@taqwim/core'

// Default: Friday/Saturday weekend
addHijriBusinessDays({ hy: 1445, hm: 9, hd: 1 }, 20)

// Western Saturday/Sunday weekend
addHijriBusinessDays({ hy: 1445, hm: 9, hd: 1 }, 20, { weekend: [6, 0] })

// Single-day weekend
addHijriBusinessDays({ hy: 1445, hm: 9, hd: 1 }, 20, { weekend: [5] })
```

### Supported range

Conversion is table-driven (Umm al-Qura), covering **1343–1500 AH**
(1924–2076 CE). Dates outside that range throw a `HijriRangeError` rather than
returning a silently incorrect result:

```typescript
import { HijriRangeError, MIN_HIJRI_YEAR, MAX_HIJRI_YEAR, toGregorian } from '@taqwim/core'

try {
  toGregorian({ hy: 1200, hm: 1, hd: 1 })
} catch (error) {
  if (error instanceof HijriRangeError) {
    console.warn(`Supported range is ${MIN_HIJRI_YEAR}-${MAX_HIJRI_YEAR} AH`)
  }
}
```

### Comparison

| Function                     | Description                  |
| ---------------------------- | ---------------------------- |
| `isEqual(a, b)`              | Check if two dates are equal |
| `isGreaterThan(a, b)`        | Check if `a > b`             |
| `isGreaterThanOrEqual(a, b)` | Check if `a >= b`            |
| `isLessThan(a, b)`           | Check if `a < b`             |
| `isLessThanOrEqual(a, b)`    | Check if `a <= b`            |

### Validation & Info

| Function                     | Description                                             |
| ---------------------------- | ------------------------------------------------------- |
| `isValidHijriDate(date)`     | Validate a Hijri date (object or string)                |
| `getDaysLengthInMonth(date)` | Get number of days in a Hijri month (29 or 30)          |
| `getDayInWeek(date)`         | Get day of week (0=Sun … 6=Sat)                         |
| `getMonthAdjacentDays(date)` | Get previous/next month padding days for calendar grids |

### Formatting & Parsing

| Function                                 | Description                                                        |
| ---------------------------------------- | ------------------------------------------------------------------ |
| `formatHijriDate(date, format, locale?)` | Format using tokens: `iYYYY`, `iMM`, `iDD`, `iMMMM`, etc.          |
| `parseDateString(str)`                   | Parse `"yyyy-MM-dd"` or `"dd/MM/yyyy"` string to `HijriDateObject` |
| `normalizeHijriDate(date)`               | Normalize `ValidHijriDate` to `HijriDateObject`                    |
| `getLocaleData(locale, key)`             | Get locale-specific month names, weekday names, etc.               |

### Locales

Built-in locales: `en` (English), `ar` (Arabic), `fr` (French)

Each locale provides: month names (long/medium/short), weekday names (long/medium/short), and time unit labels.

## Vue Components

### HijriCalendar

A themed, feature-rich calendar component with headless compound sub-components.

```vue
<HijriCalendar
  v-model="date"
  theme="modern"
  size="default"
  locale="ar"
  :min-value="{ hy: 1445, hm: 1, hd: 1 }"
  :max-value="{ hy: 1446, hm: 12, hd: 30 }"
  :week-starts-on="6"
  :fixed-weeks="true"
  :multiple="false"
  :disabled="false"
  :readonly="false"
  dir="rtl"
/>
```

**Key Props:**

- `theme` — `'default'` | `'dark'` | `'modern'` | `'islamic'` | `'minimal'` | `'neon'` | `'ocean'` | `'sunset'` | `'cyberpunk'` | `'nature'` | `'minimalist'` | `'luxurious'` | `'material'` | `'custom'`
- `size` — `'compact'` | `'default'` | `'large'`
- `locale` — `'en'` | `'ar'` | `'fr'`
- `multiple` — Enable multi-date selection
- `minValue` / `maxValue` — Date range constraints
- `weekStartsOn` — `0` (Sun) to `6` (Sat)
- `fixedWeeks` — Always render 6 weeks
- `isDateDisabled` / `isDateUnavailable` — Callback to disable/mark dates
- `dir` — `'ltr'` | `'rtl'`

**Slots:** `header`, `prev-button`, `next-button`, `weekday`, `cell`, `default`

### Headless Compound Components

For full layout control, use the sub-components directly:

```vue
<HijriCalendarRoot v-model="date" locale="en">
  <HijriCalendarHeader>
    <HijriCalendarPrev />
    <HijriCalendarHeading />
    <HijriCalendarNext />
  </HijriCalendarHeader>
  <HijriCalendarGrid>
    <HijriCalendarGridHead>
      <HijriCalendarGridRow>
        <HijriCalendarHeadCell />
      </HijriCalendarGridRow>
    </HijriCalendarGridHead>
    <HijriCalendarGridBody>
      <HijriCalendarGridRow>
        <HijriCalendarCell>
          <HijriCalendarCellTrigger />
        </HijriCalendarCell>
      </HijriCalendarGridRow>
    </HijriCalendarGridBody>
  </HijriCalendarGrid>
</HijriCalendarRoot>
```

### DatePicker

A compact date picker with month/year navigation and view mode switching.

```vue
<DatePicker
  v-model="date"
  v-model:formatted-value="formatted"
  locale="en"
  format="iYYYY/iMM/iD"
  :show-adjacent-days="true"
  view-mode="month"
/>
```

**Props:** `modelValue`, `formattedValue`, `locale`, `format`, `title`, `viewMode` (`'month'` | `'months'` | `'years'`), `weekDayFormat`, `monthFormat`, `showAdjacentDays`

**Slots:** `title`, `header`, `controls`, `month`, `mode`, `prev`, `next`, `weekdays`, `days`, `months`, `years`

### Composables

| Composable                | Description                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `useHijriLocale(locale?)` | Reactive locale management — exposes `localeData`, `isRtl`, `direction`, `setLocale()` |

### CSS Themes

Import a single theme or the base styles:

```typescript
// Base styles (required)
import 'taqwim-vue/style.css'

// Individual themes (optional, pick one)
import 'taqwim-vue/hijri-calendar-dark.css'
import 'taqwim-vue/hijri-calendar-modern.css'
import 'taqwim-vue/hijri-calendar-islamic.css'
import 'taqwim-vue/hijri-calendar-neon.css'
import 'taqwim-vue/hijri-calendar-ocean.css'
import 'taqwim-vue/hijri-calendar-sunset.css'
import 'taqwim-vue/hijri-calendar-cyberpunk.css'
import 'taqwim-vue/hijri-calendar-nature.css'
import 'taqwim-vue/hijri-calendar-minimalist.css'
import 'taqwim-vue/hijri-calendar-luxurious.css'
import 'taqwim-vue/hijri-calendar-material.css'

// Or use minimal.css for a bare-bones base
import 'taqwim-vue/minimal.css'
```

## Development

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Setup

```bash
git clone https://github.com/boussadjra/taqwim.git
cd taqwim
pnpm install
pnpm test
```

### Scripts

| Command              | Description                |
| -------------------- | -------------------------- |
| `pnpm test`          | Run all tests (core + Vue) |
| `pnpm build`         | Build all packages         |
| `pnpm core:test`     | Core utils unit tests      |
| `pnpm core:build`    | Build core utils           |
| `pnpm vue:test`      | Vue component unit tests   |
| `pnpm vue:build`     | Build Vue package          |
| `pnpm vue:test:e2e`  | Playwright E2E tests       |
| `pnpm vue:play:dev`  | Vue development playground |
| `pnpm lint`          | ESLint with auto-fix       |
| `pnpm format`        | Prettier format            |
| `pnpm docs:dev`      | Documentation dev server   |
| `pnpm docs:build`    | Build documentation        |
| `pnpm test:coverage` | Run with coverage          |

### Releasing

This project uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing.

```bash
# 1. Create a changeset describing your changes
pnpm changeset

# 2. Version packages (updates package.json + CHANGELOG)
pnpm version-packages

# 3. Publish to npm (builds, tests, then publishes)
pnpm release
```

On push to `main`, the CI automatically creates a release PR or publishes if changesets are consumed.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow, code standards, and PR guidelines.

## Browser Support

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.

## License

[MIT](LICENSE)

## Support

- 📖 [Documentation](https://taqwim.netlify.app/)
- 💬 [GitHub Discussions](https://github.com/boussadjra/taqwim/discussions)
- 🐛 [Issue Tracker](https://github.com/boussadjra/taqwim/issues)

Made with ❤️ by [Brahim Boussadjra](https://github.com/boussadjra)
