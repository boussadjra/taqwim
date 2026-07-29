[**@taqwim/core**](../README.md)

---

[@taqwim/core](../globals.md) / addHijriWeeks

# Function: addHijriWeeks()

> **addHijriWeeks**(`date`, `amount`): `HijriDateObject`

Defined in: [packages/core/src/lib/addHijriWeeks.ts:19](https://github.com/boussadjra/taqwim/blob/967b462e7dccdb8cffe50f13ba37d6f2e3f2a4a2/packages/core/src/lib/addHijriWeeks.ts#L19)

Adds a specified number of weeks to a Hijri date.

## Parameters

### date

`HijriDateObject`

The Hijri date object to add weeks to.

### amount

`number`

The number of weeks to add.

## Returns

`HijriDateObject`

The resulting Hijri date object after adding the specified number of weeks, or `null` if the input date is invalid.

## Example

```ts
// Add 10 weeks to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
const result = addHijriWeeks({ hy: 1445, hm: 9, hd: 1 }, 10)
//=> { hy: 1445, hm: 11, hd: 12 }
```
