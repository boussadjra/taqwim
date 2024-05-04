---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "@taqwim/docs"
  text: "Docs for taqwim date picker and calendar"
  tagline:  "A modern date utility library for frontend"
  actions:
    - theme: brand
      text: Get Started
      link: /guide
    - theme: alt
      text: API Reference
      link: /api

features:
  - title: Agnostic
    details: Agnostic utility library for date and time manipulation in frontend
  - title: Modern
    details: Modern utility library for date and time manipulation in frontend
  - title: Lightweight
    details: Lightweight utility library for date and time manipulation in frontend
---

<script setup>
import { ref } from 'vue'
import {double} from '@taqwim/core-utils'

const count = ref(0)
</script>

## Markdown Content

The count is: {{ double(count) }}

<button :class="$style.button" @click="count++">Increment</button>

<style module>
.button {
  color: red;
  font-weight: bold;
}
</style>