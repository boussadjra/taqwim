# HijriCalendar Components

A comprehensive set of headless Vue 3 components for building accessible Hijri (Islamic) calendars.

## 🌟 Features

- 🗓️ **Complete Hijri Calendar Support** - Full Islamic calendar implementation
- ♿ **Accessibility First** - WCAG compliant with proper ARIA attributes
- 🎨 **Headless Design** - Completely customizable styling
- 🌍 **Internationalization** - Support for Arabic, English, and French locales
- ⌨️ **Keyboard Navigation** - Full keyboard support
- 📱 **RTL Support** - Built-in right-to-left layout support
- 🎯 **TypeScript** - Full type safety and IntelliSense
- 🔧 **Composable** - Small, focused components that work together
- 🎭 **Multiple Themes** - Default, Dark, Modern, and Islamic themes included
- 📱 **Responsive** - Works perfectly on all screen sizes

## 📦 Installation

```bash
npm install taqwim-vue @taqwim/core
```

## 🚀 Quick Start

```vue
<template>
  <HijriCalendarRoot v-model="selectedDate" locale="ar">
    <template #default="{ grid, weekDays }">
      <div class="calendar-header">
        <HijriCalendarPrev>←</HijriCalendarPrev>
        <HijriCalendarHeading />
        <HijriCalendarNext>→</HijriCalendarNext>
      </div>

      <HijriCalendarGrid>
        <HijriCalendarGridHead>
          <HijriCalendarGridRow>
            <HijriCalendarHeadCell v-for="day in weekDays" :key="day">
              {{ day }}
            </HijriCalendarHeadCell>
          </HijriCalendarGridRow>
        </HijriCalendarGridHead>

        <HijriCalendarGridBody>
          <HijriCalendarGridRow v-for="(week, index) in grid" :key="index">
            <HijriCalendarCell
              v-for="day in week"
              :key="`${day.date.hy}-${day.date.hm}-${day.date.hd}`"
              :date="day.date"
            >
              <HijriCalendarCellTrigger :day="day.date" :month="day.date">
                {{ day.dayInMonth }}
              </HijriCalendarCellTrigger>
            </HijriCalendarCell>
          </HijriCalendarGridRow>
        </HijriCalendarGridBody>
      </HijriCalendarGrid>
    </template>
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
import type { HijriDateObject } from '@taqwim/core'

const selectedDate = ref<HijriDateObject>()
</script>
```

## 🎨 Theming

### Default Theme

```vue
<template>
  <HijriCalendarRoot class="hijri-calendar">
    <!-- calendar content -->
  </HijriCalendarRoot>
</template>

<style>
@import 'taqwim-vue/style/hijri-calendar-default.css';
</style>
```

### Dark Theme

```vue
<template>
  <HijriCalendarRoot class="hijri-calendar-dark">
    <!-- calendar content -->
  </HijriCalendarRoot>
</template>

<style>
@import 'taqwim-vue/style/hijri-calendar-dark.css';
</style>
```

### Modern Theme

```vue
<template>
  <HijriCalendarRoot class="hijri-calendar-modern">
    <!-- calendar content -->
  </HijriCalendarRoot>
</template>

<style>
@import 'taqwim-vue/style/hijri-calendar-modern.css';
</style>
```

### Islamic Theme (RTL)

```vue
<template>
  <HijriCalendarRoot class="hijri-calendar-islamic" dir="rtl" locale="ar">
    <!-- calendar content -->
  </HijriCalendarRoot>
</template>

<style>
@import 'taqwim-vue/style/hijri-calendar-islamic.css';
</style>
```

## 🔧 Advanced Usage

### Multiple Date Selection

