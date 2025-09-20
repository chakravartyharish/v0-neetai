# TASK-01-06: Institute Verification Backend System

## 📋 Task Details
**Task ID**: TASK-01-06
**Story Reference**: STORY-01-02 (Institute Verification Process)
**Sprint**: Sprint 1
**Phase**: Backend
**Priority**: P0 (Critical)
**Estimated Effort**: 2 days
**Assignee**: Backend Engineer
**Dependencies**: TASK-01-01 (Database Schema), TASK-01-02 (Registration API)

## 🎯 Task Description
Develop a comprehensive backend system for institute verification that allows administrators to review, validate, and approve institute registration applications through a structured workflow with document verification, status tracking, and automated notifications.

## 📋 Acceptance Criteria

### AC-01: Admin Verification Workflow Backend
- [ ] Create verification workflow API endpoints for admin operations
- [ ] Implement document review and validation logic
- [ ] Support batch operations for multiple verifications
- [ ] Track verification history and audit trail
- [ ] Handle verification decision logic (approve/reject/request-more-info)

### AC-02: Document Validation System
- [ ] Build document authenticity validation service
- [ ] Implement OCR integration for automatic data extraction
- [ ] Create document quality assessment algorithms
- [ ] Support multiple document formats with validation
- [ ] Generate validation reports and confidence scores

### AC-03: Status Management System
- [ ] Implement comprehensive status state machine
- [ ] Create status transition validation and logging
- [ ] Support custom verification statuses per institute type
- [ ] Track verification timeline and SLA metrics
- [ ] Generate status change audit logs

### AC-04: Email Notification Service
- [ ] Create automated email notification system
- [ ] Support customizable email templates for different stages
- [ ] Implement email delivery tracking and retry logic
- [ ] Support bulk notifications for admin actions
- [ ] Integration with email service providers

### AC-05: Reporting and Analytics Backend
- [ ] Generate verification performance metrics
- [ ] Create admin dashboard data aggregation APIs
- [ ] Support filtering and search across verification data
- [ ] Implement export functionality for verification reports
- [ ] Track conversion rates and processing times

## 🔧 Technical Specifications

### Database Schema Extensions

