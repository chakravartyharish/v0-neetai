/**
 * Smoke Test for Playwright Installation
 * Simple test to verify that Playwright and browsers are working correctly
 */

const { test, expect } = require('@playwright/test');

test.describe('Smoke Tests', () => {
  test('Playwright installation is working', async ({ page }) => {
    // Navigate to a reliable external site
    await page.goto('https://httpbin.org/get');
    
    // Should be able to see the page content
    await expect(page.locator('body')).toContainText('args');
    
    console.log('✅ Playwright is working correctly!');
  });

  test('Browser can execute JavaScript', async ({ page }) => {
    await page.goto('data:text/html,<html><body><h1>Test Page</h1></body></html>');
    
    // Execute some JavaScript
    const result = await page.evaluate(() => {
      return {
        title: document.title,
        userAgent: navigator.userAgent.includes('Chrome') || 
                  navigator.userAgent.includes('Firefox') ||
                  navigator.userAgent.includes('Safari'),
        timestamp: Date.now()
      };
    });
    
    expect(result.userAgent).toBe(true);
    expect(result.timestamp).toBeGreaterThan(0);
    
    console.log('✅ JavaScript execution is working!');
  });

  test('Can take screenshots', async ({ page }) => {
    await page.goto('data:text/html,<html><body style="background:green;color:white;"><h1>Screenshot Test</h1></body></html>');
    
    // Take a screenshot
    const screenshot = await page.screenshot();
    expect(screenshot).toBeTruthy();
    expect(screenshot.length).toBeGreaterThan(0);
    
    console.log('✅ Screenshot functionality is working!');
  });
});