import type { DivProps } from './types'
import type { Snippet } from 'svelte'
type $$ComponentProps = DivProps & {
  children?: Snippet<[string[]]>
}
declare const HijriCalendarGridHead: import('svelte').Component<$$ComponentProps, {}, ''>
type HijriCalendarGridHead = ReturnType<typeof HijriCalendarGridHead>
export default HijriCalendarGridHead
