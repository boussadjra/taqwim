[**@taqwim/core**](../README.md)

---

[@taqwim/core](../globals.md) / formatHijriDate

# Function: formatHijriDate()

> **formatHijriDate**(`hijriDate`, `formatStr`, `locale`): `string`

Defined in: [packages/core/src/lib/formatHijriDate.ts:39](https://github.com/boussadjra/taqwim/blob/967b462e7dccdb8cffe50f13ba37d6f2e3f2a4a2/packages/core/src/lib/formatHijriDate.ts#L39)

Formats a Hijri date based on the provided format string.

## Parameters

### hijriDate

The Hijri date object containing the year, month, and day.

#### hd

`number`

#### hm

`number`

#### hy

`number`

### formatStr

`string`

The format string specifying how the Hijri date should be formatted.

### locale

`string` = `'en'`

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
