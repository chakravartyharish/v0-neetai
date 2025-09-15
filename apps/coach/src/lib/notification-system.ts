import { Notification, NotificationType, NotificationPriority, CommunicationType } from '@/types';

export interface NotificationChannel {
  type: CommunicationType;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface NotificationPreferences {
  user_id: string;
  channels: NotificationChannel[];
  global_enabled: boolean;
  quiet_hours: {
    start: string; // HH:mm format
    end: string;   // HH:mm format
    timezone: string;
  };
  frequency_limits: {
    max_per_hour: number;
    max_per_day: number;
  };
  type_preferences: Record<NotificationType, boolean>;
  priority_thresholds: {
    email: NotificationPriority;
    sms: NotificationPriority;
    push: NotificationPriority;
  };
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  channels: CommunicationType[];
  subject_template: string;
  content_template: string;
  variables: string[];
  institute_customizable: boolean;
}

export interface BulkNotificationRequest {
  recipients: Array<{
    user_id: string;
    recipient_type: 'student' | 'teacher' | 'parent' | 'admin';
    custom_data?: Record<string, any>;
  }>;
  template_id?: string;
  custom_content?: {
    subject: string;
    message: string;
  };
  channels: CommunicationType[];
  scheduled_at?: string;
  priority: NotificationPriority;
  institute_id: string;
}

export interface NotificationLog {
  id: string;
  notification_id: string;
  recipient_id: string;
  channel: CommunicationType;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read';
  sent_at?: string;
  delivered_at?: string;
  read_at?: string;
  error_message?: string;
  retry_count: number;
  metadata?: Record<string, any>;
}

class NotificationSystem {
  private static instance: NotificationSystem;
  private templates: Map<string, NotificationTemplate> = new Map();
  private preferences: Map<string, NotificationPreferences> = new Map();
  private rateLimits: Map<string, { count: number; resetTime: number }> = new Map();

  private constructor() {
    this.initializeDefaultTemplates();
  }

  public static getInstance(): NotificationSystem {
    if (!NotificationSystem.instance) {
      NotificationSystem.instance = new NotificationSystem();
    }
    return NotificationSystem.instance;
  }

