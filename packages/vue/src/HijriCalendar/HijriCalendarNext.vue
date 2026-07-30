<script lang="ts">
export interface HijriCalendarNextSlot {
  default?: (props: { disabled: boolean }) => unknown
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { injectHijriCalendarRootContext } from './context'

defineSlots<HijriCalendarNextSlot>()

defineOptions({
  name: 'HijriCalendarNext',
  inheritAttrs: false,
})

const { store, state } = injectHijriCalendarRootContext()

const buttonProps = computed(() => {
  void state.value
  return store.getNextButtonProps()
})

const disabled = computed(() => state.value.isNextDisabled)
</script>

<template>
  <button v-bind="{ ...buttonProps, ...$attrs }" :disabled="disabled" @click="store.nextPage()">
    <slot :disabled="disabled" />
  </button>
</template>
