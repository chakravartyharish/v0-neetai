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
        Update: Partial<Database['public']['Tables']['students']['Insert']>
      }
      neet_questions: {
        Row: {
          id: string
          year: number
          exam_type: 'NEET' | 'AIPMT' | 'AIIMS'
          subject: 'Physics' | 'Chemistry' | 'Biology'
          chapter: string
          topic: string
          subtopic: string | null
          question_text: string
          question_image: string | null
          options: {
            A: string
            B: string
            C: string
            D: string
          }
          correct_option: 'A' | 'B' | 'C' | 'D'
          explanation: {
            text: string
            video_url?: string
            diagram_url?: string
            mnemonic_tip?: string
          }
          difficulty: {
            level: number // 1-5 scale
            dynamic_rating: number // Updated based on user performance
            cognitive_load: 'low' | 'medium' | 'high'
          }
          analytics: {
            average_solve_time: number
            global_success_rate: number
            attempt_count: number
            common_mistakes: string[]
            expert_insights: string[]
          }
          concept_tags: string[]
          ncert_reference: {
            class: 11 | 12
            chapter: string
            page_number?: number
          }
          related_questions: string[] // Similar concepts
          trending_score: number // Relevance for current year
          language_support: string[] // Available explanation languages
          accessibility: {
            audio_description?: string
            screen_reader_friendly: boolean
          }
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          year: number
          exam_type: 'NEET' | 'AIPMT' | 'AIIMS'
          subject: 'Physics' | 'Chemistry' | 'Biology'
          chapter: string
          topic: string
          subtopic?: string | null
          question_text: string
          question_image?: string | null
          options: {
            A: string
            B: string
            C: string
            D: string
          }
          correct_option: 'A' | 'B' | 'C' | 'D'
          explanation: {
            text: string
            video_url?: string
            diagram_url?: string
            mnemonic_tip?: string
          }
          difficulty?: {
            level: number
            dynamic_rating: number
            cognitive_load: 'low' | 'medium' | 'high'
          }
          analytics?: {
            average_solve_time: number
            global_success_rate: number
            attempt_count: number
            common_mistakes: string[]
            expert_insights: string[]
          }
          concept_tags?: string[]
          ncert_reference?: {
            class: 11 | 12
            chapter: string
            page_number?: number
          }
          related_questions?: string[]
          trending_score?: number
          language_support?: string[]
          accessibility?: {
            audio_description?: string
            screen_reader_friendly: boolean
          }
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['neet_questions']['Insert']>
      }
      quiz_attempts: {
        Row: {
          id: string
          student_id: string
          quiz_type: 'practice' | 'mock' | 'topic' | 'custom'
          questions: number[]
          answers: Record<string, string>
          score: number
          total_questions: number
          time_spent: number
          started_at: string
          completed_at: string | null
          metadata: Record<string, any> | null
        }
        Insert: {
          id?: string
          student_id: string
          quiz_type: 'practice' | 'mock' | 'topic' | 'custom'
          questions: number[]
          answers?: Record<string, string>
          score?: number
          total_questions: number
          time_spent?: number
          started_at?: string
          completed_at?: string | null
          metadata?: Record<string, any> | null
        }
        Update: Partial<Database['public']['Tables']['quiz_attempts']['Insert']>
      }
      study_groups: {
        Row: {
          id: string
          name: string
          description: string | null
          is_private: boolean
          max_members: number
          invite_code: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_private?: boolean
          max_members?: number
          invite_code?: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['study_groups']['Insert']>
      }
    }
    Views: {
      // Define views here
    }
    Functions: {
      // Define functions here
    }
    Enums: {
      user_tier: 'free' | 'premium' | 'enterprise'
      user_role: 'student' | 'coach' | 'admin'
      quiz_type: 'practice' | 'mock' | 'topic' | 'custom'
      subject: 'Physics' | 'Chemistry' | 'Biology'
    }
  }
}
