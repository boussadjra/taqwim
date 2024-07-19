[**taqwim-core-utils**](../README.md) • **Docs**

***

[taqwim-core-utils](../globals.md) / subHijriYears

# Function: subHijriYears()

> **subHijriYears**(`date`, `amount`): `HijriDateObject` \| `null`

Adds a specified number of years to a Hijri date.

## Parameters

• **date**: `HijriDateObject`

The Hijri date object to substract years to.

• **amount**: `number`

The number of years to sub.

## Returns

`HijriDateObject` \| `null`

The resulting Hijri date object after subing the specified number of years, or `null` if the input date is invalid.

## Examples

```ts
// Substract 10 years from 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
const result = subHijriYears(
{ hy: 1445, hm: 9, hd: 1 },
10
);
//=> { hy: 1435, hm: 9, hd: 1 }
```

```ts
// Substract 1 year to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 30 }) and adjust the month
const result = subHijriYears(
{ hy: 1445, hm: 9, hd: 30 },
1
);
//=> { hy: 1444, hm: 9, hd: 29 }
```

## Source

[subHijriYears.ts:26](https://github.com/boussadjra/taqwim/blob/a16e0483140d22a326ae33586f5bfb208d318d3e/packages/core-utils/src/lib/subHijriYears.ts#L26)
