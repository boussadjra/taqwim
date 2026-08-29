import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

/**
 * One spec file, five frameworks.
 *
 * This is the mechanism that keeps cross-framework parity honest. Every
 * adapter binds to the same `@taqwim/calendar-core` store and emits the same
 * `data-*` attributes, so these assertions are written against the DOM and
 * nothing here mentions Vue, React, Svelte, Solid or Angular. Playwright runs
 * the file once per project; a divergence in any adapter fails here rather
 * than in review.
 *
 * Each playground serves a harness at `/` that reads its configuration from
 * the query string, so a test can put any adapter into any state.
 */

const RAMADAN_1445 = '1445-09-01'

async function open(page: Page, query: Record<string, string | number | boolean> = {}) {
  const params = new URLSearchParams({ placeholder: RAMADAN_1445 })
  for (const [key, value] of Object.entries(query)) params.set(key, String(value))

  await page.goto(`/?${params}`)
  await page.waitForSelector('[data-taqwim-calendar]')
}

const calendar = (page: Page) => page.locator('[data-taqwim-calendar]')
const inMonth = (page: Page) => page.locator('[data-taqwim-calendar-cell-trigger]:not([data-outside-month])')

/** The trigger for a day of the visible month, by its rendered number. */
function day(page: Page, dayInMonth: number) {
  return page
    .locator(`[data-taqwim-calendar-cell-trigger]:not([data-outside-month])`)
    .filter({ hasText: new RegExp(`^${dayInMonth}$`) })
}

const heading = (page: Page) => page.locator('[data-taqwim-calendar-heading]')
const monthHeading = (page: Page) => page.locator('[data-taqwim-heading="month"]')
const yearHeading = (page: Page) => page.locator('[data-taqwim-heading="year"]')
const selection = (page: Page) => page.locator('[data-testid="selection"]')

// Found by accessible name rather than a test id: the paging buttons' labels
// come from the store, so this asserts the a11y contract at the same time.
const prevButton = (page: Page) => page.getByRole('button', { name: 'Previous page' })
const nextButton = (page: Page) => page.getByRole('button', { name: 'Next page' })

test.describe('rendering', () => {
  test('renders the placeholder month', async ({ page }) => {
    await open(page)

    await expect(heading(page)).toContainText('1445')
    await expect(page.locator('[data-taqwim-calendar-grid]')).toHaveCount(1)
  })

  test('renders every day of the month', async ({ page }) => {
    await open(page)

    // Ramadan 1445 has 30 days.
    await expect(inMonth(page)).toHaveCount(30)
  })

  test('marks today', async ({ page }) => {
    // No placeholder, so the calendar opens on the current month.
    await page.goto('/')
    await page.waitForSelector('[data-taqwim-calendar]')

    await expect(page.locator('[data-today]')).toHaveCount(1)
  })

  test('describes itself to assistive technology', async ({ page }) => {
    await open(page)

    await expect(calendar(page)).toHaveAttribute('role', 'application')
    await expect(calendar(page)).toHaveAttribute('aria-label', /.+/)
    await expect(page.locator('[data-taqwim-calendar-grid]')).toHaveAttribute('role', 'grid')
  })

  test('gives every day cell an accessible label and a value', async ({ page }) => {
    await open(page)

    await expect(day(page, 9)).toHaveAttribute('aria-label', /.+/)
    await expect(day(page, 9)).toHaveAttribute('data-value', '1445-09-09')
  })
})

