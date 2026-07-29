[**@taqwim/core**](../README.md)

---

[@taqwim/core](../globals.md) / getMonthAdjacentDays

# Function: getMonthAdjacentDays()

> **getMonthAdjacentDays**(`hijriDate`): `object`

Defined in: [packages/core/src/lib/getMonthAdjacentDays.ts:9](https://github.com/boussadjra/taqwim/blob/967b462e7dccdb8cffe50f13ba37d6f2e3f2a4a2/packages/core/src/lib/getMonthAdjacentDays.ts#L9)

Get the days of the previous and next months of the given Hijri date.

## Parameters

### hijriDate

`HijriDateObject`

The Hijri date to get the adjacent days of.

## Returns

`object`

An object containing the days of the previous and next months.

### nextMonthDays

> **nextMonthDays**: `MonthDay`[]

### prevMonthDays

> **prevMonthDays**: `MonthDay`[]
