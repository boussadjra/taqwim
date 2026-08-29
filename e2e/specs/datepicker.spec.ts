import { expect, test, type Page } from '@playwright/test'

/**
 * The date picker is not on the harness. Vue's playground uses a router
 * (`/datepicker`); the others hang the same view off `#datepicker`. The rest of
 * the assertions are DOM-only, same as `calendar.spec.ts`.
 */
async function open(page: Page) {
  const path = test.info().project.name === 'vue' ? '/datepicker' : '/#datepicker'
  await page.goto(path)
  await page.locator('.taqwim-datepicker-input').click()
  await page.waitForSelector('[data-taqwim-calendar]')
}

const prevButton = (page: Page) => page.getByRole('button', { name: 'Previous page' })
const nextButton = (page: Page) => page.getByRole('button', { name: 'Next page' })

test.describe('date picker popover', () => {
  test('shows prev/next and month/year heading buttons', async ({ page }) => {
    await open(page)

    await expect(prevButton(page)).toBeVisible()
    await expect(nextButton(page)).toBeVisible()
    await expect(page.locator('[data-taqwim-heading="month"]')).toBeVisible()
    await expect(page.locator('[data-taqwim-heading="year"]')).toBeVisible()
  })

  test('pages months without closing the popover', async ({ page }) => {
    await open(page)
    const start = await page.locator('[data-taqwim-heading="month"]').innerText()

    await nextButton(page).click()
    await expect(page.locator('[data-taqwim-calendar]')).toBeVisible()
    await expect(page.locator('[data-taqwim-heading="month"]')).not.toHaveText(start)

    await prevButton(page).click()
    await expect(page.locator('[data-taqwim-heading="month"]')).toHaveText(start)
  })

  test('opens a month grid from the month button', async ({ page }) => {
    await open(page)
    await page.locator('[data-taqwim-heading="month"]').click()

    await expect(page.locator('.taqwim-calendar-picker')).toBeVisible()
    await expect(page.locator('[data-taqwim-calendar]')).toBeVisible()
  })

  test('opens a year grid from the year button', async ({ page }) => {
    await open(page)
    await page.locator('[data-taqwim-heading="year"]').click()

    await expect(page.locator('.taqwim-calendar-picker-grid button').first()).toHaveText('1343')
    await expect(page.locator('[data-taqwim-calendar]')).toBeVisible()
  })

  test('closes when clicking outside', async ({ page }) => {
    await open(page)

    // The playground chrome is outside the picker in every adapter.
    await page.locator('.pg-header strong').click()

    await expect(page.locator('[data-taqwim-calendar]')).toHaveCount(0)
  })
})
