// Sign In API Route for NEET Prep AI Platform
// Story 1.1: User Authentication System

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, handleAuthError } from '@neet/auth';
import { z } from 'zod';

// Validation schema
const signInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    
    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validation = signInSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Sign in error:', authError);
      
      // Return generic error for security (don't reveal if email exists)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Sign in failed' },
        { status: 401 }
      );
    }

    // Get complete user data
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select(`
        *,
        user_profiles (*)
      `)
      .eq('id', authData.user.id)
      .single();

    if (studentError) {
      console.error('Error fetching user data:', studentError);
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    // Check if email is verified
    if (!authData.user.email_confirmed_at) {
      return NextResponse.json(
        { 
          error: 'Email not verified',
          message: 'Please check your email and click the verification link before signing in.',
          requiresVerification: true
        },
        { status: 403 }
      );
    }

    // Return success response with user data
    return NextResponse.json(
      { 
        message: 'Sign in successful',
        user: {
          id: student.id,
          email: student.email,
          full_name: student.full_name,
          phone: student.phone,
          role: student.role,
          tier: student.tier,
          onboarding_completed: student.onboarding_completed,
          preferences: student.preferences,
          profile: student.user_profiles?.[0] || null,
          created_at: student.created_at,
          updated_at: student.updated_at,
        },
        session: {
          access_token: authData.session?.access_token,
          refresh_token: authData.session?.refresh_token,
          expires_at: authData.session?.expires_at,
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('SignIn API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
