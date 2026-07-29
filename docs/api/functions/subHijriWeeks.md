[**@taqwim/core**](../README.md)

---

[@taqwim/core](../globals.md) / subHijriWeeks

# Function: subHijriWeeks()

> **subHijriWeeks**(`date`, `amount`): `HijriDateObject`

Defined in: [packages/core/src/lib/subHijriWeeks.ts:19](https://github.com/boussadjra/taqwim/blob/967b462e7dccdb8cffe50f13ba37d6f2e3f2a4a2/packages/core/src/lib/subHijriWeeks.ts#L19)

Substracts a specified number of weeks from a Hijri date.

## Parameters

### date

`HijriDateObject`

The Hijri date object to sub weeks to.

### amount

`number`

The number of weeks to sub.

## Returns

`HijriDateObject`

The resulting Hijri date object after subing the specified number of weeks, or `null` if the input date is invalid.

## Example

```ts
// Substract 10 weeks from 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
const result = subHijriWeeks({ hy: 1445, hm: 11, hd: 12 }, 10)
//=> { hy: 1445, hm: 9, hd: 1 }
```
