import { test, expect } from '@playwright/test'

test.describe('Taqwim Vue Components', () => {
  test('should load the Vue application', async ({ page }) => {
    await page.goto('/')

    // Check that the page loads successfully
    await expect(page).toHaveTitle(/Vite|Vue|Taqwim/)

    // Check for Vue app root element
    const app = page.locator('#app')
    await expect(app).toBeVisible()
  })

  test('should have basic Vue functionality', async ({ page }) => {
    await page.goto('/')

    // Look for common Vue elements
    const body = page.locator('body')
    await expect(body).toBeVisible()

    // Check that JavaScript is working (Vue should be rendering)
    await page.waitForTimeout(1000) // Give Vue time to mount
    const appContent = await page.locator('#app').textContent()
    expect(appContent).not.toBe('')
  })

  test('should work across different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const app = page.locator('#app')
    await expect(app).toBeVisible()

    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 })
    await expect(app).toBeVisible()
  })

  test('should be accessible', async ({ page }) => {
    await page.goto('/')

    // Basic accessibility checks
    const app = page.locator('#app')
    await expect(app).toBeVisible()

    // Check that the page has a proper structure
    const html = page.locator('html')
    await expect(html).toHaveAttribute('lang')
  })
})
