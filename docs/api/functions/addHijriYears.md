[**@taqwim/core**](../README.md)

---

[@taqwim/core](../globals.md) / addHijriYears

# Function: addHijriYears()

> **addHijriYears**(`date`, `amount`): `HijriDateObject`

Defined in: [packages/core/src/lib/addHijriYears.ts:26](https://github.com/boussadjra/taqwim/blob/967b462e7dccdb8cffe50f13ba37d6f2e3f2a4a2/packages/core/src/lib/addHijriYears.ts#L26)

Adds a specified number of years to a Hijri date.

## Parameters

### date

`HijriDateObject`

The Hijri date object to add years to.

### amount

`number`

The number of years to add.

## Returns

`HijriDateObject`

The resulting Hijri date object after adding the specified number of years, or `null` if the input date is invalid.

## Examples

```ts
// Add 10 years to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
const result = addHijriYears({ hy: 1445, hm: 9, hd: 1 }, 10)
//=> { hy: 1455, hm: 9, hd: 1 }
```

```ts
// Add 1 year to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 30 }) and adjust the month
const result = addHijriYears({ hy: 1445, hm: 9, hd: 30 }, 1)
//=> { hy: 1446, hm: 10, hd: 29 }
```
