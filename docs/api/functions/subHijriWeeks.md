[**taqwim-core-utils**](../README.md) • **Docs**

---

[taqwim-core-utils](../globals.md) / subHijriWeeks

# Function: subHijriWeeks()

> **subHijriWeeks**(`date`, `amount`): `HijriDateObject` \| `null`

Substracts a specified number of weeks from a Hijri date.

## Parameters

• **date**: `HijriDateObject`

The Hijri date object to sub weeks to.

• **amount**: `number`

The number of weeks to sub.

## Returns

`HijriDateObject` \| `null`

The resulting Hijri date object after subing the specified number of weeks, or `null` if the input date is invalid.

## Example

```ts
// Substract 10 weeks from 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
const result = subHijriWeeks({ hy: 1445, hm: 11, hd: 12 }, 10)
//=> { hy: 1445, hm: 9, hd: 1 }
```

## Source

[subHijriWeeks.ts:19](https://github.com/boussadjra/taqwim/blob/a16e0483140d22a326ae33586f5bfb208d318d3e/packages/core-utils/src/lib/subHijriWeeks.ts#L19)
