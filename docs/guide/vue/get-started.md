---
outline: deep
---

<script setup>
import { ref } from 'vue'
import { DatePicker } from 'taqwim-vue'

const date = ref({hy: 1446, hm: 1, hd: 1})
</script>
<style src="taqwim-vue/dist/style.css"></style>

# Get Started

## Introduction

`taqwim-vue` is a set of components and composables that  

## Installation

::: code-group

```bash [npm]
npm install taqwim-vue
```

```bash [pnpm]
pnpm add taqwim-vue
```

```bash [yarn]
yarn add taqwim-vue
```

:::

## Usage

```vue
<script setup>
import { ref } from 'vue'
import { DatePicker } from 'taqwim-vue'

const date = ref({hy: 1446, hm: 1, hd: 1})
</script>

<template>
  <DatePicker v-model="date" />
</template>
```

output :

  <DatePicker v-model="date" />
