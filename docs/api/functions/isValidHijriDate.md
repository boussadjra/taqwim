[**@taqwim/core**](../README.md)

---

[@taqwim/core](../globals.md) / isValidHijriDate

# Function: isValidHijriDate()

Checks if a given Hijri date is valid.

## Param

The Hijri year as a number, string, or an object with `hy`, `hm`, and `hd` properties.

## Param

The Hijri month as a number or string. Optional if `hy` is an object.

## Param

The Hijri day as a number. Optional if `hy` is an object.

## Call Signature

> **isValidHijriDate**(`date`): `boolean`

Defined in: [packages/core/src/lib/isValidHijriDate.ts:3](https://github.com/boussadjra/taqwim/blob/967b462e7dccdb8cffe50f13ba37d6f2e3f2a4a2/packages/core/src/lib/isValidHijriDate.ts#L3)

### Parameters

#### date

##### hd

`number`

##### hm

`number`

##### hy

`number`

### Returns

`boolean`

## Call Signature

> **isValidHijriDate**(`date`, `separator?`): `boolean`

Defined in: [packages/core/src/lib/isValidHijriDate.ts:4](https://github.com/boussadjra/taqwim/blob/967b462e7dccdb8cffe50f13ba37d6f2e3f2a4a2/packages/core/src/lib/isValidHijriDate.ts#L4)

### Parameters

#### date

`string`

#### separator?

`string`

### Returns

`boolean`

## Call Signature

> **isValidHijriDate**(`hy`, `hm`, `hd`): `boolean`

Defined in: [packages/core/src/lib/isValidHijriDate.ts:5](https://github.com/boussadjra/taqwim/blob/967b462e7dccdb8cffe50f13ba37d6f2e3f2a4a2/packages/core/src/lib/isValidHijriDate.ts#L5)

### Parameters

#### hy

`number`

#### hm

`number`

#### hd

`number`

### Returns

`boolean`
