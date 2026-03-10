# HijriCalendar Components

A comprehensive set of headless Vue 3 components for building accessible Hijri (Islamic) calendars. Built following reka-ui patterns and best practices.

## Features

- 🗓️ **Complete Hijri Calendar Support** - Full Islamic calendar implementation
- ♿ **Accessibility First** - WCAG compliant with proper ARIA attributes
- 🎨 **Headless Design** - Completely customizable styling
- 🌍 **Internationalization** - Support for Arabic, English, and French locales
- ⌨️ **Keyboard Navigation** - Full keyboard support
- 📱 **RTL Support** - Built-in right-to-left layout support
- 🎯 **TypeScript** - Full type safety and IntelliSense
- 🔧 **Composable** - Small, focused components that work together
- 🎭 **Multiple Themes** - Default, Dark, Modern, and Islamic themes included

## Installation

```bash
npm install taqwim-vue taqwim-core-utils
```

## Basic Usage

```vue
<template>
  <HijriCalendarRoot v-model="selectedDate" locale="ar">
    <HijriCalendarHeader class="calendar-header">
      <HijriCalendarPrev class="nav-button">←</HijriCalendarPrev>
      <HijriCalendarHeading class="heading" />
      <HijriCalendarNext class="nav-button">→</HijriCalendarNext>
    </HijriCalendarHeader>

    <HijriCalendarGrid class="calendar-grid">
      <HijriCalendarGridHead>
        <HijriCalendarGridRow class="weekdays-row">
          <HijriCalendarHeadCell v-for="day in weekDays" :key="day" class="weekday-cell">
            {{ day }}
          </HijriCalendarHeadCell>
        </HijriCalendarGridRow>
      </HijriCalendarGridHead>

      <HijriCalendarGridBody>
        <HijriCalendarGridRow v-for="(week, index) in grid" :key="index" class="week-row">
          <HijriCalendarCell
            v-for="day in week"
            :key="`${day.date.hy}-${day.date.hm}-${day.date.hd}`"
            :date="day.date"
            class="day-cell"
          >
            <HijriCalendarCellTrigger :day="day.date" :month="day.date" class="day-button">
              {{ day.dayInMonth }}
            </HijriCalendarCellTrigger>
          </HijriCalendarCell>
        </HijriCalendarGridRow>
      </HijriCalendarGridBody>
    </HijriCalendarGrid>
  </HijriCalendarRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  HijriCalendarRoot,
  HijriCalendarHeader,
  HijriCalendarHeading,
  HijriCalendarPrev,
  HijriCalendarNext,
  HijriCalendarGrid,
  HijriCalendarGridHead,
  HijriCalendarGridBody,
  HijriCalendarGridRow,
  HijriCalendarHeadCell,
  HijriCalendarCell,
  HijriCalendarCellTrigger,
} from 'taqwim-vue'
import type { HijriDateObject } from 'taqwim-core-utils'

const selectedDate = ref<HijriDateObject>()
</script>
```

## Components

### HijriCalendarRoot

The root component that provides context and state management for all child components.

#### Props

