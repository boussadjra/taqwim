---
'@taqwim/angular-styled': minor
'@taqwim/react-styled': minor
'@taqwim/solid-styled': minor
'@taqwim/svelte-styled': minor
'@taqwim/vue-styled': minor
---

`HijriCalendarLayout` is now importable from every styled package.

All five styled packages accept a `layout` prop and all five re-exported the union that types it from their component file — but no entry point forwarded it, so it was reachable only through a deep import into a path that is not part of the public surface. Writing a typed wrapper meant copying the union by hand, which goes stale the moment a layout is added:

```ts
// Before
type Layout = 'default' | 'compact' | 'panel' | 'stacked' // hand-copied

// After
import type { HijriCalendarLayout } from '@taqwim/react-styled'
```

Nothing about the runtime or the prop itself changed; this only makes the existing type reachable. The gap was found by type-checking the React, Svelte and Solid playgrounds, which had been running without a `tsconfig.json`.
