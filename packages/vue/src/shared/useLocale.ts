import { computed, type Ref } from 'vue'

export function useLocale(locale?: Ref<string | undefined>): Ref<string> {
  return computed(() => {
    return locale?.value || 'en'
  })
}
