import { test, expect } from '@playwright/test'

test.describe('All Pages Functionality', () => {
  test('Pipeline page should render correctly', async ({ page }) => {
    await page.goto('/pipeline')
    
    // Check page header
    await expect(page.locator('h1')).toContainText('Content Pipeline')
    await expect(page.locator('text=Strategic content creation workflow')).toBeVisible()
    
    // Check for pipeline stages
    await expect(page.locator('text=Ideation')).toBeVisible()
    await expect(page.locator('text=Scripting')).toBeVisible()
    await expect(page.locator('text=Design')).toBeVisible()
    await expect(page.locator('text=Production')).toBeVisible()
    await expect(page.locator('text=Published')).toBeVisible()
    
    // Check for New Content button
    await expect(page.locator('button', { hasText: 'New Content' })).toBeVisible()
    
    // Check for platform filter
    await expect(page.locator('[role="combobox"]')).toBeVisible()
  })

  test('Calendar page should render correctly', async ({ page }) => {
    await page.goto('/calendar')
    
    // Check page header
    await expect(page.locator('h1')).toContainText('Mission Calendar')
    await expect(page.locator('text=Strategic scheduling and timeline coordination')).toBeVisible()
    
    // Check for calendar navigation
    await expect(page.locator('text=Today')).toBeVisible()
    await expect(page.locator('button[aria-label="Previous"]', )).toBeVisible()
    await expect(page.locator('button[aria-label="Next"]')).toBeVisible()
    
    // Check for view mode toggles
    await expect(page.locator('text=Month')).toBeVisible()
    await expect(page.locator('text=Week')).toBeVisible()
    
    // Check for execution rate stats
    await expect(page.locator('text=Execution Rate')).toBeVisible()
  })

  test('Memory page should render correctly', async ({ page }) => {
    await page.goto('/memory')
    
    // Check page header
    await expect(page.locator('h1')).toContainText('Memory Vault')
    await expect(page.locator('text=Centralized knowledge repository')).toBeVisible()
    
    // Check for search functionality
    await expect(page.locator('input[placeholder*="Search memories"]')).toBeVisible()
    
    // Check for category filter
    await expect(page.locator('[role="combobox"]')).toBeVisible()
    
    // Check for memory statistics
    await expect(page.locator('text=Knowledge Base')).toBeVisible()
    
    // Check for memory cards or content
    const memoryContent = page.locator('h3, [class*="memory"], [class*="card"]')
    const count = await memoryContent.count()
    expect(count).toBeGreaterThan(0)
  })

  test('Team page should render correctly', async ({ page }) => {
    await page.goto('/team')
    
    // Check page header
    await expect(page.locator('h1')).toContainText('Team Command')
    await expect(page.locator('text=Agent status dashboard')).toBeVisible()
    
    // Check for team statistics
    await expect(page.locator('text=Team Performance')).toBeVisible()
    await expect(page.locator('text=Total Agents')).toBeVisible()
    await expect(page.locator('text=Online Now')).toBeVisible()
    await expect(page.locator('text=Active Tasks')).toBeVisible()
    await expect(page.locator('text=Completed')).toBeVisible()
    
    // Check for agent cards
    const agentCards = page.locator('[class*="agent"], [class*="card"]')
    const count = await agentCards.count()
    expect(count).toBeGreaterThan(0)
    
    // Check for recent activity
    await expect(page.locator('text=Recent Activity')).toBeVisible()
  })

  test('Office page should render correctly', async ({ page }) => {
    await page.goto('/office')
    
    // Check page header
    await expect(page.locator('h1')).toContainText('Virtual Office')
    await expect(page.locator('text=Digital headquarters visualization')).toBeVisible()
    
    // Check for office statistics
    await expect(page.locator('text=Office Activity')).toBeVisible()
    
    // Check for office status indicators
    await expect(page.locator('text=Systems Online')).toBeVisible()
    await expect(page.locator('text=Connected')).toBeVisible()
    
    // Check for office headquarters
    await expect(page.locator('text=OpenClaw Virtual Headquarters')).toBeVisible()
    await expect(page.locator('text=Operational')).toBeVisible()
    
    // Check for activity panels
    await expect(page.locator('text=Live Activities')).toBeVisible()
    await expect(page.locator('text=Workstation Status')).toBeVisible()
  })

  test('All pages should have consistent branding and navigation', async ({ page }) => {
    const pages = ['/', '/pipeline', '/calendar', '/memory', '/team', '/office']
    
    for (const url of pages) {
      await page.goto(url)
      
      // Check for navigation bar
      await expect(page.locator('text=Mission Control')).toBeVisible()
      await expect(page.locator('text=OpenClaw Command Center')).toBeVisible()
      
      // Check for status indicator
      await expect(page.locator('text=Online')).toBeVisible()
      
      // Check that navigation links are present
      await expect(page.locator('a[href="/"]')).toBeVisible()
      await expect(page.locator('a[href="/pipeline"]')).toBeVisible()
      await expect(page.locator('a[href="/calendar"]')).toBeVisible()
      await expect(page.locator('a[href="/memory"]')).toBeVisible()
      await expect(page.locator('a[href="/team"]')).toBeVisible()
      await expect(page.locator('a[href="/office"]')).toBeVisible()
    }
  })

  test('All pages should load within reasonable time', async ({ page }) => {
    const pages = [
      { url: '/', title: 'Mission Control' },
      { url: '/pipeline', title: 'Content Pipeline' },
      { url: '/calendar', title: 'Mission Calendar' },
      { url: '/memory', title: 'Memory Vault' },
      { url: '/team', title: 'Team Command' },
      { url: '/office', title: 'Virtual Office' }
    ]
    
    for (const { url, title } of pages) {
      const start = Date.now()
      await page.goto(url)
      await expect(page.locator('h1')).toContainText(title)
      const loadTime = Date.now() - start
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000)
    }
  })
})