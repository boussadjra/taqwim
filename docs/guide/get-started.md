---
outline: deep
---

<script setup>
import { toHijri } from '@taqwim/core';
const gregorianDate = new Date('2024-03-11');

const hijriDate = toHijri(gregorianDate); 
</script>

# Get Started

## Introduction

`@taqwim/core` is a modern date utility library for frontend. It is a lightweight and agnostic utility library for date and time manipulation in frontend.

## Installation

::: code-group

```bash [npm]
npm install @taqwim/core
```

```bash [pnpm]
pnpm add @taqwim/core
```

```bash [yarn]
yarn add @taqwim/core
```

:::

## Usage

```js
import { toHijri } from '@taqwim/core'

const gregorianDate = new Date('2024-03-11')

const hijriDate = toHijri(gregorianDate)
```

output :

    {{ hijriDate}}
