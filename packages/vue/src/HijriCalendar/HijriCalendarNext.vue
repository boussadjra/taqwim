<script lang="ts">
import type { HijriDateObject } from '@taqwim/core'

export interface HijriCalendarNextProps {
  /** The function to be used for the next page. Overwrites the `nextPage` function set on the `HijriCalendarRoot`. */
  nextPage?: (placeholder: HijriDateObject) => HijriDateObject
  /** Additional HTML attributes */
  [key: string]: any
}

export interface HijriCalendarNextSlot {
  default?: (props: {
    /** Current disable state */
    disabled: boolean
  }) => any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { injectHijriCalendarRootContext } from './HijriCalendarRoot.vue'

const props = defineProps<HijriCalendarNextProps>()
defineSlots<HijriCalendarNextSlot>()

const rootContext = injectHijriCalendarRootContext()

const disabled = computed(() => rootContext.disabled.value || rootContext.isNextButtonDisabled(props.nextPage))

function handleClick() {
  if (disabled.value) return
  rootContext.nextPage()
}
</script>

<template>
  <button
    type="button"
    :aria-label="`Go to next page`"
    :aria-disabled="disabled"
    :data-disabled="disabled ? '' : undefined"
    :disabled="disabled"
    @click="handleClick"
    v-bind="$attrs"
  >
    <slot :disabled="disabled" />
  </button>
</template>
