[**taqwim-core-utils**](../README.md) • **Docs**

---

[taqwim-core-utils](../globals.md) / subHijriDays

# Function: subHijriDays()

> **subHijriDays**(`date`, `amount`): `HijriDateObject` \| `null`

## Parameters

• **date**: `HijriDateObject`

The date to be changed

• **amount**: `number`

The amount of days to be substracted.

## Returns

`HijriDateObject` \| `null`

The new date with the days substracted

## Name

subHijriDays

## Summary

Add the specified number of days to the given date.

## Description

Add the specified number of days to the given date.

## Example

```ts
// Add 10 days to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
const result = subHijriDays(
 { hy: 1445, hm: 9, hd: 1 },
, 10)
//=> { hy: 1445, hm: 10, hd: 11 }
```

## Source

[subHijriDays.ts:27](https://github.com/boussadjra/taqwim/blob/a16e0483140d22a326ae33586f5bfb208d318d3e/packages/core-utils/src/lib/subHijriDays.ts#L27)
