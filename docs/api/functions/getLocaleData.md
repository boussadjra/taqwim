[**taqwim-core-utils**](../README.md) • **Docs**

---

[taqwim-core-utils](../globals.md) / getLocaleData

# Function: getLocaleData()

> **getLocaleData**(`locale`, `key`): `string` \| `string`[]

Retrieves the locale data based on the specified locale and key.

## Parameters

• **locale**: `string`

The locale for which to retrieve the data.

• **key**: `"day"` \| `"month"` \| `"year"` \| `"years"` \| `"months"` \| `"week"` \| `"weeks"` \| `"days"` \| `"monthsLong"` \| `"monthsMedium"` \| `"monthsShort"` \| `"weekDaysLong"` \| `"weekDaysMedium"` \| `"weekDaysShort"` \| `"today"` \| `"from"` \| `"to"`

The key indicating the specific data to retrieve.

## Returns

`string` \| `string`[]

The locale data as an array of strings or a single string.

## Source

[getLocaleData.ts:13](https://github.com/boussadjra/taqwim/blob/a16e0483140d22a326ae33586f5bfb208d318d3e/packages/core-utils/src/lib/getLocaleData.ts#L13)
