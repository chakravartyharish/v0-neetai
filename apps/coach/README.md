# NEETAI Coach Portal

A comprehensive coaching platform for NEET exam preparation, built with Next.js 15, React 18, TypeScript, and Supabase.

## Overview

The NEETAI Coach Portal is a modern, full-featured web application designed for coaching institutes to manage their NEET preparation programs. It provides a complete solution for student management, test creation, analytics, communication, and administrative tasks with advanced features like PWA support, real-time analytics, and GDPR compliance.

## Features

### 🎓 Student Management
- Comprehensive student profiles with academic history
- Batch management and enrollment
- Performance tracking and analytics
- Parent contact management
- Bulk import/export capabilities

### 📊 Analytics & Reporting
- Real-time performance dashboards
- Predictive NEET score analytics
- Subject-wise performance tracking
- Custom report generation
- Parent and teacher insights

### 📝 Assessment Management
- Custom test creation with question bank integration
- Auto-grading and manual review
- Test scheduling and batch assignment
- Performance analysis and feedback

### 👥 Communication
- Parent-teacher communication portal
- Automated progress reports
- Announcement system
- SMS and email integration

### 💰 Billing & Subscriptions
- Subscription management
- Invoice generation
- Payment tracking
- Revenue analytics

### 🎨 White-Label Customization
- Custom branding and themes
- Domain customization
- Email template personalization
- Mobile app branding

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.2+ (strict mode)
- **Styling**: Tailwind CSS v4 + Radix UI
- **Database**: Supabase (PostgreSQL + Realtime)
- **Authentication**: Supabase Auth with RLS
- **State Management**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm 8+
- Supabase account
- Environment variables configured

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your Supabase credentials and other required environment variables.

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3002`

### Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run type-check` - Run TypeScript compiler check
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:e2e:ui` - Run E2E tests with UI mode
- `npm run test:a11y` - Run accessibility tests
- `npm run format` - Format code with Prettier
- `npm run analyze` - Analyze bundle size

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Main dashboard pages
│   ├── login/             # Authentication pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── forms/            # Form components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
├── services/             # API service layers
├── stores/               # Zustand state management
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

## Key Features Implementation

### Authentication & Authorization
- Role-based access control (Institute Owner, Teacher, Admin Staff, Parent)
- Supabase Auth integration with middleware protection
- Session management and automatic token refresh

### Dashboard & Navigation
- Responsive sidebar with role-based menu items
- Real-time metrics and analytics
- Quick action buttons for common tasks

### Student Management
- Advanced filtering and search capabilities
- Bulk operations (import, export, assign batches)
- Detailed performance tracking
- Parent contact management

### Assessment System
- Integration with NEETAI question bank
- Custom test creation with multiple question types
- Automated grading and analysis
- Scheduling and batch assignment

### Analytics & Reporting
- Student performance trends
- Batch comparison analytics
- Subject-wise insights
- Predictive NEET score modeling

### Communication System
- Multi-channel notifications (email, SMS, in-app)
- Parent-teacher communication
- Automated progress reports
- Announcement system

## API Integration

The coach portal integrates with the main NEETAI platform through:

- **Question Bank API**: Access to 50,000+ NEET questions
- **AI Tutoring API**: AI-powered explanations and insights
- **Analytics API**: Advanced performance analytics
- **Sync APIs**: Real-time data synchronization

## Testing Strategy

### Unit & Integration Tests
- **Framework**: Jest + React Testing Library + jsdom
- **Location**: `src/**/__tests__/`
- **Coverage**: Minimum 80% code coverage required
- **Run**: `npm run test`
- **Watch Mode**: `npm run test:watch`
- **Coverage Report**: `npm run test:coverage`

### End-to-End Tests
- **Framework**: Playwright
- **Location**: `tests/`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome/Safari
- **Features Tested**: Authentication, Dashboard, Student Management, Test Creation
- **Run**: `npm run test:e2e`
- **Debug Mode**: `npm run test:e2e:debug`

### Accessibility Tests
- **Framework**: jest-axe
- **Standards**: WCAG 2.1 AA compliance
- **Features**: Keyboard navigation, screen reader support, color contrast
- **Run**: `npm run test:a11y`

### Performance Tests
- **Framework**: Lighthouse CI
- **Metrics**: Performance (>80), Accessibility (>90), SEO (>80), Best Practices (>80)
- **Pages Tested**: Home, Dashboard, Students, Analytics
- **Run**: Automatically in CI/CD pipeline

### Security Tests
- **Tools**: npm audit, Snyk security scanning
- **Coverage**: Dependency vulnerabilities, security headers, input validation
- **Run**: Automatically in CI/CD pipeline

### Cross-Browser Testing
- **Desktop**: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Android 90+
- **Testing**: Automated via Playwright in CI/CD

## Security & Compliance

- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Field-level encryption for sensitive data
- **Row Level Security (RLS)**: Database-level security policies
- **Input Validation**: Zod schemas for all user inputs
- **XSS Prevention**: Content Security Policy headers
- **CSRF Protection**: SameSite cookies and CSRF tokens
- **Rate Limiting**: Request throttling and abuse prevention
- **Audit Logging**: Comprehensive action logging
- **GDPR Compliance**: Data export, deletion, and consent management
- **Security Headers**: Strict-Transport-Security, X-Frame-Options, etc.

## Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Link your GitHub repository to Vercel
   - Configure build settings:
     - Build Command: `npm run build`
     - Output Directory: `.next`
     - Install Command: `npm install`

2. **Environment Variables**
   - Add all required environment variables
   - Ensure production URLs and keys are configured
   - Set `NODE_ENV=production`

3. **Deploy**
   ```bash
   npm run build  # Test build locally first
   vercel --prod  # Deploy to production
   ```

### CI/CD Pipeline

The project includes a comprehensive GitHub Actions workflow:

#### Continuous Integration
- **Code Quality**: ESLint, Prettier, TypeScript checks
- **Testing**: Unit tests with coverage (>80%), E2E tests
- **Security**: npm audit, Snyk vulnerability scanning
- **Performance**: Lighthouse CI performance testing
- **Accessibility**: WCAG 2.1 compliance testing
- **Cross-Browser**: Automated testing on multiple browsers

#### Continuous Deployment
- **Preview Deployments**: Automatic deployments for pull requests
- **Production Deployment**: Automatic deployment on merge to main
- **Environment Management**: Separate staging and production environments
- **Rollback Support**: Quick rollback capabilities
- **Monitoring**: Sentry error tracking and performance monitoring
- **Notifications**: Slack integration for deployment status

#### Deployment Features
- **Zero-Downtime**: Rolling deployments with health checks
- **CDN**: Global content delivery network
- **SSL**: Automatic SSL certificate management
- **Performance**: Edge caching and optimization
- **Scaling**: Automatic scaling based on traffic

## Subscription Tiers

### White-Label Solution
- **Setup Fee**: ₹5,00,000 (one-time)
- **Monthly per student**: ₹99
- **Minimum**: 100 students
- Custom branding, dedicated support, analytics portal

### Integration Package
- **API Access**: ₹50,000/month
- **Teacher Dashboard**: ₹25,000/month
- Question bank, AI tutoring, analytics APIs

### School Partnerships
- **Institution License**: ₹2,00,000/year
- Unlimited students, complete curriculum integration
- Teacher training and support included

## Support

For technical support and questions:
- Create an issue in the repository
- Contact the NEETAI development team
- Check the documentation and guides

## License

This project is proprietary software. All rights reserved.

---

Built with ❤️ for NEET coaching institutes across India.