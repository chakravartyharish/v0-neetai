// AI Types aligned with PRD v3 specifications

export interface StudentAbilityProfile {
  overallAbility: number // IRT theta parameter
  subjectAbilities: {
    Physics: number
    Chemistry: number
    Biology: number
  }
  learningStyle: LearningStyleProfile
  emotionalState: EmotionalMetrics
  cognitiveLoad: 'low' | 'medium' | 'high'
}

export interface LearningStyleProfile {
  visualLearner: number // 0-1 score
  auditoryLearner: number
  kinestheticLearner: number
  readingWritingLearner: number
  preferredPace: 'slow' | 'medium' | 'fast'
  attentionSpan: number // minutes
}

export interface EmotionalMetrics {
  stressLevel: number // 0-1 scale
  motivationLevel: number
  confidenceLevel: number
  frustrationLevel: number
  engagementScore: number
  lastUpdated: Date
}

export interface MultimodalExplanation {
  textExplanation: string
  audioExplanation?: AudioFile
  visualDiagram?: DiagramData
  videoExplanation?: VideoData
  interactiveElements?: InteractiveComponent[]
  mnemonicDevices?: MnemonicData[]
  realWorldExamples: Example[]
  commonMistakes: MistakeAnalysis[]
  nextSteps: StudyRecommendation[]
  culturalContext: CulturalContext
}

export interface AIModelConfig {
  primaryModel: 'GPT-4o-2024-11-20'
  specializedModels: {
    'physics-expert': string
    'chemistry-expert': string
    'biology-expert': string
    'hindi-expert': string
    'emotional-intelligence': string
  }
  modelRouting: ModelRoutingStrategy
}

export interface ModelRoutingStrategy {
  determineModel(context: QueryContext): string
  fallbackModel: string
  loadBalancing: 'round-robin' | 'least-latency' | 'cost-optimized'
}

export interface QueryContext {
  subject: 'Physics' | 'Chemistry' | 'Biology'
  questionType: 'explanation' | 'doubt' | 'study-plan' | 'voice-interaction'
  studentProfile: StudentAbilityProfile
  language: string
  culturalContext: string
}
