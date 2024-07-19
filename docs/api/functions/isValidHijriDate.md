[**taqwim-core-utils**](../README.md) • **Docs**

---

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

[isValidHijriDate.ts:4](https://github.com/boussadjra/taqwim/blob/a16e0483140d22a326ae33586f5bfb208d318d3e/packages/core-utils/src/lib/isValidHijriDate.ts#L4)

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

[isValidHijriDate.ts:5](https://github.com/boussadjra/taqwim/blob/a16e0483140d22a326ae33586f5bfb208d318d3e/packages/core-utils/src/lib/isValidHijriDate.ts#L5)

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

[isValidHijriDate.ts:6](https://github.com/boussadjra/taqwim/blob/a16e0483140d22a326ae33586f5bfb208d318d3e/packages/core-utils/src/lib/isValidHijriDate.ts#L6)
