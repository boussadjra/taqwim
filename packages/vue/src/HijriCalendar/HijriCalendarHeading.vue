<script lang="ts">
export interface HijriCalendarHeadingProps {
  /** Additional HTML attributes */
  [key: string]: any
}
</script>

<script setup lang="ts">
import { injectHijriCalendarRootContext } from './HijriCalendarRoot.vue'

defineProps<HijriCalendarHeadingProps>()

const rootContext = injectHijriCalendarRootContext()
</script>

<template>
  <div :data-disabled="rootContext.disabled.value ? '' : undefined" v-bind="$attrs">
    <slot>
      {{ rootContext.headingValue.value }}
    </slot>
  </div>
</template>
