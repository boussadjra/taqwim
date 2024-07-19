[**taqwim-core-utils**](../README.md) • **Docs**

---

[taqwim-core-utils](../globals.md) / addHijriBusinessDays

# Function: addHijriBusinessDays()

> **addHijriBusinessDays**(`date`, `amount`): `HijriDateObject` \| `null`

## Parameters

• **date**: `HijriDateObject`

The date to be changed

• **amount**: `number`

The amount of business days to be added.

## Returns

`HijriDateObject` \| `null`

The new date with the business days added

## Name

addHijriBusinessDays

## Summary

Add the specified number of business days to the given date.

## Description

Add the specified number of business days to the given date.

## Example

```ts
// Add 10 business days to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
const result = addHijriBusinessDays(
 { hy: 1445, hm: 9, hd: 1 },
, 10)
//=> { hy: 1445, hm: 10, hd: 15 }
```

## Source

[addHijriBusinessDays.ts:27](https://github.com/boussadjra/taqwim/blob/a16e0483140d22a326ae33586f5bfb208d318d3e/packages/core-utils/src/lib/addHijriBusinessDays.ts#L27)
