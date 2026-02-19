import { test, expect } from '@playwright/test'

test.describe('Tasks Board', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display task board with three columns', async ({ page }) => {
    // Check that all three columns are present
    await expect(page.locator('text=Awaiting Deployment')).toBeVisible()
    await expect(page.locator('text=Active Operations')).toBeVisible()
    await expect(page.locator('text=Mission Complete')).toBeVisible()
  })

  test('should show deploy task button', async ({ page }) => {
    const deployButton = page.locator('button', { hasText: 'Deploy Task' })
    await expect(deployButton).toBeVisible()
  })

  test('should display mission progress statistics', async ({ page }) => {
    // Check for progress percentage
    await expect(page.locator('text=Mission Progress')).toBeVisible()
    
    // Check for completion stats
    await expect(page.locator('text=/\\d+% Complete/')).toBeVisible()
  })

  test('should show agent status indicators', async ({ page }) => {
    // Check for agent avatars and indicators
    await expect(page.locator('text=👤')).toBeVisible() // Hamza
    await expect(page.locator('text=🤘')).toBeVisible() // Manus
    await expect(page.locator('text=✈️')).toBeVisible() // Monica
    await expect(page.locator('text=🔍')).toBeVisible() // Jarvis
    await expect(page.locator('text=🌙')).toBeVisible() // Luna
  })

  test('should have assignee filter functionality', async ({ page }) => {
    // Check that the filter dropdown exists
    const filterSelect = page.locator('[role="combobox"]').first()
    await expect(filterSelect).toBeVisible()
    
    // Click to open dropdown
    await filterSelect.click()
    
    // Check for filter options
    await expect(page.locator('text=All')).toBeVisible()
    await expect(page.locator('text=Hamza')).toBeVisible()
    await expect(page.locator('text=Manus')).toBeVisible()
    await expect(page.locator('text=Monica')).toBeVisible()
    await expect(page.locator('text=Jarvis')).toBeVisible()
    await expect(page.locator('text=Luna')).toBeVisible()
  })

  test('should display task cards with proper information', async ({ page }) => {
    // Wait for task cards to load
    await page.waitForSelector('[data-testid="task-card"], .priority-bar, h3')
    
    // Check that task cards are present (looking for task titles or priority indicators)
    const taskElements = await page.locator('h3, .priority-bar, [class*="priority"]').count()
    expect(taskElements).toBeGreaterThan(0)
  })

  test('should show hover effects on interactive elements', async ({ page }) => {
    // Hover over deploy task button
    const deployButton = page.locator('button', { hasText: 'Deploy Task' })
    await deployButton.hover()
    
    // Check that button is still visible (basic hover test)
    await expect(deployButton).toBeVisible()
  })

  test('should display proper page title and description', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Mission Control')
    await expect(page.locator('text=Advanced task orchestration system')).toBeVisible()
  })

  test('should show agent activity indicators', async ({ page }) => {
    // Look for agent activity indicators with task counts
    const activityIndicators = page.locator('[class*="active"], [class*="online"], text=/\\d+ tasks/')
    const count = await activityIndicators.count()
    expect(count).toBeGreaterThan(0)
  })
})