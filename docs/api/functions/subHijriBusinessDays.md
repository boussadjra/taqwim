[**@taqwim/core**](../README.md)

---

[@taqwim/core](../globals.md) / subHijriBusinessDays

# Function: subHijriBusinessDays()

> **subHijriBusinessDays**(`date`, `amount`, `options`): `HijriDateObject`

Defined in: [packages/core/src/lib/subHijriBusinessDays.ts:26](https://github.com/boussadjra/taqwim/blob/967b462e7dccdb8cffe50f13ba37d6f2e3f2a4a2/packages/core/src/lib/subHijriBusinessDays.ts#L26)

## Parameters

### date

`HijriDateObject`

The date to be changed

### amount

`number`

The amount of business days to be subtracted.

### options

`BusinessDayOptions` = `{}`

Business-day options, e.g. `{ weekend: [6, 0] }` for a Sat/Sun weekend.

## Returns

`HijriDateObject`

The new date with the business days subtracted, or `null` if `date` is invalid.

## Name

subHijriBusinessDays

## Description

Subtract the specified number of business days from the given date, skipping
weekend days. The weekend defaults to Friday/Saturday — the working week
across most of the Arab world — and is configurable.

## Example

```ts
// Subtract 10 business days from 1 Ramadan 1445
subHijriBusinessDays({ hy: 1445, hm: 9, hd: 1 }, 10)
//=> { hy: 1445, hm: 8, hd: 16 }
```
