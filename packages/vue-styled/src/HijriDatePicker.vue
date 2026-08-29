<script lang="ts">
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
  /** Pattern used for the input's text, e.g. `'iD iMMMM iYYYY'`. @default 'iYYYY-iMM-iDD' */
  format?: string
  /** Placeholder text for the empty input. */
  inputPlaceholder?: string
  /** Accessible label for the input. @default 'Hijri date' */
  label?: string
  /** Let the user type a date as well as pick one. @default true */
  editable?: boolean
}

export interface HijriDatePickerSlots {
  /** Replaces the trigger input entirely. */
  trigger?: (props: { value: string; open: () => void; isOpen: boolean }) => unknown
}
</script>

<script setup lang="ts">
import { formatHijriDate, isValidHijriDate, type HijriDateObject as HijriDate } from '@taqwim/core'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import HijriCalendar from './HijriCalendar.vue'

let instances = 0

const props = withDefaults(defineProps<HijriDatePickerProps>(), {
  format: 'iYYYY-iMM-iDD',
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
    inputPlaceholder: _inputPlaceholder,
    label: _label,
    editable: _editable,
    modelValue: _modelValue,
    ...rest
  } = props
  return rest
})

const isOpen = ref(false)
const container = ref<HTMLElement>()
const draft = ref('')

const formatted = computed(() =>
  modelValue.value ? formatHijriDate(modelValue.value, props.format, props.locale) : '',
)

// The draft only diverges from the model while the user is mid-edit.
watch(formatted, value => (draft.value = value), { immediate: true })

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

/*
 * Deliberately not `@taqwim/core`'s `parseDateString`: that throws on bad input
 * and resolves an empty string to today, neither of which suits an input the
 * user is still typing into.
 */
const YMD = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/
const DMY = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/

function parseDraft(text: string): HijriDate | null {
  const trimmed = text.trim()

  const ymd = YMD.exec(trimmed)
  const dmy = ymd ? null : DMY.exec(trimmed)
  if (!ymd && !dmy) return null

  const [hy, hm, hd] = ymd
    ? [Number(ymd[1]), Number(ymd[2]), Number(ymd[3])]
    : [Number(dmy![3]), Number(dmy![2]), Number(dmy![1])]

  const candidate = { hy, hm, hd }
  return isValidHijriDate(candidate) ? candidate : null
}

function commitDraft() {
  if (draft.value.trim() === '') {
    modelValue.value = undefined
    return
  }

  const parsed = parseDraft(draft.value)
  if (parsed) {
    modelValue.value = parsed
  } else {
    // Unparseable input reverts rather than silently clearing the selection.
    draft.value = formatted.value
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
    <slot name="trigger" :value="formatted" :open="open" :is-open="isOpen">
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
        :readonly="!editable || readonly"
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
