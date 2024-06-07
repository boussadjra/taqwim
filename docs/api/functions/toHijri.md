[**taqwim-core-utils**](../README.md) • **Docs**

---

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

[toHijri.ts:10](https://github.com/boussadjra/taqwim/blob/b6011f3ed342a975f52680743fe89e4925ba0553/packages/core-utils/src/lib/toHijri.ts#L10)

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

[toHijri.ts:13](https://github.com/boussadjra/taqwim/blob/b6011f3ed342a975f52680743fe89e4925ba0553/packages/core-utils/src/lib/toHijri.ts#L13)

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

[toHijri.ts:18](https://github.com/boussadjra/taqwim/blob/b6011f3ed342a975f52680743fe89e4925ba0553/packages/core-utils/src/lib/toHijri.ts#L18)
