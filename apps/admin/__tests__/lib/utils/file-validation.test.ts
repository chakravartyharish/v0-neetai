import {
  validateFile,
  validateFiles,
  sanitizeFilename,
  validateFileHeader,
  getSecurityConfig,
  SECURITY_CONFIGS,
} from '../../../lib/utils/file-validation'

// Mock FileReader for header validation tests
const mockFileReader = {
  readAsArrayBuffer: jest.fn(),
  result: null as ArrayBuffer | null,
  onload: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null,
  onerror: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null,
}

Object.defineProperty(window, 'FileReader', {
  writable: true,
  value: jest.fn(() => mockFileReader),
})

describe('File Validation Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFileReader.result = null
    mockFileReader.onload = null
    mockFileReader.onerror = null
  })

  describe('validateFile', () => {
    it('validates a correct PDF file', () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })
      const result = validateFile(file)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.sanitizedName).toBe('test.pdf')
    })

    it('rejects files that are too large', () => {
      const largeContent = new Array(51 * 1024 * 1024).fill('a').join('') // 51MB
      const file = new File([largeContent], 'large.pdf', { type: 'application/pdf' })
      const result = validateFile(file)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(expect.stringContaining('exceeds maximum allowed size'))
    })

    it('rejects empty files', () => {
      const file = new File([], 'empty.pdf', { type: 'application/pdf' })
      const result = validateFile(file)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('File is empty')
    })

    it('rejects disallowed file types', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' })
      const result = validateFile(file)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(expect.stringContaining('File type "text/plain" is not allowed'))
    })

    it('rejects disallowed file extensions', () => {
      const file = new File(['content'], 'test.exe', { type: 'application/pdf' })
      const result = validateFile(file)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(expect.stringContaining('File extension ".exe" is not allowed'))
    })

    it('rejects dangerous file extensions', () => {
      const file = new File(['content'], 'malicious.exe', { type: 'application/pdf' })
      const result = validateFile(file)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(expect.stringContaining('potentially dangerous'))
    })

    it('validates file with custom options', () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
      const options = {
        allowedTypes: ['image/jpeg'] as readonly string[],
        allowedExtensions: ['.jpg'] as readonly string[],
        maxSize: 10 * 1024 * 1024, // 10MB
      }
      const result = validateFile(file, options)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('validateFiles', () => {
    it('validates multiple valid files', () => {
      const files = [
        new File(['content1'], 'test1.pdf', { type: 'application/pdf' }),
        new File(['content2'], 'test2.pdf', { type: 'application/pdf' }),
      ]
      const result = validateFiles(files)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('rejects when too many files', () => {
      const files = Array.from({ length: 11 }, (_, i) =>
        new File([`content${i}`], `test${i}.pdf`, { type: 'application/pdf' })
      )
      const result = validateFiles(files)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(expect.stringContaining('Too many files'))
    })

    it('warns about duplicate filenames', () => {
      const files = [
        new File(['content1'], 'test.pdf', { type: 'application/pdf' }),
        new File(['content2'], 'Test.PDF', { type: 'application/pdf' }), // Case insensitive
      ]
      const result = validateFiles(files)

      expect(result.warnings).toContain(expect.stringContaining('Duplicate filenames detected'))
    })

    it('aggregates errors from individual file validation', () => {
      const files = [
        new File(['content1'], 'test1.pdf', { type: 'application/pdf' }),
        new File(['content2'], 'test2.exe', { type: 'application/pdf' }), // Invalid extension
      ]
      const result = validateFiles(files)

      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.errors[0]).toContain('File 2 (test2.exe)')
    })
  })

  describe('sanitizeFilename', () => {
    it('sanitizes problematic characters', () => {
      const result = sanitizeFilename('test<>:"|?*.pdf')
      expect(result).toBe('test_________.pdf')
    })

    it('removes path components', () => {
      const result = sanitizeFilename('../../malicious/path/file.pdf')
      expect(result).toBe('file.pdf')
    })

    it('handles files starting with dot', () => {
      const result = sanitizeFilename('.hidden.pdf')
      expect(result).toBe('file_.hidden.pdf')
    })

    it('limits filename length', () => {
      const longName = 'a'.repeat(200) + '.pdf'
      const result = sanitizeFilename(longName)
      expect(result.length).toBeLessThanOrEqual(100)
      expect(result.endsWith('.pdf')).toBe(true)
    })

    it('preserves clean filenames', () => {
      const cleanName = 'good_file-name.pdf'
      const result = sanitizeFilename(cleanName)
      expect(result).toBe(cleanName)
    })
  })

  describe('validateFileHeader', () => {
    it('validates correct PDF header', async () => {
      const file = new File(['%PDF-1.4'], 'test.pdf', { type: 'application/pdf' })

      // Mock FileReader to return PDF header bytes
      const pdfHeaderBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]) // %PDF
      mockFileReader.result = pdfHeaderBytes.buffer

      const promise = validateFileHeader(file)

      // Simulate FileReader onload
      if (mockFileReader.onload) {
        mockFileReader.onload.call(mockFileReader as any, {} as any)
      }

      const result = await promise
      expect(result).toBe(true)
    })

    it('rejects invalid PDF header', async () => {
      const file = new File(['invalid'], 'test.pdf', { type: 'application/pdf' })

      // Mock FileReader to return invalid header bytes
      const invalidBytes = new Uint8Array([0x00, 0x00, 0x00, 0x00])
      mockFileReader.result = invalidBytes.buffer

      const promise = validateFileHeader(file)

      // Simulate FileReader onload
      if (mockFileReader.onload) {
        mockFileReader.onload.call(mockFileReader as any, {} as any)
      }

      const result = await promise
      expect(result).toBe(false)
    })

    it('handles FileReader errors', async () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })

      const promise = validateFileHeader(file)

      // Simulate FileReader error
      if (mockFileReader.onerror) {
        mockFileReader.onerror.call(mockFileReader as any, {} as any)
      }

      const result = await promise
      expect(result).toBe(false)
    })

    it('accepts non-PDF files by default', async () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })

      const promise = validateFileHeader(file)

      // Simulate FileReader onload
      if (mockFileReader.onload) {
        mockFileReader.onload.call(mockFileReader as any, {} as any)
      }

      const result = await promise
      expect(result).toBe(true)
    })
  })

  describe('getSecurityConfig', () => {
    it('returns development config in development', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      const config = getSecurityConfig()

      expect(config.maxSize).toBe(SECURITY_CONFIGS.development.maxSize)
      expect(config.allowedTypes).toEqual([...SECURITY_CONFIGS.development.allowedTypes])
      expect(config.maxFiles).toBe(SECURITY_CONFIGS.development.maxFiles)

      process.env.NODE_ENV = originalEnv
    })

    it('returns production config in production', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      const config = getSecurityConfig()

      expect(config.maxSize).toBe(SECURITY_CONFIGS.production.maxSize)
      expect(config.allowedTypes).toEqual([...SECURITY_CONFIGS.production.allowedTypes])
      expect(config.maxFiles).toBe(SECURITY_CONFIGS.production.maxFiles)

      process.env.NODE_ENV = originalEnv
    })

    it('defaults to development config for unknown environments', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'test'

      const config = getSecurityConfig()

      expect(config.maxSize).toBe(SECURITY_CONFIGS.development.maxSize)

      process.env.NODE_ENV = originalEnv
    })

    it('returns mutable arrays', () => {
      const config = getSecurityConfig()

      // Should be able to modify the arrays (they're not readonly)
      expect(() => {
        config.allowedTypes?.push('test/type')
      }).not.toThrow()

      expect(() => {
        config.allowedExtensions?.push('.test')
      }).not.toThrow()
    })
  })

  describe('Edge Cases', () => {
    it('handles files with no extension', () => {
      const file = new File(['content'], 'readme', { type: 'application/pdf' })
      const result = validateFile(file)

      expect(result.isValid).toBe(false) // No extension means empty string, not in allowed list
    })

    it('handles files with multiple dots in name', () => {
      const file = new File(['content'], 'file.backup.pdf', { type: 'application/pdf' })
      const result = validateFile(file)

      expect(result.isValid).toBe(true)
      expect(result.sanitizedName).toBe('file.backup.pdf')
    })

    it('handles Unicode characters in filename', () => {
      const file = new File(['content'], 'файл.pdf', { type: 'application/pdf' })
      const result = validateFile(file)

      expect(result.warnings).toContain(expect.stringContaining('non-normalized Unicode'))
      expect(result.sanitizedName).toBe('____.pdf') // Unicode chars get replaced
    })

    it('handles extremely long filenames', () => {
      const longName = 'a'.repeat(300) + '.pdf'
      const file = new File(['content'], longName, { type: 'application/pdf' })
      const result = validateFile(file)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Filename is too long')
    })

    it('handles null bytes in filename', () => {
      const filename = 'test\0.pdf'
      const file = new File(['content'], filename, { type: 'application/pdf' })
      const result = validateFile(file)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Filename contains null bytes')
    })
  })
})