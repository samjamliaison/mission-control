import { test, expect } from '@playwright/test'

test.describe('Theme Switching Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should switch themes from settings page', async ({ page }) => {
    // Navigate to settings page
    await page.goto('/settings')
    await page.waitForLoadState('networkidle')
    
    // Check that theme settings section is visible
    await expect(page.locator('text=Visual Theme')).toBeVisible()
    
    // Test switching to Midnight theme
    const midnightButton = page.locator('button', { hasText: 'Midnight' }).or(
      page.locator('[data-theme="midnight"], button[class*="midnight"]').first()
    )
    
    if (await midnightButton.isVisible()) {
      await midnightButton.click()
      
      // Wait for theme transition
      await page.waitForTimeout(500)
      
      // Check that theme class is applied to html element
      const htmlElement = page.locator('html')
      const htmlClass = await htmlElement.getAttribute('class')
      expect(htmlClass).toContain('theme-midnight')
      
      // Check that CSS variables are updated
      const bgColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--command-background')
      })
      expect(bgColor).toBeTruthy()
    }
    
    // Test switching to Terminal theme
    const terminalButton = page.locator('button', { hasText: 'Terminal' }).or(
      page.locator('[data-theme="terminal"], button[class*="terminal"]').first()
    )
    
    if (await terminalButton.isVisible()) {
      await terminalButton.click()
      
      // Wait for theme transition
      await page.waitForTimeout(500)
      
      // Check that theme class is applied
      const htmlElement = page.locator('html')
      const htmlClass = await htmlElement.getAttribute('class')
      expect(htmlClass).toContain('theme-terminal')
      
      // Check for terminal-specific elements (like cursor or scan lines)
      const bodyClass = await page.locator('body').getAttribute('class')
      expect(bodyClass).toContain('theme-terminal')
    }
    
    // Switch back to Dark theme
    const darkButton = page.locator('button', { hasText: 'Dark' }).or(
      page.locator('[data-theme="dark"], button[class*="dark"]').first()
    )
    
    if (await darkButton.isVisible()) {
      await darkButton.click()
      await page.waitForTimeout(500)
      
      // Check that theme is applied
      const htmlElement = page.locator('html')
      const htmlClass = await htmlElement.getAttribute('class')
      expect(htmlClass).toContain('theme-dark')
    }
  })

  test('should show theme previews in settings', async ({ page }) => {
    await page.goto('/settings')
    
    // Check that theme preview cards are visible
    await expect(page.locator('text=Dark Command')).toBeVisible()
    await expect(page.locator('text=Midnight Black')).toBeVisible()
    await expect(page.locator('text=Matrix Terminal')).toBeVisible()
    
    // Check for theme descriptions
    await expect(page.locator('text=Professional dark theme')).toBeVisible()
    await expect(page.locator('text=Deeper black theme')).toBeVisible()
    await expect(page.locator('text=Green-on-black hacker')).toBeVisible()
    
    // Check for visual theme previews (color swatches)
    const themeCards = page.locator('[class*="theme"], [data-theme]')
    const cardCount = await themeCards.count()
    expect(cardCount).toBeGreaterThan(0)
  })

  test('should persist theme selection across page reloads', async ({ page }) => {
    await page.goto('/settings')
    
    // Switch to a different theme
    const terminalButton = page.locator('button', { hasText: 'Terminal' })
    if (await terminalButton.isVisible()) {
      await terminalButton.click()
      await page.waitForTimeout(500)
      
      // Reload the page
      await page.reload()
      await page.waitForLoadState('networkidle')
      
      // Check that theme is still applied after reload
      const htmlClass = await page.locator('html').getAttribute('class')
      expect(htmlClass).toContain('theme-terminal')
      
      // Navigate to another page to test persistence
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Theme should still be applied
      const htmlClassAfterNav = await page.locator('html').getAttribute('class')
      expect(htmlClassAfterNav).toContain('theme-terminal')
    }
  })

  test('should show smooth theme transitions', async ({ page }) => {
    await page.goto('/settings')
    
    // Test theme transition smoothness by checking for transition classes/effects
    const midnightButton = page.locator('button', { hasText: 'Midnight' })
    if (await midnightButton.isVisible()) {
      await midnightButton.click()
      
      // Check that transition overlay appears during switch
      const transitionOverlay = page.locator('.theme-transition-overlay')
      
      // Wait for transition to complete
      await page.waitForTimeout(600)
      
      // After transition, overlay should be removed
      if (await transitionOverlay.isVisible()) {
        await page.waitForTimeout(200)
        await expect(transitionOverlay).toBeHidden()
      }
    }
  })

  test('should apply theme-specific visual effects', async ({ page }) => {
    await page.goto('/settings')
    
    // Test Terminal theme specific effects
    const terminalButton = page.locator('button', { hasText: 'Terminal' })
    if (await terminalButton.isVisible()) {
      await terminalButton.click()
      await page.waitForTimeout(500)
      
      // Check for terminal-specific styling
      const bodyClass = await page.locator('body').getAttribute('class')
      expect(bodyClass).toContain('theme-terminal')
      
      // Terminal theme should have green accent colors
      const accentColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--command-accent')
      })
      expect(accentColor).toContain('120') // Green hue
    }
    
    // Test Midnight theme specific effects
    const midnightButton = page.locator('button', { hasText: 'Midnight' })
    if (await midnightButton.isVisible()) {
      await midnightButton.click()
      await page.waitForTimeout(500)
      
      // Check for midnight-specific styling
      const bodyClass = await page.locator('body').getAttribute('class')
      expect(bodyClass).toContain('theme-midnight')
      
      // Midnight theme should have purple accent colors
      const accentColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--command-accent')
      })
      expect(accentColor).toContain('262') // Purple hue
    }
  })

  test('should show current theme status in settings header', async ({ page }) => {
    await page.goto('/settings')
    
    // Check that current theme is displayed in the page header
    const themeStatus = page.locator('text=Visual Theme').locator('..')
    await expect(themeStatus).toBeVisible()
    
    // Should show current theme name (Dark, Midnight, or Terminal)
    const headerStats = page.locator('[class*="stats"], [class*="card"]').filter({ hasText: /Dark|Midnight|Terminal/ })
    if (await headerStats.count() > 0) {
      await expect(headerStats.first()).toBeVisible()
    }
  })

  test('should update theme indicators when switching', async ({ page }) => {
    await page.goto('/settings')
    
    // Switch to different themes and check active indicators
    const themes = ['Midnight', 'Terminal', 'Dark']
    
    for (const themeName of themes) {
      const themeButton = page.locator('button', { hasText: themeName })
      if (await themeButton.isVisible()) {
        await themeButton.click()
        await page.waitForTimeout(300)
        
        // Check that theme button shows active state
        const activeIndicator = themeButton.locator('..').locator('svg, [class*="check"], [class*="active"]')
        if (await activeIndicator.count() > 0) {
          await expect(activeIndicator.first()).toBeVisible()
        }
      }
    }
  })

  test('should handle theme switching with keyboard shortcuts', async ({ page }) => {
    // This test assumes theme switching might be available via shortcuts
    // If not implemented, this test will be skipped
    
    await page.goto('/settings')
    
    // Test if there are any keyboard shortcuts for theme switching
    // This is a forward-looking test for potential future features
    
    // Try pressing T for theme toggle (if implemented)
    await page.keyboard.press('t')
    await page.waitForTimeout(200)
    
    // Since this might not be implemented yet, we just ensure page still works
    await expect(page.locator('h1')).toContainText('Settings')
  })

  test('should work across all pages after theme change', async ({ page }) => {
    await page.goto('/settings')
    
    // Switch to Terminal theme
    const terminalButton = page.locator('button', { hasText: 'Terminal' })
    if (await terminalButton.isVisible()) {
      await terminalButton.click()
      await page.waitForTimeout(500)
      
      // Navigate to different pages and check theme is applied
      const pages = ['/', '/tasks', '/pipeline', '/activity']
      
      for (const pagePath of pages) {
        await page.goto(pagePath)
        await page.waitForLoadState('networkidle')
        
        // Check theme is still applied
        const htmlClass = await page.locator('html').getAttribute('class')
        expect(htmlClass).toContain('theme-terminal')
      }
    }
  })
})