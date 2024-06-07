[**taqwim-core-utils**](../README.md) • **Docs**

---

[taqwim-core-utils](../globals.md) / addHijriYears

# Function: addHijriYears()

> **addHijriYears**(`date`, `amount`): `HijriDateObject` \| `null`

Adds a specified number of years to a Hijri date.

## Parameters

• **date**: `HijriDateObject`

The Hijri date object to add years to.

• **amount**: `number`

The number of years to add.

## Returns

`HijriDateObject` \| `null`

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

## Source

[addHijriYears.ts:26](https://github.com/boussadjra/taqwim/blob/b6011f3ed342a975f52680743fe89e4925ba0553/packages/core-utils/src/lib/addHijriYears.ts#L26)
