<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from 'taqwim-vue'
import { formatHijriDate } from 'taqwim-core-utils'

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
      <DatePicker
        v-model="date"
        v-model:formatted-value="formattedDate"
        format="iYYYY/iMM/iD"
        :showAdjacentDays="false"
      >
        <template #header>
          <div class="v-picker__header">
            <div class="v-date-picker-header">
              <div class="v-date-picker-header__content">{{ formatHijriDate(date, 'iEEEE, iDD  iMMMM', 'en') }}</div>
            </div>
          </div>
        </template>
        <template #prev="{ prevMonth }">
          <button @click="prevMonth()">Prev</button>
        </template>
      </DatePicker>
    </div>
  </div>
</template>
