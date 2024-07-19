[**taqwim-core-utils**](../README.md) • **Docs**

---

[taqwim-core-utils](../globals.md) / formatHijriDate

# Function: formatHijriDate()

> **formatHijriDate**(`hijriDate`, `formatStr`, `locale`): `string`

Formats a Hijri date based on the provided format string.

## Parameters

• **hijriDate**

The Hijri date object containing the year, month, and day.

• **hijriDate.hd**: `number`

• **hijriDate.hm**: `number`

• **hijriDate.hy**: `number`

• **formatStr**: `string`

The format string specifying how the Hijri date should be formatted.

• **locale**: `string`= `'en'`

The locale to use for formatting the date. Defaults to "en".

## Returns

`string`

The formatted Hijri date as a string.

## Examples

```ts
formatHijriDate({ hy: 1443, hm: 3, hd: 10 }, 'iYYYY/iMM/iDD', 'ar')
//=> "1443/03/10"
```

```ts
formatHijriDate({ hy: 1443, hm: 3, hd: 10 }, 'iD iMMM, iYYYY', 'en')
//=> "10 Rabiʻ II, 1443"
```

```ts
formatHijriDate({ hy: 1443, hm: 3, hd: 10 }, 'iEEEE, iD iMMMM iYYYY', 'ar')
//=> "الأحد, 10 جمادى الثاني 1443"
```

```ts
formatHijriDate({ hy: 1443, hm: 3, hd: 10 }, 'iE, iD iMMM iYYYY', 'en')
//=> "7, 10 Rabiʻ II 1443"
```

```ts
formatHijriDate({ hy: 1443, hm: 3, hd: 10 }, 'iD iMMM, iYYYY', 'fr')
//=> "10 Rabiʻ II, 1443"
```

```ts
formatHijriDate({ hy: 1443, hm: 3, hd: 10 }, 'iD iMMM, iYYYY', 'ar')
//=> "10 ربيع الثاني, 1443"
```

```ts
formatHijriDate({ hy: 1443, hm: 3, hd: 10 }, 'iD iMMM, iYYYY', 'en')
//=> "10 Rabiʻ II, 1443"
```

## Source

[formatHijriDate.ts:39](https://github.com/boussadjra/taqwim/blob/a16e0483140d22a326ae33586f5bfb208d318d3e/packages/core-utils/src/lib/formatHijriDate.ts#L39)