test.describe('previously inert props', () => {
  test('renders several months', async ({ page }) => {
    await open(page, { numberOfMonths: 3 })

    await expect(page.locator('[data-taqwim-calendar-grid]')).toHaveCount(3)
  })

  test('honours weekStartsOn', async ({ page }) => {
    await open(page, { weekStartsOn: 0 })
    const sunday = await page.locator('[data-taqwim-calendar-head-cell]').allInnerTexts()

    await open(page, { weekStartsOn: 1 })
    const monday = await page.locator('[data-taqwim-calendar-head-cell]').allInnerTexts()

    expect(monday[0].trim()).toBe(sunday[1].trim())
  })

  test('always renders six rows under fixedWeeks', async ({ page }) => {
    await open(page, { fixedWeeks: true })

    await expect(page.locator('[data-taqwim-calendar-grid-body] [data-taqwim-calendar-grid-row]')).toHaveCount(6)
  })

  test('disables days outside min/max rather than only the paging buttons', async ({ page }) => {
    await open(page, { min: '1445-09-10', max: '1445-09-20' })

    await expect(day(page, 5)).toHaveAttribute('data-disabled', '')
    await expect(day(page, 15)).not.toHaveAttribute('data-disabled', '')
    await expect(day(page, 25)).toHaveAttribute('data-disabled', '')
  })
})

test.describe('selection', () => {
  test('selects on click', async ({ page }) => {
    await open(page)

    await day(page, 12).click()

    await expect(day(page, 12)).toHaveAttribute('data-selected', '')
    await expect(selection(page)).toHaveText('1445-09-12')
  })

  test('deselects on a second click', async ({ page }) => {
    await open(page)

    await day(page, 12).click()
    await day(page, 12).click()

    await expect(day(page, 12)).not.toHaveAttribute('data-selected', '')
  })

  test('keeps the selection under preventDeselect', async ({ page }) => {
    await open(page, { preventDeselect: true })

    await day(page, 12).click()
    await day(page, 12).click()

    await expect(day(page, 12)).toHaveAttribute('data-selected', '')
  })

  test('accumulates selections under multiple', async ({ page }) => {
    await open(page, { multiple: true })

    await day(page, 3).click()
    await day(page, 7).click()

    await expect(page.locator('[data-selected]')).toHaveCount(2)
  })

  test('does not select while readonly', async ({ page }) => {
    await open(page, { readonly: true })

    await day(page, 12).click()

    await expect(page.locator('[data-selected]')).toHaveCount(0)
  })
})

test.describe('paging', () => {
  test('moves forward and back a month', async ({ page }) => {
    await open(page)
    const start = await monthHeading(page).innerText()

    await nextButton(page).click()
    await expect(monthHeading(page)).not.toHaveText(start)

    await prevButton(page).click()
    await expect(monthHeading(page)).toHaveText(start)
  })

  test('exposes month and year as separate heading buttons', async ({ page }) => {
    await open(page)

    await expect(monthHeading(page)).toHaveText('Ramadan')
    await expect(yearHeading(page)).toHaveText('1445')
  })

  test('opens a month grid from the month button', async ({ page }) => {
    await open(page)
    await page.locator('[data-taqwim-heading="month"]').click()

    await expect(page.locator('.taqwim-calendar-picker')).toBeVisible()
  })

  test('opens a year grid from the year button', async ({ page }) => {
    await open(page)
    await page.locator('[data-taqwim-heading="year"]').click()

    await expect(page.locator('.taqwim-calendar-picker-grid button').first()).toHaveText('1343')
  })

  test('disables paging past the bounds', async ({ page }) => {
    await open(page, { min: '1445-09-01', max: '1445-09-30' })

    await expect(prevButton(page)).toHaveAttribute('data-disabled', '')
    await expect(nextButton(page)).toHaveAttribute('data-disabled', '')
  })
})

