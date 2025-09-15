import { createHash, randomBytes, createCipheriv, createDecipheriv } from 'crypto';

export interface AuditLogEntry {
  id: string;
  user_id: string;
  institute_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, any>;
  ip_address: string;
  user_agent: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface EncryptionConfig {
  algorithm: string;
  keyLength: number;
  ivLength: number;
}

export interface PIIField {
  field_name: string;
  field_type: 'email' | 'phone' | 'name' | 'address' | 'id_number' | 'date_of_birth';
  is_sensitive: boolean;
  retention_period_days?: number;
}

export interface DataRetentionPolicy {
  resource_type: string;
  retention_period_days: number;
  auto_delete: boolean;
  anonymize_after_days?: number;
  pii_fields: PIIField[];
}

export interface SecurityHeaders {
  'Content-Security-Policy': string;
  'X-Frame-Options': string;
  'X-Content-Type-Options': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'Strict-Transport-Security': string;
  'X-XSS-Protection': string;
}

class SecurityManager {
  private static instance: SecurityManager;
  private encryptionKey: Buffer;
  private auditLogs: Map<string, AuditLogEntry> = new Map();
  private rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map();
  private encryptionConfig: EncryptionConfig = {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 16,
  };

  private constructor() {
    // In production, this should come from a secure key management service
    this.encryptionKey = this.getOrCreateEncryptionKey();
    this.setupSecurityHeaders();
  }

  public static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  private getOrCreateEncryptionKey(): Buffer {
    // In production, retrieve from secure key management (e.g., AWS KMS, Azure Key Vault)
    const envKey = process.env.ENCRYPTION_KEY;
    if (envKey) {
      return Buffer.from(envKey, 'hex');
    }
    
    // Generate a new key (only for development)
    const key = randomBytes(this.encryptionConfig.keyLength);
    console.warn('Generated new encryption key. In production, use a proper key management service.');
    return key;
  }

  // Data Encryption
  public encryptData(plaintext: string): { encrypted: string; iv: string; tag: string } {
    const iv = randomBytes(this.encryptionConfig.ivLength);
    const cipher = createCipheriv(this.encryptionConfig.algorithm, this.encryptionKey, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
    };
  }

  public decryptData(encryptedData: { encrypted: string; iv: string; tag: string }): string {
    const decipher = createDecipheriv(
      this.encryptionConfig.algorithm,
      this.encryptionKey,
      Buffer.from(encryptedData.iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  // Hash sensitive data for comparison without storing plaintext
  public hashData(data: string, salt?: string): { hash: string; salt: string } {
    const actualSalt = salt || randomBytes(16).toString('hex');
    const hash = createHash('sha256').update(data + actualSalt).digest('hex');
    return { hash, salt: actualSalt };
  }

  public verifyHash(data: string, hash: string, salt: string): boolean {
    const { hash: computedHash } = this.hashData(data, salt);
    return computedHash === hash;
  }

  // PII Detection and Masking
  public detectPII(text: string): Array<{ type: string; value: string; start: number; end: number }> {
    const patterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      phone: /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/g,
      indianPhone: /(\+91[-\s]?)?[6-9]\d{9}/g,
      aadhaar: /\d{4}[-\s]?\d{4}[-\s]?\d{4}/g,
      pan: /[A-Z]{5}\d{4}[A-Z]/g,
      indianPostal: /\d{6}/g,
    };

    const detected: Array<{ type: string; value: string; start: number; end: number }> = [];
    
    Object.entries(patterns).forEach(([type, pattern]) => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        detected.push({
          type,
          value: match[0],
          start: match.index,
          end: match.index + match[0].length,
        });
      }
    });

    return detected;
  }

