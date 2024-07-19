[**taqwim-core-utils**](../README.md) • **Docs**

---

[taqwim-core-utils](../globals.md) / subHijriMonths

# Function: subHijriMonths()

> **subHijriMonths**(`date`, `amount`): `HijriDateObject` \| `null`

Substracts a specified number of Months from a Hijri date.

## Parameters

• **date**: `HijriDateObject`

The Hijri date object to sub Months to.

• **amount**: `number`

The number of Months to sub.

## Returns

`HijriDateObject` \| `null`

The resulting Hijri date object after subing the specified number of Months, or `null` if the input date is invalid.

## Examples

```ts
// Substract 10 Months to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
const result = subHijriMonths({ hy: 1445, hm: 9, hd: 1 }, 10)
//=> { hy: 1444, hm: 11, hd: 1 }
```

```ts
// Substract 1 Month from 30 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 30 })
const result = subHijriMonths({ hy: 1445, hm: 9, hd: 30 }, 1)
//=> { hy: 1445, hm: 8, hd: 29 }
```

```ts
// Substract 26 Months from 30 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 30 })
const result = subHijriMonths({ hy: 1447, hm: 12, hd: 29 }, 26)
//=> { hy: 1445, hm: 9, hd: 30 }
```

## Source

[subHijriMonths.ts:34](https://github.com/boussadjra/taqwim/blob/a16e0483140d22a326ae33586f5bfb208d318d3e/packages/core-utils/src/lib/subHijriMonths.ts#L34)