  private initializeDefaultTemplates(): void {
    const defaultTemplates: NotificationTemplate[] = [
      {
        id: 'student_enrollment',
        name: 'Student Enrollment Confirmation',
        type: 'announcement',
        channels: ['email', 'sms', 'in_app'],
        subject_template: 'Welcome to {{institute_name}} - Enrollment Confirmed',
        content_template: `
          Dear {{student_name}},
          
          Welcome to {{institute_name}}! Your enrollment has been confirmed.
          
          Batch: {{batch_name}}
          Start Date: {{start_date}}
          
          Login to your portal: {{portal_url}}
          
          Best regards,
          {{institute_name}} Team
        `,
        variables: ['student_name', 'institute_name', 'batch_name', 'start_date', 'portal_url'],
        institute_customizable: true,
      },
      {
        id: 'test_reminder',
        name: 'Test Reminder',
        type: 'reminder',
        channels: ['email', 'sms', 'in_app', 'whatsapp'],
        subject_template: 'Reminder: {{test_name}} tomorrow at {{test_time}}',
        content_template: `
          Hi {{student_name}},
          
          This is a reminder that you have a test scheduled:
          
          Test: {{test_name}}
          Date: {{test_date}}
          Time: {{test_time}}
          Duration: {{duration}} minutes
          
          Please be prepared and join on time.
          
          Good luck!
          {{institute_name}}
        `,
        variables: ['student_name', 'test_name', 'test_date', 'test_time', 'duration', 'institute_name'],
        institute_customizable: true,
      },
      {
        id: 'performance_alert',
        name: 'Performance Alert',
        type: 'alert',
        channels: ['email', 'in_app'],
        subject_template: 'Performance Alert: {{student_name}} - {{alert_type}}',
        content_template: `
          Dear {{parent_name}},
          
          We wanted to inform you about {{student_name}}'s recent performance:
          
          Alert: {{alert_message}}
          Current Score: {{current_score}}%
          Class Average: {{class_average}}%
          
          Recommended Actions:
          {{recommendations}}
          
          Please feel free to contact us to discuss.
          
          Best regards,
          {{teacher_name}}
          {{institute_name}}
        `,
        variables: ['parent_name', 'student_name', 'alert_message', 'current_score', 'class_average', 'recommendations', 'teacher_name', 'institute_name'],
        institute_customizable: true,
      },
      {
        id: 'payment_reminder',
        name: 'Payment Reminder',
        type: 'reminder',
        channels: ['email', 'sms'],
        subject_template: 'Payment Reminder - {{invoice_number}}',
        content_template: `
          Dear {{student_name}},
          
          This is a friendly reminder that your payment is due:
          
          Invoice: {{invoice_number}}
          Amount: {{amount}}
          Due Date: {{due_date}}
          
          Please make the payment at your earliest convenience.
          
          Pay online: {{payment_url}}
          
          Thank you,
          {{institute_name}} Accounts Team
        `,
        variables: ['student_name', 'invoice_number', 'amount', 'due_date', 'payment_url', 'institute_name'],
        institute_customizable: false,
      },
    ];

    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  // Template Management
  public getTemplate(templateId: string): NotificationTemplate | undefined {
    return this.templates.get(templateId);
  }

  public getAllTemplates(): NotificationTemplate[] {
    return Array.from(this.templates.values());
  }

  public createCustomTemplate(template: Omit<NotificationTemplate, 'id'>): string {
    const id = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.templates.set(id, { ...template, id });
    return id;
  }

  public updateTemplate(templateId: string, updates: Partial<NotificationTemplate>): boolean {
    const template = this.templates.get(templateId);
    if (!template) return false;

    this.templates.set(templateId, { ...template, ...updates });
    return true;
  }

  // Preference Management
  public getUserPreferences(userId: string): NotificationPreferences | undefined {
    return this.preferences.get(userId);
  }

  public setUserPreferences(preferences: NotificationPreferences): void {
    this.preferences.set(preferences.user_id, preferences);
  }

  public getDefaultPreferences(userId: string): NotificationPreferences {
    return {
      user_id: userId,
      channels: [
        { type: 'in_app', enabled: true },
        { type: 'email', enabled: true },
        { type: 'sms', enabled: false },
        { type: 'whatsapp', enabled: false },
      ],
      global_enabled: true,
      quiet_hours: {
        start: '22:00',
        end: '08:00',
        timezone: 'Asia/Kolkata',
      },
      frequency_limits: {
        max_per_hour: 5,
        max_per_day: 20,
      },
      type_preferences: {
        announcement: true,
        reminder: true,
        alert: true,
        achievement: true,
        system: true,
      },
      priority_thresholds: {
        email: 'medium',
        sms: 'high',
        push: 'low',
      },
    };
  }

  // Rate Limiting
  private checkRateLimit(userId: string, preferences: NotificationPreferences): boolean {
    const now = Date.now();
    const hourKey = `${userId}_hour_${Math.floor(now / (60 * 60 * 1000))}`;
    const dayKey = `${userId}_day_${Math.floor(now / (24 * 60 * 60 * 1000))}`;

    // Check hourly limit
    const hourlyLimit = this.rateLimits.get(hourKey);
    if (hourlyLimit && hourlyLimit.count >= preferences.frequency_limits.max_per_hour) {
      return false;
    }

    // Check daily limit
    const dailyLimit = this.rateLimits.get(dayKey);
    if (dailyLimit && dailyLimit.count >= preferences.frequency_limits.max_per_day) {
      return false;
    }

    // Update counters
    this.rateLimits.set(hourKey, { 
      count: (hourlyLimit?.count || 0) + 1, 
      resetTime: now + 60 * 60 * 1000 
    });
    this.rateLimits.set(dayKey, { 
      count: (dailyLimit?.count || 0) + 1, 
      resetTime: now + 24 * 60 * 60 * 1000 
    });

    return true;
  }

  // Quiet Hours Check
  private isInQuietHours(preferences: NotificationPreferences): boolean {
    const now = new Date();
    const timezone = preferences.quiet_hours.timezone || 'Asia/Kolkata';
    
    // Convert to user's timezone
    const userTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const currentHour = userTime.getHours();
    const currentMinute = userTime.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const [startHour, startMinute] = preferences.quiet_hours.start.split(':').map(Number);
    const [endHour, endMinute] = preferences.quiet_hours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    if (startTime <= endTime) {
      // Same day quiet hours (e.g., 22:00 - 23:00)
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Overnight quiet hours (e.g., 22:00 - 08:00)
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  // Template Rendering
  private renderTemplate(template: NotificationTemplate, variables: Record<string, any>): {
    subject: string;
    content: string;
  } {
    let subject = template.subject_template;
    let content = template.content_template;

    // Replace variables in template
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      subject = subject.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(value));
      content = content.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(value));
    });

