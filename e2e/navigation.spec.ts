import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate to main pages', async ({ page }) => {
    await page.goto('/')
    
    // Check home page loads
    await expect(page).toHaveURL('/')
    
    // Navigate to About page
    await page.getByRole('link', { name: /about/i }).first().click()
    await expect(page).toHaveURL(/\/about/)
    
    // Navigate to Programs page
    await page.goto('/')
    await page.getByRole('link', { name: /programs/i }).first().click()
    await expect(page).toHaveURL(/\/programs/)
    
    // Navigate to Contact page
    await page.goto('/')
    await page.getByRole('link', { name: /contact/i }).first().click()
    await expect(page).toHaveURL(/\/contact/)
  })

  test('should display contact form', async ({ page }) => {
    await page.goto('/contact')
    
    await expect(page.getByLabel(/name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/subject/i)).toBeVisible()
    await expect(page.getByLabel(/message/i)).toBeVisible()
  })
})