```sql
-- Institute verification table
CREATE TABLE institute_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID REFERENCES institutes(id) NOT NULL,
    verification_request_id UUID REFERENCES institute_registrations(id),
    
    -- Verification Details
    verification_type ENUM('initial', 'renewal', 'compliance_check') DEFAULT 'initial',
    status ENUM(
        'pending_review',
        'under_review', 
        'document_verification',
        'approved',
        'rejected',
        'requires_additional_info',
        'expired'
    ) DEFAULT 'pending_review',
    
    -- Assignment and Workflow
    assigned_reviewer_id UUID REFERENCES auth.users(id),
    priority_level ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    
    -- Document Analysis
    documents_submitted JSONB DEFAULT '[]',
    document_analysis_results JSONB DEFAULT '{}',
    ocr_extraction_results JSONB DEFAULT '{}',
    document_validation_score DECIMAL(3,2) DEFAULT 0.00,
    
    -- Verification Process
    verification_checklist JSONB DEFAULT '{}',
    verification_notes TEXT,
    internal_comments JSONB DEFAULT '[]',
    external_feedback TEXT,
    
    -- Decisions and Actions
    decision_made_by UUID REFERENCES auth.users(id),
    decision_date TIMESTAMP,
    decision_reason TEXT,
    recommended_actions JSONB DEFAULT '[]',
    
    -- Timeline Tracking
    submitted_at TIMESTAMP DEFAULT NOW(),
    review_started_at TIMESTAMP,
    review_completed_at TIMESTAMP,
    sla_deadline TIMESTAMP,
    processing_duration INTERVAL,
    
    -- Compliance and Quality
    compliance_score DECIMAL(3,2) DEFAULT 0.00,
    quality_assessment JSONB DEFAULT '{}',
    risk_factors JSONB DEFAULT '[]',
    
    -- Communication
    last_communication_date TIMESTAMP,
    communication_log JSONB DEFAULT '[]',
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Verification workflow steps
CREATE TABLE verification_workflow_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_id UUID REFERENCES institute_verifications(id),
    
    step_name VARCHAR(100) NOT NULL,
    step_order INTEGER NOT NULL,
    step_status ENUM('pending', 'in_progress', 'completed', 'skipped', 'failed') DEFAULT 'pending',
    
    -- Step Details
    step_type ENUM('manual_review', 'document_check', 'compliance_verification', 'external_verification') NOT NULL,
    required_documents JSONB DEFAULT '[]',
    validation_criteria JSONB DEFAULT '{}',
    
    -- Execution Details
    assigned_to UUID REFERENCES auth.users(id),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    duration INTERVAL,
    
    -- Results
    step_result ENUM('pass', 'fail', 'conditional_pass') DEFAULT 'pass',
    findings JSONB DEFAULT '{}',
    recommendations JSONB DEFAULT '[]',
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Document verification details
CREATE TABLE document_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_id UUID REFERENCES institute_verifications(id),
    
    -- Document Information
    document_type VARCHAR(100) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    document_url VARCHAR(500) NOT NULL,
    document_hash VARCHAR(128) NOT NULL,
    
    -- Verification Results
    verification_status ENUM('pending', 'verified', 'rejected', 'requires_resubmission') DEFAULT 'pending',
    authenticity_score DECIMAL(3,2) DEFAULT 0.00,
    quality_score DECIMAL(3,2) DEFAULT 0.00,
    
    -- OCR and Analysis
    ocr_extracted_text TEXT,
    ocr_confidence_score DECIMAL(3,2) DEFAULT 0.00,
    extracted_data JSONB DEFAULT '{}',
    
    -- Manual Review
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP,
    review_notes TEXT,
    
    -- Issues and Corrections
    identified_issues JSONB DEFAULT '[]',
    correction_requests JSONB DEFAULT '[]',
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Verification notifications log
CREATE TABLE verification_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_id UUID REFERENCES institute_verifications(id),
    
    -- Notification Details
    notification_type ENUM('status_update', 'reminder', 'decision', 'request_info') NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_type ENUM('institute', 'admin', 'reviewer') NOT NULL,
    
    -- Content
    subject VARCHAR(255) NOT NULL,
    message_body TEXT NOT NULL,
    template_used VARCHAR(100),
    
    -- Delivery Tracking
    delivery_status ENUM('pending', 'sent', 'delivered', 'failed', 'bounced') DEFAULT 'pending',
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    
    -- Retry Logic
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    next_retry_at TIMESTAMP,
    
    -- Provider Details
    email_provider VARCHAR(50),
    provider_message_id VARCHAR(255),
    provider_response JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

### API Implementation

```typescript
// app/api/admin/verifications/route.ts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const assignedTo = searchParams.get('assignedTo');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const user = await getCurrentUser();
    await verifyAdminAccess(user.id);

    let query = supabase
      .from('institute_verifications')
      .select(`
        *,
        institutes(id, name, type, contact_info),
        verification_workflow_steps(
          step_name,
          step_status,
          step_result,
          completed_at
        ),
        document_verifications(
          document_type,
          verification_status,
          authenticity_score,
          quality_score
        ),
        assigned_reviewer:assigned_reviewer_id(id, first_name, last_name, email)
      `);

    // Apply filters
    if (status) query = query.eq('status', status);
    if (priority) query = query.eq('priority_level', priority);
    if (assignedTo) query = query.eq('assigned_reviewer_id', assignedTo);

    // Apply pagination and sorting
    const offset = (page - 1) * limit;
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    const { data: verifications, error, count } = await query;
    if (error) throw new DatabaseError('Failed to fetch verifications', error);

    // Calculate additional metrics
    const enrichedData = await Promise.all(
      verifications.map(async (verification) => ({
        ...verification,
        overallProgress: calculateVerificationProgress(verification.verification_workflow_steps),
        timeToComplete: calculateTimeToComplete(verification),
        riskLevel: assessRiskLevel(verification),
        nextAction: determineNextAction(verification)
      }))
    );

    return NextResponse.json({
      success: true,
      data: {
        verifications: enrichedData,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        },
        summary: await getVerificationSummary()
      }
    });

  } catch (error) {
    return handleApiError(error);
  }
}

