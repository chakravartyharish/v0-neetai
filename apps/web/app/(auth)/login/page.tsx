'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const message = searchParams.get('message');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to sign in');
        return;
      }

      // Success - redirect to dashboard or intended page
      router.push(redirectTo);
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (email: string, password: string) => {
    setFormData({ email, password });
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to sign in');
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
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

        {/* Message */}
        {message && (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-600 text-center">{message}</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-md p-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </a>
            </span>
          </div>
        </form>

        {/* Demo Access */}
        <div className="mt-8 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Demo Access</h3>
            <p className="text-xs text-gray-600 mb-3">
              Try the platform with a demo account
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handleDemoLogin('hkchakravarty@gmail.com', 'demo123')}
                disabled={loading}
                className="w-full text-xs bg-white border border-gray-200 rounded px-3 py-2 hover:bg-gray-50 disabled:opacity-50"
              >
                Demo Student (hkchakravarty@gmail.com)
              </button>
              <button
                onClick={() => handleDemoLogin('coach@neetai.com', 'demo123')}
                disabled={loading}
                className="w-full text-xs bg-white border border-gray-200 rounded px-3 py-2 hover:bg-gray-50 disabled:opacity-50"
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
