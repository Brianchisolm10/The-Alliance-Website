import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login')
    
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
  })

  test('should show validation error for invalid email', async ({ page }) => {
    await page.goto('/login')
    
    await page.getByLabel(/email/i).fill('invalid-email')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page.getByText(/invalid email/i)).toBeVisible()
  })

  test('should navigate to password reset page', async ({ page }) => {
    await page.goto('/login')
    
    await page.getByRole('link', { name: /forgot password/i }).click()
    
    await expect(page).toHaveURL(/\/reset-password/)
    await expect(page.getByRole('heading', { name: /reset password/i })).toBeVisible()
  })
})