    return { subject, content };
  }

  // Single Notification
  public async sendNotification(
    recipientId: string,
    notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>
  ): Promise<{ success: boolean; message: string; logs: NotificationLog[] }> {
    const preferences = this.preferences.get(recipientId) || this.getDefaultPreferences(recipientId);
    const logs: NotificationLog[] = [];

    // Check if notifications are globally enabled
    if (!preferences.global_enabled) {
      return {
        success: false,
        message: 'Notifications disabled for user',
        logs,
      };
    }

    // Check notification type preference
    if (!preferences.type_preferences[notification.type]) {
      return {
        success: false,
        message: `${notification.type} notifications disabled for user`,
        logs,
      };
    }

    // Check rate limits
    if (!this.checkRateLimit(recipientId, preferences)) {
      return {
        success: false,
        message: 'Rate limit exceeded',
        logs,
      };
    }

    // Check quiet hours for non-urgent notifications
    if (notification.priority !== 'urgent' && this.isInQuietHours(preferences)) {
      // Schedule for later (after quiet hours end)
      return {
        success: true,
        message: 'Notification scheduled after quiet hours',
        logs,
      };
    }

    // Determine which channels to use based on priority and preferences
    const channelsToUse = preferences.channels.filter(channel => {
      return channel.enabled && 
             this.shouldUseChannel(channel.type, notification.priority, preferences);
    });

    if (channelsToUse.length === 0) {
      return {
        success: false,
        message: 'No enabled channels for this notification priority',
        logs,
      };
    }

    // Send through each enabled channel
    const results = await Promise.allSettled(
      channelsToUse.map(channel => this.sendThroughChannel(
        recipientId,
        notification,
        channel.type,
        channel.config
      ))
    );

    results.forEach((result, index) => {
      const channel = channelsToUse[index];
      const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      if (result.status === 'fulfilled') {
        logs.push({
          id: logId,
          notification_id: `notif_${Date.now()}`,
          recipient_id: recipientId,
          channel: channel.type,
          status: 'sent',
          sent_at: new Date().toISOString(),
          retry_count: 0,
          metadata: result.value.metadata,
        });
      } else {
        logs.push({
          id: logId,
          notification_id: `notif_${Date.now()}`,
          recipient_id: recipientId,
          channel: channel.type,
          status: 'failed',
          error_message: result.reason.message,
          retry_count: 0,
        });
      }
    });

    const successfulSends = logs.filter(log => log.status === 'sent').length;
    
    return {
      success: successfulSends > 0,
      message: `Sent through ${successfulSends}/${channelsToUse.length} channels`,
      logs,
    };
  }

  private shouldUseChannel(
    channel: CommunicationType,
    priority: NotificationPriority,
    preferences: NotificationPreferences
  ): boolean {
    const thresholdMap: Record<NotificationPriority, number> = {
      low: 1,
      medium: 2,
      high: 3,
      urgent: 4,
    };

    const requiredThreshold = thresholdMap[priority];
    const channelThreshold = thresholdMap[preferences.priority_thresholds[channel as keyof typeof preferences.priority_thresholds] || 'medium'];

    return requiredThreshold >= channelThreshold;
  }

  private async sendThroughChannel(
    recipientId: string,
    notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>,
    channel: CommunicationType,
    config?: Record<string, any>
  ): Promise<{ success: boolean; metadata?: Record<string, any> }> {
    // Mock implementation - replace with actual service integrations
    switch (channel) {
      case 'email':
        return this.sendEmail(recipientId, notification, config);
      case 'sms':
        return this.sendSMS(recipientId, notification, config);
      case 'whatsapp':
        return this.sendWhatsApp(recipientId, notification, config);
      case 'in_app':
        return this.sendInApp(recipientId, notification);
      default:
        throw new Error(`Unsupported channel: ${channel}`);
    }
  }

