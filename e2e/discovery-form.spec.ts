import { test, expect } from '@playwright/test'

test.describe('Discovery Form', () => {
  test('should display discovery form', async ({ page }) => {
    await page.goto('/start')
    
    await expect(page.getByRole('heading', { name: /start your wellness journey/i })).toBeVisible()
    await expect(page.getByLabel(/name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    await page.goto('/start')
    
    // Try to submit without filling fields
    await page.getByRole('button', { name: /submit/i }).click()
    
    // Should show validation errors
    await expect(page.getByText(/name is required/i)).toBeVisible()
  })

  test('should submit discovery form with valid data', async ({ page }) => {
    await page.goto('/start')
    
    // Fill out the form
    await page.getByLabel(/name/i).fill('Test User')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/goal/i).fill('I want to improve my overall fitness and health')
    
    // Submit the form
    await page.getByRole('button', { name: /submit/i }).click()
    
    // Should redirect to confirmation page
    await expect(page).toHaveURL(/\/start\/confirmation/)
  })
})
