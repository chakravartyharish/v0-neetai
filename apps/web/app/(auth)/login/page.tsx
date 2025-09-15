// Login Page for NEET Prep AI Platform
// Story 1.1: User Authentication System

'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SignInForm } from '@neet/ui/auth/signin-form';

// Temporary type until @neet/auth is ready
interface AuthUser {
  id: string;
  email: string;
  onboarding_completed?: boolean;
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get redirect URL from search params (for after successful login)
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const message = searchParams.get('message'); // For displaying messages like "Please login to continue"

  const handleSignInSuccess = (user: AuthUser) => {
    console.log('Sign in successful:', user);
    
    // Check if user has completed onboarding
    if (!user.onboarding_completed) {
      router.push('/onboarding');
      return;
    }
    
    // Redirect to intended destination or dashboard
    router.push(redirectTo);
  };

  const handleSignInError = (error: string) => {
    console.error('Sign in error:', error);
    // Error handling is done within the SignInForm component
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

        {/* Message from redirect (e.g., "Please login to continue") */}
        {message && (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-600 text-center">{message}</p>
            </div>
          </div>
        )}

        {/* Sign In Form */}
        <SignInForm
          onSuccess={handleSignInSuccess}
          onError={handleSignInError}
          className="w-full"
        />

        {/* Additional Help */}
        <div className="mt-8 space-y-4">
          {/* Quick Access for Demo */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Demo Access</h3>
            <p className="text-xs text-gray-600 mb-3">
              Try the platform with a demo account
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {/* Demo student login */}}
                className="w-full text-xs bg-white border border-gray-200 rounded px-3 py-2 hover:bg-gray-50"
              >
                Demo Student (student@neetai.com)
              </button>
              <button
                onClick={() => {/* Demo coach login */}}
                className="w-full text-xs bg-white border border-gray-200 rounded px-3 py-2 hover:bg-gray-50"
              >
                Demo Coach (coach@neetai.com)
              </button>
            </div>
          </div>

          {/* Help Links */}
          <div className="text-center space-y-2">
            <div className="text-sm">
              <a href="/auth/help" className="font-medium text-blue-600 hover:text-blue-500">
                Having trouble signing in?
              </a>
            </div>
            <div className="text-sm">
              <a href="/auth/verify-email" className="text-blue-600 hover:text-blue-500">
                Resend verification email
              </a>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <a href="/" className="hover:text-gray-700">
                ← Back to homepage
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
