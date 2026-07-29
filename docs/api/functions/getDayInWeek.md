[**@taqwim/core**](../README.md)

---

[@taqwim/core](../globals.md) / getDayInWeek

# Function: getDayInWeek()

> **getDayInWeek**(`hijriDate`): `number`

Defined in: [packages/core/src/lib/getDayInWeek.ts:11](https://github.com/boussadjra/taqwim/blob/967b462e7dccdb8cffe50f13ba37d6f2e3f2a4a2/packages/core/src/lib/getDayInWeek.ts#L11)

Returns the day of the week for a given Hijri date.

## Parameters

### hijriDate

`ValidHijriDate`

The Hijri date to get the day of the week for.

## Returns

`number`

The day of the week as a number (0-6), where 0 represents Sunday, 1 represents Monday, and so on.
Returns `undefined` if the provided Hijri date is invalid.
