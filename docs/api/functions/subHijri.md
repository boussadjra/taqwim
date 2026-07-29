[**@taqwim/core**](../README.md)

---

[@taqwim/core](../globals.md) / subHijri

# Function: subHijri()

> **subHijri**(`date`, `duration`): `HijriDateObject`

Defined in: [packages/core/src/lib/subHijri.ts:25](https://github.com/boussadjra/taqwim/blob/967b462e7dccdb8cffe50f13ba37d6f2e3f2a4a2/packages/core/src/lib/subHijri.ts#L25)

Substracts a Hijri duration from a given Hijri date.

## Parameters

### date

`HijriDateObject`

The Hijri date to which the duration will be substracted.

### duration

`HijriDuration`

The Hijri duration to sub.

## Returns

`HijriDateObject`

The new Hijri date after subing the duration.

## Examples

```ts
// Substract 10 days from 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
const result = subHijri({ hy: 1445, hm: 9, hd: 1 }, { years: 0, months: 0, weeks: 0, days: 10 })
//=> { hy: 1445, hm: 8, hd: 21 }
```

```ts
// Substract 1 year, 2 months, 3 weeks, and 4 days from 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
const result = subHijri({ hy: 1445, hm: 9, hd: 1 }, { years: 1, months: 2, weeks: 3, days: 4 })
//=> { hy: 1444, hm: 6, hd: 5 }
```
