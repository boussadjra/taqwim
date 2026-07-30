import type { DivProps } from './types'
import type { Snippet } from 'svelte'
type $$ComponentProps = DivProps & {
  children?: Snippet<[string]>
}
declare const HijriCalendarHeading: import('svelte').Component<$$ComponentProps, {}, ''>
type HijriCalendarHeading = ReturnType<typeof HijriCalendarHeading>
export default HijriCalendarHeading
