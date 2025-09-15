import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { jest } from '@jest/globals';

// Import components to test
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock Supabase and other dependencies
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

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('Accessibility Tests', () => {
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

  it('Button component should not have accessibility violations', async () => {
    const { container } = render(
      <div>
        <Button>Default Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="outline">Outline Button</Button>
        <Button disabled>Disabled Button</Button>
        <Button aria-label="Icon button" size="icon">
          <span aria-hidden="true">🔍</span>
        </Button>
      </div>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Card component should not have accessibility violations', async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Test Card Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is test card content.</p>
        </CardContent>
      </Card>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Form elements should have proper labels', async () => {
    const { container } = render(
      <form>
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          name="email"
          required
          aria-describedby="email-help"
        />
        <div id="email-help">Please enter a valid email address</div>
        
        <fieldset>
          <legend>Notification Preferences</legend>
          <label>
            <input type="checkbox" name="notifications" value="email" />
            Email notifications
          </label>
          <label>
            <input type="checkbox" name="notifications" value="sms" />
            SMS notifications
          </label>
        </fieldset>
        
        <Button type="submit">Submit Form</Button>
      </form>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Navigation should have proper landmarks', async () => {
    const { container } = render(
      <div>
        <header role="banner">
          <nav aria-label="Main navigation">
            <ul>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/students">Students</a></li>
              <li><a href="/analytics">Analytics</a></li>
            </ul>
          </nav>
        </header>
        <main>
          <h1>Page Title</h1>
          <p>Main content goes here.</p>
        </main>
        <footer role="contentinfo">
          <p>&copy; 2024 NEETAI Coach Portal</p>
        </footer>
      </div>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Tables should have proper headers', async () => {
    const { container } = render(
      <table>
        <caption>Student Performance Data</caption>
        <thead>
          <tr>
            <th scope="col">Student Name</th>
            <th scope="col">Subject</th>
            <th scope="col">Score</th>
            <th scope="col">Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>Mathematics</td>
            <td>95</td>
            <td>A</td>
          </tr>
          <tr>
            <td>Jane Smith</td>
            <td>Physics</td>
            <td>87</td>
            <td>B+</td>
          </tr>
        </tbody>
      </table>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Images should have proper alt text', async () => {
    const { container } = render(
      <div>
        <img 
          src="/logo.png" 
          alt="NEETAI Coach Portal Logo" 
          width={100} 
          height={50}
        />
        <img 
          src="/chart.png" 
          alt="Student performance chart showing improvement over 6 months" 
          width={400} 
          height={300}
        />
        <img 
          src="/decoration.png" 
          alt="" 
          role="presentation"
          width={50} 
          height={50}
        />
      </div>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Interactive elements should be keyboard accessible', async () => {
    const { container } = render(
      <div>
        <button type="button">Button</button>
        <a href="/link">Link</a>
        <input type="text" placeholder="Text input" />
        <select>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </select>
        <textarea placeholder="Textarea"></textarea>
      </div>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Color contrast should be sufficient', async () => {
    // This test will check for color contrast issues
    const { container } = render(
      <div>
        <div style={{ color: '#333', backgroundColor: '#fff' }}>
          Good contrast text
        </div>
        <Button variant="default">Default Button</Button>
        <Button variant="secondary">Secondary Button</Button>
      </div>
    );

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
    expect(results).toHaveNoViolations();
  });
});