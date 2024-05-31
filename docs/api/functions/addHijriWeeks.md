[**taqwim-core-utils**](../README.md) • **Docs**

***

[taqwim-core-utils](../globals.md) / addHijriWeeks

# Function: addHijriWeeks()

> **addHijriWeeks**(`date`, `amount`): `HijriDateObject` \| `null`

Adds a specified number of weeks to a Hijri date.

## Parameters

• **date**: `HijriDateObject`

The Hijri date object to add weeks to.

• **amount**: `number`

The number of weeks to add.

## Returns

`HijriDateObject` \| `null`

The resulting Hijri date object after adding the specified number of weeks, or `null` if the input date is invalid.

## Example

```ts
// Add 10 weeks to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
const result = addHijriWeeks(
{ hy: 1445, hm: 9, hd: 1 },
10
);
//=> { hy: 1445, hm: 11, hd: 12 }
```

## Source

[addHijriWeeks.ts:24](https://github.com/boussadjra/taqwim/blob/b6011f3ed342a975f52680743fe89e4925ba0553/packages/core-utils/src/lib/addHijriWeeks.ts#L24)
