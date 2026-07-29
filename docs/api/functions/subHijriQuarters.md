[**@taqwim/core**](../README.md)

---

[@taqwim/core](../globals.md) / subHijriQuarters

# Function: subHijriQuarters()

> **subHijriQuarters**(`date`, `amount`): `HijriDateObject`

Defined in: [packages/core/src/lib/subHijriQuarters.ts:23](https://github.com/boussadjra/taqwim/blob/967b462e7dccdb8cffe50f13ba37d6f2e3f2a4a2/packages/core/src/lib/subHijriQuarters.ts#L23)

Substracts a specified number of Hijri quarters from a given Hijri date.

## Parameters

### date

`HijriDateObject`

The Hijri date object to which the quarters will be substracted.

### amount

`number`

The number of quarters to sub. Positive values will substract quarters in the future, while negative values will subtract quarters from the date.

## Returns

`HijriDateObject`

A new Hijri date object that is the result of subing the specified number of quarters to the given date. Returns null if the input date is invalid.

## Examples

```ts
// Substract 2 quarters from 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
const result = subHijriQuarters({ hy: 1445, hm: 9, hd: 1 }, 2)
//=> { hy: 1445, hm: 3, hd: 1 }
```

```ts
// Substract 1 quarter from 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 30 }) and adjust the month
const result = subHijriQuarters({ hy: 1445, hm: 9, hd: 30 }, 1)
//=> { hy: 1444, hm: 9, hd: 29 };
```
