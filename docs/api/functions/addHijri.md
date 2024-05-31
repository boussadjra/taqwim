[**taqwim-core-utils**](../README.md) • **Docs**

***

[taqwim-core-utils](../globals.md) / addHijri

# Function: addHijri()

> **addHijri**(`date`, `duration`): `HijriDateObject`

Adds a Hijri duration to a given Hijri date.

## Parameters

• **date**: `HijriDateObject`

The Hijri date to which the duration will be added.

• **duration**: `HijriDuration`

The Hijri duration to add.

## Returns

`HijriDateObject`

The new Hijri date after adding the duration.

## Examples

```ts
// Add 10 days to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
const result = addHijri(
{ hy: 1445, hm: 9, hd: 1 },
{ years: 0, months: 0, weeks: 0, days: 10 }
)
//=> { hy: 1445, hm: 9, hd: 11 }
```

```ts
// Add 1 year, 2 months, 3 weeks, and 4 days to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
const result = addHijri(
{ hy: 1445, hm: 9, hd: 1 },
{ years: 1, months: 2, weeks: 3, days: 4 }
)
//=> { hy: 1446, hm: 11, hd: 25 }
```

## Source

[addHijri.ts:32](https://github.com/boussadjra/taqwim/blob/b6011f3ed342a975f52680743fe89e4925ba0553/packages/core-utils/src/lib/addHijri.ts#L32)
