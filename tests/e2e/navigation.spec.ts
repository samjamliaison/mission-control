import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate to all pages successfully', async ({ page }) => {
    // Start at home page (Tasks)
    await page.goto('/')
    await expect(page).toHaveTitle(/Mission Control/)
    await expect(page.locator('h1')).toContainText('Mission Control')

    // Navigate to Pipeline
    await page.click('a[href="/pipeline"]')
    await expect(page).toHaveURL('/pipeline')
    await expect(page.locator('h1')).toContainText('Content Pipeline')

    // Navigate to Calendar
    await page.click('a[href="/calendar"]')
    await expect(page).toHaveURL('/calendar')
    await expect(page.locator('h1')).toContainText('Mission Calendar')

    // Navigate to Memory
    await page.click('a[href="/memory"]')
    await expect(page).toHaveURL('/memory')
    await expect(page.locator('h1')).toContainText('Memory Vault')

    // Navigate to Team
    await page.click('a[href="/team"]')
    await expect(page).toHaveURL('/team')
    await expect(page.locator('h1')).toContainText('Team Command')

    // Navigate to Office
    await page.click('a[href="/office"]')
    await expect(page).toHaveURL('/office')
    await expect(page.locator('h1')).toContainText('Virtual Office')

    // Navigate back to Tasks
    await page.click('a[href="/"]')
    await expect(page).toHaveURL('/')
    await expect(page.locator('h1')).toContainText('Mission Control')
  })

  test('should highlight active navigation item', async ({ page }) => {
    await page.goto('/')
    
    // Check that Tasks nav item is active
    const tasksNav = page.locator('a[href="/"]')
    await expect(tasksNav).toHaveClass(/glass-morphism/)

    // Navigate to pipeline and check active state
    await page.click('a[href="/pipeline"]')
    const pipelineNav = page.locator('a[href="/pipeline"]')
    await expect(pipelineNav).toHaveClass(/glass-morphism/)
  })

  test('should display Mission Control logo and tagline', async ({ page }) => {
    await page.goto('/')
    
    // Check for logo/branding
    await expect(page.locator('text=Mission Control')).toBeVisible()
    await expect(page.locator('text=OpenClaw Command Center')).toBeVisible()
  })

  test('should show online status indicator', async ({ page }) => {
    await page.goto('/')
    
    // Check for status indicator
    await expect(page.locator('text=Online')).toBeVisible()
  })
})