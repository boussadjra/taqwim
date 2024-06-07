<script setup lang="ts">
import { toHijri, formatHijriDate } from 'taqwim-core-utils'
import { format } from 'date-fns'
</script>

<template>
  <div class="flex justify-center p-4" dir="rtl">
    {{ format(new Date(), 'yyyy-Mo-dd') }}
    <br />
    {{ toHijri(new Date()) }}
    <br />
    {{
      formatHijriDate(
        {
          hy: 1445,
          hm: 9,
          hd: 1,
        },
        'iYYYY-iMMMM-iDD <> yyyy-MMMM-dd',
        'ar',
      )
    }}
  </div>
</template>
