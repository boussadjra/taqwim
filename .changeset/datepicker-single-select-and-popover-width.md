---
'@taqwim/vue-styled': minor
'@taqwim/themes': patch
---

`HijriDatePicker` is single-select in Vue too, and its popover is no longer squeezed.

**Vue's picker no longer accepts `multiple`.** React, Svelte and Solid already omitted it — the input holds one formatted date and the value is one `HijriDateObject`, so a multi-select calendar has nowhere to put the rest of the selection. Vue accepted the prop and kept only `value[0]`, which meant picking a second date silently kept the first and the popup stayed open with no way to finish. `HijriDatePickerProps` is now `Omit<HijriCalendarProps, 'multiple'>` in all four, so the same code ports between them.

If you were passing `multiple` to Vue's `HijriDatePicker`, it was not doing what it looked like it was doing. Use `HijriCalendar` with `multiple` for a multi-select calendar; the picker stays single-select.

**The popover renders at its natural width.** `.taqwim-datepicker-popover` is absolutely positioned inside `.taqwim-datepicker`, which is only as wide as the input, so it shrink-to-fit against that instead of against the calendar it contains — the grid came out compressed and the month heading wrapped onto two lines. It now sets `width: max-content`. This affects every framework's date picker.
