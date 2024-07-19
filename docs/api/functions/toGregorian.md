[**taqwim-core-utils**](../README.md) • **Docs**

***

[taqwim-core-utils](../globals.md) / toGregorian

# Function: toGregorian()

## toGregorian(date)

> **toGregorian**(`date`): `Date` \| `null`

Converts a Hijri date to a Gregorian date.

### Parameters

• **date**: `HijriDateObject`

### Returns

`Date` \| `null`

The corresponding Gregorian date, or `null` if the Hijri date is invalid.

### Throws

Error if the arguments are invalid or the Hijri date is invalid.

### Source

[toGregorian.ts:4](https://github.com/boussadjra/taqwim/blob/a16e0483140d22a326ae33586f5bfb208d318d3e/packages/core-utils/src/lib/toGregorian.ts#L4)

## toGregorian(hy, hm, hd)

> **toGregorian**(`hy`, `hm`, `hd`): `Date` \| `null`

Converts a Hijri date to a Gregorian date.

### Parameters

• **hy**: `number`

• **hm**: `number`

The Hijri month (optional, required if `dateOrHy` is a number).

• **hd**: `number`

The Hijri day (optional, required if `dateOrHy` is a number).

### Returns

`Date` \| `null`

The corresponding Gregorian date, or `null` if the Hijri date is invalid.

### Throws

Error if the arguments are invalid or the Hijri date is invalid.

### Source

[toGregorian.ts:5](https://github.com/boussadjra/taqwim/blob/a16e0483140d22a326ae33586f5bfb208d318d3e/packages/core-utils/src/lib/toGregorian.ts#L5)
