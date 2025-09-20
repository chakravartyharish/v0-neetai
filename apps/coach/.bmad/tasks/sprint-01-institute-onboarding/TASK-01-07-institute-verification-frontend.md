# TASK-01-07: Institute Verification Frontend System

## 📋 Task Details
**Task ID**: TASK-01-07
**Story Reference**: STORY-01-02 (Institute Verification Process)
**Sprint**: Sprint 1
**Phase**: Frontend
**Priority**: P0 (Critical)
**Estimated Effort**: 2 days
**Assignee**: Frontend Engineer
**Dependencies**: TASK-01-06 (Verification Backend), TASK-01-03 (Registration UI)

## 🎯 Task Description
Develop comprehensive frontend components for institute verification that enable administrators to efficiently review, process, and manage institute applications through an intuitive dashboard interface with document viewer, status tracking, and decision-making tools.

## 📋 Acceptance Criteria

### AC-01: Admin Verification Dashboard
- [ ] Create comprehensive verification queue dashboard
- [ ] Display verification status with color-coded indicators
- [ ] Support filtering and sorting by status, priority, date
- [ ] Show verification metrics and summary statistics
- [ ] Implement bulk operations for multiple verifications

### AC-02: Document Review Interface
- [ ] Build document viewer with zoom and annotation capabilities
- [ ] Display OCR extracted data alongside original documents
- [ ] Show document authenticity scores and quality ratings
- [ ] Enable side-by-side comparison of multiple documents
- [ ] Support document approval/rejection with comments

### AC-03: Verification Workflow Management
- [ ] Create step-by-step verification progress indicator
- [ ] Display workflow status with completion tracking
- [ ] Enable workflow step assignment to specific reviewers
- [ ] Show estimated completion time and SLA tracking
- [ ] Support workflow customization per institute type

### AC-04: Decision Making Interface
- [ ] Build comprehensive verification decision form
- [ ] Support approve/reject/request-more-info actions
- [ ] Enable detailed comments and feedback entry
- [ ] Display verification checklist with completion tracking
- [ ] Generate decision summary and audit trail

### AC-05: Communication and Notifications
- [ ] Create email template preview and editing interface
- [ ] Display communication history and log
- [ ] Enable quick message sending to institutes
- [ ] Show notification delivery status and tracking
- [ ] Support bulk notifications for similar cases

## 🔧 Technical Specifications

### Component Architecture

