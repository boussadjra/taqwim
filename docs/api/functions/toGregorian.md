[**@taqwim/core**](../README.md)

---

[@taqwim/core](../globals.md) / toGregorian

# Function: toGregorian()

Converts a Hijri date to a Gregorian date.

## Param

The Hijri date object or the Hijri year.

## Param

The Hijri month (optional, required if `dateOrHy` is a number).

## Param

The Hijri day (optional, required if `dateOrHy` is a number).

## Throws

If the arguments are incomplete or the Hijri date is not a real date.

## Throws

If the Hijri year falls outside the Umm al-Qura table's coverage.

## Call Signature

> **toGregorian**(`date`): `Date`

Defined in: [packages/core/src/lib/toGregorian.ts:13](https://github.com/boussadjra/taqwim/blob/967b462e7dccdb8cffe50f13ba37d6f2e3f2a4a2/packages/core/src/lib/toGregorian.ts#L13)

### Parameters

#### date

`HijriDateObject`

### Returns

`Date`

## Call Signature

> **toGregorian**(`hy`, `hm`, `hd`): `Date`

Defined in: [packages/core/src/lib/toGregorian.ts:14](https://github.com/boussadjra/taqwim/blob/967b462e7dccdb8cffe50f13ba37d6f2e3f2a4a2/packages/core/src/lib/toGregorian.ts#L14)

### Parameters

#### hy

`number`

#### hm

`number`

#### hd

`number`

### Returns

`Date`
