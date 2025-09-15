// Sign Up Page for NEET Prep AI Platform
// Story 1.1: User Authentication System

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SignUpForm } from '@neet/ui/auth/signup-form';

// Temporary type until @neet/auth is ready
interface AuthUser {
  id: string;
  email: string;
  onboarding_completed?: boolean;
}

export default function SignUpPage() {
  const router = useRouter();

  const handleSignUpSuccess = (user: AuthUser) => {
    console.log('Sign up successful:', user);
    
    // Show success message and redirect to verification page
    router.push('/auth/verify-email?email=' + encodeURIComponent(user.email));
  };

  const handleSignUpError = (error: string) => {
    console.error('Sign up error:', error);
    // Error handling is done within the SignUpForm component
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            NEET Prep AI
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your AI-powered companion for NEET success
          </p>
        </div>

        {/* Sign Up Form */}
        <SignUpForm
          onSuccess={handleSignUpSuccess}
          onError={handleSignUpError}
          className="w-full"
        />

        {/* Additional Links */}
        <div className="mt-8 text-center">
          <div className="text-sm">
            <a href="/auth/help" className="font-medium text-blue-600 hover:text-blue-500">
              Need help signing up?
            </a>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <a href="/" className="hover:text-gray-700">
              ← Back to homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
