import { ApiResponse, PaginatedResponse } from '@/types';

export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
  retries: number;
}

export interface WebhookConfig {
  url: string;
  secret: string;
  events: string[];
}

export interface SyncOptions {
  batchSize?: number;
  conflictResolution?: 'client' | 'server' | 'merge';
  includeDeleted?: boolean;
}

export class ApiClient {
  private config: ApiConfig;
  private webhooks: Map<string, WebhookConfig> = new Map();
  private retryQueue: Array<{ url: string; options: RequestInit; retries: number }> = [];

  constructor(config: ApiConfig) {
    this.config = config;
  }

  // Core API methods
  async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-API-Source': 'coach-portal',
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        
        // Add to retry queue if retries available
        if (this.config.retries > 0) {
          this.retryQueue.push({
            url,
            options,
            retries: this.config.retries - 1,
          });
        }
        
        return {
          success: false,
          error: error.message,
        };
      }
      
      return {
        success: false,
        error: 'Unknown error occurred',
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Paginated requests
  async getPaginated<T>(
    endpoint: string,
    params: { page?: number; limit?: number; [key: string]: any } = {}
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const url = `${endpoint}?${searchParams.toString()}`;
    return this.get<PaginatedResponse<T>>(url);
  }

  // Question Bank API
  async getQuestions(filters: {
    subject?: string;
    difficulty?: string;
    topic?: string;
    page?: number;
    limit?: number;
  } = {}) {
    return this.getPaginated('/api/v1/questions', filters);
  }

  async createCustomQuestion(questionData: {
    question_text: string;
    options: string[];
    correct_answer: number;
    explanation?: string;
    subject: string;
    difficulty: string;
    topics: string[];
  }) {
    return this.post('/api/v1/questions', questionData);
  }

  async getQuestionBank(bankId: string) {
    return this.get(`/api/v1/question-banks/${bankId}`);
  }

  async createQuestionBank(bankData: {
    name: string;
    description?: string;
    subject: string;
    question_ids: string[];
  }) {
    return this.post('/api/v1/question-banks', bankData);
  }

  // AI Tutoring API
  async generateExplanation(questionId: string, studentAnswer: number) {
    return this.post('/api/v1/ai/explain', {
      question_id: questionId,
      student_answer: studentAnswer,
    });
  }

  async getPersonalizedRecommendations(studentId: string, subject?: string) {
    return this.get(`/api/v1/ai/recommendations/${studentId}${subject ? `?subject=${subject}` : ''}`);
  }

  async createStudyPlan(studentId: string, planData: {
    duration_weeks: number;
    subjects: string[];
    difficulty_preference: string;
    study_hours_per_day: number;
  }) {
    return this.post(`/api/v1/ai/study-plans/${studentId}`, planData);
  }

  async analyzePerformance(studentId: string, timeframe: 'week' | 'month' | 'quarter' = 'month') {
    return this.get(`/api/v1/ai/performance/${studentId}?timeframe=${timeframe}`);
  }

  // Analytics API
  async getStudentAnalytics(studentId: string, dateRange: { start: string; end: string }) {
    return this.get(`/api/v1/analytics/students/${studentId}?start=${dateRange.start}&end=${dateRange.end}`);
  }

  async getBatchAnalytics(batchId: string, metrics: string[] = ['performance', 'engagement', 'progress']) {
    const metricsParam = metrics.join(',');
    return this.get(`/api/v1/analytics/batches/${batchId}?metrics=${metricsParam}`);
  }

  async getInstituteMetrics(instituteId: string) {
    return this.get(`/api/v1/analytics/institutes/${instituteId}`);
  }

  async generateReport(reportType: string, filters: any) {
    return this.post('/api/v1/analytics/reports', {
      type: reportType,
      filters,
    });
  }

  // Content API
  async getStudyMaterials(filters: {
    subject?: string;
    difficulty?: string;
    content_type?: string;
    batch_id?: string;
    page?: number;
    limit?: number;
  } = {}) {
    return this.getPaginated('/api/v1/content/materials', filters);
  }

  async uploadStudyMaterial(materialData: FormData) {
    return this.request('/api/v1/content/upload', {
      method: 'POST',
      body: materialData,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'X-API-Source': 'coach-portal',
      },
    });
  }

  async getLiveClasses(filters: {
    teacher_id?: string;
    batch_id?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
  } = {}) {
    return this.getPaginated('/api/v1/content/live-classes', filters);
  }

  async scheduleClass(classData: {
    title: string;
    description?: string;
    batch_id: string;
    teacher_id: string;
    scheduled_at: string;
    duration_minutes: number;
    meeting_link?: string;
  }) {
    return this.post('/api/v1/content/live-classes', classData);
  }

  // Data Synchronization
  async syncData(dataType: string, options: SyncOptions = {}) {
    const { batchSize = 100, conflictResolution = 'server', includeDeleted = false } = options;
    
    return this.post('/api/v1/sync', {
      data_type: dataType,
      batch_size: batchSize,
      conflict_resolution: conflictResolution,
      include_deleted: includeDeleted,
    });
  }

  async getSyncStatus(syncId: string) {
    return this.get(`/api/v1/sync/${syncId}/status`);
  }

  async batchSync(dataTypes: string[], options: SyncOptions = {}) {
    const syncPromises = dataTypes.map(type => this.syncData(type, options));
    return Promise.allSettled(syncPromises);
  }

  // Webhook Management
  registerWebhook(name: string, config: WebhookConfig) {
    this.webhooks.set(name, config);
  }

  async setupWebhooks() {
    const webhookPromises = Array.from(this.webhooks.entries()).map(
      ([name, config]) => this.post('/api/v1/webhooks', {
        name,
        url: config.url,
        events: config.events,
        secret: config.secret,
      })
    );

    return Promise.allSettled(webhookPromises);
  }

  async handleWebhook(payload: any, signature: string, webhookName: string): Promise<boolean> {
    const webhook = this.webhooks.get(webhookName);
    if (!webhook) {
      throw new Error(`Webhook ${webhookName} not found`);
    }

    // Verify webhook signature
    const crypto = await import('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', webhook.secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (signature !== `sha256=${expectedSignature}`) {
      throw new Error('Invalid webhook signature');
    }

    // Process webhook event
    return this.processWebhookEvent(payload, webhook);
  }

  private async processWebhookEvent(payload: any, webhook: WebhookConfig): Promise<boolean> {
    try {
      // Handle different event types
      switch (payload.event_type) {
        case 'student.created':
        case 'student.updated':
        case 'student.deleted':
          await this.syncData('students', { batchSize: 1 });
          break;
        
        case 'test.completed':
          await this.syncData('test_attempts', { batchSize: 10 });
          break;
        
        case 'analytics.updated':
          await this.syncData('analytics', { batchSize: 50 });
          break;
        
        default:
          console.warn(`Unhandled webhook event: ${payload.event_type}`);
      }

      return true;
    } catch (error) {
      console.error('Error processing webhook event:', error);
      return false;
    }
  }

  // Error Handling and Retry Logic
  async processRetryQueue() {
    const failures: Array<{ url: string; error: string }> = [];
    
    while (this.retryQueue.length > 0) {
      const item = this.retryQueue.shift();
      if (!item) continue;

      try {
        const response = await fetch(item.url, item.options);
        if (!response.ok && item.retries > 0) {
          this.retryQueue.push({
            ...item,
            retries: item.retries - 1,
          });
        } else if (!response.ok) {
          failures.push({
            url: item.url,
            error: `${response.status} ${response.statusText}`,
          });
        }
      } catch (error) {
        if (item.retries > 0) {
          this.retryQueue.push({
            ...item,
            retries: item.retries - 1,
          });
        } else {
          failures.push({
            url: item.url,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    }

    return failures;
  }

  // Health Check
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, boolean>;
    latency: number;
  }> {
    const startTime = Date.now();
    const services = {
      api: false,
      questions: false,
      ai_tutoring: false,
      analytics: false,
      content: false,
    };

    try {
      // Check main API
      const apiResponse = await this.get('/api/v1/health');
      services.api = apiResponse.success;

      // Check question bank service
      const questionsResponse = await this.get('/api/v1/questions/health');
      services.questions = questionsResponse.success;

      // Check AI tutoring service
      const aiResponse = await this.get('/api/v1/ai/health');
      services.ai_tutoring = aiResponse.success;

      // Check analytics service
      const analyticsResponse = await this.get('/api/v1/analytics/health');
      services.analytics = analyticsResponse.success;

      // Check content service
      const contentResponse = await this.get('/api/v1/content/health');
      services.content = contentResponse.success;

      const latency = Date.now() - startTime;
      const healthyServices = Object.values(services).filter(Boolean).length;
      const totalServices = Object.keys(services).length;

      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      if (healthyServices === 0) {
        status = 'unhealthy';
      } else if (healthyServices < totalServices) {
        status = 'degraded';
      }

      return { status, services, latency };
    } catch (error) {
      return {
        status: 'unhealthy',
        services,
        latency: Date.now() - startTime,
      };
    }
  }
}

// Default client instance
export const apiClient = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.neetai.com',
  apiKey: process.env.API_KEY || '',
  timeout: 30000,
  retries: 3,
});

// Webhook endpoints for the coach portal
export const setupCoachPortalWebhooks = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  apiClient.registerWebhook('student_sync', {
    url: `${baseUrl}/api/webhooks/student-sync`,
    secret: process.env.WEBHOOK_SECRET || 'default-secret',
    events: ['student.created', 'student.updated', 'student.deleted'],
  });

  apiClient.registerWebhook('test_sync', {
    url: `${baseUrl}/api/webhooks/test-sync`,
    secret: process.env.WEBHOOK_SECRET || 'default-secret',
    events: ['test.completed', 'test.scored', 'assignment.submitted'],
  });

  apiClient.registerWebhook('analytics_sync', {
    url: `${baseUrl}/api/webhooks/analytics-sync`,
    secret: process.env.WEBHOOK_SECRET || 'default-secret',
    events: ['analytics.updated', 'performance.calculated', 'insights.generated'],
  });

  return apiClient.setupWebhooks();
};

export default apiClient;