// Sign Up API Route for NEET Prep AI Platform
// Story 1.1: User Authentication System

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, handleAuthError } from '@neet/auth';
import { z } from 'zod';

// Validation schema
const signUpSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  role: z.enum(['student', 'coach', 'parent', 'admin']).optional().default('student'),
  phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    
    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validation = signUpSchema.safeParse(body);
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

    const { email, password, full_name, role, phone } = validation.data;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('students')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          role,
        },
      },
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      return NextResponse.json(
        { error: handleAuthError(authError) },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    // Create student record
    const { data: student, error: studentError } = await supabase
      .from('students')
      .insert({
        id: authData.user.id,
        email,
        full_name,
        phone: phone || null,
        role,
        tier: 'free',
        onboarding_completed: false,
        preferences: {},
      })
      .select()
      .single();

    if (studentError) {
      console.error('Student creation error:', studentError);
      
      // Try to clean up auth user if student creation fails
      try {
        await supabase.auth.admin.deleteUser(authData.user.id);
      } catch (cleanupError) {
        console.error('Failed to cleanup auth user:', cleanupError);
      }

      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      );
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        student_id: authData.user.id,
        study_hours_per_day: 2,
        preferred_subjects: [],
        weak_areas: [],
        timezone: 'Asia/Kolkata',
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Don't fail the entire signup if profile creation fails
    }

    // Return success response
    return NextResponse.json(
      { 
        message: 'Account created successfully. Please check your email to verify your account.',
        user: {
          id: student.id,
          email: student.email,
          full_name: student.full_name,
          role: student.role,
          tier: student.tier,
          onboarding_completed: student.onboarding_completed,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup API error:', error);
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