// app/api/admin/verifications/[id]/review/route.ts
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reviewData = await request.json();
    const user = await getCurrentUser();
    await verifyAdminAccess(user.id);

    // Validate review data
    const validatedData = verificationReviewSchema.parse(reviewData);

    // Start database transaction
    const { data, error } = await supabase.rpc('process_verification_review', {
      verification_id: params.id,
      reviewer_id: user.id,
      decision: validatedData.decision,
      notes: validatedData.notes,
      checklist_updates: validatedData.checklistUpdates,
      document_assessments: validatedData.documentAssessments,
      recommended_actions: validatedData.recommendedActions
    });

    if (error) throw new DatabaseError('Failed to process review', error);

    // Send notification based on decision
    if (validatedData.decision === 'approved') {
      await sendInstituteApprovalNotification(params.id);
      await createInstituteAccount(params.id);
    } else if (validatedData.decision === 'rejected') {
      await sendInstituteRejectionNotification(params.id, validatedData.notes);
    } else if (validatedData.decision === 'requires_additional_info') {
      await sendAdditionalInfoRequestNotification(params.id, validatedData.requestedInfo);
    }

    // Log verification action
    await logVerificationAction({
      verificationId: params.id,
      action: `verification_${validatedData.decision}`,
      performedBy: user.id,
      details: validatedData
    });

    return NextResponse.json({
      success: true,
      message: `Verification ${validatedData.decision} successfully`,
      data: data
    });

  } catch (error) {
    return handleApiError(error);
  }
}

// app/api/admin/verifications/[id]/documents/validate/route.ts
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { documentIds } = await request.json();
    const user = await getCurrentUser();
    await verifyAdminAccess(user.id);

    // Validate documents using external services
    const validationResults = await Promise.all(
      documentIds.map(async (docId: string) => {
        const document = await getDocumentById(docId);
        
        // OCR extraction
        const ocrResult = await ocrService.extractText(document.url);
        
        // Authenticity check
        const authenticityCheck = await documentAuthenticityService.verify(
          document,
          ocrResult
        );

        // Quality assessment
        const qualityAssessment = await documentQualityService.assess(document);

        // Update document verification record
        await supabase
          .from('document_verifications')
          .update({
            ocr_extracted_text: ocrResult.text,
            ocr_confidence_score: ocrResult.confidence,
            extracted_data: ocrResult.extractedData,
            authenticity_score: authenticityCheck.score,
            quality_score: qualityAssessment.score,
            verification_status: determineVerificationStatus(
              authenticityCheck.score,
              qualityAssessment.score
            ),
            reviewed_by: user.id,
            reviewed_at: new Date().toISOString()
          })
          .eq('id', docId);

        return {
          documentId: docId,
          documentType: document.document_type,
          ocrResult,
          authenticityCheck,
          qualityAssessment,
          overallScore: calculateOverallScore(
            authenticityCheck.score,
            qualityAssessment.score
          )
        };
      })
    );

    // Update verification progress
    await updateVerificationProgress(params.id, 'document_verification', validationResults);

    return NextResponse.json({
      success: true,
      data: validationResults,
      message: 'Documents validated successfully'
    });

  } catch (error) {
    return handleApiError(error);
  }
}
```

### Service Layer Implementation

```typescript
// services/VerificationService.ts
export class VerificationService {
  async processVerificationWorkflow(verificationId: string): Promise<void> {
    const verification = await this.getVerificationById(verificationId);
    const workflowSteps = await this.getWorkflowSteps(verificationId);

    // Execute next workflow step
    const currentStep = workflowSteps.find(step => step.step_status === 'pending');
    if (currentStep) {
      await this.executeWorkflowStep(currentStep);
    }

    // Check if verification is complete
    const allStepsCompleted = workflowSteps.every(step => 
      step.step_status === 'completed' || step.step_status === 'skipped'
    );

    if (allStepsCompleted) {
      await this.finalizeVerification(verificationId);
    }
  }

  async executeWorkflowStep(step: WorkflowStep): Promise<void> {
    switch (step.step_type) {
      case 'document_check':
        await this.performDocumentCheck(step);
        break;
      case 'compliance_verification':
        await this.performComplianceCheck(step);
        break;
      case 'external_verification':
        await this.performExternalVerification(step);
        break;
      case 'manual_review':
        await this.assignManualReview(step);
        break;
    }
  }

  async performDocumentCheck(step: WorkflowStep): Promise<void> {
    const documents = await this.getVerificationDocuments(step.verification_id);
    
    for (const document of documents) {
      // OCR processing
      const ocrResult = await this.ocrService.processDocument(document);
      
      // Validation against criteria
      const validation = await this.validateDocumentContent(
        ocrResult,
        step.validation_criteria
      );

      // Update document verification
      await this.updateDocumentVerification(document.id, {
        ocr_extracted_text: ocrResult.text,
        extracted_data: ocrResult.data,
        verification_status: validation.isValid ? 'verified' : 'rejected',
        authenticity_score: validation.authenticityScore,
        quality_score: validation.qualityScore
      });
    }

    // Mark step as completed
    await this.completeWorkflowStep(step.id, {
      step_result: 'pass',
      findings: { documents_processed: documents.length }
    });
  }