| Prop                | Type                                                | Default            | Description                                            |
| ------------------- | --------------------------------------------------- | ------------------ | ------------------------------------------------------ |
| `modelValue`        | `HijriDateObject \| HijriDateObject[] \| undefined` | `undefined`        | The selected date(s)                                   |
| `placeholder`       | `HijriDateObject`                                   | Today's Hijri date | The month to display when no date is selected          |
| `locale`            | `'ar' \| 'en' \| 'fr'`                              | `'ar'`             | The locale for formatting dates                        |
| `weekStartsOn`      | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6`                   | `0`                | The day of the week to start the calendar (0 = Sunday) |
| `weekdayFormat`     | `WeekDayFormat`                                     | `'weekDaysMedium'` | Format for weekday names                               |
| `monthFormat`       | `MonthFormat`                                       | `'monthsMedium'`   | Format for month names                                 |
| `multiple`          | `boolean`                                           | `false`            | Allow multiple date selection                          |
| `preventDeselect`   | `boolean`                                           | `false`            | Prevent deselecting the current date                   |
| `disabled`          | `boolean`                                           | `false`            | Disable the entire calendar                            |
| `readonly`          | `boolean`                                           | `false`            | Make the calendar read-only                            |
| `fixedWeeks`        | `boolean`                                           | `false`            | Always show 6 weeks                                    |
| `pagedNavigation`   | `boolean`                                           | `false`            | Navigate by number of months displayed                 |
| `numberOfMonths`    | `number`                                            | `1`                | Number of months to display                            |
| `minValue`          | `HijriDateObject`                                   | `undefined`        | Minimum selectable date                                |
| `maxValue`          | `HijriDateObject`                                   | `undefined`        | Maximum selectable date                                |
| `isDateDisabled`    | `(date: HijriDateObject) => boolean`                | `undefined`        | Function to determine if a date is disabled            |
| `isDateUnavailable` | `(date: HijriDateObject) => boolean`                | `undefined`        | Function to determine if a date is unavailable         |
| `dir`               | `'ltr' \| 'rtl'`                                    | `'ltr'`            | Text direction                                         |

#### Events

| Event                | Type                                           | Description                               |
| -------------------- | ---------------------------------------------- | ----------------------------------------- |
| `update:modelValue`  | `(date: HijriDateObject \| undefined) => void` | Emitted when the selected date changes    |
| `update:placeholder` | `(date: HijriDateObject) => void`              | Emitted when the placeholder date changes |

#### Slots

| Slot      | Props                                                      | Description          |
| --------- | ---------------------------------------------------------- | -------------------- |
| `default` | `{ grid, weekDays, date, locale, fixedWeeks, modelValue }` | The calendar content |

### HijriCalendarHeader

Container for the calendar navigation and heading.

#### Props

Accepts all standard HTML attributes via `v-bind="$attrs"`.

### HijriCalendarHeading

Displays the current month and year.

#### Props

Accepts all standard HTML attributes via `v-bind="$attrs"`.

### HijriCalendarPrev

Navigation button to go to the previous month.

#### Props

| Prop       | Type                                         | Default     | Description                                  |
| ---------- | -------------------------------------------- | ----------- | -------------------------------------------- |
| `prevPage` | `(date: HijriDateObject) => HijriDateObject` | `undefined` | Custom function for previous page navigation |

### HijriCalendarNext

Navigation button to go to the next month.

#### Props

| Prop       | Type                                         | Default     | Description                              |
| ---------- | -------------------------------------------- | ----------- | ---------------------------------------- |
| `nextPage` | `(date: HijriDateObject) => HijriDateObject` | `undefined` | Custom function for next page navigation |

### HijriCalendarGrid

Container for the calendar grid.

#### Props

Accepts all standard HTML attributes via `v-bind="$attrs"`.

### HijriCalendarGridHead

Container for the weekday headers.

#### Props

Accepts all standard HTML attributes via `v-bind="$attrs"`.

### HijriCalendarGridBody

Container for the calendar body with date cells.

#### Props

Accepts all standard HTML attributes via `v-bind="$attrs"`.

### HijriCalendarGridRow

Container for a row of calendar cells.

#### Props

Accepts all standard HTML attributes via `v-bind="$attrs"`.

### HijriCalendarHeadCell

Container for a weekday header cell.

#### Props

Accepts all standard HTML attributes via `v-bind="$attrs"`.

### HijriCalendarCell

Container for a date cell.

#### Props

| Prop   | Type              | Description            |
| ------ | ----------------- | ---------------------- |
| `date` | `HijriDateObject` | The date for this cell |

### HijriCalendarCellTrigger

Interactive button for selecting a date.

#### Props

| Prop    | Type              | Description                              |
| ------- | ----------------- | ---------------------------------------- |
| `day`   | `HijriDateObject` | The date value for this cell             |
| `month` | `HijriDateObject` | The month in which this cell is rendered |

#### Data Attributes

| Attribute                   | Description                                         |
| --------------------------- | --------------------------------------------------- |
| `data-selected`             | Present when the date is selected                   |
| `data-today`                | Present when the date is today                      |
| `data-disabled`             | Present when the date is disabled                   |
| `data-unavailable`          | Present when the date is unavailable                |
| `data-outside-view`         | Present when the date is outside the current month  |
| `data-outside-visible-view` | Present when the date is outside the visible months |

## Styling

### Default Theme

Import the default theme:

```css
@import 'taqwim-vue/style/hijri-calendar-default.css';
```

```vue
<HijriCalendarRoot class="hijri-calendar">
  <!-- calendar content -->
</HijriCalendarRoot>
```

### Dark Theme

Import the dark theme:

```css
@import 'taqwim-vue/style/hijri-calendar-dark.css';
```

```vue
<HijriCalendarRoot class="hijri-calendar-dark">
  <!-- calendar content -->
</HijriCalendarRoot>
```

### Modern Theme

Import the modern theme:

```css
@import 'taqwim-vue/style/hijri-calendar-modern.css';
```

```vue
<HijriCalendarRoot class="hijri-calendar-modern">
  <!-- calendar content -->
</HijriCalendarRoot>
```

### Islamic Theme

Import the Islamic theme:

```css
@import 'taqwim-vue/style/hijri-calendar-islamic.css';
```

```vue
<HijriCalendarRoot class="hijri-calendar-islamic" dir="rtl">
  <!-- calendar content -->
