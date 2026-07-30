<script setup lang="ts">
/**
 * The full compound surface, wired up the way the README documents it.
 *
 * Tests mount this rather than the primitives in isolation so that what they
 * exercise is the same composition consumers write.
 */
import type { HijriCalendarRootProps } from '../../src'
import {
  HijriCalendarCell,
  HijriCalendarCellTrigger,
  HijriCalendarGrid,
  HijriCalendarGridBody,
  HijriCalendarGridHead,
  HijriCalendarGridRow,
  HijriCalendarHeadCell,
  HijriCalendarHeader,
  HijriCalendarHeading,
  HijriCalendarNext,
  HijriCalendarPrev,
  HijriCalendarRoot,
} from '../../src'

defineProps<HijriCalendarRootProps>()
</script>

<template>
  <HijriCalendarRoot v-bind="$props" v-slot="{ months, weekDays }">
    <HijriCalendarHeader>
      <HijriCalendarPrev data-testid="prev">‹</HijriCalendarPrev>
      <HijriCalendarHeading data-testid="heading" />
      <HijriCalendarNext data-testid="next">›</HijriCalendarNext>
    </HijriCalendarHeader>

    <HijriCalendarGrid v-for="month in months" :key="month.label" :month="month">
      <HijriCalendarGridHead>
        <HijriCalendarGridRow>
          <HijriCalendarHeadCell v-for="day in weekDays" :key="day">
            {{ day }}
          </HijriCalendarHeadCell>
        </HijriCalendarGridRow>
      </HijriCalendarGridHead>

      <HijriCalendarGridBody>
        <HijriCalendarGridRow v-for="(week, index) in month.weeks" :key="index">
          <HijriCalendarCell v-for="day in week" :key="day.date.hd + '-' + day.date.hm" :day="day">
            <HijriCalendarCellTrigger :day="day" />
          </HijriCalendarCell>
        </HijriCalendarGridRow>
      </HijriCalendarGridBody>
    </HijriCalendarGrid>
  </HijriCalendarRoot>
</template>
