import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test, type Locator, type Page } from '@playwright/test'

const themes = resolve(dirname(fileURLToPath(import.meta.url)), '../../packages/themes/src')
const styles = ['variables.css', 'core.css'].map(file => readFileSync(resolve(themes, file), 'utf8')).join('\n')
const fullDate = 'Wednesday, Ramadan 29, 1445 AH — 10 April 2024'

async function renderWeek(page: Page, direction: 'ltr' | 'rtl', width: number) {
  await page.setViewportSize({ width, height: 420 })
  await page.setContent(`
    <style>* { box-sizing: border-box; } body { margin: 0; padding: 80px 40px; font-family: Arial; }</style>
    <div data-taqwim-calendar data-show-gregorian dir="${direction}">
      <div data-taqwim-calendar-grid role="grid">
        <div role="row">
          ${Array.from(
            { length: 7 },
            (_, index) => `
            <div role="gridcell" data-taqwim-calendar-cell data-tooltip="${fullDate}">
              <button data-taqwim-calendar-cell-trigger>${index + 1}</button>
            </div>`,
          ).join('')}
        </div>
      </div>
    </div>
  `)
  await page.addStyleTag({ content: styles })
  await page.mouse.move(0, 0)
}

async function tooltipBounds(cell: Locator) {
  return cell.evaluate(element => {
    const cellRect = element.getBoundingClientRect()
    const row = element.parentElement!.getBoundingClientRect()
    const tooltip = getComputedStyle(element, '::after')
    const width = Number.parseFloat(tooltip.width)
    // Resolved insets and transforms give a pseudo-element's rendered bounds
    // without adding a second tooltip or relying on a CSS selector snapshot.
    const inset =
      tooltip.left === 'auto'
        ? cellRect.width - width - Number.parseFloat(tooltip.right)
        : Number.parseFloat(tooltip.left)
    const translate = tooltip.translate.split(' ')[0]
    const shift = translate.endsWith('%')
      ? (Number.parseFloat(translate) * width) / 100
      : Number.parseFloat(translate) || 0
    const transform = tooltip.transform === 'none' ? 0 : new DOMMatrixReadOnly(tooltip.transform).m41
    const left = cellRect.left + inset + shift + transform
    return {
      left,
      right: left + width,
      rowLeft: row.left,
      rowRight: row.right,
      display: tooltip.display,
      content: tooltip.content,
    }
  })
}

for (const direction of ['ltr', 'rtl'] as const) {
  for (const width of [320, 360]) {
    test(`tooltips stay within a narrow week row at ${width}px in ${direction}`, async ({ page }) => {
      await renderWeek(page, direction, width)
      const cells = page.locator('[data-taqwim-calendar-cell]')
      const pageWidth = () => page.evaluate(() => document.documentElement.scrollWidth)

      // The former hidden boxes alone widened the page before any interaction.
      expect(await pageWidth()).toBe(width)
      for (const cell of await cells.all()) {
        await cell.locator('button').focus()
        const bounds = await tooltipBounds(cell)
        expect(bounds.display).toBe('block')
        expect(bounds.content).toContain(fullDate)
        expect(bounds.left).toBeGreaterThanOrEqual(bounds.rowLeft - 1)
        expect(bounds.right).toBeLessThanOrEqual(bounds.rowRight + 1)
        expect(await pageWidth()).toBe(width)
      }

      await page.locator('button').last().blur()
      await cells.first().hover()
      expect((await tooltipBounds(cells.first())).display).toBe('block')
      expect(await pageWidth()).toBe(width)
      await page.mouse.move(0, 0)
      expect((await tooltipBounds(cells.first())).display).toBe('none')
      expect(await pageWidth()).toBe(width)
    })
  }
}