</HijriCalendarRoot>
```

### Custom Styling

You can create completely custom styles using the data attributes:

```css
.my-calendar [data-selected] {
  background: #22c55e;
  color: white;
}

.my-calendar [data-today] {
  background: #3b82f6;
  color: white;
}

.my-calendar [data-unavailable] {
  color: #ef4444;
  text-decoration: line-through;
}
```

## Advanced Examples

### Multiple Date Selection

```vue
<template>
  <HijriCalendarRoot v-model="selectedDates" :multiple="true" locale="ar">
    <!-- calendar content -->
  </HijriCalendarRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { HijriDateObject } from 'taqwim-core-utils'

const selectedDates = ref<HijriDateObject[]>([])
</script>
```

### Custom Date Validation

```vue
<template>
  <HijriCalendarRoot v-model="selectedDate" :is-date-disabled="isWeekend" :is-date-unavailable="isHoliday" locale="ar">
    <!-- calendar content -->
  </HijriCalendarRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { HijriDateObject } from 'taqwim-core-utils'
import { getDayInWeek } from 'taqwim-core-utils'

const selectedDate = ref<HijriDateObject>()

const isWeekend = (date: HijriDateObject) => {
  const dayInWeek = getDayInWeek(date)
  return dayInWeek === 5 || dayInWeek === 6 // Friday and Saturday
}

const isHoliday = (date: HijriDateObject) => {
  // Example: 1st of Muharram (New Year)
  return date.hm === 1 && date.hd === 1
}
</script>
```

### Range Selection with Custom Logic

```vue
<template>
  <HijriCalendarRoot v-model="selectedRange" :multiple="true" locale="ar" @update:model-value="handleRangeSelection">
    <!-- calendar content -->
  </HijriCalendarRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { HijriDateObject } from 'taqwim-core-utils'
import { isEqual } from 'taqwim-core-utils'

const selectedRange = ref<HijriDateObject[]>([])

const handleRangeSelection = (dates: HijriDateObject[]) => {
  if (dates.length <= 2) {
    selectedRange.value = dates
  } else {
    // Reset to new range start
    selectedRange.value = [dates[dates.length - 1]]
  }
}
</script>
```

### Multi-Month Display

```vue
<template>
  <HijriCalendarRoot v-model="selectedDate" :number-of-months="3" :paged-navigation="true" locale="ar">
    <!-- calendar content -->
  </HijriCalendarRoot>
</template>
```

### Custom Month Navigation

```vue
<template>
  <HijriCalendarRoot v-model="selectedDate" locale="ar">
    <HijriCalendarHeader>
      <HijriCalendarPrev :prev-page="goBackOneYear"> ⏪ </HijriCalendarPrev>
      <HijriCalendarPrev>←</HijriCalendarPrev>
      <HijriCalendarHeading />
      <HijriCalendarNext>→</HijriCalendarNext>
      <HijriCalendarNext :next-page="goForwardOneYear"> ⏩ </HijriCalendarNext>
    </HijriCalendarHeader>
    <!-- grid content -->
  </HijriCalendarRoot>
</template>

<script setup lang="ts">
import { addHijriYears, subHijriYears } from 'taqwim-core-utils'
import type { HijriDateObject } from 'taqwim-core-utils'

const goBackOneYear = (date: HijriDateObject) => subHijriYears(date, 1) || date

const goForwardOneYear = (date: HijriDateObject) => addHijriYears(date, 1) || date
</script>
```

## Accessibility

The HijriCalendar components are built with accessibility in mind:

- ✅ **ARIA Support**: Proper roles, labels, and states
- ✅ **Keyboard Navigation**: Full keyboard support with Tab, Enter, Arrow keys
- ✅ **Screen Reader Support**: Descriptive labels and announcements
- ✅ **Focus Management**: Proper focus handling and visual indicators
- ✅ **High Contrast**: Works with high contrast modes
- ✅ **RTL Support**: Built-in right-to-left layout support

### Keyboard Shortcuts

| Key               | Action                                  |
| ----------------- | --------------------------------------- |
| `Tab`             | Move focus between interactive elements |
| `Enter` / `Space` | Select the focused date                 |
| `Arrow Keys`      | Navigate between dates                  |
| `Home`            | Go to the first day of the month        |
| `End`             | Go to the last day of the month         |
| `Page Up`         | Go to the previous month                |
| `Page Down`       | Go to the next month                    |

## TypeScript Support

All components include comprehensive TypeScript definitions:

```typescript
import type { HijriCalendarRootProps, HijriCalendarRootEmits, HijriCalendarCellTriggerProps } from 'taqwim-vue'
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
