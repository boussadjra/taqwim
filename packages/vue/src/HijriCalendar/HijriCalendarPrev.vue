<script lang="ts">
export interface HijriCalendarPrevSlot {
  default?: (props: { disabled: boolean }) => unknown
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { injectHijriCalendarRootContext } from './context'

defineSlots<HijriCalendarPrevSlot>()

defineOptions({
  name: 'HijriCalendarPrev',
  inheritAttrs: false,
})

const { store, state } = injectHijriCalendarRootContext()

const buttonProps = computed(() => {
  void state.value
  return store.getPrevButtonProps()
})

const disabled = computed(() => state.value.isPrevDisabled)
</script>

<template>
  <button v-bind="{ ...buttonProps, ...$attrs }" :disabled="disabled" @click="store.prevPage()">
    <slot :disabled="disabled" />
  </button>
</template>
