# HijriCalendar API Reference

Complete API documentation for all HijriCalendar components.

## Table of Contents

1. [HijriCalendarRoot](#hijricalendarroot)
2. [HijriCalendarHeader](#hijricalendarheader)
3. [HijriCalendarHeading](#hijricalendarheading)
4. [HijriCalendarPrev](#hijricalendarprev)
5. [HijriCalendarNext](#hijricalendarnext)
6. [HijriCalendarGrid](#hijricalendargrid)
7. [HijriCalendarGridHead](#hijricalendargridhead)
8. [HijriCalendarGridBody](#hijricalendargridbody)
9. [HijriCalendarGridRow](#hijricalendargridrow)
10. [HijriCalendarHeadCell](#hijricalendarheadcell)
11. [HijriCalendarCell](#hijricalendarcell)
12. [HijriCalendarCellTrigger](#hijricalendarcelltrigger)
13. [Types](#types)
14. [Utilities](#utilities)

## HijriCalendarRoot

The root component that provides context and state management for the entire calendar.

### Props

```typescript
interface HijriCalendarRootProps {
  /** The selected date(s) */
  modelValue?: HijriDateObject | HijriDateObject[]

  /** Default month to display when no date is selected */
  placeholder?: HijriDateObject

  /** Locale for date formatting and display */
  locale?: 'ar' | 'en' | 'fr'

  /** Starting day of the week (0 = Sunday, 6 = Saturday) */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6

  /** Format for weekday names */
  weekdayFormat?: WeekDayFormat

  /** Format for month names */
  monthFormat?: MonthFormat

  /** Allow multiple date selection */
  multiple?: boolean

  /** Prevent deselecting the currently selected date */
  preventDeselect?: boolean

  /** Disable the entire calendar */
  disabled?: boolean

  /** Make the calendar read-only */
  readonly?: boolean

  /** Always show 6 weeks (42 days) */
  fixedWeeks?: boolean

  /** Navigate by the number of months displayed */
  pagedNavigation?: boolean

  /** Number of months to display simultaneously */
  numberOfMonths?: number

  /** Minimum selectable date */
  minValue?: HijriDateObject

  /** Maximum selectable date */
  maxValue?: HijriDateObject

  /** Function to determine if a date should be disabled */
  isDateDisabled?: (date: HijriDateObject) => boolean

  /** Function to determine if a date is unavailable */
  isDateUnavailable?: (date: HijriDateObject) => boolean

  /** Text direction */
  dir?: 'ltr' | 'rtl'
}
```

### Events

```typescript
interface HijriCalendarRootEmits {
  /** Emitted when the selected date changes */
  'update:modelValue': (value: HijriDateObject | HijriDateObject[] | undefined) => void

  /** Emitted when the placeholder (displayed month) changes */
  'update:placeholder': (value: HijriDateObject) => void
}
```

### Slots

```typescript
interface HijriCalendarRootSlots {
  default: {
    /** Calendar grid data */
    grid: CalendarDay[][]

    /** Weekday names in current locale */
    weekDays: string[]

    /** Current displayed date */
    date: HijriDateObject

    /** Current locale */
    locale: 'ar' | 'en' | 'fr'

    /** Whether fixed weeks mode is enabled */
    fixedWeeks: boolean

    /** Currently selected date(s) */
    modelValue: HijriDateObject | HijriDateObject[] | undefined
  }
}
```

### Data Attributes

- `data-readonly`: Present when the calendar is read-only
- `data-disabled`: Present when the calendar is disabled

### Usage

```vue
<template>
  <HijriCalendarRoot
    v-model="selectedDate"
    locale="ar"
    :multiple="false"
    :fixed-weeks="false"
    :is-date-disabled="isWeekend"
  >
    <template #default="{ grid, weekDays }">
      <!-- Calendar content -->
    </template>
  </HijriCalendarRoot>
</template>
```

## HijriCalendarHeader

Container component for calendar navigation and heading elements.

### Props

Inherits all standard HTML div attributes.

### Slots

```typescript
interface HijriCalendarHeaderSlots {
  default: {}
}
```

### Usage

```vue
<template>
  <HijriCalendarHeader class="calendar-header">
    <HijriCalendarPrev />
    <HijriCalendarHeading />
    <HijriCalendarNext />
  </HijriCalendarHeader>
</template>
```

## HijriCalendarHeading

Displays the current month and year.

### Props

Inherits all standard HTML div attributes.

### Slots

```typescript
interface HijriCalendarHeadingSlots {
  default: {
    /** Formatted month and year string */
    headingValue: string
  }
}
```

### Data Attributes

- `data-disabled`: Present when the calendar is disabled

### Usage

```vue
<template>
  <HijriCalendarHeading class="month-heading" />

  <!-- With custom content -->
  <HijriCalendarHeading>
    <template #default="{ headingValue }">
      <strong>{{ headingValue }}</strong>
    </template>
  </HijriCalendarHeading>
</template>
```

## HijriCalendarPrev

Navigation button to go to the previous month.

### Props

```typescript
interface HijriCalendarPrevProps {
  /** Custom function for previous page navigation */
  prevPage?: (date: HijriDateObject) => HijriDateObject
}
```

### Slots

```typescript
interface HijriCalendarPrevSlots {
  default: {}
}
```

### Data Attributes

- `data-disabled`: Present when navigation is disabled

### Usage

```vue
<template>
  <HijriCalendarPrev class="nav-button"> ← Previous </HijriCalendarPrev>

  <!-- With custom navigation -->
  <HijriCalendarPrev :prev-page="goBackOneYear"> ⏪ Previous Year </HijriCalendarPrev>
</template>
```

## HijriCalendarNext

Navigation button to go to the next month.

### Props

```typescript
interface HijriCalendarNextProps {
  /** Custom function for next page navigation */
  nextPage?: (date: HijriDateObject) => HijriDateObject
}
```

### Slots

```typescript
interface HijriCalendarNextSlots {
  default: {}
}
```

### Data Attributes

- `data-disabled`: Present when navigation is disabled

### Usage

```vue
<template>
  <HijriCalendarNext class="nav-button"> Next → </HijriCalendarNext>

  <!-- With custom navigation -->
  <HijriCalendarNext :next-page="goForwardOneYear"> Next Year ⏩ </HijriCalendarNext>
</template>
```

## HijriCalendarGrid

Container for the calendar grid structure.

### Props

Inherits all standard HTML table attributes.

### Slots

```typescript
interface HijriCalendarGridSlots {
  default: {}
}
```

### Usage

```vue
<template>
  <HijriCalendarGrid class="calendar-table" role="grid">
    <HijriCalendarGridHead>
      <!-- Weekday headers -->
    </HijriCalendarGridHead>
    <HijriCalendarGridBody>
      <!-- Calendar days -->
    </HijriCalendarGridBody>
  </HijriCalendarGrid>
</template>
```

## HijriCalendarGridHead

Container for weekday headers.

### Props

Inherits all standard HTML thead attributes.

### Slots

```typescript
interface HijriCalendarGridHeadSlots {
  default: {}
}
```

### Usage

```vue
<template>
  <HijriCalendarGridHead>
    <HijriCalendarGridRow>
      <HijriCalendarHeadCell v-for="day in weekDays" :key="day">
        {{ day }}
      </HijriCalendarHeadCell>
    </HijriCalendarGridRow>
  </HijriCalendarGridHead>
</template>
```

## HijriCalendarGridBody

Container for calendar date cells.

### Props

Inherits all standard HTML tbody attributes.

### Slots

```typescript
interface HijriCalendarGridBodySlots {
  default: {}
}
```

### Usage

```vue
<template>
  <HijriCalendarGridBody>
    <HijriCalendarGridRow v-for="(week, index) in grid" :key="index">
      <!-- Week cells -->
    </HijriCalendarGridRow>
  </HijriCalendarGridBody>
</template>
```

## HijriCalendarGridRow

Container for a row of calendar cells.

### Props

Inherits all standard HTML tr attributes.

### Slots

```typescript
interface HijriCalendarGridRowSlots {
  default: {}
}
```

### Usage

```vue
<template>
  <HijriCalendarGridRow class="calendar-week">
    <HijriCalendarCell v-for="day in week" :key="day.id" :date="day.date">
      <!-- Day content -->
    </HijriCalendarCell>
  </HijriCalendarGridRow>
</template>
```

## HijriCalendarHeadCell

Container for weekday header cells.

### Props

Inherits all standard HTML th attributes.

### Slots

```typescript
interface HijriCalendarHeadCellSlots {
  default: {}
}
```

### Usage

```vue
<template>
  <HijriCalendarHeadCell class="weekday-header">
    {{ dayName }}
  </HijriCalendarHeadCell>
</template>
```

## HijriCalendarCell

Container for individual date cells.

### Props

```typescript
interface HijriCalendarCellProps {
  /** The date for this cell */
  date: HijriDateObject
}
```

### Slots

```typescript
interface HijriCalendarCellSlots {
  default: {}
}
```

### Data Attributes

- `data-disabled`: Present when the cell's date is disabled

### Usage

```vue
<template>
  <HijriCalendarCell :date="dayDate" class="day-cell">
    <HijriCalendarCellTrigger :day="dayDate" :month="currentMonth">
      {{ dayDate.hd }}
    </HijriCalendarCellTrigger>
  </HijriCalendarCell>
</template>
```

## HijriCalendarCellTrigger

Interactive button for selecting dates.

### Props

```typescript
interface HijriCalendarCellTriggerProps {
  /** The date value for this cell */
  day: HijriDateObject

  /** The month in which this cell is rendered */
  month: HijriDateObject
}
```

### Slots

```typescript
interface HijriCalendarCellTriggerSlots {
  default: {}
}
```

### Data Attributes

- `data-selected`: Present when the date is selected
- `data-today`: Present when the date is today
- `data-disabled`: Present when the date is disabled
- `data-unavailable`: Present when the date is unavailable
- `data-outside-view`: Present when the date is outside the current month
- `data-outside-visible-view`: Present when the date is outside the visible months
- `data-value`: The date value in ISO format

### ARIA Attributes

- `role="gridcell"`
- `aria-selected`: True when the date is selected
- `aria-disabled`: True when the date is disabled
- `aria-label`: Descriptive label for the date
- `tabindex`: 0 for focusable dates, -1 for others

### Usage

```vue
<template>
  <HijriCalendarCellTrigger :day="date" :month="currentMonth" class="day-button">
    <div class="day-content">
      <span class="day-number">{{ date.hd }}</span>
      <span v-if="hasEvents(date)" class="event-dot">•</span>
    </div>
  </HijriCalendarCellTrigger>
</template>
```

## Types

### HijriDateObject

```typescript
interface HijriDateObject {
  /** Hijri year */
  hy: number

  /** Hijri month (1-12) */
  hm: number

  /** Hijri day (1-30) */
  hd: number
}
```

### CalendarDay

```typescript
interface CalendarDay {
  /** The date for this day */
  date: HijriDateObject

  /** Day number within the month */
  dayInMonth: number

  /** Whether this day is in the current month view */
  inCurrentMonth: boolean

  /** Whether this day is today */
  isToday: boolean

  /** Whether this day is selected */
  isSelected: boolean

  /** Whether this day is disabled */
  isDisabled: boolean

  /** Whether this day is unavailable */
  isUnavailable: boolean
}
```

### WeekDayFormat

```typescript
type WeekDayFormat =
  | 'weekDaysShort' // ج، خ، س...
  | 'weekDaysMedium' // جمعة، خميس، سبت...
  | 'weekDaysLong' // الجمعة، الخميس، السبت...
```

### MonthFormat

```typescript
type MonthFormat =
  | 'monthsShort' // محرم، صفر...
  | 'monthsMedium' // محرم، صفر...
  | 'monthsLong' // المحرم، صفر...
```

### HijriCalendarRootContext

```typescript
interface HijriCalendarRootContext {
  /** Current locale */
  locale: Ref<'ar' | 'en' | 'fr'>

  /** Text direction */
  dir: Ref<'ltr' | 'rtl'>

  /** Currently selected date(s) */
  modelValue: Ref<HijriDateObject | HijriDateObject[] | undefined>

  /** Current displayed month */
  placeholder: Ref<HijriDateObject>

  /** Calendar configuration */
  disabled: Ref<boolean>
  readonly: Ref<boolean>
  multiple: Ref<boolean>
  preventDeselect: Ref<boolean>

  /** Date validation functions */
  isDateDisabled: (date: HijriDateObject) => boolean
  isDateUnavailable: (date: HijriDateObject) => boolean

  /** Calendar data */
  grid: ComputedRef<CalendarDay[][]>
  weekDays: ComputedRef<string[]>

  /** Navigation functions */
  nextPage: () => void
  prevPage: () => void

  /** Selection functions */
  onDateSelect: (date: HijriDateObject) => void
  isSelected: (date: HijriDateObject) => boolean

  /** Formatting functions */
  formatMonthYear: (date: HijriDateObject) => string
}
```

## Utilities

### Date Comparison

```typescript
import { isEqual, isGreaterThan, isLessThan } from '@taqwim/core'

// Check if two dates are equal
const equal = isEqual(date1, date2)

// Check if date1 is greater than date2
const greater = isGreaterThan(date1, date2)

// Check if date1 is less than date2
const less = isLessThan(date1, date2)
```

### Date Arithmetic

```typescript
import { addHijriDays, addHijriMonths, addHijriYears, subHijriDays, subHijriMonths, subHijriYears } from '@taqwim/core'

// Add/subtract days
const nextWeek = addHijriDays(date, 7)
const lastWeek = subHijriDays(date, 7)

// Add/subtract months
const nextMonth = addHijriMonths(date, 1)
const lastMonth = subHijriMonths(date, 1)

// Add/subtract years
const nextYear = addHijriYears(date, 1)
const lastYear = subHijriYears(date, 1)
```

### Date Formatting

```typescript
import { formatHijriDate } from '@taqwim/core'

// Format with default pattern
const formatted = formatHijriDate(date, 'ar')

// Format with custom pattern
const custom = formatHijriDate(date, 'iYYYY/iMM/iDD', 'en')

// Available format tokens:
// iYYYY - 4-digit year
// iYY   - 2-digit year
// iMM   - 2-digit month
// iM    - 1-digit month
// iDD   - 2-digit day
// iD    - 1-digit day
// iMMMM - Full month name
// iMMM  - Short month name
// iEEEE - Full weekday name
// iEEE  - Short weekday name
```

### Date Conversion

```typescript
import { toHijri, toGregorian } from '@taqwim/core'

// Convert Gregorian to Hijri
const hijriDate = toHijri(new Date())

// Convert Hijri to Gregorian
const gregorianDate = toGregorian(hijriDate)
```

### Date Validation

```typescript
import { isValidHijriDate } from '@taqwim/core'

// Check if a date is valid
const valid = isValidHijriDate({ hy: 1446, hm: 1, hd: 15 })
```

### Calendar Utilities

```typescript
import { getDayInWeek, getDaysLengthInMonth, getMonthAdjacentDays } from '@taqwim/core'

// Get day of week (0 = Sunday, 6 = Saturday)
const dayOfWeek = getDayInWeek(date)

// Get number of days in month
const daysInMonth = getDaysLengthInMonth(date.hy, date.hm)

// Get adjacent month days for calendar grid
const adjacentDays = getMonthAdjacentDays(date, 0) // 0 = start on Sunday
```

## Best Practices

### Performance

1. **Memoize validation functions**: If your date validation logic is expensive, wrap it in a computed property or use memoization.

```typescript
const isDateDisabled = computed(() => {
  return (date: HijriDateObject) => {
    // Expensive validation logic
    return expensiveValidation(date)
  }
})
```

2. **Use fixed weeks for consistent layout**: Enable `fixedWeeks` to prevent layout shifts when navigating between months.

3. **Limit multiple selection**: For performance with large date ranges, consider limiting the number of selectable dates.

### Accessibility

1. **Provide proper ARIA labels**: The components include built-in ARIA support, but you can enhance it with custom labels.

2. **Support keyboard navigation**: All interactive elements are keyboard accessible by default.

3. **Use semantic HTML**: The calendar uses proper table semantics for screen reader compatibility.

### Internationalization

1. **Set appropriate direction**: Use `dir="rtl"` for Arabic locales.

2. **Choose appropriate formats**: Use locale-appropriate date and weekday formats.

3. **Handle locale changes**: Update the calendar direction and format when the locale changes.

### Styling

1. **Use data attributes for styling**: Style based on `data-selected`, `data-today`, etc., rather than class names.

2. **Provide focus indicators**: Ensure focused elements have clear visual indicators.

3. **Support dark mode**: Use CSS custom properties to support theme switching.

4. **Make it responsive**: Ensure the calendar works well on different screen sizes.
