# taqwim-vue

## Installation

```bash
npm install taqwim-vue
```

## Usage

```vue
<script setup>
import { DatePicker } from 'taqwim-vue'

const date = ref({ hy: 1446, hm: 1, hd: 1 })
</script>

<template>
  <DatePicker v-model="date" />
</template>
```

### Props

| Name               | Description                                     | Type                                                                      | Default                      |
| ------------------ | ----------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------- |
| `viewMode`         | The initial view mode of the date picker.       | `ViewMode` (`'month'`, `'months'`, `'years'`)                             | `'month'`                    |
| `locale`           | Locale to use for formatting and parsing.       | `string`                                                                  | `'en'`                       |
| `modelValue`       | The current date value in Hijri format.         | `ValidHijriDate`                                                          | current Hijri date           |
| `formattedValue`   | The formatted date value as a string.           | `string`                                                                  | current Hijri date formatted |
| `format`           | The format string used for the date.            | `string`                                                                  | `'iYYYY/iMM/iD'`             |
| `title`            | Title of the date picker, displayed at the top. | `string`                                                                  | `''`                         |
| `weekDayFormat`    | Format for displaying weekdays.                 | `WeekDayFormat` (`'weekDaysMedium'`, `'weekDaysLong'`, `'weekDaysShort'`) | `'weekDaysMedium'`           |
| `monthFormat`      | Format for displaying months.                   | `MonthFormat` (`'monthsMedium'`, `'monthsLong'`, `'monthsShort'`)         | `'monthsMedium'`             |
| `showAdjacentDays` | Whether to show dates from adjacent months.     | `boolean`                                                                 | `true`                       |

### Events

| Name | Description | Payload |
| ---- | ----------- | ------- |

### Slots

| Name       | Description                                                                | Slot Props                                                                                                              |
| ---------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `title`    | Custom content for the title area.                                         |                                                                                                                         |
| `header`   | Custom content for the header area, typically showing the selected date.   |                                                                                                                         |
| `controls` | Custom content for the date picker controls, including navigation buttons. |                                                                                                                         |
| `month`    | Custom content for the month navigation control.                           | `{ date: HijriDateObject, locale: string, changeMode: Function }`                                                       |
| `mode`     | Custom content for the mode toggle button (month/year view).               | `{ date: HijriDateObject, locale: string, changeMode: Function, viewMode: ViewMode }`                                   |
| `prev`     | Custom content for the previous month navigation button.                   | `{ prevMonth: Function }`                                                                                               |
| `next`     | Custom content for the next month navigation button.                       | `{ nextMonth: Function }`                                                                                               |
| `weekdays` | Custom content for displaying weekdays.                                    | `{ weekdays: string[] }`                                                                                                |
| `days`     | Custom content for displaying days in the month view.                      | `{ days: { date: HijriDateObject, dayInMonth: number, isAdjacent: boolean, isToday: boolean, isSelected: boolean }[] }` |
| `months`   | Custom content for displaying months in the year view.                     | `{ months: string[] }`                                                                                                  |
| `years`    | Custom content for displaying years in the decade view.                    | `{ years: number[] }`                                                                                                   |
