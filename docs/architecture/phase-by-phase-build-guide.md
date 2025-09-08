# Phase-by-Phase Build Guide

## Phase 1: Foundation Setup (Months 1-2)

**Objective**: Establish the core infrastructure and development environment.

### Step 1: Monorepo Initialization

```bash
# Initialize the monorepo
npx create-turbo@latest neet-prep-platform
cd neet-prep-platform

# Install dependencies
npm install

# Add required dependencies
npm install @vercel/ai @vercel/analytics @vercel/kv @vercel/blob
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install framer-motion zustand @tanstack/react-query
npm install tailwindcss @headlessui/react lucide-react
```


### Step 2: Setup Core Packages

**packages/config/package.json**

```json
{
  "name": "@neet/config",
  "version": "0.0.0",
  "main": "./index.ts",
  "types": "./index.ts",
  "dependencies": {
    "@vercel/ai": "^2.2.0"
  }
}
```

**packages/config/index.ts**

```typescript
export const config = {
  app: {
    name: 'NEET Prep AI',
    description: 'AI-powered NEET preparation platform',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  ai: {
    openaiApiKey: process.env.OPENAI_API_KEY!,
  },
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    secretKey: process.env.STRIPE_SECRET_KEY!,
  },
} as const

export type Config = typeof config
```


### Step 3: Database Package Setup

**packages/database/package.json**

```json
{
  "name": "@neet/database",
  "version": "0.0.0",
  "main": "./index.ts",
  "types": "./index.ts",
  "dependencies": {
    "@supabase/supabase-js": "^2.38.0",
    "@neet/config": "*"
  }
}
```

**packages/database/client.ts**

```typescript
import { createClient } from '@supabase/supabase-js'
import { config } from '@neet/config'
import type { Database } from './types'

export const supabase = createClient<Database>(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
)

export type SupabaseClient = typeof supabase
```

**packages/database/types.ts**

```typescript
export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          tier: 'free' | 'premium' | 'enterprise'
          role: 'student' | 'coach' | 'admin'
          referred_by: string | null
          onboarding_completed: boolean
          preferences: Record<string, any> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          phone?: string | null
          tier?: 'free' | 'premium' | 'enterprise'
          role?: 'student' | 'coach' | 'admin'
          referred_by?: string | null
          onboarding_completed?: boolean
          preferences?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          tier?: 'free' | 'premium' | 'enterprise'
          role?: 'student' | 'coach' | 'admin'
          referred_by?: string | null
          onboarding_completed?: boolean
          preferences?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
      }
      neet_questions: {
        Row: {
          id: number
          year: number
          subject: 'Physics' | 'Chemistry' | 'Biology'
          chapter: string
          topic: string
          question_text: string
          options: Record<string, string>
          correct_option: 'A' | 'B' | 'C' | 'D'
          explanation: string
          difficulty_level: number
          concept_tags: string[]
          metadata: Record<string, any> | null
          created_at: string
        }
        Insert: {
          id?: number
          year: number
          subject: 'Physics' | 'Chemistry' | 'Biology'
          chapter: string
          topic: string
          question_text: string
          options: Record<string, string>
          correct_option: 'A' | 'B' | 'C' | 'D'
          explanation: string
          difficulty_level?: number
          concept_tags?: string[]
          metadata?: Record<string, any> | null
          created_at?: string
        }
        Update: {
          id?: number
          year?: number
          subject?: 'Physics' | 'Chemistry' | 'Biology'
          chapter?: string
          topic?: string
          question_text?: string
          options?: Record<string, string>
          correct_option?: 'A' | 'B' | 'C' | 'D'
          explanation?: string
          difficulty_level?: number
          concept_tags?: string[]
          metadata?: Record<string, any> | null
          created_at?: string
        }
      }
      // Add more tables as needed
    }
    Views: {
      // Define views here
    }
    Functions: {
      // Define functions here
    }
    Enums: {
      // Define enums here
    }
  }
}
```


### Step 4: UI Package Setup

**packages/ui/package.json**

```json
{
  "name": "@neet/ui",
  "version": "0.0.0",
  "main": "./index.tsx",
  "types": "./index.tsx",
  "dependencies": {
    "react": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "@headlessui/react": "^1.7.0",
    "lucide-react": "^0.290.0",
    "framer-motion": "^10.16.0"
  },
  "peerDependencies": {
    "react": "^18.2.0"
  }
}
```

**packages/ui/components/button.tsx**

```typescript
'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '../utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    disabled,
    children, 
    ...props 
  }, ref) => {
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
      outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
      ghost: 'hover:bg-gray-100 text-gray-700'
    }

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-12 px-6 py-3 text-lg'
    }

    return (
      <motion.button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.02 }}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
```