  public maskPII(text: string, maskChar: string = '*'): string {
    const piiInstances = this.detectPII(text);
    let maskedText = text;
    
    // Sort by position in reverse order to avoid index shifting
    piiInstances.sort((a, b) => b.start - a.start);
    
    piiInstances.forEach(({ type, value, start, end }) => {
      let maskedValue: string;
      
      switch (type) {
        case 'email':
          const [localPart, domain] = value.split('@');
          maskedValue = `${localPart.charAt(0)}${maskChar.repeat(localPart.length - 2)}${localPart.charAt(localPart.length - 1)}@${domain}`;
          break;
        case 'phone':
        case 'indianPhone':
          maskedValue = value.substring(0, 2) + maskChar.repeat(value.length - 4) + value.substring(value.length - 2);
          break;
        case 'aadhaar':
          maskedValue = value.substring(0, 4) + maskChar.repeat(value.length - 4);
          break;
        case 'pan':
          maskedValue = value.substring(0, 3) + maskChar.repeat(4) + value.substring(7);
          break;
        default:
          maskedValue = maskChar.repeat(value.length);
      }
      
      maskedText = maskedText.substring(0, start) + maskedValue + maskedText.substring(end);
    });
    
    return maskedText;
  }

  // Audit Logging
  public logAuditEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const auditEntry: AuditLogEntry = {
      ...entry,
      id: `audit_${Date.now()}_${randomBytes(8).toString('hex')}`,
      timestamp: new Date().toISOString(),
    };

    this.auditLogs.set(auditEntry.id, auditEntry);

    // In production, this should be sent to a secure logging service
    console.log('Audit Log:', JSON.stringify(auditEntry));
    
    // Store in database (mock implementation)
    this.storeAuditLog(auditEntry);
  }

  private async storeAuditLog(entry: AuditLogEntry): Promise<void> {
    // In production, store in secure audit database
    // This ensures logs are tamper-proof and persistent
    try {
      // Mock database storage
      console.log(`Storing audit log: ${entry.id}`);
    } catch (error) {
      console.error('Failed to store audit log:', error);
      // Implement fallback storage mechanism
    }
  }

  public getAuditLogs(filters: {
    user_id?: string;
    institute_id?: string;
    action?: string;
    resource_type?: string;
    severity?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
  }): AuditLogEntry[] {
    let logs = Array.from(this.auditLogs.values());

    // Apply filters
    if (filters.user_id) {
      logs = logs.filter(log => log.user_id === filters.user_id);
    }
    if (filters.institute_id) {
      logs = logs.filter(log => log.institute_id === filters.institute_id);
    }
    if (filters.action) {
      logs = logs.filter(log => log.action.includes(filters.action));
    }
    if (filters.resource_type) {
      logs = logs.filter(log => log.resource_type === filters.resource_type);
    }
    if (filters.severity) {
      logs = logs.filter(log => log.severity === filters.severity);
    }
    if (filters.date_from) {
      const fromDate = new Date(filters.date_from);
      logs = logs.filter(log => new Date(log.timestamp) >= fromDate);
    }
    if (filters.date_to) {
      const toDate = new Date(filters.date_to);
      logs = logs.filter(log => new Date(log.timestamp) <= toDate);
    }

    // Sort by timestamp (newest first)
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Apply limit
    if (filters.limit) {
      logs = logs.slice(0, filters.limit);
    }

    return logs;
  }

  // Rate Limiting
  public checkRateLimit(
    identifier: string,
    windowMs: number,
    maxRequests: number
  ): { allowed: boolean; resetTime: number; remaining: number } {
    const now = Date.now();
    const windowStart = now - windowMs;
    const key = `${identifier}_${Math.floor(now / windowMs)}`;

    const current = this.rateLimitStore.get(key);
    
    if (!current) {
      this.rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return { allowed: true, resetTime: now + windowMs, remaining: maxRequests - 1 };
    }

    if (current.count >= maxRequests) {
      return { allowed: false, resetTime: current.resetTime, remaining: 0 };
    }

    current.count += 1;
    this.rateLimitStore.set(key, current);

    return {
      allowed: true,
      resetTime: current.resetTime,
      remaining: maxRequests - current.count,
    };
  }

  // Security Headers
  private setupSecurityHeaders(): void {
    // These headers should be set in middleware or server configuration
    console.log('Security headers configuration ready');
  }

