// Shared types across NEET Prep AI Platform - PRD v3 Compliant

export interface Student {
  id: string
  email: string
  fullName: string | null
  phone: string | null
  tier: 'free' | 'premium' | 'enterprise'
  role: 'student' | 'coach' | 'admin'
  referredBy: string | null
  onboardingCompleted: boolean
  preferences: StudentPreferences | null
  createdAt: string
  updatedAt: string
}

export interface StudentPreferences {
  language: string
  culturalContext: string
  learningStyle: {
    visual: number
    auditory: number
    kinesthetic: number
    readingWriting: number
  }
  studyReminders: boolean
  parentalUpdates: boolean
  competitiveFeatures: boolean
}

export interface NEETQuestion {
  id: string
  year: number
  examType: 'NEET' | 'AIPMT' | 'AIIMS'
  subject: 'Physics' | 'Chemistry' | 'Biology'
  chapter: string
  topic: string
  subtopic?: string
  questionText: string
  questionImage?: string
  options: {
    A: string
    B: string
    C: string
    D: string
  }
  correctOption: 'A' | 'B' | 'C' | 'D'
  explanation: {
    text: string
    videoUrl?: string
    diagramUrl?: string
    mnemonicTip?: string
  }
  difficulty: {
    level: number // 1-5 scale
    dynamicRating: number
    cognitiveLoad: 'low' | 'medium' | 'high'
  }
  analytics: {
    averageSolveTime: number
    globalSuccessRate: number
    attemptCount: number
    commonMistakes: string[]
    expertInsights: string[]
  }
  conceptTags: string[]
  ncertReference: {
    class: 11 | 12
    chapter: string
    pageNumber?: number
  }
  relatedQuestions: string[]
  trendingScore: number
  languageSupport: string[]
  accessibility: {
    audioDescription?: string
    screenReaderFriendly: boolean
  }
  createdAt: Date
  updatedAt: Date
}

export interface QuizAttempt {
  id: string
  studentId: string
  quizType: 'practice' | 'mock' | 'topic' | 'custom' | 'challenge'
  questions: number[]
  answers: Record<string, string>
  score: number
  totalQuestions: number
  timeSpent: number
  startedAt: string
  completedAt: string | null
  metadata: {
    difficulty: string
    subjects: string[]
    adaptiveSession: boolean
    predictedScore?: number
  }
}

export interface StudyGroup {
  id: string
  name: string
  description: string | null
  isPrivate: boolean
  maxMembers: number
  inviteCode: string
  createdBy: string
  createdAt: string
  updatedAt: string
  members: GroupMember[]
}

export interface GroupMember {
  studentId: string
  groupId: string
  role: 'admin' | 'moderator' | 'member'
  joinedAt: string
  contributionScore: number
}

// Analytics and Performance Types
export interface PerformanceMetrics {
  studentId: string
  subject: 'Physics' | 'Chemistry' | 'Biology' | 'Overall'
  accuracy: number
  averageTime: number
  streakCount: number
  weakTopics: string[]
  strongTopics: string[]
  predictedNEETScore: number
  confidenceLevel: number
  lastUpdated: Date
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  metadata?: {
    total?: number
    page?: number
    limit?: number
  }
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  metadata: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
