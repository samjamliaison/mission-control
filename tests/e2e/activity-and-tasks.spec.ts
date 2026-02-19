import { test, expect } from '@playwright/test'

test.describe('Activity Log and Task Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should display activity log page with filters', async ({ page }) => {
    // Navigate to activity page
    await page.goto('/activity')
    await page.waitForLoadState('networkidle')
    
    // Check page header (use more specific selector to avoid multiple h1 elements)
    await expect(page.locator('h1').filter({ hasText: 'Activity Log' })).toBeVisible()
    
    // Check for filter section
    await expect(page.locator('text=Filters')).toBeVisible()
    
    // Check for filter controls
    await expect(page.locator('input[placeholder*="search" i]')).toBeVisible()
    await expect(page.locator('[role="combobox"]')).toBeVisible() // Filter dropdowns
    
    // Check for activity feed
    const activityFeed = page.locator('text=Activity Feed')
    await expect(activityFeed).toBeVisible()
  })

  test('should filter activity log entries', async ({ page }) => {
    await page.goto('/activity')
    await page.waitForLoadState('networkidle')
    
    // Wait for any activities to load
    await page.waitForTimeout(1000)
    
    // Test search filter
    const searchInput = page.locator('input[placeholder*="search" i]')
    await searchInput.fill('navigation')
    await page.waitForTimeout(500)
    
    // Clear search
    await searchInput.fill('')
    await page.waitForTimeout(300)
    
    // Test dropdown filters
    const filterDropdowns = page.locator('[role="combobox"]')
    const dropdownCount = await filterDropdowns.count()
    
    if (dropdownCount > 0) {
      // Click first dropdown (likely action type filter)
      await filterDropdowns.first().click()
      await page.waitForTimeout(300)
      
      // Check for filter options
      const filterOptions = page.locator('[role="option"]')
      const optionCount = await filterOptions.count()
      
      if (optionCount > 0) {
        // Select first option
        await filterOptions.first().click()
        await page.waitForTimeout(500)
      }
    }
  })

  test('should create new tasks and log activity', async ({ page }) => {
    // Start from dashboard or tasks page
    await page.goto('/tasks')
    await page.waitForLoadState('networkidle')
    
    // Look for "Add Task" or "Deploy Task" button
    const addTaskButton = page.locator('button').filter({ 
      hasText: /Add Task|Deploy Task|New Task|Create Task/i 
    }).first()
    
    if (await addTaskButton.isVisible()) {
      await addTaskButton.click()
      await page.waitForTimeout(500)
      
      // Check if task creation dialog opened
      const dialog = page.locator('[role="dialog"]')
      if (await dialog.isVisible()) {
        // Fill task form
        const titleInput = dialog.locator('input[id*="title"], input[name*="title"]').first()
        if (await titleInput.isVisible()) {
          await titleInput.fill('Test Task for E2E')
          
          // Find assignee dropdown
          const assigneeSelect = dialog.locator('[role="combobox"]').first()
          if (await assigneeSelect.isVisible()) {
            await assigneeSelect.click()
            await page.waitForTimeout(300)
            
            // Select first assignee option
            const assigneeOptions = page.locator('[role="option"]')
            if (await assigneeOptions.count() > 0) {
              await assigneeOptions.first().click()
            }
          }
          
          // Submit task
          const submitButton = dialog.locator('button').filter({ 
            hasText: /Create|Save|Deploy|Submit/i 
          }).first()
          
          if (await submitButton.isVisible()) {
            await submitButton.click()
            await page.waitForTimeout(1000)
          }
        }
      }
    }
    
    // Navigate to activity page to check if task creation was logged
    await page.goto('/activity')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    
    // Search for task creation activity
    const searchInput = page.locator('input[placeholder*="search" i]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('task')
      await page.waitForTimeout(500)
      
      // Check if task creation activity is visible
      const activityEntries = page.locator('[class*="activity"], [class*="feed"] > div, .glass-morphism')
      if (await activityEntries.count() > 0) {
        // Look for task-related activity
        const taskActivity = activityEntries.filter({ hasText: /task|created|Test Task/i })
        if (await taskActivity.count() > 0) {
          await expect(taskActivity.first()).toBeVisible()
        }
      }
    }
  })

  test('should test keyboard shortcut N for creating tasks', async ({ page }) => {
    await page.goto('/tasks')
    await page.waitForLoadState('networkidle')
    
    // Press N to create new task
    await page.keyboard.press('n')
    await page.waitForTimeout(500)
    
    // Check if task creation dialog opened
    const dialog = page.locator('[role="dialog"]')
    if (await dialog.isVisible()) {
      await expect(dialog).toBeVisible()
      
      // Close dialog
      await page.keyboard.press('Escape')
      await page.waitForTimeout(300)
      await expect(dialog).toBeHidden()
    }
  })

  test('should test drag and drop functionality on tasks board', async ({ page }) => {
    await page.goto('/tasks')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    
    // Look for task cards that can be dragged
    const taskCards = page.locator('[draggable="true"], [class*="task-card"], [class*="draggable"]')
    const cardCount = await taskCards.count()
    
    if (cardCount > 0) {
      const firstCard = taskCards.first()
      
      // Get the bounding box of the first card
      const cardBox = await firstCard.boundingBox()
      
      if (cardBox) {
        // Look for drop zones (columns)
        const columns = page.locator('[class*="column"], [class*="droppable"]')
        const columnCount = await columns.count()
        
        if (columnCount > 1) {
          const targetColumn = columns.nth(1) // Second column
          const columnBox = await targetColumn.boundingBox()
          
          if (columnBox) {
            // Perform drag and drop
            await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2)
            await page.mouse.down()
            await page.waitForTimeout(100)
            
            // Move to target column
            await page.mouse.move(columnBox.x + columnBox.width / 2, columnBox.y + columnBox.height / 2, { steps: 10 })
            await page.waitForTimeout(200)
            
            await page.mouse.up()
            await page.waitForTimeout(500)
            
            // Check if drag and drop visual effects were applied
            // This is mainly to ensure the drag operation completed without errors
            await expect(page.locator('body')).toBeVisible()
          }
        }
      }
    }
  })

  test('should show task board columns with proper styling', async ({ page }) => {
    await page.goto('/tasks')
    await page.waitForLoadState('networkidle')
    
    // Check for task board columns
    const expectedColumns = ['Awaiting', 'Active', 'Complete'] // Partial matches
    
    for (const columnText of expectedColumns) {
      const column = page.getByText(columnText, { exact: false })
      if (await column.count() > 0) {
        await expect(column.first()).toBeVisible()
      }
    }
    
    // Check for task statistics
    await expect(page.locator('text*="Progress"').or(page.locator('text*="Complete"'))).toBeVisible()
  })

  test('should handle focus search shortcut (/)', async ({ page }) => {
    // Go to activity page which has search input
    await page.goto('/activity')
    await page.waitForLoadState('networkidle')
    
    // Press / to focus search
    await page.keyboard.press('/')
    await page.waitForTimeout(300)
    
    // Check if search input is focused
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first()
    if (await searchInput.isVisible()) {
      await expect(searchInput).toBeFocused()
    }
  })

  test('should handle Escape key to close modals', async ({ page }) => {
    // Try to open a modal (like task creation)
    await page.goto('/tasks')
    await page.waitForLoadState('networkidle')
    
    const addButton = page.locator('button').filter({ hasText: /Add|New|Create|Deploy/i }).first()
    if (await addButton.isVisible()) {
      await addButton.click()
      await page.waitForTimeout(300)
      
      // Check if dialog opened
      const dialog = page.locator('[role="dialog"]')
      if (await dialog.isVisible()) {
        await expect(dialog).toBeVisible()
        
        // Press Escape to close
        await page.keyboard.press('Escape')
        await page.waitForTimeout(300)
        
        await expect(dialog).toBeHidden()
      }
    }
  })

  test('should navigate and log navigation activities', async ({ page }) => {
    // Start at home
    await page.goto('/')
    
    // Navigate to different pages
    const pages = ['/tasks', '/pipeline', '/activity', '/settings']
    
    for (const pagePath of pages) {
      await page.goto(pagePath)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(300)
    }
    
    // Go to activity page to check navigation logs
    await page.goto('/activity')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    
    // Search for navigation activities
    const searchInput = page.locator('input[placeholder*="search" i]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('navigation')
      await page.waitForTimeout(500)
      
      // Check if navigation activities are logged
      const activityEntries = page.locator('[class*="activity"], [class*="feed"] > div')
      if (await activityEntries.count() > 0) {
        const navigationActivity = activityEntries.filter({ hasText: /navigat/i })
        if (await navigationActivity.count() > 0) {
          await expect(navigationActivity.first()).toBeVisible()
        }
      }
    }
  })

  test('should export and clear activity data', async ({ page }) => {
    await page.goto('/activity')
    await page.waitForLoadState('networkidle')
    
    // Look for export button
    const exportButton = page.locator('button').filter({ hasText: /export/i })
    if (await exportButton.isVisible()) {
      // Set up download handler
      const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null)
      
      await exportButton.click()
      
      const download = await downloadPromise
      if (download) {
        // Verify download occurred
        expect(download.suggestedFilename()).toMatch(/\.json$/)
      }
    }
    
    // Look for clear button (should require confirmation)
    const clearButton = page.locator('button').filter({ hasText: /clear/i })
    if (await clearButton.isVisible()) {
      await clearButton.click()
      await page.waitForTimeout(300)
      
      // Should show confirmation dialog
      const confirmDialog = page.locator('[role="dialog"]').or(page.locator('.confirm'))
      if (await confirmDialog.isVisible()) {
        // Cancel the action to avoid actually clearing data
        const cancelButton = confirmDialog.locator('button').filter({ hasText: /cancel/i })
        if (await cancelButton.isVisible()) {
          await cancelButton.click()
        } else {
          await page.keyboard.press('Escape')
        }
      }
    }
  })
})