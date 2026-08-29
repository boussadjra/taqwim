<script lang="ts">
import type { DatePickerInputDisplay } from '@taqwim/calendar-core'
import type { HijriDateObject } from '@taqwim/core'
import type { HijriCalendarProps } from './HijriCalendar.vue'

/*
 * `multiple` is omitted, as it is in the React, Svelte and Solid pickers: the
 * input holds one formatted date and `v-model` is one `HijriDateObject`, so a
 * multi-select calendar has nowhere to put the rest of the selection. Vue used
 * to accept it and keep only `value[0]`, which meant picking a second date
 * silently kept the first.
 */
export interface HijriDatePickerProps extends Omit<HijriCalendarProps, 'multiple'> {
  /** Pattern used for the input's Hijri text, e.g. `'iD iMMMM iYYYY'`. @default 'iYYYY-iMM-iDD' */
  format?: string
  /** `Intl.DateTimeFormatOptions` for Gregorian input text. @default ISO-like `YYYY-MM-DD` */
  gregorianFormat?: Intl.DateTimeFormatOptions
  /** Which representation appears in the input. @default 'hijri' */
  inputDisplay?: DatePickerInputDisplay
  /** Placeholder text for the empty input. */
  inputPlaceholder?: string
  /** Accessible label for the input. @default 'Hijri date' */
  label?: string
  /** Let the user type a date as well as pick one. @default true */
  editable?: boolean
}

export interface HijriDatePickerSlots {
  /** Replaces the trigger input entirely. */
  trigger?: (props: {
    value: string
    hijriValue: string
    gregorianValue: string
    open: () => void
    isOpen: boolean
  }) => unknown
}
</script>

<script setup lang="ts">
import { DEFAULT_GREGORIAN_FORMAT_OPTIONS, formatDatePickerValues, parseDatePickerDraft } from '@taqwim/calendar-core'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import HijriCalendar from './HijriCalendar.vue'

let instances = 0

const props = withDefaults(defineProps<HijriDatePickerProps>(), {
  format: 'iYYYY-iMM-iDD',
  gregorianFormat: () => DEFAULT_GREGORIAN_FORMAT_OPTIONS,
  inputDisplay: 'hijri',
  label: 'Hijri date',
  editable: true,
  locale: 'en',
  // Same defaults as HijriCalendar. Vue treats undeclared optional booleans
  // as `false`, so without these the popover opened with no prev/next and a
  // static heading — which is how the picker looked like it could not page.
  showNavigation: true,
  showWeekdays: true,
  selectableHeading: true,
})

defineSlots<HijriDatePickerSlots>()

defineOptions({
  name: 'HijriDatePicker',
  inheritAttrs: false,
})

const modelValue = defineModel<HijriDateObject | undefined>({ default: undefined })

/*
 * `role="combobox"` is only complete when it points at the popup it controls,
 * so the popover needs a stable id. A module counter rather than `useId()`
 * keeps the Vue 3.3 peer range honest.
 */
const popoverId = `taqwim-datepicker-${++instances}`

// The picker owns the input's props; the rest belong to the calendar it opens.
const calendarProps = computed(() => {
  const {
    format: _format,
    gregorianFormat: _gregorianFormat,
    inputDisplay: _inputDisplay,
    inputPlaceholder: _inputPlaceholder,
    label: _label,
    editable: _editable,
    modelValue: _modelValue,
    ...rest
  } = props
  return rest
})

const formatOptions = computed(() => ({
  hijriFormat: props.format,
  gregorianFormat: props.gregorianFormat,
  locale: props.locale ?? 'en',
  gregorianLocale: props.gregorianLocale ?? props.locale ?? 'en',
  inputDisplay: props.inputDisplay,
}))

const isOpen = ref(false)
const container = ref<HTMLElement>()
const draft = ref('')

const formatted = computed(() => formatDatePickerValues(modelValue.value, formatOptions.value))

// The draft only diverges from the model while the user is mid-edit.
watch(
  () => formatted.value.value,
  value => (draft.value = value),
  { immediate: true },
)

function open() {
  if (props.disabled) return
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

function onSelect(value: HijriDateObject | HijriDateObject[] | undefined) {
  modelValue.value = Array.isArray(value) ? value[0] : value
  close()
}

function commitDraft() {
  const parsed = parseDatePickerDraft(draft.value, props.inputDisplay)
  if (parsed === 'empty') {
    modelValue.value = undefined
    return
  }

  if (parsed) {
    modelValue.value = parsed
  } else {
    // Unparseable input reverts rather than silently clearing the selection.
    draft.value = formatted.value.value
  }
}

/*
 * A month page unmounts the focused day cell, which fires `focusout` with
 * `relatedTarget === null`. Closing on that made prev/next dismiss the
 * popover before the new month could be seen. Close only when focus actually
 * moved to a node outside the picker; clicks on the page are handled below.
 */
function onFocusOut(event: FocusEvent) {
  const next = event.relatedTarget as Node | null
  if (next && !container.value?.contains(next)) close()
}

function onDocumentPointerDown(event: PointerEvent) {
  if (!isOpen.value) return
  if (container.value?.contains(event.target as Node)) return
  close()
}

onMounted(() => document.addEventListener('pointerdown', onDocumentPointerDown, true))
onUnmounted(() => document.removeEventListener('pointerdown', onDocumentPointerDown, true))
</script>

<template>
  <div
    ref="container"
    class="taqwim-datepicker"
    :data-taqwim-theme="theme"
    :data-open="isOpen ? '' : undefined"
    @focusout="onFocusOut"
    @keydown.escape="close"
  >
    <slot
      name="trigger"
      :value="formatted.value"
      :hijri-value="formatted.hijriValue"
      :gregorian-value="formatted.gregorianValue"
      :open="open"
      :is-open="isOpen"
    >
      <input
        v-bind="$attrs"
        v-model="draft"
        class="taqwim-datepicker-input"
        type="text"
        role="combobox"
        aria-haspopup="dialog"
        :aria-expanded="isOpen"
        :aria-controls="popoverId"
        :aria-label="label"
        :placeholder="inputPlaceholder ?? format"
        :readonly="!editable || readonly || inputDisplay === 'both'"
        :disabled="disabled"
        @focus="open"
        @click="open"
        @change="commitDraft"
        @keydown.enter.prevent="commitDraft"
        @keydown.down.prevent="open"
      />
    </slot>

    <div
      v-if="isOpen"
      :id="popoverId"
      class="taqwim-datepicker-popover"
      role="dialog"
      tabindex="-1"
      :aria-label="label"
    >
      <HijriCalendar v-bind="calendarProps" :model-value="modelValue" initial-focus @update:model-value="onSelect" />
    </div>
  </div>
</template>