### Step 5: Auth Package Setup

**packages/auth/package.json**

```json
{
  "name": "@neet/auth",
  "version": "0.0.0",
  "main": "./index.ts",
  "types": "./index.ts",
  "dependencies": {
    "@supabase/auth-helpers-nextjs": "^0.8.0",
    "@supabase/supabase-js": "^2.38.0",
    "@neet/database": "*",
    "react": "^18.2.0"
  }
}
```

**packages/auth/hooks/use-auth.ts**

```typescript
'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@neet/database'

export interface AuthState {
  user: User | null
  loading: boolean
  error: Error | null
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setState({ user: null, loading: false, error })
          return
        }

        setState({ user: session?.user ?? null, loading: false, error: null })
      } catch (error) {
        setState({ user: null, loading: false, error: error as Error })
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState({ user: session?.user ?? null, loading: false, error: null })
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return state
}
```


### Step 6: Basic Web App Setup

**apps/web/package.json**

```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@neet/ui": "*",
    "@neet/database": "*",
    "@neet/auth": "*",
    "@neet/config": "*",
    "@vercel/analytics": "^1.1.0",
    "@vercel/speed-insights": "^1.0.0"
  }
}
```

**apps/web/app/layout.tsx**

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NEET Prep AI - AI-Powered Medical Entrance Preparation',
  description: 'Transform your NEET preparation with AI-powered personalized learning, comprehensive question banks, and social study features.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```


## Phase 2: Core Learning Features (Months 3-4)

**Objective**: Implement the core educational components.

### Step 1: AI Package Development

**packages/ai/package.json**

```json
{
  "name": "@neet/ai",
  "version": "0.0.0",
  "main": "./index.ts",
  "types": "./index.ts",
  "dependencies": {
    "@vercel/ai": "^2.2.0",
    "openai": "^4.0.0",
    "@neet/config": "*",
    "zod": "^3.22.0"
  }
}
```

**packages/ai/services/explanation-service.ts**

```typescript
import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'

const ExplanationSchema = z.object({
  correctAnswerReasoning: z.string().describe('2-3 sentences explaining why the correct answer is right'),
  incorrectOptionsAnalysis: z.array(z.object({
    option: z.enum(['A', 'B', 'C', 'D']),
    reason: z.string().describe('Why this option is incorrect')
  })),
  conceptReview: z.string().describe('Key concepts needed to understand this question'),
  memoryTip: z.string().optional().describe('Mnemonic or memory technique if applicable'),
  relatedTopics: z.array(z.string()).describe('Related topics for further study'),
  difficulty: z.enum(['basic', 'intermediate', 'advanced']),
  confidence: z.number().min(0).max(1).describe('AI confidence in the explanation')
})

export type Explanation = z.infer<typeof ExplanationSchema>

export class ExplanationService {
  async generateExplanation(
    questionText: string,
    options: Record<string, string>,
    correctOption: string,
    subject: string,
    studentLevel?: string
  ): Promise<Explanation> {
    const prompt = `You are NEET Buddy, an expert NEET tutor for ${subject}. 
    
Question: ${questionText}
Options: ${Object.entries(options).map(([key, value]) => `${key}: ${value}`).join('\n')}
Correct Answer: ${correctOption}
Student Level: ${studentLevel || 'intermediate'}

Provide a comprehensive explanation that helps the student understand not just the correct answer, but why other options are wrong and the underlying concepts.`

    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: ExplanationSchema,
      prompt,
      temperature: 0.3,
    })

    return object
  }

  async generateStudyPlan(
    weakAreas: string[],
    timeAvailable: number, // hours per day
    targetScore: number,
    currentLevel: Record<string, number>
  ) {
    // Implementation for AI-generated study plans
  }
}

export const explanationService = new ExplanationService()
```


### Step 2: Question Bank Implementation

**packages/database/queries/questions.ts**