```typescript
// components/admin/verification/VerificationDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { useVerificationStore } from '@/stores/verification-store';
import { VerificationQueue } from './VerificationQueue';
import { VerificationDetails } from './VerificationDetails';
import { VerificationFilters } from './VerificationFilters';
import { VerificationMetrics } from './VerificationMetrics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface VerificationDashboardProps {
  initialFilters?: VerificationFilters;
}

export function VerificationDashboard({ initialFilters }: VerificationDashboardProps) {
  const [activeTab, setActiveTab] = useState('queue');
  const [selectedVerification, setSelectedVerification] = useState<string | null>(null);
  const [filters, setFilters] = useState(initialFilters || {
    status: 'all',
    priority: 'all',
    assignee: 'all',
    dateRange: 'all'
  });

  const {
    verifications,
    metrics,
    isLoading,
    fetchVerifications,
    processVerification,
    bulkProcessVerifications
  } = useVerificationStore();

  useEffect(() => {
    fetchVerifications(filters);
  }, [filters, fetchVerifications]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_review':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'under_review':
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string): string => {
    const colors = {
      'pending_review': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'under_review': 'bg-blue-100 text-blue-800 border-blue-200',
      'document_verification': 'bg-purple-100 text-purple-800 border-purple-200',
      'approved': 'bg-green-100 text-green-800 border-green-200',
      'rejected': 'bg-red-100 text-red-800 border-red-200',
      'requires_additional_info': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Institute Verification</h1>
          <p className="text-gray-600 mt-1">
            Review and approve institute registration applications
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setSelectedVerification(null)}
            disabled={!selectedVerification}
          >
            Clear Selection
          </Button>
          <Button
            onClick={() => {
              // Handle bulk operations
            }}
            disabled={verifications.filter(v => v.selected).length === 0}
          >
            Bulk Actions
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <VerificationMetrics metrics={metrics} />

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="queue">
            Verification Queue
            <Badge variant="secondary" className="ml-2">
              {verifications.filter(v => v.status === 'pending_review').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress
            <Badge variant="secondary" className="ml-2">
              {verifications.filter(v => v.status === 'under_review').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            <Badge variant="secondary" className="ml-2">
              {verifications.filter(v => ['approved', 'rejected'].includes(v.status)).length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <VerificationFilters
                filters={filters}
                onFiltersChange={setFilters}
              />
              <VerificationQueue
                verifications={verifications.filter(v => v.status === 'pending_review')}
                onSelectVerification={setSelectedVerification}
                selectedVerification={selectedVerification}
                isLoading={isLoading}
              />
            </div>
            <div className="lg:col-span-1">
              {selectedVerification ? (
                <VerificationDetails
                  verificationId={selectedVerification}
                  onProcessComplete={() => {
                    fetchVerifications(filters);
                    setSelectedVerification(null);
                  }}
                />
              ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a Verification
                  </h3>
                  <p className="text-gray-600">
                    Choose a verification from the queue to review details and make decisions
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-6">
          <VerificationQueue
            verifications={verifications.filter(v => 
              ['under_review', 'document_verification'].includes(v.status)
            )}
            onSelectVerification={setSelectedVerification}
            selectedVerification={selectedVerification}
            showProgress={true}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <VerificationQueue
            verifications={verifications.filter(v => 
              ['approved', 'rejected'].includes(v.status)
            )}
            onSelectVerification={setSelectedVerification}
            selectedVerification={selectedVerification}
            showDecisionSummary={true}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <VerificationAnalytics metrics={metrics} verifications={verifications} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// components/admin/verification/VerificationDetails.tsx
interface VerificationDetailsProps {
  verificationId: string;
  onProcessComplete: () => void;
}

export function VerificationDetails({ verificationId, onProcessComplete }: VerificationDetailsProps) {
  const [verification, setVerification] = useState<Verification | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [decision, setDecision] = useState<'approved' | 'rejected' | 'requires_additional_info' | null>(null);
  const [comments, setComments] = useState('');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  const { processVerification, validateDocuments } = useVerificationStore();

  useEffect(() => {
    fetchVerificationDetails(verificationId).then(setVerification);
  }, [verificationId]);

  const handleProcessVerification = async () => {
    if (!decision || !verification) return;

    setIsProcessing(true);
    try {
      await processVerification(verificationId, {
        decision,
        comments,
        checklist,
        reviewerId: getCurrentUser().id
      });
      
      toast.success(`Verification ${decision} successfully`);
      onProcessComplete();
    } catch (error) {
      toast.error('Failed to process verification');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!verification) {
    return <div className="animate-pulse">Loading verification details...</div>;
  }

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      {/* Verification Header */}
      <div className="border-b p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {verification.institutes.name}
            </h2>
            <p className="text-gray-600">
              {verification.institutes.type} • ID: {verification.id.slice(0, 8)}
            </p>
          </div>
          <Badge className={getStatusColor(verification.status)}>
            {getStatusIcon(verification.status)}
            <span className="ml-1 capitalize">{verification.status.replace('_', ' ')}</span>
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Submitted:</span>
            <p className="font-medium">{formatDate(verification.submitted_at)}</p>
          </div>
          <div>
            <span className="text-gray-500">Priority:</span>
            <p className="font-medium capitalize">{verification.priority_level}</p>
          </div>
          <div>
            <span className="text-gray-500">Documents:</span>
            <p className="font-medium">{verification.document_verifications.length}</p>
          </div>
          <div>
            <span className="text-gray-500">Overall Score:</span>
            <p className="font-medium">{(verification.document_validation_score * 100).toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Verification Content */}
      <div className="p-6 space-y-6">
        {/* Documents Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Documents Review</h3>
          <DocumentReviewSection
            documents={verification.document_verifications}
            onDocumentValidate={(docId) => validateDocuments([docId])}
          />
        </div>

        {/* Workflow Progress */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Verification Progress</h3>
          <WorkflowProgressSection
            steps={verification.verification_workflow_steps}
            currentStatus={verification.status}
          />
        </div>

        {/* Verification Checklist */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Verification Checklist</h3>
          <VerificationChecklist
            items={verification.verification_checklist}
            checkedItems={checklist}
            onItemChange={(itemId, checked) => 
              setChecklist(prev => ({ ...prev, [itemId]: checked }))
            }
          />
        </div>

        {/* Decision Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Verification Decision</h3>
          
          <div className="space-y-4">
            {/* Decision Options */}
            <div className="flex space-x-4">
              <Button
                variant={decision === 'approved' ? 'default' : 'outline'}
                onClick={() => setDecision('approved')}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                variant={decision === 'rejected' ? 'default' : 'outline'}
                onClick={() => setDecision('rejected')}
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                variant={decision === 'requires_additional_info' ? 'default' : 'outline'}
                onClick={() => setDecision('requires_additional_info')}
                className="flex-1"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Request Info
              </Button>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments & Feedback
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add your review comments..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setDecision(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleProcessVerification}
                disabled={!decision || isProcessing || comments.trim().length < 10}
              >
                {isProcessing ? 'Processing...' : `Confirm ${decision?.replace('_', ' ')}`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// components/admin/verification/DocumentReviewSection.tsx
interface DocumentReviewSectionProps {
  documents: DocumentVerification[];
  onDocumentValidate: (documentId: string) => void;
}

export function DocumentReviewSection({ documents, onDocumentValidate }: DocumentReviewSectionProps) {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
        <Badge variant="secondary">
          {documents.length} Documents
        </Badge>
      </div>

      {/* Documents Display */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
        {documents.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            isSelected={selectedDocument === document.id}
            onSelect={() => setSelectedDocument(
              selectedDocument === document.id ? null : document.id
            )}
            onValidate={() => onDocumentValidate(document.id)}
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewerModal
          documentId={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
}

// components/admin/verification/DocumentCard.tsx
interface DocumentCardProps {
  document: DocumentVerification;
  isSelected: boolean;
  onSelect: () => void;
  onValidate: () => void;
  viewMode: 'grid' | 'list';
}

export function DocumentCard({ document, isSelected, onSelect, onValidate, viewMode }: DocumentCardProps) {
  const getVerificationStatusColor = (status: string): string => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'verified': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'requires_resubmission': 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (viewMode === 'list') {
    return (
      <div 
        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={onSelect}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {document.document_name}
            </h4>
            <Badge className={getVerificationStatusColor(document.verification_status)}>
              {document.verification_status}
            </Badge>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>{document.document_type}</span>
            <span className={`font-medium ${getScoreColor(document.authenticity_score)}`}>
              Score: {(document.authenticity_score * 100).toFixed(1)}%
            </span>
            {document.reviewed_at && (
              <span>Reviewed: {formatDate(document.reviewed_at)}</span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          {document.verification_status === 'pending' && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onValidate();
              }}
            >
              Validate
            </Button>
          )}
          <Button size="sm" variant="ghost">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`border rounded-lg cursor-pointer transition-colors ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Document Preview */}
      <div className="aspect-[4/3] bg-gray-100 rounded-t-lg relative overflow-hidden">
        {document.document_url ? (
          <iframe
            src={document.document_url}
            className="w-full h-full"
            title={document.document_name}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <Badge className={getVerificationStatusColor(document.verification_status)}>
            {document.verification_status}
          </Badge>
        </div>
      </div>

      {/* Document Details */}
      <div className="p-4">
        <h4 className="font-medium text-gray-900 mb-2 truncate">
          {document.document_name}
        </h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Type:</span>
            <span className="font-medium">{document.document_type}</span>
          </div>
          <div className="flex justify-between">
            <span>Authenticity:</span>
            <span className={`font-medium ${getScoreColor(document.authenticity_score)}`}>
              {(document.authenticity_score * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Quality:</span>
            <span className={`font-medium ${getScoreColor(document.quality_score)}`}>
              {(document.quality_score * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 mt-4">
          {document.verification_status === 'pending' && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onValidate();
              }}
              className="flex-1"
            >
              Validate
            </Button>
          )}
          <Button size="sm" variant="ghost" className="flex-1">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### State Management

```typescript
// stores/verification-store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface VerificationState {
  verifications: Verification[];
  selectedVerification: string | null;
  metrics: VerificationMetrics;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchVerifications: (filters: VerificationFilters) => Promise<void>;
  processVerification: (id: string, decision: VerificationDecision) => Promise<void>;
  validateDocuments: (documentIds: string[]) => Promise<void>;
  bulkProcessVerifications: (ids: string[], decision: BulkDecision) => Promise<void>;
  updateVerificationStatus: (id: string, status: string) => void;
  setSelectedVerification: (id: string | null) => void;
}

export const useVerificationStore = create<VerificationState>()(
  devtools(
    (set, get) => ({
      verifications: [],
      selectedVerification: null,
      metrics: {
        totalVerifications: 0,
        pendingReview: 0,
        inProgress: 0,
        approved: 0,
        rejected: 0,
        averageProcessingTime: 0,
        approvalRate: 0
      },
      isLoading: false,
      error: null,

      fetchVerifications: async (filters: VerificationFilters) => {
        set({ isLoading: true, error: null });
        
        try {
          const queryParams = new URLSearchParams({
            status: filters.status,
            priority: filters.priority,
            assignedTo: filters.assignee,
            dateRange: filters.dateRange,
            page: filters.page?.toString() || '1',
            limit: filters.limit?.toString() || '20'
          });

          const response = await fetch(`/api/admin/verifications?${queryParams}`);
          if (!response.ok) throw new Error('Failed to fetch verifications');

          const data = await response.json();
          
          set({ 
            verifications: data.data.verifications,
            metrics: data.data.summary,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false 
          });
        }
      },

      processVerification: async (id: string, decision: VerificationDecision) => {
        set({ isLoading: true });

        try {
          const response = await fetch(`/api/admin/verifications/${id}/review`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(decision)
          });

          if (!response.ok) throw new Error('Failed to process verification');

          // Update local state
          set(state => ({
            verifications: state.verifications.map(v => 
              v.id === id 
                ? { ...v, status: decision.decision, decision_date: new Date().toISOString() }
                : v
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false 
          });
        }
      },

      validateDocuments: async (documentIds: string[]) => {
        const { selectedVerification } = get();
        if (!selectedVerification) return;

        try {
          const response = await fetch(
            `/api/admin/verifications/${selectedVerification}/documents/validate`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ documentIds })
            }
          );

          if (!response.ok) throw new Error('Failed to validate documents');

          // Refresh verification data
          await get().fetchVerifications({});
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
      },

      bulkProcessVerifications: async (ids: string[], decision: BulkDecision) => {
        set({ isLoading: true });

        try {
          const response = await fetch('/api/admin/verifications/bulk', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ verificationIds: ids, ...decision })
          });

          if (!response.ok) throw new Error('Failed to process bulk verifications');

          // Refresh data
          await get().fetchVerifications({});
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false 
          });
        }
      },

      updateVerificationStatus: (id: string, status: string) => {
        set(state => ({
          verifications: state.verifications.map(v => 
            v.id === id ? { ...v, status } : v
          )
        }));
      },

      setSelectedVerification: (id: string | null) => {
        set({ selectedVerification: id });
      }
    }),
    {
      name: 'verification-store'
    }
  )
);
```

## 🧪 Testing Requirements

### Component Tests
```typescript
describe('VerificationDashboard', () => {
  test('renders verification queue correctly', async () => {
    const mockVerifications = createMockVerifications();
    render(<VerificationDashboard />, {
      wrapper: createTestWrapper({ verifications: mockVerifications })
    });

    expect(screen.getByText('Institute Verification')).toBeInTheDocument();
    expect(screen.getByText('Verification Queue')).toBeInTheDocument();
    expect(screen.getAllByTestId('verification-card')).toHaveLength(mockVerifications.length);
  });

  test('filters verifications correctly', async () => {
    render(<VerificationDashboard />);

    const statusFilter = screen.getByLabelText('Status');
    fireEvent.change(statusFilter, { target: { value: 'pending_review' } });

    await waitFor(() => {
      expect(mockFetchVerifications).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'pending_review' })
      );
    });
  });

  test('processes verification decision', async () => {
    render(<VerificationDashboard />);
    
    const verificationCard = screen.getByTestId('verification-card-1');
    fireEvent.click(verificationCard);

    const approveButton = screen.getByText('Approve');
    fireEvent.click(approveButton);

    const commentsField = screen.getByPlaceholderText('Add your review comments...');
    fireEvent.change(commentsField, { target: { value: 'Institute meets all requirements' } });

    const confirmButton = screen.getByText('Confirm approved');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockProcessVerification).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          decision: 'approved',
          comments: 'Institute meets all requirements'
        })
      );
    });
  });
});

describe('DocumentReviewSection', () => {
  test('displays documents in grid view', () => {
    const mockDocuments = createMockDocuments();
    render(<DocumentReviewSection documents={mockDocuments} onDocumentValidate={jest.fn()} />);

    expect(screen.getByText('Grid')).toBeInTheDocument();
    expect(screen.getAllByTestId('document-card')).toHaveLength(mockDocuments.length);
  });

  test('validates document when button clicked', async () => {
    const mockOnValidate = jest.fn();
    const mockDocuments = createMockDocuments();
    
    render(
      <DocumentReviewSection 
        documents={mockDocuments} 
        onDocumentValidate={mockOnValidate} 
      />
    );

    const validateButton = screen.getByText('Validate');
    fireEvent.click(validateButton);

    expect(mockOnValidate).toHaveBeenCalledWith(mockDocuments[0].id);
  });
});
```

### Integration Tests
- Verification workflow end-to-end
- Document validation integration
- Email notification integration
- Real-time status updates
- Bulk operation processing

## 📊 Success Metrics
- Admin dashboard load time < 2 seconds
- Document viewer responsiveness < 1 second
- Verification processing completion rate > 95%
- User interface accessibility score > 95%
- Cross-browser compatibility verified

## 📋 Definition of Done
- [ ] Admin verification dashboard functional
- [ ] Document review interface complete
- [ ] Verification workflow management working
- [ ] Decision making interface operational
- [ ] Communication tools integrated
- [ ] Real-time status updates working
- [ ] Mobile responsive design
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Unit tests passing (>90% coverage)
- [ ] Integration tests complete
- [ ] Cross-browser testing verified
- [ ] Performance benchmarks met

## 🔗 Dependencies
- TASK-01-06 (Verification Backend)
- UI component library
- Document viewer library
- Real-time updates system
- Email template system

## ⚡ Performance Optimization
- Virtual scrolling for large verification lists
- Document viewer lazy loading
- Image optimization and caching
- Optimistic UI updates
- Background data refresh

## 📝 Notes
- Implement keyboard shortcuts for power users
- Consider implementing bulk selection UI patterns
- Plan for mobile admin interface
- Prepare for multi-language admin interface
- Design for high-volume verification processing

---

**Task Owner**: Frontend Engineer
**Reviewer**: UX Designer + Tech Lead
**Created**: 2024-01-20
**Due Date**: 2024-02-14