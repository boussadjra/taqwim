[**taqwim-core-utils**](../README.md) • **Docs**

***

[taqwim-core-utils](../globals.md) / isValidHijriDate

# Function: isValidHijriDate()

## isValidHijriDate(date)

> **isValidHijriDate**(`date`): `boolean`

Checks if a given Hijri date is valid.

### Parameters

• **date**

• **date.hd**: `number`

• **date.hm**: `number`

• **date.hy**: `number`

### Returns

`boolean`

A boolean indicating whether the Hijri date is valid or not.

### Source

[isValidHijriDate.ts:4](https://github.com/boussadjra/taqwim/blob/b6011f3ed342a975f52680743fe89e4925ba0553/packages/core-utils/src/lib/isValidHijriDate.ts#L4)

## isValidHijriDate(date, separator)

> **isValidHijriDate**(`date`, `separator`?): `boolean`

Checks if a given Hijri date is valid.

### Parameters

• **date**: `string`

• **separator?**: `string`

### Returns

`boolean`

A boolean indicating whether the Hijri date is valid or not.

### Source

[isValidHijriDate.ts:9](https://github.com/boussadjra/taqwim/blob/b6011f3ed342a975f52680743fe89e4925ba0553/packages/core-utils/src/lib/isValidHijriDate.ts#L9)

## isValidHijriDate(hy, hm, hd)

> **isValidHijriDate**(`hy`, `hm`, `hd`): `boolean`

Checks if a given Hijri date is valid.

### Parameters

• **hy**: `number`

The Hijri year as a number, string, or an object with `hy`, `hm`, and `hd` properties.

• **hm**: `number`

The Hijri month as a number or string. Optional if `hy` is an object.

• **hd**: `number`

The Hijri day as a number. Optional if `hy` is an object.

### Returns

`boolean`

A boolean indicating whether the Hijri date is valid or not.

### Source

[isValidHijriDate.ts:10](https://github.com/boussadjra/taqwim/blob/b6011f3ed342a975f52680743fe89e4925ba0553/packages/core-utils/src/lib/isValidHijriDate.ts#L10)