  async sendVerificationNotification(
    verificationId: string,
    type: NotificationType,
    customData?: any
  ): Promise<void> {
    const verification = await this.getVerificationById(verificationId);
    const institute = await this.getInstituteById(verification.institute_id);

    const notificationConfig = this.getNotificationConfig(type);
    const emailContent = await this.generateEmailContent(
      notificationConfig.template,
      {
        verification,
        institute,
        ...customData
      }
    );

    // Send email notification
    const emailResult = await this.emailService.send({
      to: institute.contact_info.email,
      subject: emailContent.subject,
      html: emailContent.body,
      template: notificationConfig.template
    });

    // Log notification
    await this.logNotification({
      verification_id: verificationId,
      notification_type: type,
      recipient_email: institute.contact_info.email,
      subject: emailContent.subject,
      message_body: emailContent.body,
      delivery_status: emailResult.success ? 'sent' : 'failed',
      provider_response: emailResult.response
    });
  }

  async calculateVerificationMetrics(filters: any): Promise<VerificationMetrics> {
    const verifications = await this.getVerifications(filters);

    return {
      totalVerifications: verifications.length,
      averageProcessingTime: this.calculateAverageProcessingTime(verifications),
      approvalRate: this.calculateApprovalRate(verifications),
      rejectionRate: this.calculateRejectionRate(verifications),
      averageDocumentScore: this.calculateAverageDocumentScore(verifications),
      slaCompliance: this.calculateSLACompliance(verifications),
      topRejectionReasons: this.getTopRejectionReasons(verifications),
      processingTimeDistribution: this.getProcessingTimeDistribution(verifications)
    };
  }
}

// services/DocumentValidationService.ts
export class DocumentValidationService {
  async validateDocument(document: Document): Promise<ValidationResult> {
    // Extract text using OCR
    const ocrResult = await this.ocrService.extractText(document.url);
    
    // Validate document authenticity
    const authenticityResult = await this.validateAuthenticity(document, ocrResult);
    
    // Assess document quality
    const qualityResult = await this.assessQuality(document);
    
    // Validate content against criteria
    const contentValidation = await this.validateContent(ocrResult, document.document_type);

    return {
      isValid: authenticityResult.isValid && qualityResult.isValid && contentValidation.isValid,
      authenticityScore: authenticityResult.score,
      qualityScore: qualityResult.score,
      contentScore: contentValidation.score,
      overallScore: this.calculateOverallScore([
        authenticityResult.score,
        qualityResult.score,
        contentValidation.score
      ]),
      issues: [
        ...authenticityResult.issues,
        ...qualityResult.issues,
        ...contentValidation.issues
      ],
      extractedData: ocrResult.data,
      confidence: ocrResult.confidence
    };
  }

  private async validateAuthenticity(document: Document, ocrResult: OCRResult): Promise<AuthenticityResult> {
    // Check for document tampering
    const tamperingCheck = await this.checkForTampering(document);
    
    // Validate document format and structure
    const formatValidation = await this.validateDocumentFormat(document, ocrResult);
    
    // Cross-reference with external databases
    const externalValidation = await this.crossReferenceExternal(ocrResult.data, document.document_type);

    return {
      isValid: tamperingCheck.isValid && formatValidation.isValid && externalValidation.isValid,
      score: Math.min(tamperingCheck.score, formatValidation.score, externalValidation.score),
      issues: [
        ...tamperingCheck.issues,
        ...formatValidation.issues,
        ...externalValidation.issues
      ],
      confidence: Math.min(tamperingCheck.confidence, formatValidation.confidence, externalValidation.confidence)
    };
  }
}

// services/NotificationService.ts
export class VerificationNotificationService {
  private emailTemplates = {
    status_update: 'verification-status-update',
    approval: 'verification-approved',
    rejection: 'verification-rejected',
    additional_info_request: 'verification-additional-info',
    reminder: 'verification-reminder'
  };

  async sendStatusUpdateNotification(verificationId: string): Promise<void> {
    const verification = await this.getVerificationWithInstitute(verificationId);
    
    await this.sendNotification({
      type: 'status_update',
      recipientEmail: verification.institutes.contact_info.email,
      templateData: {
        instituteName: verification.institutes.name,
        currentStatus: verification.status,
        verificationId: verification.id,
        nextSteps: await this.getNextSteps(verification)
      }
    });
  }

