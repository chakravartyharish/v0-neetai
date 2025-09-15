import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminDashboard from '../../app/page'
import { useAuth } from '@neet/auth'

// Mock dependencies
jest.mock('@neet/auth')
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>
const mockSignOut = jest.fn()

describe('Admin Dashboard Integration', () => {
  const mockAdminUser = {
    id: 'admin-1',
    email: 'admin@neetai.dev',
    full_name: 'Admin User',
    tier: 'enterprise' as const,
    role: 'admin' as const,
    referred_by: null,
    onboarding_completed: true,
    preferences: {},
    created_at: '2023-01-01',
    updated_at: '2023-01-01',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuth.mockReturnValue({
      user: mockAdminUser,
      loading: false,
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: mockSignOut,
      resetPassword: jest.fn(),
      updatePassword: jest.fn(),
      updateProfile: jest.fn(),
      refreshUser: jest.fn(),
    })
  })

  it('renders admin dashboard with user information', () => {
    render(<AdminDashboard />)

    expect(screen.getByText('NEET Prep AI Admin')).toBeInTheDocument()
    expect(screen.getByText('Welcome, admin@neetai.dev')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument()
  })

  it('displays statistics cards', () => {
    render(<AdminDashboard />)

    expect(screen.getByText('Total Questions')).toBeInTheDocument()
    expect(screen.getByText('PDF Uploads')).toBeInTheDocument()
    expect(screen.getByText('Processing Queue')).toBeInTheDocument()
    expect(screen.getByText('Active Users')).toBeInTheDocument()
  })

  it('displays quick action buttons', () => {
    render(<AdminDashboard />)

    expect(screen.getByText('Upload NEET PDF')).toBeInTheDocument()
    expect(screen.getByText('Manage Questions')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('displays navigation cards', () => {
    render(<AdminDashboard />)

    expect(screen.getByText('Question Bank')).toBeInTheDocument()
    expect(screen.getByText('OCR Processing')).toBeInTheDocument()
    expect(screen.getByText('User Management')).toBeInTheDocument()
  })

  it('displays system status', () => {
    render(<AdminDashboard />)

    expect(screen.getByText('System Status')).toBeInTheDocument()
    expect(screen.getByText('OCR Service')).toBeInTheDocument()
    expect(screen.getByText('Database')).toBeInTheDocument()
    expect(screen.getByText('Storage')).toBeInTheDocument()

    // Check status indicators
    expect(screen.getAllByText('Active')).toHaveLength(1)
    expect(screen.getAllByText('Connected')).toHaveLength(1)
    expect(screen.getAllByText('85% Full')).toHaveLength(1)
  })

  it('handles logout functionality', async () => {
    const user = userEvent.setup()

    render(<AdminDashboard />)

    const logoutButton = screen.getByRole('button', { name: 'Logout' })
    await user.click(logoutButton)

    expect(mockSignOut).toHaveBeenCalled()
  })

  it('handles signOut error gracefully', async () => {
    const user = userEvent.setup()
    const consoleError = jest.spyOn(console, 'error').mockImplementation()

    mockSignOut.mockRejectedValue(new Error('Sign out failed'))

    render(<AdminDashboard />)

    const logoutButton = screen.getByRole('button', { name: 'Logout' })
    await user.click(logoutButton)

    expect(mockSignOut).toHaveBeenCalled()
    expect(consoleError).toHaveBeenCalledWith('Failed to sign out:', expect.any(Error))

    consoleError.mockRestore()
  })

  it('displays recent activity section', () => {
    render(<AdminDashboard />)

    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
    expect(screen.getByText('No recent activity')).toBeInTheDocument()
  })

  it('has proper navigation links', () => {
    render(<AdminDashboard />)

    // Check upload link
    const uploadLinks = screen.getAllByText('Upload NEET PDF')
    expect(uploadLinks[0].closest('a')).toHaveAttribute('href', '/upload')

    // Check questions link
    const questionLinks = screen.getAllByText(/Manage Questions|Question Bank/)
    const manageQuestionsLink = questionLinks.find(link =>
      link.textContent === 'Manage Questions'
    )
    expect(manageQuestionsLink?.closest('a')).toHaveAttribute('href', '/questions')

    // Check processing link
    const processingLink = screen.getByText('OCR Processing').closest('a')
    expect(processingLink).toHaveAttribute('href', '/processing')
  })

  it('displays all statistics with initial values', () => {
    render(<AdminDashboard />)

    // All stats should show 0 initially (mocked useState)
    const statValues = screen.getAllByText('0')
    expect(statValues).toHaveLength(4) // 4 statistics
  })

  it('has proper responsive layout classes', () => {
    render(<AdminDashboard />)

    const dashboard = screen.getByText('NEET Prep AI Admin').closest('.min-h-screen')
    expect(dashboard).toHaveClass('min-h-screen', 'bg-gray-50')

    // Check grid layouts exist
    expect(document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4')).toBeInTheDocument()
    expect(document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3')).toBeInTheDocument()
  })

  it('handles missing user gracefully', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: mockSignOut,
      resetPassword: jest.fn(),
      updatePassword: jest.fn(),
      updateProfile: jest.fn(),
      refreshUser: jest.fn(),
    })

    render(<AdminDashboard />)

    // Should still render but without user-specific content
    expect(screen.getByText('NEET Prep AI Admin')).toBeInTheDocument()
    expect(screen.queryByText('Welcome,')).not.toBeInTheDocument()
  })

  it('displays proper button variants and styles', () => {
    render(<AdminDashboard />)

    // Check different button variants exist
    expect(screen.getByRole('button', { name: 'Profile' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument()

    // Check action buttons
    expect(screen.getByText('View Questions').closest('button')).toBeInTheDocument()
    expect(screen.getByText('View Processing').closest('button')).toBeInTheDocument()
    expect(screen.getByText('Manage Users').closest('button')).toBeInTheDocument()
  })
}