```vue
<template>
  <HijriCalendarRoot v-model="selectedDates" :multiple="true" locale="ar">
    <!-- calendar content -->
  </HijriCalendarRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { HijriDateObject } from '@taqwim/core'

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
import { getDayInWeek } from '@taqwim/core'
import type { HijriDateObject } from '@taqwim/core'

const isWeekend = (date: HijriDateObject) => {
  const dayInWeek = getDayInWeek(date)
  return dayInWeek === 5 || dayInWeek === 6 // Friday and Saturday
}

const isHoliday = (date: HijriDateObject) => {
  return date.hm === 1 && date.hd === 1 // Muharram 1 - New Year
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

## 📋 Components

### Core Components

- **`HijriCalendarRoot`** - Root component providing context and state management
- **`HijriCalendarHeader`** - Container for navigation and heading
- **`HijriCalendarHeading`** - Displays current month and year
- **`HijriCalendarPrev`** - Previous month navigation button
- **`HijriCalendarNext`** - Next month navigation button

### Grid Components

- **`HijriCalendarGrid`** - Calendar grid container
- **`HijriCalendarGridHead`** - Weekday headers container
- **`HijriCalendarGridBody`** - Calendar body container
- **`HijriCalendarGridRow`** - Calendar row container
- **`HijriCalendarHeadCell`** - Weekday header cell
- **`HijriCalendarCell`** - Date cell container
- **`HijriCalendarCellTrigger`** - Interactive date button

## ⌨️ Keyboard Navigation

| Key               | Action                                  |
| ----------------- | --------------------------------------- |
| `Tab`             | Move focus between interactive elements |
| `Enter` / `Space` | Select the focused date                 |
| `Arrow Keys`      | Navigate between dates                  |
| `Home`            | Go to the first day of the month        |
| `End`             | Go to the last day of the month         |
| `Page Up`         | Go to the previous month                |
| `Page Down`       | Go to the next month                    |

## 🌍 Internationalization

### Supported Locales

- **Arabic (`ar`)** - العربية with RTL support
- **English (`en`)** - English with LTR layout
- **French (`fr`)** - Français with LTR layout

### Locale-Specific Features

- **Date Formatting** - Locale-appropriate date formats
- **Weekday Names** - Localized weekday names in various formats
- **Month Names** - Localized month names in various formats
- **Text Direction** - Automatic RTL support for Arabic
- **Number Systems** - Support for Arabic-Indic numerals

## 🎯 Data Attributes

The components provide data attributes for styling:

- `data-selected` - Applied to selected dates
- `data-today` - Applied to today's date
- `data-disabled` - Applied to disabled dates
- `data-unavailable` - Applied to unavailable dates
- `data-outside-view` - Applied to dates outside current month
- `data-outside-visible-view` - Applied to dates outside visible months

## 📚 Documentation

- **[Complete API Reference](./docs/API-REFERENCE.md)** - Detailed API documentation
- **[Usage Examples](./docs/USAGE-EXAMPLES.md)** - Comprehensive usage examples
- **[Component Guide](./docs/HIJRI-CALENDAR.md)** - Complete component guide

## 🧪 Testing

The components include comprehensive test coverage:

### Unit Tests

- Component rendering and behavior
- Props validation and defaults
- Event handling and emissions
- State management and context

### E2E Tests

- User interactions and workflows
- Keyboard navigation
- Accessibility compliance
- Cross-browser compatibility

## 🏗️ Architecture

### Headless Design

The components follow a headless architecture pattern:

- **Separation of Concerns** - Logic separated from presentation
- **Maximum Flexibility** - Complete control over styling and layout
- **Accessibility Built-in** - ARIA attributes and keyboard navigation included
- **Framework Agnostic Styling** - No CSS framework dependencies

### Context-Based State Management

- **Centralized State** - All state managed in HijriCalendarRoot
- **Prop Drilling Avoided** - Context injection for child components
- **Type Safety** - Full TypeScript support for context
- **Performance Optimized** - Computed values and reactive refs

### reka-ui Inspired Patterns

Following established patterns from reka-ui:

- **Consistent API** - Similar props and events across components
- **Composable Components** - Small, focused, reusable components
- **Slot-Based Rendering** - Flexible content customization
- **Data Attribute Styling** - CSS styling via data attributes

## 🌟 Integration Examples

### With Tailwind CSS

```vue
<HijriCalendarCellTrigger
  class="w-10 h-10 rounded-lg hover:bg-blue-50 data-[selected]:bg-blue-500 data-[selected]:text-white data-[today]:bg-blue-100"
>
  {{ day.dayInMonth }}
</HijriCalendarCellTrigger>
```

### With Form Libraries

```vue
<Field name="eventDate" v-slot="{ field, errors }">
  <HijriCalendarRoot 
    v-model="field.value" 
    @update:model-value="field.onChange"
  >
    <!-- calendar content -->
  </HijriCalendarRoot>
  <div v-if="errors.length">{{ errors[0] }}</div>
</Field>
```

### With State Management

```vue
<script setup lang="ts">
import { useCalendarStore } from '@/stores/calendar'

const calendarStore = useCalendarStore()
</script>

<template>
  <HijriCalendarRoot
    v-model="calendarStore.selectedDate"
    :min-value="calendarStore.minDate"
    :max-value="calendarStore.maxDate"
    :is-date-disabled="calendarStore.isDateDisabled"
  >
    <!-- calendar content -->
  </HijriCalendarRoot>
</template>
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](../../LICENSE) for details.

## 🙏 Acknowledgments

- Inspired by [reka-ui](https://github.com/reka-ui/reka-ui) architecture and patterns
- Built on top of [@taqwim/core](../core-utils) for Hijri date calculations
- Following [WAI-ARIA](https://www.w3.org/WAI/ARIA/) guidelines for accessibility

---

Built with ❤️ for the Islamic community by the Taqwim team.
