import { test, expect } from '@playwright/test'

test.describe('HijriCalendar E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the playground page with HijriCalendar
    await page.goto('/playground/vue3/')
  })

  test('should render HijriCalendar correctly', async ({ page }) => {
    // Check if the calendar container exists
    await expect(page.locator('.hijri-calendar')).toBeVisible()

    // Check if header is rendered
    await expect(page.locator('.hijri-calendar-header')).toBeVisible()

    // Check if navigation buttons are present
    await expect(page.locator('[data-testid="hijri-prev-button"]')).toBeVisible()
    await expect(page.locator('[data-testid="hijri-next-button"]')).toBeVisible()

    // Check if heading is present
    await expect(page.locator('.hijri-calendar-heading')).toBeVisible()
  })

  test('should display weekday headers', async ({ page }) => {
    // Check if weekday headers are rendered
    const weekdayHeaders = page.locator('.hijri-calendar-head-cell')
    await expect(weekdayHeaders).toHaveCount(7)

    // In Arabic locale, should show Arabic weekday names
    await expect(weekdayHeaders.first()).toContainText(/[أ-ي]/)
  })

  test('should display calendar grid with dates', async ({ page }) => {
    // Check if calendar grid exists
    await expect(page.locator('.hijri-calendar-grid')).toBeVisible()

    // Check if calendar cells are rendered
    const cells = page.locator('[data-reka-calendar-cell-trigger]')
    await expect(cells.first()).toBeVisible()

    // Should have multiple date cells
    const cellCount = await cells.count()
    expect(cellCount).toBeGreaterThan(20) // At least 3 weeks worth of days
  })

  test('should handle date selection', async ({ page }) => {
    // Click on a date cell
    const dateCell = page.locator('[data-reka-calendar-cell-trigger]').nth(15)
    await dateCell.click()

    // Check if the date is selected
    await expect(dateCell).toHaveAttribute('data-selected', '')

    // Check if the selected date is displayed below the calendar
    await expect(page.locator('text=Selected Date:')).toBeVisible()
  })

  test('should navigate to next month', async ({ page }) => {
    // Get current month text
    const initialHeading = await page.locator('.hijri-calendar-heading').textContent()

    // Click next button
    await page.locator('[data-testid="hijri-next-button"]').click()

    // Wait for month to change
    await page.waitForTimeout(300)

    // Check if heading changed
    const newHeading = await page.locator('.hijri-calendar-heading').textContent()
    expect(newHeading).not.toBe(initialHeading)
  })

  test('should navigate to previous month', async ({ page }) => {
    // Get current month text
    const initialHeading = await page.locator('.hijri-calendar-heading').textContent()

    // Click previous button
    await page.locator('[data-testid="hijri-prev-button"]').click()

    // Wait for month to change
    await page.waitForTimeout(300)

    // Check if heading changed
    const newHeading = await page.locator('.hijri-calendar-heading').textContent()
    expect(newHeading).not.toBe(initialHeading)
  })

  test('should show today indicator', async ({ page }) => {
    // Look for today's date (should have data-today attribute)
    const todayCell = page.locator('[data-today]')
    await expect(todayCell).toBeVisible()

    // Today cell should be visually distinct
    await expect(todayCell).toHaveCSS('background-color', /rgb\(219, 234, 254\)/) // blue-100
  })

  test('should handle keyboard navigation', async ({ page }) => {
    // Focus on a date cell
    const dateCell = page.locator('[data-reka-calendar-cell-trigger]').nth(15)
    await dateCell.focus()

    // Check if cell is focused
    await expect(dateCell).toBeFocused()

    // Press Enter to select
    await page.keyboard.press('Enter')

    // Check if date is selected
    await expect(dateCell).toHaveAttribute('data-selected', '')
  })

  test('should respect unavailable dates', async ({ page }) => {
    // Look for unavailable dates (marked in the example)
    const unavailableCells = page.locator('[data-unavailable]')

    if ((await unavailableCells.count()) > 0) {
      const unavailableCell = unavailableCells.first()

      // Should have line-through styling
      await expect(unavailableCell).toHaveCSS('text-decoration', /line-through/)

      // Should not be clickable
      await expect(unavailableCell).toHaveAttribute('aria-disabled', 'true')
    }
  })

  test('should support RTL layout', async ({ page }) => {
    // Check if calendar supports RTL direction
    const calendar = page.locator('.hijri-calendar')

    // Check for RTL attribute
    const dir = await calendar.getAttribute('dir')
    if (dir === 'rtl') {
      // Grid should be in RTL order
      await expect(calendar).toHaveCSS('direction', 'rtl')
    }
  })

  test('should handle multiple date selection when enabled', async ({ page }) => {
    // This test assumes the calendar is configured for multiple selection
    // Click on first date
    const firstDate = page.locator('[data-reka-calendar-cell-trigger]').nth(10)
    await firstDate.click()
    await expect(firstDate).toHaveAttribute('data-selected', '')

    // Click on second date
    const secondDate = page.locator('[data-reka-calendar-cell-trigger]').nth(15)
    await secondDate.click()

    // Both dates should be selected if multiple is enabled
    // This depends on the configuration in App.vue
  })

  test('should display correct aria labels', async ({ page }) => {
    // Check calendar aria-label
    const calendar = page.locator('[role="application"]')
    await expect(calendar).toHaveAttribute('aria-label')

    // Check date cell aria-labels
    const dateCell = page.locator('[data-reka-calendar-cell-trigger]').first()
    await expect(dateCell).toHaveAttribute('aria-label')

    // Aria-label should contain date information
    const ariaLabel = await dateCell.getAttribute('aria-label')
    expect(ariaLabel).toMatch(/\d+/) // Should contain numbers (date)
  })

  test('should handle hover states', async ({ page }) => {
    const dateCell = page.locator('[data-reka-calendar-cell-trigger]').nth(15)

    // Hover over a date cell
    await dateCell.hover()

    // Should have hover styling (background color change)
    await expect(dateCell).toHaveCSS('background-color', /rgb\(219, 234, 254\)/) // hover:bg-blue-50
  })

  test('should display month and year in heading', async ({ page }) => {
    const heading = page.locator('.hijri-calendar-heading')
    const headingText = await heading.textContent()

    // Should contain year (1400+ range for Hijri)
    expect(headingText).toMatch(/14\d\d/)

    // Should contain month name (in Arabic if locale is Arabic)
    expect(headingText).toMatch(/[أ-ي]/) // Arabic characters for month names
  })

  test('should handle disabled state', async ({ page }) => {
    // Look for disabled cells (outside current month or disabled dates)
    const disabledCells = page.locator('[data-disabled]')

    if ((await disabledCells.count()) > 0) {
      const disabledCell = disabledCells.first()

      // Should have disabled styling
      await expect(disabledCell).toHaveCSS('opacity', '0.5')

      // Should not respond to clicks
      await disabledCell.click()
      await expect(disabledCell).not.toHaveAttribute('data-selected', '')
    }
  })
})
