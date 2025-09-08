// Supabase client configuration for NEET Prep AI Platform
// Story 1.1: User Authentication System

import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Database type definitions
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

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client-side Supabase client (for React components)
export const createClientSupabase = () => {
  return createClientComponentClient<Database>();
};

// Server-side Supabase client (for Server Components and API routes)
export const createServerSupabase = () => {
  return createServerComponentClient<Database>({
    cookies,
  });
};

// Service role client (for admin operations)
export const createServiceSupabase = () => {
  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Admin client (bypasses RLS)
export const supabaseAdmin = createServiceSupabase();

// Auth configuration
export const authConfig = {
  // Session configuration
  session: {
    maxAge: 24 * 60 * 60, // 24 hours
    cookieName: 'neet-auth-session',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
  },
  
  // Email configuration
  email: {
    confirmEmail: true,
    requireEmailConfirmation: true,
    emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
  },
  
  // Password requirements
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },
  
  // Rate limiting
  rateLimit: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
};

// Helper function to handle Supabase auth errors
export const handleAuthError = (error: any): string => {
  if (!error) return 'An unknown error occurred';
  
  // Map common Supabase auth error messages to user-friendly ones
  const errorMessages: Record<string, string> = {
    'Invalid login credentials': 'Invalid email or password',
    'User not found': 'No account found with this email address',
    'Email not confirmed': 'Please check your email and click the confirmation link',
    'Password should be at least 6 characters': 'Password must be at least 8 characters long',
    'User already registered': 'An account with this email address already exists',
    'Token has expired': 'This link has expired. Please request a new one',
    'Invalid token': 'This link is invalid or has already been used',
  };
  
  const message = error.message || error.error_description || error.toString();
  return errorMessages[message] || message;
};

// Auth event handlers
export const authEvents = {
  onSignIn: (user: any) => {
    console.log('User signed in:', user.email);
    // Track sign in event
  },
  
  onSignOut: () => {
    console.log('User signed out');
    // Clear user data, analytics, etc.
  },
  
  onSignUp: (user: any) => {
    console.log('User signed up:', user.email);
    // Track sign up event
  },
  
  onPasswordReset: (email: string) => {
    console.log('Password reset requested for:', email);
    // Track password reset event
  },
};
