import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { jest } from '@jest/globals';
import Dashboard from '../page';

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({
          data: [],
          error: null
        }))
      }))
    }))
  }
}));

// Mock the components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div data-testid="card" {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>
}));

jest.mock('@/components/dashboard/student-progress-chart', () => ({
  StudentProgressChart: () => <div data-testid="progress-chart">Progress Chart</div>
}));

jest.mock('@/components/dashboard/recent-activities', () => ({
  RecentActivities: () => <div data-testid="recent-activities">Recent Activities</div>
}));

jest.mock('@/components/dashboard/performance-metrics', () => ({
  PerformanceMetrics: () => <div data-testid="performance-metrics">Performance Metrics</div>
}));

jest.mock('@/components/dashboard/upcoming-sessions', () => ({
  UpcomingSessions: () => <div data-testid="upcoming-sessions">Upcoming Sessions</div>
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('Dashboard Page', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
  });

  afterEach(() => {
    queryClient.clear();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  it('renders dashboard page correctly', async () => {
    renderWithProviders(<Dashboard />);

    // Check if main heading is rendered
    expect(screen.getByText('Dashboard')).toBeInTheDocument();

    // Check if all dashboard components are rendered
    await waitFor(() => {
      expect(screen.getByTestId('progress-chart')).toBeInTheDocument();
      expect(screen.getByTestId('recent-activities')).toBeInTheDocument();
      expect(screen.getByTestId('performance-metrics')).toBeInTheDocument();
      expect(screen.getByTestId('upcoming-sessions')).toBeInTheDocument();
    });
  });

  it('displays welcome message', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
  });

  it('has proper page structure', () => {
    renderWithProviders(<Dashboard />);
    
    // Check for main container
    const container = screen.getByRole('main') || document.querySelector('.container');
    expect(container).toBeInTheDocument();
  });
});