test.describe('keyboard', () => {
  /*
   * None of this existed before the rewrite: `initialFocus` resolved to a TODO
   * and there was no arrow handling at all, so the calendar could not be
   * operated without a mouse in any framework.
   */
  test('enters the grid with a single Tab stop', async ({ page }) => {
    await open(page)

    // A roving tabindex: Tab reaches the grid and leaves it, rather than
    // walking 42 buttons.
    await expect(page.locator('[data-taqwim-calendar-cell-trigger][tabindex="0"]')).toHaveCount(1)
  })

  test.describe('with focus in the grid', () => {
    const focused = (page: Page) => page.locator('[data-focused]')

    test('moves a day at a time', async ({ page }) => {
      await open(page, { value: '1445-09-15', initialFocus: true })

      await page.keyboard.press('ArrowRight')
      await expect(focused(page)).toHaveAttribute('data-value', '1445-09-16')

      await page.keyboard.press('ArrowLeft')
      await expect(focused(page)).toHaveAttribute('data-value', '1445-09-15')
    })

    test('moves a week at a time', async ({ page }) => {
      await open(page, { value: '1445-09-15', initialFocus: true })

      await page.keyboard.press('ArrowDown')
      await expect(focused(page)).toHaveAttribute('data-value', '1445-09-22')

      await page.keyboard.press('ArrowUp')
      await expect(focused(page)).toHaveAttribute('data-value', '1445-09-15')
    })

    test('mirrors the horizontal keys under rtl', async ({ page }) => {
      await open(page, { value: '1445-09-15', initialFocus: true, dir: 'rtl' })

      await page.keyboard.press('ArrowRight')
      await expect(focused(page)).toHaveAttribute('data-value', '1445-09-14')
    })

    test('jumps to the ends of the week', async ({ page }) => {
      await open(page, { value: '1445-09-15', initialFocus: true })

      await page.keyboard.press('Home')
      const first = await focused(page).getAttribute('data-value')

      await page.keyboard.press('End')
      const last = await focused(page).getAttribute('data-value')

      expect(Number(last!.slice(-2)) - Number(first!.slice(-2))).toBe(6)
    })

    test('pages a month, and a year with Shift', async ({ page }) => {
      await open(page, { initialFocus: true })

      await page.keyboard.press('PageDown')
      await expect(heading(page)).toContainText('1445')

      await page.keyboard.press('Shift+PageDown')
      await expect(heading(page)).toContainText('1446')
    })

    test('selects with Enter', async ({ page }) => {
      await open(page, { value: '1445-09-15', initialFocus: true })

      await page.keyboard.press('ArrowRight')
      await page.keyboard.press('Enter')

      await expect(selection(page)).toHaveText('1445-09-16')
    })

    test('keeps DOM focus on the cell the store has focused', async ({ page }) => {
      await open(page, { value: '1445-09-15', initialFocus: true })

      await page.keyboard.press('ArrowRight')

      const active = await page.evaluate(() => document.activeElement?.getAttribute('data-value'))
      expect(active).toBe('1445-09-16')
    })
  })
})

test.describe('theming', () => {
  test('applies the theme as an attribute', async ({ page }) => {
    await open(page, { theme: 'islamic' })

    await expect(calendar(page)).toHaveAttribute('data-taqwim-theme', 'islamic')
  })

  test('restyles when the theme changes, without reloading', async ({ page }) => {
    await open(page, { theme: 'default' })
    const before = await calendar(page).evaluate(el => getComputedStyle(el).backgroundColor)

    await page.locator('[data-testid="theme"]').selectOption('dark')

    await expect(calendar(page)).toHaveAttribute('data-taqwim-theme', 'dark')
    await expect.poll(() => calendar(page).evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(before)
  })
})

test.describe('accessibility', () => {
  /*
   * A calendar is a high-risk widget and the roving focus is new code, so this
   * runs against every adapter rather than being spot-checked on one.
   */
  test('has no detectable axe violations', async ({ page }) => {
    await open(page, { fixedWeeks: true })

    const results = await new AxeBuilder({ page }).include('[data-taqwim-calendar]').analyze()

    expect(results.violations).toEqual([])
  })

  test('has no detectable axe violations in Arabic, right to left', async ({ page }) => {
    await open(page, { locale: 'ar', dir: 'rtl' })

    const results = await new AxeBuilder({ page }).include('[data-taqwim-calendar]').analyze()

    expect(results.violations).toEqual([])
  })
})
