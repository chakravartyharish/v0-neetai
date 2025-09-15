import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { AdminGuard } from '../../../components/auth/admin-guard'
import { useAuth } from '@neet/auth'

// Mock dependencies
jest.mock('next/navigation')
jest.mock('@neet/auth')

const mockReplace = jest.fn()
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

describe('AdminGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      replace: mockReplace,
      push: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    })
  })

  it('shows loading spinner when auth is loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      resetPassword: jest.fn(),
      updatePassword: jest.fn(),
      updateProfile: jest.fn(),
      refreshUser: jest.fn(),
    })

    render(
      <AdminGuard>
        <div>Admin Content</div>
      </AdminGuard>
    )

    expect(screen.getByText('Checking authentication...')).toBeInTheDocument()
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument()
  })

  it('redirects to login when user is not authenticated', async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      resetPassword: jest.fn(),
      updatePassword: jest.fn(),
      updateProfile: jest.fn(),
      refreshUser: jest.fn(),
    })

    render(
      <AdminGuard>
        <div>Admin Content</div>
      </AdminGuard>
    )

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/auth/login')
    })
  })

  it('redirects to unauthorized when user lacks admin role', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'user@example.com',
      full_name: 'Test User',
      tier: 'free' as const,
      role: 'student' as const,
      referred_by: null,
      onboarding_completed: true,
      preferences: {},
      created_at: '2023-01-01',
      updated_at: '2023-01-01',
      user_metadata: {},
      app_metadata: {},
    }

    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      resetPassword: jest.fn(),
      updatePassword: jest.fn(),
      updateProfile: jest.fn(),
      refreshUser: jest.fn(),
    })

    render(
      <AdminGuard>
        <div>Admin Content</div>
      </AdminGuard>
    )

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/auth/unauthorized')
    })
  })

  it('allows access when user has admin role', async () => {
    const mockAdminUser = {
      id: 'admin-1',
      email: 'admin@example.com',
      full_name: 'Admin User',
      tier: 'enterprise' as const,
      role: 'admin' as const,
      referred_by: null,
      onboarding_completed: true,
      preferences: {},
      created_at: '2023-01-01',
      updated_at: '2023-01-01',
      user_metadata: { role: 'admin' },
      app_metadata: { role: 'admin' },
    }

    mockUseAuth.mockReturnValue({
      user: mockAdminUser,
      loading: false,
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      resetPassword: jest.fn(),
      updatePassword: jest.fn(),
      updateProfile: jest.fn(),
      refreshUser: jest.fn(),
    })

    render(
      <AdminGuard>
        <div>Admin Content</div>
      </AdminGuard>
    )

    await waitFor(() => {
      expect(screen.getByText('Admin Content')).toBeInTheDocument()
    })
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('allows access in development for neetai.dev emails', async () => {
    // Mock development environment
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    const mockDevUser = {
      id: 'dev-1',
      email: 'dev@neetai.dev',
      full_name: 'Dev User',
      tier: 'free' as const,
      role: 'student' as const,
      referred_by: null,
      onboarding_completed: true,
      preferences: {},
      created_at: '2023-01-01',
      updated_at: '2023-01-01',
      user_metadata: {},
      app_metadata: {},
    }

    mockUseAuth.mockReturnValue({
      user: mockDevUser,
      loading: false,
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      resetPassword: jest.fn(),
      updatePassword: jest.fn(),
      updateProfile: jest.fn(),
      refreshUser: jest.fn(),
    })

    render(
      <AdminGuard>
        <div>Admin Content</div>
      </AdminGuard>
    )

    await waitFor(() => {
      expect(screen.getByText('Admin Content')).toBeInTheDocument()
    })
    expect(mockReplace).not.toHaveBeenCalled()

    // Restore environment
    process.env.NODE_ENV = originalEnv
  })
}