  public getSecurityHeaders(): SecurityHeaders {
    return {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel.app",
        "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
        "font-src 'self' fonts.gstatic.com",
        "img-src 'self' data: *.supabase.co *.vercel.app",
        "connect-src 'self' *.supabase.co *.vercel.app wss:",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; '),
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': [
        'camera=()',
        'microphone=()',
        'geolocation=()',
        'payment=()',
      ].join(', '),
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-XSS-Protection': '1; mode=block',
    };
  }

  // GDPR Compliance
  public createDataRetentionPolicy(policy: DataRetentionPolicy): void {
    console.log('Data retention policy created:', policy.resource_type);
    // In production, store in database and set up automated cleanup jobs
  }

  public anonymizeData(data: Record<string, any>, piiFields: PIIField[]): Record<string, any> {
    const anonymized = { ...data };
    
    piiFields.forEach(field => {
      if (field.is_sensitive && anonymized[field.field_name]) {
        switch (field.field_type) {
          case 'email':
            anonymized[field.field_name] = 'anonymized@example.com';
            break;
          case 'phone':
            anonymized[field.field_name] = '+91XXXXXXXXXX';
            break;
          case 'name':
            anonymized[field.field_name] = 'Anonymous User';
            break;
          case 'address':
            anonymized[field.field_name] = 'Anonymized Address';
            break;
          case 'date_of_birth':
            // Keep only year for statistical purposes
            const year = new Date(anonymized[field.field_name]).getFullYear();
            anonymized[field.field_name] = `${year}-01-01`;
            break;
          default:
            anonymized[field.field_name] = 'ANONYMIZED';
        }
      }
    });
    
    return anonymized;
  }

  public generateDataExportReport(userId: string, instituteId: string): Promise<{
    user_data: Record<string, any>;
    academic_data: Record<string, any>;
    communication_data: Record<string, any>;
    export_timestamp: string;
  }> {
    // GDPR Article 15 - Right of access
    return Promise.resolve({
      user_data: {
        id: userId,
        name: 'User Name',
        email: 'user@example.com',
        // ... other user data
      },
      academic_data: {
        tests_taken: [],
        assignments_submitted: [],
        performance_metrics: {},
      },
      communication_data: {
        notifications_received: [],
        messages_sent: [],
      },
      export_timestamp: new Date().toISOString(),
    });
  }

  public deleteUserData(userId: string, instituteId: string): Promise<{
    deleted: boolean;
    anonymized_records: number;
    audit_trail: string;
  }> {
    // GDPR Article 17 - Right to erasure
    return Promise.resolve({
      deleted: true,
      anonymized_records: 0,
      audit_trail: `audit_${Date.now()}`,
    });
  }

  // Input Sanitization
  public sanitizeInput(input: string): string {
    return input
      .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }

  public validateFileUpload(file: {
    name: string;
    type: string;
    size: number;
  }): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (file.size > maxSize) {
      errors.push('File size exceeds 10MB limit');
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not allowed');
    }

    // Check for dangerous file extensions
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com'];
    const hasDeficiousDangerousExt = dangerousExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );

    if (hasDeficiousDangerousExt) {
      errors.push('Potentially dangerous file extension detected');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Backup and Recovery
  public createSecurityBackup(): Promise<{
    backup_id: string;
    timestamp: string;
    encrypted: boolean;
    location: string;
  }> {
    const backupId = `backup_${Date.now()}_${randomBytes(8).toString('hex')}`;
    
    return Promise.resolve({
      backup_id: backupId,
      timestamp: new Date().toISOString(),
      encrypted: true,
      location: `/backups/${backupId}.enc`,
    });
  }
}

// Export singleton instance
export const securityManager = SecurityManager.getInstance();

// Middleware helper for rate limiting
export function createRateLimitMiddleware(
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  maxRequests: number = 100
) {
  return (identifier: string) => {
    const result = securityManager.checkRateLimit(identifier, windowMs, maxRequests);
    return result;
  };
}

// Audit logging helper
export function auditLog(
  action: string,
  resourceType: string,
  resourceId: string,
  userId: string,
  instituteId: string,
  details: Record<string, any> = {},
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
) {
  securityManager.logAuditEvent({
    user_id: userId,
    institute_id: instituteId,
    action,
    resource_type: resourceType,
    resource_id: resourceId,
    details,
    ip_address: 'unknown', // Should be extracted from request
    user_agent: 'unknown', // Should be extracted from request
    severity,
  });
}

export default SecurityManager;