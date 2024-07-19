[**taqwim-core-utils**](../README.md) • **Docs**

---

[taqwim-core-utils](../globals.md) / subHijriBusinessDays

# Function: subHijriBusinessDays()

> **subHijriBusinessDays**(`date`, `amount`): `HijriDateObject` \| `null`

## Parameters

• **date**: `HijriDateObject`

The date to be changed

• **amount**: `number`

The amount of business days to be substracted.

## Returns

`HijriDateObject` \| `null`

The new date with the business days substracted

## Name

subHijriBusinessDays

## Summary

Substract the specified number of business days from the given date.

## Description

Substract the specified number of business days from the given date.

## Example

```ts
// Substract 10 business days from 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
const result = subHijriBusinessDays(
 { hy: 1445, hm: 9, hd: 1 },
, 10)
//=> { hy: 1445, hm: 8, hd: 19 }
```

## Source

[subHijriBusinessDays.ts:27](https://github.com/boussadjra/taqwim/blob/a16e0483140d22a326ae33586f5bfb208d318d3e/packages/core-utils/src/lib/subHijriBusinessDays.ts#L27)
