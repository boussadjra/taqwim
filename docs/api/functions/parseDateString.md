[**@taqwim/core**](../README.md)

---

[@taqwim/core](../globals.md) / parseDateString

# Function: parseDateString()

> **parseDateString**(`dateString`): `HijriDateObject`

Defined in: [packages/core/src/lib/parseDateString.ts:11](https://github.com/boussadjra/taqwim/blob/967b462e7dccdb8cffe50f13ba37d6f2e3f2a4a2/packages/core/src/lib/parseDateString.ts#L11)

Parses a date string and returns a HijriDateObject.

## Parameters

### dateString

The date string to parse.

`""` | `` `${number}-${number}-${number}` `` | `` `${number}-${number}/${number}` `` | `` `${number}/${number}-${number}` `` | `` `${number}/${number}/${number}` ``

## Returns

`HijriDateObject`

The parsed HijriDateObject.

## Throws

Error if the date format is invalid.
