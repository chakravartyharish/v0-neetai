import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test environment
    await page.goto('/');
  });

  test('should display login page for unauthenticated users', async ({ page }) => {
    // Check if login elements are present
    await expect(page.locator('h1')).toContainText('Sign in to NEETAI Coach Portal');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation errors for invalid inputs', async ({ page }) => {
    // Try to submit empty form
    await page.locator('button[type="submit"]').click();
    
    // Check for validation errors
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Wait for and check error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible({ timeout: 10000 });
  });

  test('should redirect to dashboard on successful login', async ({ page }) => {
    // Mock successful authentication
    await page.route('**/auth/v1/token**', async route => {
      const json = {
        access_token: 'mock-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
        user: {
          id: 'mock-user-id',
          email: 'coach@example.com',
          user_metadata: {
            full_name: 'Test Coach',
            role: 'coach'
          }
        }
      };
      await route.fulfill({ json });
    });

    // Fill in valid credentials
    await page.fill('input[type="email"]', 'coach@example.com');
    await page.fill('input[type="password"]', 'validpassword');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should handle password reset flow', async ({ page }) => {
    // Click on "Forgot Password" link
    await page.locator('text=Forgot your password?').click();
    
    // Should show password reset form
    await expect(page.locator('h1')).toContainText('Reset Password');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    
    // Fill in email
    await page.fill('input[type="email"]', 'coach@example.com');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Should show success message
    await expect(page.locator('text=Password reset link sent')).toBeVisible();
  });

  test('should allow logout from authenticated state', async ({ page }) => {
    // Mock authenticated state
    await page.addInitScript(() => {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-token',
        user: { id: 'mock-user-id', email: 'coach@example.com' }
      }));
    });

    await page.goto('/dashboard');
    
    // Click on user menu
    await page.locator('[data-testid="user-menu"]').click();
    
    // Click logout
    await page.locator('text=Logout').click();
    
    // Should redirect to login page
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Sign in to NEETAI Coach Portal');
  });
});