  async sendApprovalNotification(verificationId: string): Promise<void> {
    const verification = await this.getVerificationWithInstitute(verificationId);
    
    await this.sendNotification({
      type: 'approval',
      recipientEmail: verification.institutes.contact_info.email,
      templateData: {
        instituteName: verification.institutes.name,
        approvedDate: verification.decision_date,
        loginCredentials: await this.generateLoginCredentials(verification.institute_id),
        nextSteps: this.getPostApprovalSteps()
      }
    });
  }

  private async sendNotification(config: NotificationConfig): Promise<void> {
    const template = this.emailTemplates[config.type];
    const content = await this.renderEmailTemplate(template, config.templateData);

    const result = await this.emailService.send({
      to: config.recipientEmail,
      subject: content.subject,
      html: content.body,
      template: template
    });

    // Log the notification
    await this.logNotification(config, result);
  }
}
```

## 🧪 Testing Requirements

### Unit Tests
```typescript
describe('VerificationService', () => {
  let verificationService: VerificationService;

  beforeEach(() => {
    verificationService = new VerificationService();
  });

  test('should create verification workflow for new registration', async () => {
    const registrationData = createValidRegistration();
    const result = await verificationService.createVerificationWorkflow(registrationData.id);

    expect(result.success).toBe(true);
    expect(result.workflowSteps).toHaveLength(4);
    expect(result.status).toBe('pending_review');
  });

  test('should process document verification correctly', async () => {
    const mockDocument = createMockDocument();
    const result = await verificationService.validateDocument(mockDocument);

    expect(result.isValid).toBe(true);
    expect(result.overallScore).toBeGreaterThan(0.8);
    expect(result.extractedData).toBeDefined();
  });

  test('should send appropriate notifications on status changes', async () => {
    const verificationId = 'test-verification-id';
    await verificationService.updateVerificationStatus(verificationId, 'approved');

    expect(mockEmailService.send).toHaveBeenCalledWith(
      expect.objectContaining({
        template: 'verification-approved',
        to: expect.any(String)
      })
    );
  });
});

describe('DocumentValidationService', () => {
  test('should detect document tampering', async () => {
    const tamperedDocument = createTamperedDocument();
    const result = await documentValidationService.validateAuthenticity(tamperedDocument);

    expect(result.isValid).toBe(false);
    expect(result.issues).toContain('Document tampering detected');
    expect(result.score).toBeLessThan(0.5);
  });

  test('should extract data correctly from valid documents', async () => {
    const validDocument = createValidDocument();
    const result = await documentValidationService.validateDocument(validDocument);

    expect(result.extractedData.instituteName).toBeDefined();
    expect(result.extractedData.registrationNumber).toBeDefined();
    expect(result.confidence).toBeGreaterThan(0.9);
  });
});
```

### Integration Tests
- Email notification delivery
- OCR service integration
- Document storage and retrieval
- Workflow state transitions
- Database transaction consistency

## 📊 Success Metrics
- Document validation accuracy > 95%
- Average verification processing time < 2 days
- Email notification delivery rate > 99%
- OCR extraction accuracy > 90%
- System uptime > 99.9%

## 🔒 Security Considerations
- Secure document storage and access
- Encrypted sensitive data handling
- Audit trail for all verification actions
- Rate limiting for API endpoints
- Access control for admin operations

## 📋 Definition of Done
- [ ] All verification workflow APIs implemented
- [ ] Document validation service functional
- [ ] Email notification system working
- [ ] Status tracking and audit logging
- [ ] Admin review tools integrated
- [ ] OCR and authenticity validation
- [ ] Unit tests passing (>90% coverage)
- [ ] Integration tests complete
- [ ] Security review passed
- [ ] Performance benchmarks met

## 🔗 Dependencies
- OCR service integration (AWS Textract/Google Vision)
- Email service provider (SendGrid/AWS SES)
- Document storage service (AWS S3/Cloudinary)
- External verification APIs
- Database schema from TASK-01-01

## ⚡ Performance Optimization
- Async document processing
- Batch email notifications
- Caching for frequently accessed data
- Database query optimization
- Background job processing

## 📝 Notes
- Implement retry logic for external service failures
- Consider implementing ML-based fraud detection
- Plan for multi-language document support
- Prepare for regulatory compliance requirements
- Design for scalability with high verification volumes

---

**Task Owner**: Backend Engineer
**Reviewer**: Tech Lead + Compliance Officer
**Created**: 2024-01-20
**Due Date**: 2024-02-12