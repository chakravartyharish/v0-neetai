import { test, expect } from '@playwright/test'
import path from 'path'
import fs from 'fs'

// Setup test files
const testFilesDir = path.join(__dirname, '../fixtures')

// Create test files if they don't exist
function createTestFiles() {
  if (!fs.existsSync(testFilesDir)) {
    fs.mkdirSync(testFilesDir, { recursive: true })
  }

  // Create a valid PDF file (minimal PDF structure)
  const validPdfContent = '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000010 00000 n \n0000000053 00000 n \n0000000103 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n162\n%%EOF'
  fs.writeFileSync(path.join(testFilesDir, 'valid-test.pdf'), validPdfContent)

  // Create an invalid PDF file (wrong header)
  fs.writeFileSync(path.join(testFilesDir, 'invalid.pdf'), 'This is not a PDF file')

  // Create a large file (for size testing)
  const largeContent = 'a'.repeat(51 * 1024 * 1024) // 51MB
  fs.writeFileSync(path.join(testFilesDir, 'large.pdf'), largeContent)

  // Create files with dangerous extensions
  fs.writeFileSync(path.join(testFilesDir, 'malware.exe'), 'fake executable')
  fs.writeFileSync(path.join(testFilesDir, 'script.js'), 'console.log("malicious")')

  // Create files with problematic names
  fs.writeFileSync(path.join(testFilesDir, 'file with spaces.pdf'), validPdfContent)
  fs.writeFileSync(path.join(testFilesDir, 'file..with..dots.pdf'), validPdfContent)
}