  private async sendEmail(
    recipientId: string,
    notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>,
    config?: Record<string, any>
  ): Promise<{ success: boolean; metadata?: Record<string, any> }> {
    // Mock email service integration
    console.log(`Sending email to ${recipientId}:`, notification.title);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      success: true,
      metadata: {
        email_id: `email_${Date.now()}`,
        provider: 'sendgrid',
      },
    };
  }

  private async sendSMS(
    recipientId: string,
    notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>,
    config?: Record<string, any>
  ): Promise<{ success: boolean; metadata?: Record<string, any> }> {
    // Mock SMS service integration
    console.log(`Sending SMS to ${recipientId}:`, notification.title);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 150));
    
    return {
      success: true,
      metadata: {
        sms_id: `sms_${Date.now()}`,
        provider: 'twilio',
      },
    };
  }

  private async sendWhatsApp(
    recipientId: string,
    notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>,
    config?: Record<string, any>
  ): Promise<{ success: boolean; metadata?: Record<string, any> }> {
    // Mock WhatsApp service integration
    console.log(`Sending WhatsApp to ${recipientId}:`, notification.title);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      success: true,
      metadata: {
        whatsapp_id: `wa_${Date.now()}`,
        provider: 'whatsapp-business-api',
      },
    };
  }

  private async sendInApp(
    recipientId: string,
    notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>
  ): Promise<{ success: boolean; metadata?: Record<string, any> }> {
    // Mock in-app notification storage
    console.log(`Storing in-app notification for ${recipientId}:`, notification.title);
    
    // In a real implementation, this would store in database
    // and potentially use WebSocket/SSE for real-time delivery
    
    return {
      success: true,
      metadata: {
        stored_at: new Date().toISOString(),
      },
    };
  }

  // Bulk Notifications
  public async sendBulkNotification(request: BulkNotificationRequest): Promise<{
    success: boolean;
    total_recipients: number;
    successful_sends: number;
    failed_sends: number;
    logs: NotificationLog[];
  }> {
    const allLogs: NotificationLog[] = [];
    let successfulSends = 0;
    let failedSends = 0;

    const template = request.template_id ? this.getTemplate(request.template_id) : null;

    // Process each recipient
    const results = await Promise.allSettled(
      request.recipients.map(async (recipient) => {
        let notificationContent: { title: string; message: string };

        if (template && recipient.custom_data) {
          const rendered = this.renderTemplate(template, recipient.custom_data);
          notificationContent = {
            title: rendered.subject,
            message: rendered.content,
          };
        } else if (request.custom_content) {
          notificationContent = {
            title: request.custom_content.subject,
            message: request.custom_content.message,
          };
        } else {
          throw new Error('No content source provided');
        }

        const notification: Omit<Notification, 'id' | 'created_at' | 'is_read'> = {
          institute_id: request.institute_id,
          recipient_id: recipient.user_id,
          recipient_type: recipient.recipient_type,
          title: notificationContent.title,
          message: notificationContent.message,
          type: template?.type || 'announcement',
          priority: request.priority,
          scheduled_at: request.scheduled_at,
        };

        return this.sendNotification(recipient.user_id, notification);
      })
    );

    // Aggregate results
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        if (result.value.success) {
          successfulSends++;
        } else {
          failedSends++;
        }
        allLogs.push(...result.value.logs);
      } else {
        failedSends++;
      }
    });

    return {
      success: successfulSends > 0,
      total_recipients: request.recipients.length,
      successful_sends: successfulSends,
      failed_sends: failedSends,
      logs: allLogs,
    };
  }

  // Notification History and Analytics
  public getNotificationLogs(filters: {
    recipient_id?: string;
    institute_id?: string;
    channel?: CommunicationType;
    status?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
  }): NotificationLog[] {
    // Mock implementation - in reality, this would query a database
    return [];
  }

  public getNotificationAnalytics(instituteId: string, dateRange: { start: string; end: string }): {
    total_sent: number;
    delivery_rate: number;
    read_rate: number;
    channel_breakdown: Record<CommunicationType, number>;
    type_breakdown: Record<NotificationType, number>;
    failed_reasons: Record<string, number>;
  } {
    // Mock analytics - in reality, this would aggregate from logs
    return {
      total_sent: 1250,
      delivery_rate: 0.97,
      read_rate: 0.75,
      channel_breakdown: {
        email: 800,
        sms: 200,
        in_app: 1250,
        whatsapp: 150,
      },
      type_breakdown: {
        announcement: 300,
        reminder: 500,
        alert: 200,
        achievement: 150,
        system: 100,
      },
      failed_reasons: {
        'Invalid phone number': 5,
        'Email bounced': 8,
        'Rate limit exceeded': 12,
      },
    };
  }
}

// Export singleton instance
export const notificationSystem = NotificationSystem.getInstance();

export default NotificationSystem;