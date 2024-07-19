[**taqwim-core-utils**](../README.md) • **Docs**

***

[taqwim-core-utils](../globals.md) / toHijri

# Function: toHijri()

## toHijri(date)

> **toHijri**(`date`): `object` \| `null`

Converts a Gregorian date to Hijri (Islamic) date.

### Parameters

• **date**: `Date` \| `DateObject`

### Returns

`object` \| `null`

An object representing the Hijri date in the format `{ hy: number; hm: number; hd: number }`, or `null` if the conversion fails.

### Throws

If the input is invalid or the conversion fails.

### Source

[toHijri.ts:11](https://github.com/boussadjra/taqwim/blob/a16e0483140d22a326ae33586f5bfb208d318d3e/packages/core-utils/src/lib/toHijri.ts#L11)

## toHijri(year, month, day)

> **toHijri**(`year`, `month`, `day`): `object` \| `null`

Converts a Gregorian date to Hijri (Islamic) date.

### Parameters

• **year**: `number`

• **month**: `number`

The month of the Gregorian date (optional, required if `dateOrYear` is a number).

• **day**: `number`

The day of the Gregorian date (optional, required if `dateOrYear` is a number).

### Returns

`object` \| `null`

An object representing the Hijri date in the format `{ hy: number; hm: number; hd: number }`, or `null` if the conversion fails.

### Throws

If the input is invalid or the conversion fails.

### Source

[toHijri.ts:12](https://github.com/boussadjra/taqwim/blob/a16e0483140d22a326ae33586f5bfb208d318d3e/packages/core-utils/src/lib/toHijri.ts#L12)

## toHijri(date)

> **toHijri**(`date`): `object` \| `null`

Converts a Gregorian date to Hijri (Islamic) date.

### Parameters

• **date**: `string`

### Returns

`object` \| `null`

An object representing the Hijri date in the format `{ hy: number; hm: number; hd: number }`, or `null` if the conversion fails.

### Throws

If the input is invalid or the conversion fails.

### Source

[toHijri.ts:13](https://github.com/boussadjra/taqwim/blob/a16e0483140d22a326ae33586f5bfb208d318d3e/packages/core-utils/src/lib/toHijri.ts#L13)
