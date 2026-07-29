[**@taqwim/core**](../README.md)

---

[@taqwim/core](../globals.md) / addHijriBusinessDays

# Function: addHijriBusinessDays()

> **addHijriBusinessDays**(`date`, `amount`, `options`): `HijriDateObject`

Defined in: [packages/core/src/lib/addHijriBusinessDays.ts:33](https://github.com/boussadjra/taqwim/blob/967b462e7dccdb8cffe50f13ba37d6f2e3f2a4a2/packages/core/src/lib/addHijriBusinessDays.ts#L33)

## Parameters

### date

`HijriDateObject`

The date to be changed

### amount

`number`

The amount of business days to be added.

### options

`BusinessDayOptions` = `{}`

Business-day options, e.g. `{ weekend: [6, 0] }` for a Sat/Sun weekend.

## Returns

`HijriDateObject`

The new date with the business days added, or `null` if `date` is invalid.

## Name

addHijriBusinessDays

## Description

Add the specified number of business days to the given date, skipping
weekend days. The weekend defaults to Friday/Saturday — the working week
across most of the Arab world — and is configurable.

## Examples

```ts
// Add 20 business days to 1 Ramadan 1445
addHijriBusinessDays({ hy: 1445, hm: 9, hd: 1 }, 20)
//=> { hy: 1445, hm: 9, hd: 29 }
```

```ts
// Western Saturday/Sunday weekend
addHijriBusinessDays({ hy: 1445, hm: 9, hd: 1 }, 5, { weekend: [6, 0] })
```
