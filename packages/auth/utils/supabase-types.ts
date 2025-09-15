// Database type definitions for NEET Prep AI Platform

export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          tier: 'free' | 'basic' | 'premium' | 'enterprise';
          role: 'student' | 'coach' | 'parent' | 'admin';
          referred_by: string | null;
          onboarding_completed: boolean;
          preferences: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          tier?: 'free' | 'basic' | 'premium' | 'enterprise';
          role?: 'student' | 'coach' | 'parent' | 'admin';
          referred_by?: string | null;
          onboarding_completed?: boolean;
          preferences?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          tier?: 'free' | 'basic' | 'premium' | 'enterprise';
          role?: 'student' | 'coach' | 'parent' | 'admin';
          referred_by?: string | null;
          onboarding_completed?: boolean;
          preferences?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          student_id: string;
          target_exam_date: string | null;
          target_score: number | null;
          study_hours_per_day: number;
          preferred_subjects: string[];
          weak_areas: string[];
          learning_style: string | null;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          target_exam_date?: string | null;
          target_score?: number | null;
          study_hours_per_day?: number;
          preferred_subjects?: string[];
          weak_areas?: string[];
          learning_style?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          target_exam_date?: string | null;
          target_score?: number | null;
          study_hours_per_day?: number;
          preferred_subjects?: string[];
          weak_areas?: string[];
          learning_style?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}