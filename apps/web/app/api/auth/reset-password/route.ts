// Reset Password API Route for NEET Prep AI Platform
// Story 1.1: User Authentication System

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, handleAuthError } from '@neet/auth';

// Basic validation functions
function validateEmailData(data: any) {
  const errors: string[] = [];

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }

  return errors;
}

function validatePasswordData(data: any) {
  const errors: string[] = [];

  if (!data.password || typeof data.password !== 'string') {
    errors.push('Password is required');
  } else {
    if (data.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(data.password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(data.password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(data.password)) {
      errors.push('Password must contain at least one number');
    }
  }

  if (!data.confirmPassword || typeof data.confirmPassword !== 'string') {
    errors.push('Confirm password is required');
  } else if (data.password !== data.confirmPassword) {
    errors.push("Passwords don't match");
  }

  return errors;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const body = await request.json();
    const { action } = body;

    if (action === 'request') {
      // Handle password reset request
      const validationErrors = validateEmailData(body);
      if (validationErrors.length > 0) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: validationErrors
          },
          { status: 400 }
        );
      }

      const { email } = body;

      // Check if user exists (but don't reveal this information for security)
      const { data: user } = await supabase
        .from('students')
        .select('email')
        .eq('email', email)
        .single();

      // Always return success message for security (don't reveal if email exists)
      const { error } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
        }
      );

      if (error) {
        console.error('Password reset request error:', error);
        // Still return success to prevent email enumeration
      }

      return NextResponse.json(
        { 
          message: 'If an account with that email exists, we\'ve sent password reset instructions.',
          success: true
        },
        { status: 200 }
      );

    } else if (action === 'update') {
      // Handle password update
      const validationErrors = validatePasswordData(body);
      if (validationErrors.length > 0) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: validationErrors
          },
          { status: 400 }
        );
      }

      const { password } = body;

      // Update password using Supabase Auth
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Password update error:', error);
        return NextResponse.json(
          { error: handleAuthError(error) },
          { status: 400 }
        );
      }

      if (!data.user) {
        return NextResponse.json(
          { error: 'Failed to update password' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { 
          message: 'Password updated successfully',
          success: true
        },
        { status: 200 }
      );

    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "request" or "update"' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Reset password API error:', error);
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
