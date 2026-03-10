import { computed, type Ref } from 'vue'

export type Direction = 'ltr' | 'rtl'

export function useDirection(dir?: Ref<Direction | undefined>): Ref<Direction> {
  return computed(() => {
    return dir?.value || 'ltr'
  })
}
