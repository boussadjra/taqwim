<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from 'taqwim-vue'

const date = ref({ hy: 1446, hm: 1, hd: 7 })

const formattedDate = ref('1446/01/07')
</script>

<template>
  <div class="flex flex-col items-center p-4">
    <div class="font-bold">
      {{ date }}
    </div>
    <div class="font-bold">
      {{ formattedDate }}
    </div>
    <div>
      <DatePicker v-model="date" v-model:formatted-value="formattedDate" format="iD iMMM, iYYYY" />
    </div>
  </div>
</template>