```typescript
import { supabase } from '../client'
import type { Database } from '../types'

type Question = Database['public']['Tables']['neet_questions']['Row']
type QuestionInsert = Database['public']['Tables']['neet_questions']['Insert']

export interface QuestionFilters {
  subjects?: string[]
  years?: number[]
  topics?: string[]
  difficulty?: [number, number]
  limit?: number
  offset?: number
}

export class QuestionService {
  async getQuestions(filters: QuestionFilters = {}) {
    let query = supabase
      .from('neet_questions')
      .select('*')

    // Apply filters
    if (filters.subjects?.length) {
      query = query.in('subject', filters.subjects)
    }

    if (filters.years?.length) {
      query = query.in('year', filters.years)
    }

    if (filters.topics?.length) {
      query = query.in('topic', filters.topics)
    }

    if (filters.difficulty) {
      query = query
        .gte('difficulty_level', filters.difficulty[^0])
        .lte('difficulty_level', filters.difficulty[^1])
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1)
    }

    const { data, error, count } = await query

    if (error) throw error

    return { questions: data || [], total: count || 0 }
  }

  async getQuestion(id: number) {
    const { data, error } = await supabase
      .from('neet_questions')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  async searchQuestions(searchTerm: string, filters: QuestionFilters = {}) {
    let query = supabase
      .from('neet_questions')
      .select('*')
      .textSearch('question_text', searchTerm)

    // Apply additional filters...

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  async getAdaptiveQuestions(
    studentAbility: number,
    subject: string,
    count: number = 10
  ) {
    // Implement IRT-based adaptive question selection
    const targetDifficulty = this.calculateTargetDifficulty(studentAbility)
    
    const { data, error } = await supabase
      .from('neet_questions')
      .select('*')
      .eq('subject', subject)
      .gte('difficulty_level', targetDifficulty - 0.5)
      .lte('difficulty_level', targetDifficulty + 0.5)
      .limit(count)
      .order('difficulty_level', { ascending: true })

    if (error) throw error
    return data || []
  }

  private calculateTargetDifficulty(ability: number): number {
    // IRT calculation: target questions slightly above student ability
    return Math.min(5, Math.max(1, ability + 0.3))
  }
}

export const questionService = new QuestionService()
```


### Step 3: Quiz Engine Implementation

**apps/web/app/quiz/components/quiz-engine.tsx**

```typescript
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@neet/ui'
import { questionService } from '@neet/database'
import { explanationService } from '@neet/ai'
import type { Database } from '@neet/database'

type Question = Database['public']['Tables']['neet_questions']['Row']

interface QuizEngineProps {
  questions: Question[]
  timeLimit?: number // seconds
  onComplete: (results: QuizResults) => void
  adaptiveDifficulty?: boolean
}

interface QuizResults {
  totalScore: number
  maxScore: number
  timeSpent: number
  answers: Record<number, string>
  questionAnalysis: Array<{
    questionId: number
    correct: boolean
    timeSpent: number
    selectedOption: string
  }>
}

export function QuizEngine({ 
  questions, 
  timeLimit, 
  onComplete, 
  adaptiveDifficulty = false 
}: QuizEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [startTime] = useState(Date.now())
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [questionTimes, setQuestionTimes] = useState<Record<number, number>>({})

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1
  const hasAnswer = answers[currentQuestion?.id]

  // Timer effect
  useEffect(() => {
    if (!timeLimit) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev && prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev ? prev - 1 : 0
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLimit])

  const handleAnswerSelect = useCallback((option: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option
    }))
  }, [currentQuestion.id])

  const handleNext = useCallback(() => {
    // Record time spent on current question
    const timeSpent = Date.now() - questionStartTime
    setQuestionTimes(prev => ({
      ...prev,
      [currentQuestion.id]: timeSpent
    }))

    if (isLastQuestion) {
      handleSubmit()
    } else {
      setCurrentIndex(prev => prev + 1)
      setQuestionStartTime(Date.now())
    }
  }, [currentQuestion.id, isLastQuestion, questionStartTime])

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setQuestionStartTime(Date.now())
    }
  }, [currentIndex])

  const handleSubmit = useCallback(() => {
    const totalTimeSpent = Date.now() - startTime
    
    const questionAnalysis = questions.map(q => ({
      questionId: q.id,
      correct: answers[q.id] === q.correct_option,
      timeSpent: questionTimes[q.id] || 0,
      selectedOption: answers[q.id] || ''
    }))

    const totalScore = questionAnalysis.filter(q => q.correct).length
    
    const results: QuizResults = {
      totalScore,
      maxScore: questions.length,
      timeSpent: totalTimeSpent,
      answers,
      questionAnalysis
    }

    onComplete(results)
  }, [answers, questions, questionTimes, startTime, onComplete])

  if (!currentQuestion) {
    return <div>Loading questions...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with progress and timer */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-600">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <div className="w-64 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        
        {timeRemaining && (
          <div className={`text-lg font-mono ${timeRemaining < 300 ? 'text-red-500' : 'text-gray-700'}`}>
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </div>
        )}
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
        <h2 className="text-xl font-semibold mb-6 leading-relaxed">
          {currentQuestion.question_text}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {Object.entries(currentQuestion.options).map(([key, value]) => (
            <label
              key={key}
              className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                answers[currentQuestion.id] === key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={key}
                checked={answers[currentQuestion.id] === key}
                onChange={(e) => handleAnswerSelect(e.target.value)}
                className="mt-1 mr-3"
              />
              <div>
                <span className="font-medium text-gray-900 mr-2">{key}.</span>
                <span className="text-gray-700">{value}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>

        <div className="flex space-x-3">
          {!hasAnswer && (
            <p className="text-sm text-red-500 self-center">
              Please select an answer before continuing
            </p>
          )}
          
          <Button
            onClick={handleNext}
            disabled={!hasAnswer}
          >
            {isLastQuestion ? 'Submit Quiz' : 'Next Question'}
          </Button>
        </div>
      </div>
    </div>
  )
}
```


