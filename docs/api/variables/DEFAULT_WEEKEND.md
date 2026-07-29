[**@taqwim/core**](../README.md)

---

[@taqwim/core](../globals.md) / DEFAULT\_WEEKEND

# Variable: DEFAULT\_WEEKEND

> `const` **DEFAULT\_WEEKEND**: [`Weekend`](../type-aliases/Weekend.md)

Defined in: packages/core/src/lib/weekend.ts:13

Friday and Saturday — the working week across most of the Arab world, and
the sensible default for a Hijri calendar library.

Note this differs from `date-fns`, which is fixed to Saturday/Sunday. Pass
`{ weekend: [6, 0] }` for the Western convention.
