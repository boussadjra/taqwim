[**@taqwim/core**](../README.md)

---

[@taqwim/core](../globals.md) / toHijri

# Function: toHijri()

Converts a Gregorian date to Hijri (Islamic) date.

## Param

The Gregorian date or year to convert.

## Param

The month of the Gregorian date (optional, required if `dateOrYear` is a number).

## Param

The day of the Gregorian date (optional, required if `dateOrYear` is a number).

## Throws

If the input is not a usable Gregorian date.

## Throws

If the date falls outside the Umm al-Qura table's coverage.

## Call Signature

> **toHijri**(`date`): `HijriDateObject`

Defined in: [packages/core/src/lib/toHijri.ts:12](https://github.com/boussadjra/taqwim/blob/967b462e7dccdb8cffe50f13ba37d6f2e3f2a4a2/packages/core/src/lib/toHijri.ts#L12)

### Parameters

#### date

`Date` | `DateObject`

### Returns

`HijriDateObject`

## Call Signature

> **toHijri**(`year`, `month`, `day`): `HijriDateObject`

Defined in: [packages/core/src/lib/toHijri.ts:13](https://github.com/boussadjra/taqwim/blob/967b462e7dccdb8cffe50f13ba37d6f2e3f2a4a2/packages/core/src/lib/toHijri.ts#L13)

### Parameters

#### year

`number`

#### month

`number`

#### day

`number`

### Returns

`HijriDateObject`

## Call Signature

> **toHijri**(`date`): `HijriDateObject`

Defined in: [packages/core/src/lib/toHijri.ts:14](https://github.com/boussadjra/taqwim/blob/967b462e7dccdb8cffe50f13ba37d6f2e3f2a4a2/packages/core/src/lib/toHijri.ts#L14)

### Parameters

#### date

`string`

### Returns

`HijriDateObject`
