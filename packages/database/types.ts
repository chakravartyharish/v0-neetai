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
