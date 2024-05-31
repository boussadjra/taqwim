[**@taqwim/core-utils**](../README.md) • **Docs**

***

[@taqwim/core-utils](../globals.md) / addHijriMonths

# Function: addHijriMonths()

> **addHijriMonths**(`date`, `amount`): `HijriDateObject` \| `null`

Adds a specified number of Months to a Hijri date.

## Parameters

• **date**: `HijriDateObject`

The Hijri date object to add Months to.

• **amount**: `number`

The number of Months to add.

## Returns

`HijriDateObject` \| `null`

The resulting Hijri date object after adding the specified number of Months, or `null` if the input date is invalid.

## Examples

```ts
// Add 10 Months to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
const result = addHijriMonths(
{ hy: 1445, hm: 9, hd: 1 },
10
);
//=> { hy: 1445, hm: 11, hd: 12 }
```

```ts
// Add 1 Month to 30 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 30 })
const result = addHijriMonths(
{ hy: 1445, hm: 9, hd: 30 },
1
);
//=> { hy: 1445, hm: 10, hd: 29 }
```

```ts
// Add 26 Months to 30 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 30 })
const result = addHijriMonths(
{ hy: 1445, hm: 9, hd: 30 },
26
);
//=> { hy: 1447, hm: 12, hd: 29 }
```

## Source

[addHijriMonths.ts:39](https://github.com/boussadjra/taqwim/blob/b6011f3ed342a975f52680743fe89e4925ba0553/packages/core-utils/src/lib/addHijriMonths.ts#L39)