### Step 4: API Routes Implementation

**apps/web/app/api/questions/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { questionService } from '@neet/database'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    const filters = {
      subjects: searchParams.getAll('subject'),
      years: searchParams.getAll('year').map(Number),
      topics: searchParams.getAll('topic'),
      difficulty: searchParams.get('difficulty')?.split(',').map(Number) as [number, number] | undefined,
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0'),
    }

    const { questions, total } = await questionService.getQuestions(filters)

    return NextResponse.json({
      success: true,
      data: questions,
      metadata: {
        total,
        limit: filters.limit,
        offset: filters.offset,
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}
```

**apps/web/app/api/ai/explain/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { explanationService } from '@neet/ai'
import { questionService } from '@neet/database'

export async function POST(request: NextRequest) {
  try {
    const { questionId, studentLevel } = await request.json()

    // Get question details
    const question = await questionService.getQuestion(questionId)
    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      )
    }

    // Generate AI explanation
    const explanation = await explanationService.generateExplanation(
      question.question_text,
      question.options,
      question.correct_option,
      question.subject,
      studentLevel
    )

    return NextResponse.json({
      success: true,
      data: explanation
    })
  } catch (error) {
    console.error('AI explanation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate explanation' },
      { status: 500 }
    )
  }
}
```


## Phase 3: Advanced Features (Months 5-7)

**Objective**: Add interactive and social components.

### Step 1: Voice AI Implementation

**packages/ai/services/voice-service.ts**

```typescript
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export class VoiceAIService {
  async processVoiceQuery(
    transcript: string,
    studentContext: {
      id: string
      level: string
      weakAreas: string[]
      recentPerformance: number
    }
  ) {
    const systemPrompt = `You are NEET Buddy, a friendly and encouraging AI tutor specializing in NEET preparation. 

Student Context:
- Level: ${studentContext.level}
- Weak Areas: ${studentContext.weakAreas.join(', ')}
- Recent Performance: ${studentContext.recentPerformance}%

Guidelines:
- Keep responses conversational and encouraging
- Provide specific, actionable advice
- Reference the student's weak areas when relevant
- Use simple language and analogies
- Limit responses to 2-3 sentences for voice interaction`

    const result = await streamText({
      model: openai('gpt-4o'),
      system: systemPrompt,
      prompt: transcript,
      temperature: 0.7,
    })

    return result
  }

  async generateVoiceResponse(text: string, voice: string = 'alloy') {
    // Use browser's speech synthesis or integrate with ElevenLabs
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.voice = window.speechSynthesis.getVoices().find(v => v.name.includes('Google')) || null
      utterance.rate = 0.9
      utterance.pitch = 1
      return utterance
    }
    
    // For server-side or premium features, integrate with ElevenLabs
    return null
  }
}

export const voiceAIService = new VoiceAIService()
```

**apps/web/app/voice-tutor/page.tsx**

```typescript
'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@neet/ui'
import { Mic, MicOff, Volume2 } from 'lucide-react'
import { useAuth } from '@neet/auth'

export default function VoiceTutorPage() {
  const { user } = useAuth()
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Start speech recognition
      if ('webkitSpeechRecognition' in window) {
        const recognition = new (window as any).webkitSpeechRecognition() as SpeechRecognition
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'
        
        recognition.onresult = (event) => {
          const current = event.resultIndex
          const trans = event.results[current][^0].transcript
          setTranscript(trans)
        }
        
        recognition.start()
        recognitionRef.current = recognition
      }

      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }, [])

  const stopRecording = useCallback(async () => {
    setIsRecording(false)
    setIsProcessing(true)

    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    try {
      // Send transcript to AI for processing
      const res = await fetch('/api/ai/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transcript,
          userId: user?.id 
        })
      })

      if (res.ok) {
        const reader = res.body?.getReader()
        if (reader) {
          let aiResponse = ''
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            
            const chunk = new TextDecoder().decode(value)
            aiResponse += chunk
            setResponse(aiResponse)
          }

          // Convert response to speech
          const utterance = new SpeechSynthesisUtterance(aiResponse)
          speechSynthesis.speak(utterance)
        }
      }
    } catch (error) {
      console.error('Error processing voice:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [transcript, user?.id])

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Voice AI Tutor</h1>
        <p className="text-gray-600">
          Ask me anything about your NEET preparation. I'm here to help!
        </p>
      </div>

      {/* Voice Interface */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <div className="flex flex-col items-center">
          {/* Microphone Button */}
          <Button
            size="lg"
            variant={isRecording ? "secondary" : "primary"}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className="w-32 h-32 rounded-full mb-6"
          >
            {isRecording ? (
              <MicOff className="w-12 h-12" />
            ) : (
              <Mic className="w-12 h-12" />
            )}
          </Button>

          {/* Status */}
          <div className="text-center">
            {isRecording && (
              <p className="text-blue-600 font-medium">Listening... Speak now!</p>
            )}
            {isProcessing && (
              <p className="text-orange-600 font-medium">Processing your question...</p>
            )}
            {!isRecording && !isProcessing && (
              <p className="text-gray-600">Tap the microphone to start</p>
            )}
          </div>
        </div>
      </div>

      {/* Conversation */}
      {(transcript || response) && (
        <div className="space-y-4">
          {transcript && (
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium mb-1">You said:</p>
              <p className="text-gray-800">{transcript}</p>
            </div>
          )}

          {response && (
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <p className="text-sm text-green-600 font-medium">NEET Buddy:</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const utterance = new SpeechSynthesisUtterance(response)
                    speechSynthesis.speak(utterance)
                  }}
                  className="ml-2"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-gray-800">{response}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```


### Step 2: AR Question Scanner

**packages/ai/services/ocr-service.ts**

```typescript
import Tesseract from 'tesseract.js'

export class OCRService {
  async scanQuestion(imageFile: File): Promise<{
    text: string
    confidence: number
    boundingBoxes: any[]
  }> {
    try {
      const result = await Tesseract.recognize(imageFile, 'eng', {
        logger: m => console.log(m)
      })

      // Process the recognized text to extract question format
      const processedText = this.processQuestionText(result.data.text)
      
      return {
        text: processedText,
        confidence: result.data.confidence,
        boundingBoxes: result.data.words
      }
    } catch (error) {
      throw new Error('Failed to scan question: ' + error)
    }
  }

  private processQuestionText(rawText: string): string {
    // Clean up OCR artifacts and format the text
    let cleaned = rawText
      .replace(/[^\w\s\.\?\!\(\)\[\]]/g, '') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()

    // Try to identify question structure (Q., A), B), etc.)
    const lines = cleaned.split('\n').filter(line => line.trim())
    
    return lines.join('\n')
  }

  async matchQuestionInDatabase(scannedText: string): Promise<any> {
    // Use fuzzy matching to find similar questions in database
    const response = await fetch('/api/questions/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ searchTerm: scannedText })
    })

    return response.json()
  }
}

export const ocrService = new OCRService()
```


### Step 3: Social Features - Study Groups

**packages/database/queries/study-groups.ts**

```typescript
import { supabase } from '../client'
import type { Database } from '../types'

type StudyGroup = Database['public']['Tables']['study_groups']['Row']

export class StudyGroupService {
  async createGroup(groupData: {
    name: string
    description?: string
    isPrivate: boolean
    maxMembers: number
    createdBy: string
  }) {
    const inviteCode = this.generateInviteCode()
    
    const { data, error } = await supabase
      .from('study_groups')
      .insert({
        ...groupData,
        invite_code: inviteCode,
        created_by: groupData.createdBy
      })
      .select()
      .single()

    if (error) throw error

    // Add creator as admin member
    await this.addMember(data.id, groupData.createdBy, 'admin')

    return data
  }

  async joinGroup(groupId: string, userId: string, inviteCode?: string) {
    // Verify group exists and user can join
    const { data: group, error: groupError } = await supabase
      .from('study_groups')
      .select('*, group_members(*)')
      .eq('id', groupId)
      .single()

    if (groupError) throw groupError

    // Check if group is private and invite code is required
    if (group.is_private && group.invite_code !== inviteCode) {
      throw new Error('Invalid invite code')
    }

    // Check if group is full
    if (group.group_members.length >= group.max_members) {
      throw new Error('Group is full')
    }

    // Add member
    return this.addMember(groupId, userId, 'member')
  }

  private async addMember(groupId: string, userId: string, role: 'admin' | 'moderator' | 'member') {
    const { data, error } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        student_id: userId,
        role
      })

    if (error) throw error
    return data
  }

  async getGroupMessages(groupId: string, limit: number = 50) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:students!messages_sender_id_fkey(
          id,
          full_name
        )
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data?.reverse() || []
  }

  async sendMessage(groupId: string, senderId: string, content: string, type: 'text' | 'image' | 'file' = 'text') {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        group_id: groupId,
        sender_id: senderId,
        content,
        message_type: type
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  private generateInviteCode(): string {
    return 'NEET' + Math.floor(1000 + Math.random() * 9000)
  }
}

export const studyGroupService = new StudyGroupService()
```


## Phase 4: Enterprise \& Analytics (Months 8-10)

**Objective**: Add business and analytical tools.

### Step 1: Admin Dashboard App

**apps/admin/package.json**

```json
{
  "name": "admin",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3001",
    "build": "next build",
    "start": "next start --port 3001"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@neet/ui": "*",
    "@neet/database": "*",
    "@neet/analytics": "*",
    "recharts": "^2.8.0"
  }
}
```


### Step 2: Analytics Package

**packages/analytics/package.json**

```json
{
  "name": "@neet/analytics",
  "version": "0.0.0",
  "main": "./index.ts",
  "types": "./index.ts",
  "dependencies": {
    "@vercel/analytics": "^1.1.0",
    "@neet/database": "*"
  }
}
```

**packages/analytics/services/metrics-service.ts**

```typescript
import { track } from '@vercel/analytics'
import { supabase } from '@neet/database'

export interface UserAction {
  userId: string
  action: string
  properties?: Record<string, any>
  timestamp?: Date
}

export class MetricsService {
  // Track user actions
  async trackUserAction(action: UserAction) {
    // Send to Vercel Analytics
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
        created_at: action.timestamp || new Date()
      })
  }

  // Track quiz performance
  async trackQuizCompletion(
    userId: string,
    quizData: {
      quizType: string
      subject: string
      score: number
      totalQuestions: number
      timeSpent: number
    }
  ) {
    await this.trackUserAction({
      userId,
      action: 'quiz_completed',
      properties: quizData
    })

    // Update user progress
    await this.updateUserProgress(userId, quizData)
  }

  // Track AI interactions
  async trackAIInteraction(
    userId: string,
    interactionData: {
      type: 'explanation' | 'voice' | 'study_plan'
      model: string
      responseTime: number
      success: boolean
      tokens?: number
    }
  ) {
    await this.trackUserAction({
      userId,
      action: 'ai_interaction',
      properties: interactionData
    })
  }

  // Generate analytics dashboard data
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
      ai: aiMetrics
    }
  }

  private async updateUserProgress(userId: string, quizData: any) {
    // Update user's performance analytics
    await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        subject: quizData.subject,
        total_attempts: supabase.raw('total_attempts + 1'),
        total_correct: supabase.raw(`total_correct + ${quizData.score}`),
        total_time_spent: supabase.raw(`total_time_spent + ${quizData.timeSpent}`),
        last_attempt_at: new Date()
      })
  }
}

export const metricsService = new MetricsService()
```


### Step 3: Payment Integration

**packages/payments/package.json**

```json
{
  "name": "@neet/payments",
  "version": "0.0.0",
  "main": "./index.ts",
  "types": "./index.ts",
  "dependencies": {
    "stripe": "^14.0.0",
    "@neet/config": "*"
  }
}
```

**packages/payments/services/stripe-service.ts**

```typescript
import Stripe from 'stripe'
import { config } from '@neet/config'

const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2023-10-16'
})

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'premium_monthly',
    name: 'Premium Monthly',
    price: 24900, // ₹249 in paise
    interval: 'month',
    features: [
      'Unlimited AI explanations',
      'Voice AI tutor (60 min/day)',
      'Full AR features',
      'Unlimited study groups',
      'Advanced analytics'
    ]
  },
  {
    id: 'premium_yearly',
    name: 'Premium Yearly',
    price: 199900, // ₹1,999 in paise
    interval: 'year',
    features: [
      'All Premium Monthly features',
      '33% savings',
      'Priority support',
      'Early access to new features'
    ]
  }
]

export class StripeService {
  async createCheckoutSession(
    planId: string,
    userId: string,
    successUrl: string,
    cancelUrl: string
  ) {
    const plan = subscriptionPlans.find(p => p.id === planId)
    if (!plan) {
      throw new Error('Plan not found')
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: plan.name,
              description: plan.features.join(', ')
            },
            unit_amount: plan.price,
            recurring: {
              interval: plan.interval
            }
          },
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: {
        userId,
        planId
      }
    })

    return session
  }

  async handleWebhook(payload: string, signature: string) {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleSubscriptionCreated(event.data.object)
        break
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object)
        break
      case 'customer.subscription.deleted':
        await this.handleSubscriptionCanceled(event.data.object)
        break
    }
  }

  private async handleSubscriptionCreated(session: any) {
    // Update user's subscription status in database
    const { userId, planId } = session.metadata
    
    await supabase
      .from('students')
      .update({
        tier: 'premium',
        subscription_id: session.subscription,
        subscription_plan: planId,
        subscription_status: 'active'
      })
      .eq('id', userId)
  }

  private async handlePaymentSucceeded(invoice: any) {
    // Log successful payment
    await supabase
      .from('payment_history')
      .insert({
        user_id: invoice.customer_details?.metadata?.userId,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: 'paid',
        stripe_invoice_id: invoice.id
      })
  }

  private async handleSubscriptionCanceled(subscription: any) {
    // Update user's subscription status
    await supabase
      .from('students')
      .update({
        tier: 'free',
        subscription_status: 'canceled'
      })
      .eq('subscription_id', subscription.id)
  }
}

export const stripeService = new StripeService()
```


## Phase 5: Scaling \& Optimization (Months 11-14)

**Objective**: Ensure performance and real-time capabilities.

### Step 1: Performance Optimization

**apps/web/middleware.ts**

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const start = Date.now()
  
  const response = NextResponse.next()
  
  // Add performance headers
  response.headers.set('x-response-time', `${Date.now() - start}ms`)
  response.headers.set('x-request-id', crypto.randomUUID())
  
  return response
}

export const config = {
  matcher: '/api/:path*'
}
```


### Step 2: Caching Strategy with Vercel KV

**packages/cache/package.json**

```json
{
  "name": "@neet/cache",
  "version": "0.0.0",
  "main": "./index.ts",
  "types": "./index.ts",
  "dependencies": {
    "@vercel/kv": "^1.0.0"
  }
}
```

**packages/cache/services/cache-service.ts**

```typescript
import { kv } from '@vercel/kv'

export class CacheService {
  private generateKey(prefix: string, ...args: string[]): string {
    return `${prefix}:${args.join(':')}`
  }

  // Cache AI explanations
  async getExplanation(questionId: string): Promise<any | null> {
    const key = this.generateKey('explanation', questionId)
    return await kv.get(key)
  }

  async setExplanation(questionId: string, explanation: any, ttl: number = 86400) {
    const key = this.generateKey('explanation', questionId)
    await kv.setex(key, ttl, JSON.stringify(explanation))
  }

  // Cache user progress
  async getUserProgress(userId: string): Promise<any | null> {
    const key = this.generateKey('progress', userId)
    return await kv.get(key)
  }

  async setUserProgress(userId: string, progress: any, ttl: number = 3600) {
    const key = this.generateKey('progress', userId)
    await kv.setex(key, ttl, JSON.stringify(progress))
  }

  // Cache quiz questions for offline mode
  async getQuizQuestions(filters: string): Promise<any[] | null> {
    const key = this.generateKey('quiz', filters)
    return await kv.get(key)
  }

  async setQuizQuestions(filters: string, questions: any[], ttl: number = 7200) {
    const key = this.generateKey('quiz', filters)
    await kv.setex(key, ttl, JSON.stringify(questions))
  }

  // Rate limiting
  async checkRateLimit(userId: string, action: string, limit: number, window: number): Promise<boolean> {
    const key = this.generateKey('rate', action, userId)
    const current = await kv.incr(key)
    
    if (current === 1) {
      await kv.expire(key, window)
    }
    
    return current <= limit
  }

  // Session management
  async setSession(sessionId: string, data: any, ttl: number = 86400) {
    const key = this.generateKey('session', sessionId)
    await kv.setex(key, ttl, JSON.stringify(data))
  }

  async getSession(sessionId: string): Promise<any | null> {
    const key = this.generateKey('session', sessionId)
    return await kv.get(key)
  }
}

export const cacheService = new CacheService()
```


### Step 3: Real-time Features with Supabase

**packages/realtime/package.json**

```json
{
  "name": "@neet/realtime",
  "version": "0.0.0",
  "main": "./index.ts",
  "types": "./index.ts",
  "dependencies": {
    "@supabase/supabase-js": "^2.38.0",
    "@neet/database": "*"
  }
}
```

**packages/realtime/services/realtime-service.ts**

```typescript
import { supabase } from '@neet/database'
import type { RealtimeChannel } from '@supabase/supabase-js'

export class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map()

  // Study group real-time messaging
  subscribeToStudyGroup(
    groupId: string,
    callbacks: {
      onMessage?: (message: any) => void
      onMemberJoin?: (member: any) => void
      onMemberLeave?: (member: any) => void
    }
  ) {
    const channel = supabase
      .channel(`study-group-${groupId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `group_id=eq.${groupId}`
      }, (payload) => {
        callbacks.onMessage?.(payload.new)
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'group_members',
        filter: `group_id=eq.${groupId}`
      }, (payload) => {
        callbacks.onMemberJoin?.(payload.new)
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'group_members',
        filter: `group_id=eq.${groupId}`
      }, (payload) => {
        callbacks.onMemberLeave?.(payload.old)
      })
      .subscribe()

    this.channels.set(`study-group-${groupId}`, channel)
    return channel
  }

  // Real-time collaboration on whiteboard
  subscribeToWhiteboard(
    sessionId: string,
    callbacks: {
      onDraw?: (data: any) => void
      onCursor?: (data: any) => void
      onUserJoin?: (user: any) => void
    }
  ) {
    const channel = supabase
      .channel(`whiteboard-${sessionId}`)
      .on('broadcast', { event: 'draw' }, (payload) => {
        callbacks.onDraw?.(payload)
      })
      .on('broadcast', { event: 'cursor' }, (payload) => {
        callbacks.onCursor?.(payload)
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        Object.values(state).forEach(users => {
          users.forEach(user => callbacks.onUserJoin?.(user))
        })
      })
      .subscribe()

    this.channels.set(`whiteboard-${sessionId}`, channel)
    return channel
  }

  // Live quiz competitions
  subscribeToCompetition(
    competitionId: string,
    callbacks: {
      onLeaderboardUpdate?: (data: any) => void
      onCompetitionStart?: () => void
      onCompetitionEnd?: (results: any) => void
    }
  ) {
    const channel = supabase
      .channel(`competition-${competitionId}`)
      .on('broadcast', { event: 'leaderboard' }, (payload) => {
        callbacks.onLeaderboardUpdate?.(payload)
      })
      .on('broadcast', { event: 'start' }, () => {
        callbacks.onCompetitionStart?()
      })
      .on('broadcast', { event: 'end' }, (payload) => {
        callbacks.onCompetitionEnd?.(payload)
      })
      .subscribe()

    this.channels.set(`competition-${competitionId}`, channel)
    return channel
  }

  unsubscribe(channelKey: string) {
    const channel = this.channels.get(channelKey)
    if (channel) {
      supabase.removeChannel(channel)
      this.channels.delete(channelKey)
    }
  }

  unsubscribeAll() {
    this.channels.forEach((channel, key) => {
      supabase.removeChannel(channel)
    })
    this.channels.clear()
  }
}

export const realtimeService = new RealtimeService()
```


## Phase 6: Production \& Expansion (Months 15-18)

**Objective**: Deploy to production and expand features.

### Step 1: Production Deployment Setup

**turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

**vercel.json**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "turbo run build --filter=web",
  "devCommand": "turbo run dev --filter=web",
  "installCommand": "npm install",
  "framework": "nextjs",
  "functions": {
    "apps/web/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/analytics",
      "schedule": "0 0 * * *"
    }
  ]
}
```


### Step 2: Monitoring \& Observability

**packages/monitoring/services/monitoring-service.ts**

```typescript
import * as Sentry from '@sentry/nextjs'

export class MonitoringService {
  static init() {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      beforeSend(event) {
        // Filter out non-critical errors in production
        if (process.env.NODE_ENV === 'production') {
          if (event.exception?.values?.[^0]?.type === 'ChunkLoadError') {
            return null
          }
        }
        return event
      }
    })
  }

  static captureException(error: Error, context?: Record<string, any>) {
    Sentry.withScope(scope => {
      if (context) {
        Object.keys(context).forEach(key => {
          scope.setExtra(key, context[key])
        })
      }
      Sentry.captureException(error)
    })
  }

  static addBreadcrumb(message: string, data?: Record<string, any>) {
    Sentry.addBreadcrumb({
      message,
      data,
      timestamp: Date.now()
    })
  }

  static setUser(user: { id: string; email?: string }) {
    Sentry.setUser(user)
  }
}
```


### Step 3: Deployment Scripts

**package.json (root)**

```json
{
  "name": "neet-prep-platform",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "deploy:staging": "vercel --env staging",
    "deploy:production": "vercel --prod",
    "db:generate": "supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > packages/database/types.ts",
    "db:reset": "supabase db reset",
    "db:migrate": "supabase migration up"
  },
  "devDependencies": {
    "@turbo/gen": "^1.10.0",
    "turbo": "^1.10.0",
    "typescript": "^5.2.0"
  },
  "packageManager": "npm@8.0.0",
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

