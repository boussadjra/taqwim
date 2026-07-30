<script lang="ts">
export interface HijriCalendarHeadingSlot {
  default?: (props: { headingValue: string }) => unknown
}
</script>

<script setup lang="ts">
import { injectHijriCalendarRootContext } from './context'

defineSlots<HijriCalendarHeadingSlot>()

defineOptions({ name: 'HijriCalendarHeading' })

const { state } = injectHijriCalendarRootContext()
</script>

<template>
  <div :data-taqwim-calendar-heading="''" :data-disabled="state.disabled ? '' : undefined">
    <slot :heading-value="state.headingValue">
      {{ state.headingValue }}
    </slot>
  </div>
</template>
