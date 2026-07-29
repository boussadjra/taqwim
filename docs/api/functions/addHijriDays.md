[**@taqwim/core**](../README.md)

---

[@taqwim/core](../globals.md) / addHijriDays

# Function: addHijriDays()

> **addHijriDays**(`date`, `amount`): `HijriDateObject`

Defined in: [packages/core/src/lib/addHijriDays.ts:27](https://github.com/boussadjra/taqwim/blob/967b462e7dccdb8cffe50f13ba37d6f2e3f2a4a2/packages/core/src/lib/addHijriDays.ts#L27)

## Parameters

### date

`HijriDateObject`

The date to be changed

### amount

`number`

The amount of days to be added.

## Returns

`HijriDateObject`

The new date with the days added

## Name

addHijriDays

## Description

Add the specified number of days to the given date.

## Example

```ts
// Add 10 days to 1 Ramadan 1445 ({ hy: 1445, hm: 9, hd: 1 })
const result = addHijriDays(
 { hy: 1445, hm: 9, hd: 1 },
, 10)
//=> { hy: 1445, hm: 10, hd: 11 }
```
