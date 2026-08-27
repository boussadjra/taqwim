/**
 * The runtime conformance checks for `@taqwim/core`.
 *
 * One file, run unchanged under every runtime in the matrix — the same idea as
 * `e2e/specs/calendar.spec.ts` running unchanged against every framework
 * adapter. It is handed a module namespace and knows nothing about how that
 * namespace was loaded, so the ESM and CommonJS entries share it verbatim.
 *
 * It deliberately re-states expectations the Vitest suite already covers. The
 * difference is what is under test: Vitest runs `src/` under Node, this runs
 * the built `dist/` under Node, Deno and Bun. Drift between those is exactly
 * what this is here to catch, and the duplication is the price of catching it.
 *
 * Constraints, because this file has to load in three runtimes:
 *
 *   - no imports at all, and no `node:` builtins
 *   - no assertion library; the helpers below are the whole framework
 *   - only globals all three share (`Date`, `Math`, `JSON`, `console`)
 *
 * `run.mjs` drives it. Anything runtime-specific — spawning, time zones,
 * resolving the entry point — lives there, not here.
 */

/** "Ramadan" in Arabic. Named rather than inlined so a mangled diff is obvious rather than a mystery mismatch. */
const RAMADAN_AR = 'رمضان'

/**
 * The full public surface, sorted.
 *
 * Checked by name rather than by count because the failure it catches is
 * format-specific: a named export that survives the ESM build and goes missing
 * from the CommonJS one is invisible to every other test in the repo.
 */
const PUBLIC_EXPORTS = [
  'Arabic',
  'DEFAULT_WEEKEND',
  'EPOCH_DAY_RANGE',
  'English',
  'French',
  'HijriRangeError',
  'MAX_GREGORIAN_DATE',
  'MAX_HIJRI_YEAR',
  'MIN_GREGORIAN_DATE',
  'MIN_HIJRI_YEAR',
  'addHijri',
  'addHijriBusinessDays',
  'addHijriDays',
  'addHijriMonths',
  'addHijriQuarters',
  'addHijriWeeks',
  'addHijriYears',
  'dayOfWeekFromEpochDay',
  'daysInHijriMonth',
  'daysInHijriYear',
  'epochDayOf',
  'epochDayToDate',
  'formatHijriDate',
  'getDayInWeek',
  'getDaysLengthInMonth',
  'getHijriYear',
  'getLocaleData',
  'getMonthAdjacentDays',
  'hDatesTable',
  'hijriYearStartEpochDay',
  'isEqual',
  'isGreaterThan',
  'isGreaterThanOrEqual',
  'isLessThan',
  'isLessThanOrEqual',
  'isValidHijriDate',
  'normalizeHijriDate',
  'parseDateString',
  'recordForEpochDay',
  'recordForHijriYear',
  'shiftBusinessDays',
  'subHijri',
  'subHijriBusinessDays',
  'subHijriDays',
  'subHijriMonths',
  'subHijriQuarters',
  'subHijriWeeks',
  'subHijriYears',
  'toEpochDay',
  'toGregorian',
  'toHijri',
]

