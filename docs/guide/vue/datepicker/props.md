---
outline: deep
---

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
