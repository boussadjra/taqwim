[**@taqwim/core**](../README.md)

---

[@taqwim/core](../globals.md) / recordForEpochDay

# Function: recordForEpochDay()

> **recordForEpochDay**(`epochDay`): `object`

Defined in: packages/core/src/lib/hDatesIndex.ts:92

The table record for the Hijri year containing `epochDay`, plus that year's
start, via binary search. Returns `undefined` outside the table's coverage.

## Parameters

### epochDay

`number`

## Returns

`object`

### record

> **record**: `hDates`

### startEpochDay

> **startEpochDay**: `number`
