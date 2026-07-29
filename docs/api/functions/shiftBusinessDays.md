[**@taqwim/core**](../README.md)

---

[@taqwim/core](../globals.md) / shiftBusinessDays

# Function: shiftBusinessDays()

> **shiftBusinessDays**(`startEpochDay`, `amount`, `weekend`): `number`

Defined in: packages/core/src/lib/weekend.ts:42

Steps `amount` business days from `startEpochDay`, skipping weekend days.
Negative amounts step backwards. The starting day is never counted, so a
start that falls on a weekend simply walks forward to the next working day.

## Parameters

### startEpochDay

`number`

### amount

`number`

### weekend

[`Weekend`](../type-aliases/Weekend.md)

## Returns

`number`
