<script lang="ts">
export interface HijriCalendarGridHeadSlot {
  default?: (props: { weekDays: string[] }) => unknown
}
</script>

<script setup lang="ts">
import { injectHijriCalendarRootContext } from './context'

defineSlots<HijriCalendarGridHeadSlot>()

defineOptions({ name: 'HijriCalendarGridHead' })

const { state } = injectHijriCalendarRootContext()
</script>

<template>
  <!-- The weekday row duplicates each cell's accessible label, so it is hidden
       from assistive technology rather than read out twice. -->
  <div aria-hidden="true" :data-taqwim-calendar-grid-head="''">
    <slot :week-days="state.weekDays" />
  </div>
</template>
