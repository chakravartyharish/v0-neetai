// Client-side Supabase configuration for NEET Prep AI Platform
// This file only contains client-safe imports and utilities

'use client';

import { createClient } from '@supabase/supabase-js';

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client-side Supabase client (for React components)
export const createClientSupabase = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Direct client for legacy usage
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Auth configuration (client-safe values only)
export const authConfig = {
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