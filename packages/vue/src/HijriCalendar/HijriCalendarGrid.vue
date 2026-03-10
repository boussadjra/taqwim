<script lang="ts">
export interface HijriCalendarGridProps {
  /** Additional HTML attributes */
  [key: string]: any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { injectHijriCalendarRootContext } from './HijriCalendarRoot.vue'

defineProps<HijriCalendarGridProps>()

const rootContext = injectHijriCalendarRootContext()
const disabled = computed(() => (rootContext.disabled.value ? true : undefined))
const readonly = computed(() => (rootContext.readonly.value ? true : undefined))
</script>

<template>
  <div
    tabindex="-1"
    role="grid"
    :aria-readonly="readonly"
    :aria-disabled="disabled"
    :data-readonly="readonly && ''"
    :data-disabled="disabled && ''"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
