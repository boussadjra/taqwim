[**taqwim-core-utils**](../README.md) • **Docs**

---

[taqwim-core-utils](../globals.md) / addHijriDays

# Function: addHijriDays()

> **addHijriDays**(`date`, `amount`): `HijriDateObject` \| `null`

## Parameters

• **date**: `HijriDateObject`

The date to be changed

• **amount**: `number`

The amount of days to be added.

## Returns

`HijriDateObject` \| `null`

The new date with the days added

## Name

addHijriDays

## Summary

Add the specified number of days to the given date.

## Description

Add the specified number of days to the given date.

## Example

```ts
// Add 10 days to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
const result = addHijriDays(
 { hy: 1445, hm: 9, hd: 1 },
, 10)
//=> { hy: 1445, hm: 10, hd: 11 }
```

## Source

[addHijriDays.ts:32](https://github.com/boussadjra/taqwim/blob/b6011f3ed342a975f52680743fe89e4925ba0553/packages/core-utils/src/lib/addHijriDays.ts#L32)
