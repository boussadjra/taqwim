# Taqwim

## Overview

Taqwim provides a collection of utilities and components designed for managing Hijri dates in frontend applications. It includes a Hijri date converter, handler, and format, it uses the Umm al-Qura calendar system and date-fns library.

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

## Runtimes

No DOM, nothing from `node:`, and one dependency. The built package is tested on
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
