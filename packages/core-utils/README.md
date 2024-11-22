# Taqwim

## Overview

Taqwim provides a collection of utilities and components designed for managing Hijri dates in frontend applications. It includes a Hijri date converter, handler, and format, it uses the Umm al-Qura calendar system and date-fns library.

## Installation

```bash
npm install taqwim-core-utils
```

## Usage

```javascript
import { toHijri } from 'taqwim-core-utils'

const gregorianDate = new Date('2024-03-11')

const hijriDate = toHijri(gregorianDate)

console.log(hijriDate) // { hy: 1445, hm:9, hd: 1 }
```

## Docs

- [Full Documentation](https://taqwim.vercel.app)