function show(value) {
  if (value instanceof Date) return value.toDateString()
  return JSON.stringify(value)
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function same(actual, expected, what) {
  const got = show(actual)
  const wanted = show(expected)
  if (got !== wanted) throw new Error(`${what}: expected ${wanted}, got ${got}`)
}

/** Compares a `Date` by its *local* calendar parts, the only thing this library promises about one. */
function sameLocalDate(actual, [year, month, day], what) {
  assert(actual instanceof Date, `${what}: expected a Date, got ${show(actual)}`)
  same([actual.getFullYear(), actual.getMonth() + 1, actual.getDate()], [year, month, day], what)
}

function throws(fn, what, inspect) {
  let thrown
  try {
    fn()
  } catch (error) {
    thrown = error
  }
  assert(thrown !== undefined, `${what}: expected a throw, nothing was thrown`)
  if (inspect) inspect(thrown)
}

/**
 * Runs every check against one loaded copy of the package.
 *
 * @param {Record<string, any>} t The `@taqwim/core` module namespace.
 * @returns {{ passed: number, failures: { name: string, message: string }[] }}
 */
export function runChecks(t) {
  const failures = []
  let passed = 0

  const check = (name, body) => {
    try {
      body()
      passed++
    } catch (error) {
      failures.push({ name, message: error && error.message ? error.message : String(error) })
    }
  }

  const ramadan1 = { hy: 1445, hm: 9, hd: 1 }

  check('exports: the public surface is complete', () => {
    same(Object.keys(t).sort(), PUBLIC_EXPORTS, 'exported names')
    assert(typeof t.toHijri === 'function', 'toHijri should be a function')
    assert(Array.isArray(t.hDatesTable), 'hDatesTable should be an array')
  })

  check('conversion: Gregorian to Hijri, from every accepted input', () => {
    same(t.toHijri(new Date(2024, 2, 11)), ramadan1, 'from a Date')
    same(t.toHijri('2024-03-11'), ramadan1, 'from an ISO string')
    same(t.toHijri(2024, 3, 11), ramadan1, 'from year/month/day')
    same(t.toHijri({ year: 2024, month: 3, day: 11 }), ramadan1, 'from a date object')
  })

  check('conversion: Hijri to Gregorian returns local midnight', () => {
    const gregorian = t.toGregorian(ramadan1)
    sameLocalDate(gregorian, [2024, 3, 11], 'toGregorian')
    same([gregorian.getHours(), gregorian.getMinutes(), gregorian.getSeconds()], [0, 0, 0], 'time of day')
  })

  check('conversion: every day the table covers round-trips', () => {
    // ~56,000 days. Cheap enough to run in full on every runtime, and the
    // strongest single piece of evidence that a runtime's Date and Math agree
    // with Node's: one divergent day anywhere in the table surfaces here.
    const { min, max } = t.EPOCH_DAY_RANGE
    let mismatch = null
    for (let epochDay = min; epochDay <= max && mismatch === null; epochDay++) {
      const roundTripped = t.epochDayOf(t.toGregorian(t.toHijri(t.epochDayToDate(epochDay))))
      if (roundTripped !== epochDay) mismatch = `epoch day ${epochDay} round-tripped to ${roundTripped}`
    }
    assert(mismatch === null, mismatch)
  })

  check('range: both table boundaries convert', () => {
    same([t.MIN_HIJRI_YEAR, t.MAX_HIJRI_YEAR], [1343, 1500], 'covered Hijri years')
    same(t.toHijri(t.MIN_GREGORIAN_DATE), { hy: t.MIN_HIJRI_YEAR, hm: 1, hd: 1 }, 'first covered day')
    same(t.toHijri(t.MAX_GREGORIAN_DATE).hy, t.MAX_HIJRI_YEAR, 'last covered day')
  })

  check('range: a day past either end throws HijriRangeError', () => {
    const before = new Date(t.MIN_GREGORIAN_DATE)
    before.setDate(before.getDate() - 1)
    const after = new Date(t.MAX_GREGORIAN_DATE)
    after.setDate(after.getDate() + 1)

    throws(
      () => t.toHijri(before),
      'the day before the table',
      error => assert(error instanceof t.HijriRangeError, `expected HijriRangeError, got ${error.name}`),
    )
    throws(() => t.toHijri(after), 'the day after the table')
    throws(() => t.toGregorian({ hy: 1200, hm: 1, hd: 1 }), 'a Hijri year below the table')
    throws(() => t.toGregorian({ hy: 1501, hm: 1, hd: 1 }), 'a Hijri year above the table')
  })

  check('errors: HijriRangeError survives the module boundary', () => {
    // The `Object.setPrototypeOf` in its constructor is what keeps `instanceof`
    // working through the built output; a runtime that handles class extension
    // of a builtin differently would break it here and nowhere else.
    const error = t.HijriRangeError.forHijriYear(1200)
    assert(error instanceof t.HijriRangeError, 'should be a HijriRangeError')
    assert(error instanceof RangeError, 'should be a RangeError')
    same(error.name, 'HijriRangeError', 'name')
    assert(/1343-1500 AH/.test(error.message), `message should name the range, got ${show(error.message)}`)
  })

  check('arithmetic: days, weeks, months, quarters and years', () => {
    same(t.addHijriDays(ramadan1, 30), { hy: 1445, hm: 10, hd: 1 }, 'addHijriDays')
    same(t.addHijriWeeks(ramadan1, 2), { hy: 1445, hm: 9, hd: 15 }, 'addHijriWeeks')
    same(t.addHijriMonths(ramadan1, 1), { hy: 1445, hm: 10, hd: 1 }, 'addHijriMonths')
    same(t.addHijriQuarters(ramadan1, 1), { hy: 1445, hm: 12, hd: 1 }, 'addHijriQuarters')
    same(t.addHijriYears(ramadan1, 1), { hy: 1446, hm: 9, hd: 1 }, 'addHijriYears')
    same(t.addHijri(ramadan1, { years: 1, months: 1, weeks: 1, days: 1 }), { hy: 1446, hm: 10, hd: 9 }, 'addHijri')
  })

  check('arithmetic: subtraction mirrors addition', () => {
    same(t.subHijriDays(ramadan1, 30), { hy: 1445, hm: 7, hd: 29 }, 'subHijriDays')
    same(t.subHijriYears(ramadan1, 1), { hy: 1444, hm: 9, hd: 1 }, 'subHijriYears')
    for (const [add, sub] of [
      [t.addHijriDays, t.subHijriDays],
      [t.addHijriWeeks, t.subHijriWeeks],
      [t.addHijriMonths, t.subHijriMonths],
      [t.addHijriQuarters, t.subHijriQuarters],
      [t.addHijriYears, t.subHijriYears],
    ]) {
      same(sub(add(ramadan1, 3), 3), ramadan1, 'add then subtract 3')
    }
  })

  check('arithmetic: business days default to a Friday/Saturday weekend', () => {
    // 4 Ramadan 1445 is a Thursday, so one business day lands on Sunday with
    // the Arab weekend and on Friday with the Western one.
    const thursday = { hy: 1445, hm: 9, hd: 4 }
    same(t.getDayInWeek(thursday), 4, 'the fixture really is a Thursday')
    same(t.DEFAULT_WEEKEND, [5, 6], 'DEFAULT_WEEKEND')
    same(t.addHijriBusinessDays(thursday, 1), { hy: 1445, hm: 9, hd: 7 }, 'Friday/Saturday weekend')
    same(
      t.addHijriBusinessDays(thursday, 1, { weekend: [6, 0] }),
      { hy: 1445, hm: 9, hd: 5 },
      'Saturday/Sunday weekend',
    )
    same(t.subHijriBusinessDays(ramadan1, 5), { hy: 1445, hm: 8, hd: 23 }, 'subHijriBusinessDays')
    throws(() => t.shiftBusinessDays(0, 1, [0, 1, 2, 3, 4, 5, 6]), 'a seven-day weekend')
  })

  check('formatting: numeric tokens', () => {
    same(t.formatHijriDate(ramadan1, 'iYYYY-iMM-iDD'), '1445-09-01', 'padded')
    same(t.formatHijriDate(ramadan1, 'iD/iM/iYY'), '1/9/45', 'unpadded')
  })

  check('formatting: month and weekday names in en, ar and fr', () => {
    // Reaches `date-fns/locale`, a deep import through that package's own
    // export map — the one place in this library where resolution can differ
    // between runtimes rather than just arithmetic.
    same(t.formatHijriDate(ramadan1, 'iEEEE iD iMMMM iYYYY', 'en'), 'Monday 1 Ramadan 1445', 'English')
    same(t.formatHijriDate(ramadan1, 'iMMMM', 'ar'), RAMADAN_AR, 'Arabic')
    same(t.getLocaleData('ar', 'monthsLong')[8], RAMADAN_AR, 'the Arabic month table')
    same(t.formatHijriDate(ramadan1, 'iD iMMM iYYYY', 'fr'), '1 Ramadan 1445', 'French')
    throws(() => t.formatHijriDate(ramadan1, 'iD', 'xx'), 'an unsupported locale')
  })

  check('formatting: Gregorian tokens fall through to date-fns', () => {
    same(t.formatHijriDate(ramadan1, 'yyyy-MM-dd'), '2024-03-11', 'the Gregorian equivalent')
  })

  check('parsing: strings and validation', () => {
    same(t.parseDateString('1445/09/01'), ramadan1, 'yyyy/MM/dd')
    same(t.parseDateString('01-09-1445'), ramadan1, 'dd-MM-yyyy')
    same(t.normalizeHijriDate('1445/09/01'), ramadan1, 'normalizeHijriDate')
    assert(t.isValidHijriDate(ramadan1), '1 Ramadan 1445 should be valid')
    assert(!t.isValidHijriDate({ hy: 1445, hm: 9, hd: 31 }), 'Ramadan 1445 has 30 days, so day 31 is not valid')
    throws(() => t.parseDateString('nonsense'), 'an unparseable string')
  })

  check('comparison: the ordering predicates', () => {
    const later = { hy: 1445, hm: 9, hd: 2 }
    assert(t.isEqual(ramadan1, { ...ramadan1 }), 'isEqual')
    assert(t.isGreaterThan(later, ramadan1), 'isGreaterThan')
    assert(t.isGreaterThanOrEqual(ramadan1, ramadan1), 'isGreaterThanOrEqual')
    assert(t.isLessThan(ramadan1, later), 'isLessThan')
    assert(t.isLessThanOrEqual(ramadan1, ramadan1), 'isLessThanOrEqual')
  })

  check('grid: getMonthAdjacentDays pads the month into whole weeks', () => {
    const { prevMonthDays, nextMonthDays } = t.getMonthAdjacentDays(ramadan1)
    same(t.getDaysLengthInMonth(ramadan1), 30, 'days in Ramadan 1445')
    same(prevMonthDays.length, 1, 'leading days, for a month starting on a Monday')
    const total = prevMonthDays.length + t.getDaysLengthInMonth(ramadan1) + nextMonthDays.length
    same(total % 7, 0, 'padded cell count should be a whole number of weeks')
  })

  check('time zone: the epoch-day helpers ignore the host zone', () => {
    // The whole library pivots on these three. They are integer maths over
    // local calendar parts, so their answers must not move when TZ does —
    // `run.mjs` runs this file under several zones to prove it.
    same(t.toEpochDay(1970, 1, 1), 0, 'the Unix epoch')
    same(t.dayOfWeekFromEpochDay(0), 4, 'epoch day 0 was a Thursday')
    same(t.toEpochDay(2024, 3, 11), 19793, 'a date inside the table')
    for (const [year, month, day] of [
      [1924, 8, 1],
      [1970, 1, 1],
      [2024, 3, 11],
      [2077, 11, 16],
    ]) {
      const label = `${year}-${month}-${day}`
      same(t.epochDayOf(new Date(year, month - 1, day)), t.toEpochDay(year, month, day), `epochDayOf ${label}`)
      sameLocalDate(t.epochDayToDate(t.toEpochDay(year, month, day)), [year, month, day], `epochDayToDate ${label}`)
    }
  })

  check('table: the indexed views agree with the table they index', () => {
    const record = t.recordForHijriYear(1445)
    same(record.hy, 1445, 'recordForHijriYear')
    same(t.daysInHijriYear(record.dpm), 354, 'days in 1445 AH')
    same(t.daysInHijriMonth(record.dpm, 9), 30, 'days in Ramadan 1445')
    same(t.hijriYearStartEpochDay(1445), t.toEpochDay(record.gy, record.gm, record.gd), 'hijriYearStartEpochDay')
    same(t.recordForEpochDay(t.hijriYearStartEpochDay(1445)).record.hy, 1445, 'recordForEpochDay')
    same(t.getHijriYear(t.epochDayToDate(t.hijriYearStartEpochDay(1445))).hy, 1445, 'getHijriYear')
  })

  return { passed, failures }
}

/**
 * Runs the checks, prints the result in the shape `run.mjs` parses, and returns
 * the process exit code. Shared by both entry points so the ESM and CommonJS
 * legs report identically.
 */
export function report(t, format) {
  const started = Date.now()
  const { passed, failures } = runChecks(t)
  const elapsed = Date.now() - started

  for (const failure of failures) {
    console.log(`FAIL ${failure.name}: ${failure.message}`)
  }
  console.log(`RESULT ${format} ${passed} ${failures.length} ${elapsed}`)

  return failures.length === 0 ? 0 : 1
}

/** `process.exit` is not in Deno's global scope; `Deno.exit` is not in anyone else's. */
export function exit(code) {
  if (globalThis.Deno) globalThis.Deno.exit(code)
  else globalThis.process.exit(code)
}
