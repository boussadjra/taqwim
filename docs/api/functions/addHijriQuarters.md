[**@taqwim/core-utils**](../README.md) • **Docs**

***

[@taqwim/core-utils](../globals.md) / addHijriQuarters

# Function: addHijriQuarters()

> **addHijriQuarters**(`date`, `amount`): `HijriDateObject` \| `null`

Adds a specified number of Hijri quarters to a given Hijri date.

## Parameters

• **date**: `HijriDateObject`

The Hijri date object to which the quarters will be added.

• **amount**: `number`

The number of quarters to add. Positive values will add quarters in the future, while negative values will subtract quarters from the date.

## Returns

`HijriDateObject` \| `null`

A new Hijri date object that is the result of adding the specified number of quarters to the given date. Returns null if the input date is invalid.

## Examples

```ts
// Add 2 quarters to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
const result = addHijriQuarters(
{ hy: 1445, hm: 9, hd: 1 },
2
);
//=> { hy: 1446, hm: 3, hd: 1 }
```

```ts
// Add 1 quarter to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 30 }) and adjust the month
const result = addHijriQuarters(
{ hy: 1445, hm: 9, hd: 30 },
1
);
//=> { hy: 1446, hm: 1, hd: 29 }
```

## Source

addHijriQuarters.ts:23
