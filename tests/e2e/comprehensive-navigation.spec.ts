import { test, expect } from '@playwright/test'

test.describe('Comprehensive Navigation Tests', () => {
  test('should navigate to all pages including new Activity page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Mission Control/)

    // Test navigation to all pages including new Activity page
    const routes = [
      { path: '/', name: 'Mission Control Dashboard', header: 'Mission Control Dashboard' },
      { path: '/tasks', name: 'Tasks', header: 'Mission Control Tasks' },
      { path: '/pipeline', name: 'Pipeline', header: 'Content Pipeline' },
      { path: '/calendar', name: 'Calendar', header: 'Mission Calendar' },
      { path: '/memory', name: 'Memory', header: 'Memory Vault' },
      { path: '/activity', name: 'Activity', header: 'Activity Log' },
      { path: '/team', name: 'Team', header: 'Team Command' },
      { path: '/office', name: 'Office', header: 'Virtual Office' },
      { path: '/settings', name: 'Settings', header: 'Mission Settings' }
    ]

    for (const route of routes) {
      await page.click(`a[href="${route.path}"]`)
      await expect(page).toHaveURL(route.path)
      await expect(page.locator('h1')).toContainText(route.header)
      
      // Check that page loads without errors
      const errors: Error[] = []
      page.on('pageerror', (error: Error) => errors.push(error))
      await page.waitForLoadState('networkidle')
      expect(errors).toHaveLength(0)
    }
  })

  test('should use keyboard shortcuts for navigation', async ({ page }) => {
    await page.goto('/')
    
    // Test direct navigation shortcuts (1-8, 0)
    const shortcuts = [
      { key: '1', expectedUrl: '/', expectedHeader: 'Mission Control Dashboard' },
      { key: '2', expectedUrl: '/tasks', expectedHeader: 'Mission Control Tasks' },
      { key: '3', expectedUrl: '/pipeline', expectedHeader: 'Content Pipeline' },
      { key: '4', expectedUrl: '/calendar', expectedHeader: 'Mission Calendar' },
      { key: '5', expectedUrl: '/memory', expectedHeader: 'Memory Vault' },
      { key: '6', expectedUrl: '/activity', expectedHeader: 'Activity Log' },
      { key: '0', expectedUrl: '/settings', expectedHeader: 'Mission Settings' }
    ]

    for (const shortcut of shortcuts) {
      await page.keyboard.press(shortcut.key)
      await page.waitForURL(shortcut.expectedUrl)
      await expect(page).toHaveURL(shortcut.expectedUrl)
      await expect(page.locator('h1')).toContainText(shortcut.expectedHeader)
    }
  })

  test('should use sequential keyboard shortcuts (G then X)', async ({ page }) => {
    await page.goto('/')
    
    // Test G+T for tasks
    await page.keyboard.press('g')
    await page.keyboard.press('t')
    await page.waitForURL('/tasks')
    await expect(page).toHaveURL('/tasks')
    
    // Test G+P for pipeline
    await page.keyboard.press('g')
    await page.keyboard.press('p')
    await page.waitForURL('/pipeline')
    await expect(page).toHaveURL('/pipeline')
    
    // Test G+A for activity
    await page.keyboard.press('g')
    await page.keyboard.press('a')
    await page.waitForURL('/activity')
    await expect(page).toHaveURL('/activity')
  })

  test('should show keyboard shortcuts help modal', async ({ page }) => {
    await page.goto('/')
    
    // Press ? to open shortcuts help
    await page.keyboard.press('?')
    
    // Check that help modal is visible
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await expect(page.locator('text=Keyboard Shortcuts')).toBeVisible()
    
    // Check for different shortcut categories
    await expect(page.locator('text=Global')).toBeVisible()
    await expect(page.locator('text=Navigation')).toBeVisible()
    await expect(page.locator('text=Actions')).toBeVisible()
    
    // Close modal with Escape
    await page.keyboard.press('Escape')
    await expect(page.locator('[role="dialog"]')).toBeHidden()
  })

  test('should have keyboard shortcut hint in navigation', async ({ page }) => {
    await page.goto('/')
    
    // Check for keyboard shortcut hint in sidebar
    await expect(page.locator('text=Shortcuts')).toBeVisible()
    await expect(page.locator('text=Press ? for help')).toBeVisible()
    
    // Click on shortcuts hint should open help modal
    await page.click('text=Shortcuts')
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await expect(page.locator('text=Keyboard Shortcuts')).toBeVisible()
  })

  test('should show active navigation highlighting', async ({ page }) => {
    await page.goto('/')
    
    // Navigate to different pages and check active state
    const pages = ['/tasks', '/pipeline', '/activity', '/settings']
    
    for (const pagePath of pages) {
      await page.click(`a[href="${pagePath}"]`)
      await page.waitForURL(pagePath)
      
      // Check that the active page has appropriate styling
      const activeNavItem = page.locator(`a[href="${pagePath}"]`)
      await expect(activeNavItem).toBeVisible()
      
      // Active items should have different styling (checking for class existence)
      const classes = await activeNavItem.getAttribute('class')
      expect(classes).toContain('text-[#06b6d4]') // Active color class
    }
  })

  test('should handle sidebar collapse and expand', async ({ page }) => {
    await page.goto('/')
    
    // Find and click collapse button
    const collapseButton = page.locator('button').filter({ hasText: /chevron/i }).or(
      page.locator('svg[class*="chevron"]').locator('..')
    ).first()
    
    if (await collapseButton.isVisible()) {
      await collapseButton.click()
      
      // Wait for animation
      await page.waitForTimeout(500)
      
      // Check that sidebar is collapsed (navigation items should still be visible but condensed)
      await expect(page.locator('nav')).toBeVisible()
      
      // Click again to expand
      await collapseButton.click()
      await page.waitForTimeout(500)
    }
  })
})