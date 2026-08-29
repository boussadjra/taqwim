---
'@taqwim/calendar-core': minor
'@taqwim/vue': minor
'@taqwim/vue-styled': minor
'@taqwim/react': minor
'@taqwim/react-styled': minor
'@taqwim/svelte': minor
'@taqwim/svelte-styled': minor
'@taqwim/solid': minor
'@taqwim/solid-styled': minor
'@taqwim/angular': minor
'@taqwim/angular-styled': minor
'@taqwim/themes': minor
---

Add optional dual Hijri/Gregorian date presentation while keeping Hijri as the canonical calendar value.

- `showGregorian` displays the corresponding Gregorian date in calendar cells, with configurable `dateEmphasis` (`hijri` or `gregorian`)
- `gregorianLocale` controls Gregorian formatting independently from the Hijri `locale`
- Headless adapters expose derived `gregorianValue` alongside the existing Hijri selection
- `HijriDatePicker` adds `inputDisplay` (`hijri`, `gregorian`, or `both`) and `gregorianFormat` for the input field, independent of the popup grid
- Custom trigger APIs expose explicit `hijriValue` and `gregorianValue` strings

Existing consumers see no change until the new props are used.
