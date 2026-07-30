<script setup lang="ts">
import type { HijriDateObject } from '@taqwim/core'
import { HijriDatePicker } from '@taqwim/vue-styled'
import { ref } from 'vue'

const value = ref<HijriDateObject>()
const arabic = ref<HijriDateObject>()
const readOnlyInput = ref<HijriDateObject>({ hy: 1446, hm: 9, hd: 1 })
</script>

<template>
  <div class="stack">
    <section>
      <h2>Typed or picked</h2>
      <HijriDatePicker v-model="value" label="Appointment date" />
      <p>Accepts <code>1446-09-01</code> or <code>01/09/1446</code>. Unparseable text reverts.</p>
      <pre>{{ value ?? 'null' }}</pre>
    </section>

    <section>
      <h2>Arabic, right to left</h2>
      <HijriDatePicker v-model="arabic" locale="ar" dir="rtl" theme="islamic" format="iD iMMMM iYYYY" />
      <pre>{{ arabic ?? 'null' }}</pre>
    </section>

    <section>
      <h2>Pick only</h2>
      <HijriDatePicker v-model="readOnlyInput" :editable="false" theme="material" />
      <pre>{{ readOnlyInput }}</pre>
    </section>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
}

section {
  min-width: 18rem;
}

h2 {
  font-size: 1rem;
  margin: 0 0 0.75rem;
}

p {
  max-width: 22rem;
  font-size: 0.8125rem;
  opacity: 0.75;
}

pre {
  font-size: 0.75rem;
  background: #f4f4f5;
  padding: 0.5rem;
  border-radius: 0.25rem;
}
</style>
