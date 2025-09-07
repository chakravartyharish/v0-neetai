// Analytics Types - PRD v3 Requirements

export interface UserAction {
  userId: string
  action: string
  properties?: Record<string, any>
  timestamp?: Date
  sessionId?: string
}

export interface MetricsData {
  userMetrics: {
    totalRegistrations: number
    monthlyActiveUsers: number
    premiumConversions: number
    retentionRates: {
      day1: number
      day7: number
      day30: number
      month3: number
    }
  }
  quizMetrics: {
    totalAttempts: number
    averageScore: number
    completionRate: number
    averageTimeSpent: number
  }
  aiMetrics: {
    totalInteractions: number
    averageResponseTime: number
    userSatisfaction: number
    costPerInteraction: number
  }
}
