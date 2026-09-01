# Taqwim

## Overview

Taqwim provides utilities for converting, validating, formatting and calculating
Hijri dates. Umm al-Qura is the compatible default; deterministic Civil and
TBLA calendars are available as explicit opt-ins.

## Installation

```bash
npm install @taqwim/core
```

## Usage

```javascript
import { toHijri } from '@taqwim/core'

const gregorianDate = new Date('2024-03-11')

const hijriDate = toHijri(gregorianDate)

console.log(hijriDate) // { hy: 1445, hm:9, hd: 1 }
```

### Civil and TBLA

Optional calendars use separate entry points, so default users do not bundle
them.

```javascript
import { toHijri } from '@taqwim/core'
import { islamicCivil } from '@taqwim/core/calendars/islamic-civil'

toHijri('2026-08-30', { calendarSystem: islamicCivil })
// { hy: 1448, hm: 3, hd: 16 }
```

Use `@taqwim/core/calendars/islamic-tbla` for the Thursday-epoch TBLA variant.
Both are deterministic tabular algorithms. Omitting `calendarSystem` always
means Umm al-Qura.

See the [calendar-system guide](https://taqwim.vercel.app/guide/calendar-systems/)
for their range, epoch and persistence differences.

## Runtimes

No DOM, nothing from `node:`, and zero production dependencies. The built package is tested on
every release across **runtime × module format × time zone**:

|             | ESM | CommonJS |
| ----------- | --- | -------- |
| **Node** 22 | ✓   | ✓        |
| **Deno** 2  | ✓   | —        |
| **Bun** 1   | ✓   | ✓        |

Deno has no CommonJS column because a Deno consumer resolves the `import`
condition, so there is no CommonJS path to reach.

```sh
bun add @taqwim/core
deno add npm:@taqwim/core
```

Every cell runs under `UTC`, `Asia/Riyadh` and `America/Los_Angeles`, because
this library works in **local** calendar parts on purpose — `toGregorian`
returns local midnight — and that makes the host time zone load-bearing.

What the checks cover, and how to add a runtime:
[packages/core/runtimes](https://github.com/boussadjra/taqwim/tree/main/packages/core/runtimes).

## Docs

- [Full Documentation](https://taqwim.vercel.app)
