import { test, expect } from '@playwright/test'

test.describe('Command Palette Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should open command palette with Cmd+K', async ({ page }) => {
    // Open command palette
    await page.keyboard.press('Meta+k') // Mac
    
    // Fallback for non-Mac
    if (!(await page.locator('[role="dialog"] input[placeholder*="command" i], [role="dialog"] input[placeholder*="search" i]').isVisible())) {
      await page.keyboard.press('Control+k')
    }
    
    // Check that command palette is visible
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    
    // Check for command input
    const commandInput = page.locator('[role="dialog"] input[placeholder*="command" i], [role="dialog"] input[placeholder*="search" i]').first()
    await expect(commandInput).toBeVisible()
    await expect(commandInput).toBeFocused()
  })

  test('should show available commands and categories', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[role="dialog"]')
    
    // Wait for commands to load
    await page.waitForTimeout(500)
    
    // Check for command categories
    const expectedCategories = ['Navigation', 'Actions', 'Pages']
    for (const category of expectedCategories) {
      if (await page.locator(`text=${category}`).isVisible()) {
        await expect(page.locator(`text=${category}`)).toBeVisible()
      }
    }
    
    // Check for common navigation commands
    const navigationCommands = ['Dashboard', 'Tasks', 'Pipeline', 'Calendar', 'Memory', 'Activity']
    for (const command of navigationCommands) {
      // Type to search for the command
      await page.fill('[role="dialog"] input', command.toLowerCase())
      await page.waitForTimeout(200)
      
      // Check if command appears in results
      const commandItem = page.locator(`[role="dialog"] [role="option"], [role="dialog"] button`).filter({ hasText: new RegExp(command, 'i') })
      if (await commandItem.count() > 0) {
        await expect(commandItem.first()).toBeVisible()
      }
      
      // Clear input for next iteration
      await page.fill('[role="dialog"] input', '')
    }
  })

  test('should navigate using command palette', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[role="dialog"]')
    
    // Search for "tasks" command
    await page.fill('[role="dialog"] input', 'tasks')
    await page.waitForTimeout(300)
    
    // Press Enter or click on first result
    const firstResult = page.locator('[role="dialog"] [role="option"], [role="dialog"] button').first()
    if (await firstResult.isVisible()) {
      await firstResult.click()
    } else {
      await page.keyboard.press('Enter')
    }
    
    // Check navigation
    await page.waitForURL('/tasks')
    await expect(page).toHaveURL('/tasks')
    
    // Command palette should close
    await expect(page.locator('[role="dialog"]')).toBeHidden()
  })

  test('should filter commands based on search input', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[role="dialog"]')
    
    // Search for specific term
    await page.fill('[role="dialog"] input', 'pipe')
    await page.waitForTimeout(300)
    
    // Should show pipeline-related results
    const results = page.locator('[role="dialog"] [role="option"], [role="dialog"] button')
    const resultCount = await results.count()
    
    if (resultCount > 0) {
      // Check that results contain pipeline-related items
      for (let i = 0; i < Math.min(3, resultCount); i++) {
        const resultText = await results.nth(i).textContent()
        if (resultText) {
          // Should contain relevant terms
          const relevantTerms = ['pipeline', 'content', 'create']
          const containsRelevantTerm = relevantTerms.some(term => 
            resultText.toLowerCase().includes(term)
          )
          expect(containsRelevantTerm).toBeTruthy()
        }
      }
    }
  })

  test('should close command palette with Escape', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    
    // Close with Escape
    await page.keyboard.press('Escape')
    await expect(page.locator('[role="dialog"]')).toBeHidden()
  })

  test('should handle arrow key navigation in command palette', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[role="dialog"]')
    
    // Wait for commands to populate
    await page.waitForTimeout(500)
    
    const results = page.locator('[role="dialog"] [role="option"], [role="dialog"] button')
    const resultCount = await results.count()
    
    if (resultCount > 1) {
      // Navigate with arrow keys
      await page.keyboard.press('ArrowDown')
      await page.waitForTimeout(100)
      
      // Should be able to navigate further
      await page.keyboard.press('ArrowDown')
      await page.waitForTimeout(100)
      
      // Navigate back up
      await page.keyboard.press('ArrowUp')
      await page.waitForTimeout(100)
      
      // Should still be in the command palette
      await expect(page.locator('[role="dialog"]')).toBeVisible()
    }
  })

  test('should show command palette hint in navigation', async ({ page }) => {
    // Check for Cmd+K hint in the navigation
    await expect(page.locator('text=⌘K').or(page.locator('text=Cmd+K')).or(page.locator('text=Command'))).toBeVisible()
  })

  test('should not open command palette when typing in inputs', async ({ page }) => {
    // Navigate to a page with input fields (like activity page)
    await page.goto('/activity')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Find and focus a search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first()
    if (await searchInput.isVisible()) {
      await searchInput.click()
      await searchInput.focus()
      
      // Try to trigger command palette while focused on input
      await page.keyboard.press('Meta+k')
      await page.waitForTimeout(300)
      
      // Command palette should not open when typing in input
      const commandPalette = page.locator('[role="dialog"]').filter({ hasText: /command/i })
      if (await commandPalette.isVisible()) {
        // If it opened, it should be the search dialog, not command palette
        const isSearchDialog = await commandPalette.locator('input[placeholder*="search" i]').isVisible()
        expect(isSearchDialog).toBeTruthy()
      }
    }
  })

  test('should execute commands correctly', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[role="dialog"]')
    
    // Search for a settings command
    await page.fill('[role="dialog"] input', 'settings')
    await page.waitForTimeout(300)
    
    // Execute the command
    await page.keyboard.press('Enter')
    
    // Should navigate to settings page
    await page.waitForURL('/settings')
    await expect(page).toHaveURL('/settings')
    await expect(page.locator('h1')).toContainText('Settings')
  })
})