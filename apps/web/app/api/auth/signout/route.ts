// Sign Out API Route for NEET Prep AI Platform
// Story 1.1: User Authentication System

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@neet/auth';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    
    // Sign out from Supabase Auth
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Sign out error:', error);
      return NextResponse.json(
        { error: 'Failed to sign out' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      { message: 'Signed out successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('SignOut API error:', error);
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
