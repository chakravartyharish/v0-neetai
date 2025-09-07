import { track } from '@vercel/analytics'
import { supabase } from '@neet/database'
import type { UserAction } from '../types'

// PRD v3 Specification: Advanced Analytics & Metrics
export class MetricsService {
  /**
   * Track user actions with Vercel Analytics and internal storage
   * PRD v3: Real-time performance tracking
   */
  async trackUserAction(action: UserAction): Promise<void> {
    // Send to Vercel Analytics for real-time insights
    track(action.action, {
      userId: action.userId,
      ...action.properties
    })

    // Store in database for detailed analytics
    await supabase
      .from('user_events')
      .insert({
        user_id: action.userId,
        event_name: action.action,
        event_properties: action.properties || {},
        session_id: action.sessionId,
        created_at: action.timestamp || new Date()
      })
  }

  /**
   * Track quiz performance with detailed analysis
   * PRD v3: Score improvement tracking (40% target)
   */
  async trackQuizCompletion(
    userId: string,
    quizData: {
      quizType: string
      subject: string
      score: number
      totalQuestions: number
      timeSpent: number
      predictedNEETScore?: number
    }
  ): Promise<void> {
    await this.trackUserAction({
      userId,
      action: 'quiz_completed',
      properties: {
        ...quizData,
        accuracy: (quizData.score / quizData.totalQuestions) * 100,
        questionsPerMinute: quizData.totalQuestions / (quizData.timeSpent / 60)
      }
    })

    // Update user progress for predictive analytics
    await this.updateUserProgress(userId, quizData)
  }

  /**
   * Track AI interactions for cost management and performance
   * PRD v3: Cost target <₹50 per student per month
   */
  async trackAIInteraction(
    userId: string,
    interactionData: {
      type: 'explanation' | 'voice' | 'study_plan' | 'doubt_clearing'
      model: string
      responseTime: number
      success: boolean
      tokens?: number
      cost?: number
      satisfactionRating?: number
    }
  ): Promise<void> {
    await this.trackUserAction({
      userId,
      action: 'ai_interaction',
      properties: {
        ...interactionData,
        costEfficiency: interactionData.cost ? interactionData.tokens! / interactionData.cost : null
      }
    })
  }

  /**
   * Generate dashboard metrics for different user types
   * PRD v3: Multi-dimensional analytics (student, parent, educator)
   */
  async getDashboardMetrics(dateRange: { from: Date; to: Date }) {
    const { data: userMetrics } = await supabase.rpc('get_user_metrics', {
      start_date: dateRange.from.toISOString(),
      end_date: dateRange.to.toISOString()
    })

    const { data: quizMetrics } = await supabase.rpc('get_quiz_metrics', {
      start_date: dateRange.from.toISOString(),
      end_date: dateRange.to.toISOString()
    })

    const { data: aiMetrics } = await supabase.rpc('get_ai_usage_metrics', {
      start_date: dateRange.from.toISOString(),
      end_date: dateRange.to.toISOString()
    })

    return {
      users: userMetrics,
      quizzes: quizMetrics,
      ai: aiMetrics,
      performanceTargets: this.getPerformanceTargets()
    }
  }

  /**
   * Performance targets from PRD v3
   */
  private getPerformanceTargets() {
    return {
      scoreImprovement: 40, // % improvement target
      neetPredictionAccuracy: 90, // % accuracy within ±25 points
      studentEngagement: 75, // minutes average session time
      retentionRate: 90, // % monthly retention for premium users
      apiLatency: 100, // ms (95th percentile)
      availability: 99.99 // % uptime
    }
  }

  /**
   * Update user progress for predictive analytics
   */
  private async updateUserProgress(userId: string, quizData: any): Promise<void> {
    await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        subject: quizData.subject,
        total_attempts: supabase.raw('total_attempts + 1'),
        total_correct: supabase.raw(`total_correct + ${quizData.score}`),
        total_time_spent: supabase.raw(`total_time_spent + ${quizData.timeSpent}`),
        last_attempt_at: new Date(),
        predicted_neet_score: quizData.predictedNEETScore
      })
  }
}

export const metricsService = new MetricsService()
