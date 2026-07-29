<script lang="ts">
import type { HijriDateObject } from '@taqwim/core'

export interface HijriCalendarPrevProps {
  /** The function to be used for the previous page. Overwrites the `prevPage` function set on the `HijriCalendarRoot`. */
  prevPage?: (placeholder: HijriDateObject) => HijriDateObject
  /** Additional HTML attributes */
  [key: string]: any
}

export interface HijriCalendarPrevSlot {
  default?: (props: {
    /** Current disable state */
    disabled: boolean
  }) => any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { injectHijriCalendarRootContext } from './HijriCalendarRoot.vue'

const props = defineProps<HijriCalendarPrevProps>()
defineSlots<HijriCalendarPrevSlot>()

const rootContext = injectHijriCalendarRootContext()

const disabled = computed(() => rootContext.disabled.value || rootContext.isPrevButtonDisabled(props.prevPage))

function handleClick() {
  if (disabled.value) return
  rootContext.prevPage(props.prevPage)
}
</script>

<template>
  <button
    type="button"
    :aria-label="`Go to previous page`"
    :aria-disabled="disabled"
    :data-disabled="disabled ? '' : undefined"
    :disabled="disabled"
    @click="handleClick"
    v-bind="$attrs"
  >
    <slot :disabled="disabled" />
  </button>
</template>