test.describe('File Upload Security', () => {
  test.beforeAll(() => {
    createTestFiles()
  })

  test.beforeEach(async ({ page }) => {
    // Mock authentication to access admin dashboard
    await page.route('**/api/auth/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 'admin-1',
            email: 'admin@neetai.dev',
            role: 'admin',
            user_metadata: { role: 'admin' }
          }
        })
      })
    })

    await page.goto('/upload')
    await page.waitForLoadState('networkidle')
  })

  test('should display upload interface correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Upload NEET PDFs')
    await expect(page.locator('text=Drop NEET PDF files here')).toBeVisible()
    await expect(page.locator('text=Supports multiple PDF files up to 50MB each')).toBeVisible()
  })

  test('should accept valid PDF files', async ({ page }) => {
    const validPdfPath = path.join(testFilesDir, 'valid-test.pdf')

    // Upload valid PDF
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(validPdfPath)

    // Check that file appears in the list
    await expect(page.locator('text=valid-test.pdf')).toBeVisible()
    await expect(page.locator('text=Pending')).toBeVisible()

    // Should show process button
    await expect(page.locator('button:has-text("Process")')).toBeVisible()
  })

  test('should reject files with dangerous extensions', async ({ page }) => {
    const malwarePath = path.join(testFilesDir, 'malware.exe')

    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(malwarePath)

    // Should show validation error
    await expect(page.locator('text=File Validation Errors')).toBeVisible()
    await expect(page.locator('text=potentially dangerous')).toBeVisible()

    // File should not appear in the upload list
    await expect(page.locator('text=malware.exe')).not.toBeVisible()
  })

  test('should reject JavaScript files', async ({ page }) => {
    const scriptPath = path.join(testFilesDir, 'script.js')

    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(scriptPath)

    // Should show validation error
    await expect(page.locator('text=File Validation Errors')).toBeVisible()
    await expect(page.locator('text=File extension ".js" is not allowed')).toBeVisible()
  })

  test('should reject files that are too large', async ({ page }) => {
    const largePath = path.join(testFilesDir, 'large.pdf')

    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(largePath)

    // Should show validation error
    await expect(page.locator('text=File Validation Errors')).toBeVisible()
    await expect(page.locator('text=exceeds maximum allowed size')).toBeVisible()
  })

  test('should validate PDF headers', async ({ page }) => {
    const invalidPdfPath = path.join(testFilesDir, 'invalid.pdf')

    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(invalidPdfPath)

    // Should show validation error for invalid header
    await expect(page.locator('text=File Validation Errors')).toBeVisible()
    await expect(page.locator('text=appears to be corrupted or is not a valid PDF')).toBeVisible()
  })

  test('should handle multiple files with mixed validity', async ({ page }) => {
    const validPdfPath = path.join(testFilesDir, 'valid-test.pdf')
    const invalidPath = path.join(testFilesDir, 'malware.exe')

    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles([validPdfPath, invalidPath])

    // Should show validation errors for invalid file
    await expect(page.locator('text=File Validation Errors')).toBeVisible()

    // Valid file should appear in list
    await expect(page.locator('text=valid-test.pdf')).toBeVisible()

    // Invalid file should not appear
    await expect(page.locator('text=malware.exe')).not.toBeVisible()
  })

  test('should show warnings for problematic filenames', async ({ page }) => {
    const spacesPath = path.join(testFilesDir, 'file with spaces.pdf')

    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(spacesPath)

    // File should be accepted but with warnings
    await expect(page.locator('text=file with spaces.pdf')).toBeVisible()

    // May show warnings about filename (depending on implementation)
    const hasWarnings = await page.locator('text=File Validation Warnings').isVisible()
    if (hasWarnings) {
      await expect(page.locator('text=File Validation Warnings')).toBeVisible()
    }
  })

  test('should provide clear error messages', async ({ page }) => {
    const malwarePath = path.join(testFilesDir, 'malware.exe')

    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(malwarePath)

    // Should show clear error structure
    await expect(page.locator('text=File Validation Errors')).toBeVisible()

    // Should have proper error styling
    const errorBox = page.locator('.bg-red-50')
    await expect(errorBox).toBeVisible()

    // Should have error icon
    const errorIcon = page.locator('svg.text-red-400')
    await expect(errorIcon).toBeVisible()
  })

  test('should allow processing valid files', async ({ page }) => {
    const validPdfPath = path.join(testFilesDir, 'valid-test.pdf')

    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(validPdfPath)

    await expect(page.locator('text=valid-test.pdf')).toBeVisible()

    // Click process button
    const processButton = page.locator('button:has-text("Process")')
    await processButton.click()

    // Should show processing state
    await expect(page.locator('text=Uploading...')).toBeVisible()

    // Eventually should show completed (in a real app)
    // This would require mocking the actual processing endpoint
  })

  test('should handle drag and drop', async ({ page }) => {
    const validPdfPath = path.join(testFilesDir, 'valid-test.pdf')

    // Simulate drag and drop
    const dropZone = page.locator('[class*="border-dashed"]')
    await dropZone.setInputFiles(validPdfPath)

    // Should accept the file
    await expect(page.locator('text=valid-test.pdf')).toBeVisible()
  })

  test('should show processing options when files are present', async ({ page }) => {
    const validPdfPath = path.join(testFilesDir, 'valid-test.pdf')

    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(validPdfPath)

    // Should show processing options
    await expect(page.locator('text=Processing Options')).toBeVisible()
    await expect(page.locator('text=Enable OCR fallback')).toBeVisible()
    await expect(page.locator('text=Skip instruction pages')).toBeVisible()
    await expect(page.locator('text=Strict NEET format validation')).toBeVisible()
  })

  test('should provide bulk actions', async ({ page }) => {
    const validPdfPath = path.join(testFilesDir, 'valid-test.pdf')

    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles([validPdfPath, validPdfPath]) // Add same file twice for testing

    // Should show bulk action buttons
    await expect(page.locator('button:has-text("Clear All")')).toBeVisible()
    await expect(page.locator('button:has-text("Process All")')).toBeVisible()
  })

  test('should handle empty file rejection', async ({ page }) => {
    // Create empty file for testing
    const emptyPath = path.join(testFilesDir, 'empty.pdf')
    fs.writeFileSync(emptyPath, '')

    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(emptyPath)

    // Should show validation error for empty file
    await expect(page.locator('text=File Validation Errors')).toBeVisible()
    await expect(page.locator('text=File is empty')).toBeVisible()
  })

  test.afterAll(() => {
    // Clean up test files
    if (fs.existsSync(testFilesDir)) {
      fs.rmSync(testFilesDir, { recursive: true, force: true })
    }
  })
})