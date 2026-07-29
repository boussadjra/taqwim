[**@taqwim/core**](../README.md)

---

[@taqwim/core](../globals.md) / getLocaleData

# Function: getLocaleData()

> **getLocaleData**(`locale`, `key`): `string` \| `string`[]

Defined in: [packages/core/src/lib/getLocaleData.ts:13](https://github.com/boussadjra/taqwim/blob/967b462e7dccdb8cffe50f13ba37d6f2e3f2a4a2/packages/core/src/lib/getLocaleData.ts#L13)

Retrieves the locale data based on the specified locale and key.

## Parameters

### locale

`string`

The locale for which to retrieve the data.

### key

The key indicating the specific data to retrieve.

`"day"` | `"month"` | `"year"` | `"years"` | `"months"` | `"week"` | `"weeks"` | `"days"` | `"monthsLong"` | `"monthsMedium"` | `"monthsShort"` | `"weekDaysLong"` | `"weekDaysMedium"` | `"weekDaysShort"` | `"today"` | `"from"` | `"to"`

## Returns

`string` \| `string`[]

The locale data as an array of strings or a single string.
