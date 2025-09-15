import { test, expect } from '@playwright/test';

test.describe('Dashboard Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated state
    await page.addInitScript(() => {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-token',
        user: { 
          id: 'mock-user-id', 
          email: 'coach@example.com',
          user_metadata: {
            full_name: 'Test Coach',
            role: 'coach'
          }
        }
      }));
    });

    // Mock API responses
    await page.route('**/rest/v1/students**', async route => {
      await route.fulfill({
        json: [
          { id: '1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '123-456-7891' }
        ]
      });
    });

    await page.route('**/rest/v1/sessions**', async route => {
      await route.fulfill({
        json: [
          {
            id: '1',
            student_id: '1',
            scheduled_at: new Date().toISOString(),
            duration: 60,
            status: 'scheduled'
          }
        ]
      });
    });

    await page.goto('/dashboard');
  });

  test('should display dashboard with all components', async ({ page }) => {
    // Check main heading
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Check for dashboard cards/sections
    await expect(page.locator('[data-testid="performance-metrics"]')).toBeVisible();
    await expect(page.locator('[data-testid="student-progress-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="recent-activities"]')).toBeVisible();
    await expect(page.locator('[data-testid="upcoming-sessions"]')).toBeVisible();
  });

  test('should navigate to students page', async ({ page }) => {
    // Click on Students navigation link
    await page.locator('nav a[href="/dashboard/students"]').click();
    
    // Should navigate to students page
    await expect(page).toHaveURL('/dashboard/students');
    await expect(page.locator('h1')).toContainText('Students');
  });

  test('should display performance metrics', async ({ page }) => {
    // Check if performance metrics are displayed
    const metricsSection = page.locator('[data-testid="performance-metrics"]');
    await expect(metricsSection).toBeVisible();
    
    // Check for metric cards
    await expect(metricsSection.locator('text=Total Students')).toBeVisible();
    await expect(metricsSection.locator('text=Active Sessions')).toBeVisible();
    await expect(metricsSection.locator('text=Average Score')).toBeVisible();
  });

  test('should display student progress chart', async ({ page }) => {
    const chartSection = page.locator('[data-testid="student-progress-chart"]');
    await expect(chartSection).toBeVisible();
    
    // Check for chart title
    await expect(chartSection.locator('text=Student Progress')).toBeVisible();
  });

  test('should show upcoming sessions', async ({ page }) => {
    const sessionsSection = page.locator('[data-testid="upcoming-sessions"]');
    await expect(sessionsSection).toBeVisible();
    
    // Check for sessions header
    await expect(sessionsSection.locator('text=Upcoming Sessions')).toBeVisible();
  });

  test('should display recent activities', async ({ page }) => {
    const activitiesSection = page.locator('[data-testid="recent-activities"]');
    await expect(activitiesSection).toBeVisible();
    
    // Check for activities header
    await expect(activitiesSection.locator('text=Recent Activities')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if dashboard is still usable
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Check if mobile navigation works (hamburger menu)
    const mobileMenu = page.locator('[data-testid="mobile-menu-button"]');
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await expect(page.locator('nav')).toBeVisible();
    }
  });

  test('should handle loading states', async ({ page }) => {
    // Mock slow API response
    await page.route('**/rest/v1/students**', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.fulfill({
        json: [
          { id: '1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' }
        ]
      });
    });

    await page.reload();

    // Should show loading indicators
    await expect(page.locator('[data-testid="loading-spinner"]').first()).toBeVisible();
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/rest/v1/students**', async route => {
      await route.abort('networkerror');
    });

    await page.reload();

    // Should show error message or fallback
    await expect(
      page.locator('text=Unable to load data').or(
        page.locator('[data-testid="error-message"]')
      )
    ).toBeVisible();
  });

  test('should allow quick actions from dashboard', async ({ page }) => {
    // Look for quick action buttons
    const addStudentButton = page.locator('text=Add Student').first();
    const scheduleSessionButton = page.locator('text=Schedule Session').first();
    
    if (await addStudentButton.isVisible()) {
      await addStudentButton.click();
      // Should open add student modal or navigate to add student page
      await expect(
        page.locator('text=Add New Student').or(
          page.locator('[data-testid="add-student-modal"]')
        )
      ).toBeVisible();
    }
  });
});