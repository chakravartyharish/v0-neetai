# NEETAI Coach Portal - Comprehensive Frontend Development Plan for v0

**Version**: 1.0  
**Platform**: v0 by Vercel  
**Backend**: Supabase  
**Deployment**: Vercel  
**Framework**: Next.js 15 with TypeScript  
**UI Library**: Tailwind CSS + Radix UI  
**Methodology**: BMAD (Behavior-driven, Modular, Agile, Documentation)

---

## 🎯 Project Overview

The NEETAI Coach Portal is a comprehensive coaching platform for NEET exam preparation institutes. This document provides complete specifications for developing the entire frontend application using v0 Vercel, integrated with Supabase backend and deployed to Vercel.

### Key Stakeholders
- **Institute Owners**: Manage entire coaching operations
- **Teachers/Coaches**: Conduct classes, create tests, monitor students
- **Students**: Access learning materials, take tests, track progress
- **Parents**: Monitor child's progress and communicate with teachers
- **Admin Staff**: Handle administrative tasks and support

---

## 📋 Complete Feature Specification

### 1. Authentication & User Management
```typescript
// User Roles
type UserRole = 'institute_owner' | 'teacher' | 'admin_staff' | 'parent' | 'student';

// Authentication Features
- Multi-factor authentication (MFA)
- Social login (Google, Microsoft)
- Role-based access control (RBAC)
- Parent-student account linking
- Session management
- Password recovery
- Email verification
```

### 2. Dashboard Systems

#### Institute Owner Dashboard
- Real-time metrics (students, revenue, performance)
- Teacher performance analytics
- Financial overview
- Subscription management
- White-label customization

#### Teacher Dashboard  
- Class schedule management
- Student performance tracking
- Test creation and grading
- Resource management
- Parent communication

#### Student Dashboard
- Personalized learning path
- Test schedule and attempts
- Performance analytics
- Study materials access
- Achievement badges

#### Parent Dashboard
- Child's progress overview
- Test results and analytics
- Fee payment status
- Communication with teachers
- Attendance tracking

### 3. Student Management System
- Comprehensive student profiles
- Batch organization and management
- Performance tracking and analytics
- Bulk import/export (CSV/Excel)
- Parent contact management
- Medical information storage
- Document management

### 4. Test & Assessment System
- Custom test creation interface
- Question bank integration (50,000+ NEET questions)
- Multiple question types (MCQ, Numerical, Assertion-Reasoning)
- Auto-grading with manual review option
- Detailed performance analytics
- Test scheduling and assignment
- Mock test simulations
- Previous year paper practice

### 5. Analytics & Reporting
- Real-time performance dashboards
- Predictive NEET score modeling
- Subject-wise performance analysis
- Weak area identification
- Comparative analytics (batch/institute level)
- Custom report generation
- Parent progress reports
- Export to PDF/Excel

### 6. Communication Hub
- In-app messaging system
- Announcement broadcasting
- Email/SMS integration
- Parent-teacher meetings scheduler
- Notification center
- Discussion forums
- Doubt resolution system

### 7. Resource Management
- Study material library
- Video content management
- Document sharing
- Subject-wise categorization
- Access control levels
- Version control for materials
- Resource analytics

### 8. Gamification Features
- Achievement badge system
- Leaderboards (batch/institute/subject)
- Points and rewards system
- Study streaks tracking
- Challenges and competitions
- Milestone celebrations
- Peer competitions

### 9. Billing & Subscription
- Subscription tier management
- Invoice generation
- Payment tracking (Stripe integration)
- Fee reminders
- Revenue analytics
- Refund management
- Payment history

### 10. White-Label Customization
- Custom branding (logo, colors, fonts)
- Domain customization
- Email template personalization
- Custom landing pages
- Theme customization
- Mobile app branding

---

## 🏗️ Technical Architecture

### Frontend Stack
```json
{
  "framework": "Next.js 15.0.0",
  "language": "TypeScript 5.2+",
  "styling": "Tailwind CSS v3.3.5",
  "ui-components": "Radix UI",
  "state-management": "Zustand",
  "data-fetching": "TanStack Query v5",
  "forms": "React Hook Form + Zod",
  "charts": "Recharts",
  "animations": "Framer Motion",
  "icons": "Lucide React"
}
```

### Backend Integration (Supabase)
```typescript
// Supabase Configuration
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  features: {
    auth: true,
    database: true,
    storage: true,
    realtime: true,
    edge_functions: true
  }
};
```

---

## 💾 Complete Database Schema

### Core Tables Structure

```sql
-- 1. User Management
CREATE TYPE user_role AS ENUM ('institute_owner', 'teacher', 'admin_staff', 'parent', 'student');
CREATE TYPE subscription_tier AS ENUM ('basic', 'professional', 'enterprise', 'white_label');

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  institute_id UUID REFERENCES institutes(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Institute Management
CREATE TABLE institutes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  address JSONB,
  subscription_tier subscription_tier DEFAULT 'basic',
  subscription_status TEXT DEFAULT 'active',
  settings JSONB DEFAULT '{}',
  branding JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Batch Management
CREATE TABLE batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  institute_id UUID REFERENCES institutes(id),
  teacher_id UUID REFERENCES profiles(id),
  subject TEXT,
  schedule JSONB,
  capacity INTEGER,
  current_strength INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Student Management
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  batch_id UUID REFERENCES batches(id),
  parent_id UUID REFERENCES profiles(id),
  enrollment_date DATE,
  target_neet_year INTEGER,
  performance_data JSONB DEFAULT '{}',
  attendance_data JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Test Management
CREATE TABLE tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  institute_id UUID REFERENCES institutes(id),
  created_by UUID REFERENCES profiles(id),
  subject TEXT,
  topics TEXT[],
  questions JSONB NOT NULL,
  duration INTEGER, -- in minutes
  total_marks INTEGER,
  negative_marking DECIMAL,
  scheduled_at TIMESTAMP,
  batch_ids UUID[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. Test Attempts
CREATE TABLE test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES tests(id),
  student_id UUID REFERENCES students(id),
  started_at TIMESTAMP,
  submitted_at TIMESTAMP,
  answers JSONB,
  score DECIMAL,
  rank INTEGER,
  analytics JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 7. Resources
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('document', 'video', 'link', 'quiz')),
  content_url TEXT,
  subject TEXT,
  topics TEXT[],
  institute_id UUID REFERENCES institutes(id),
  created_by UUID REFERENCES profiles(id),
  access_level TEXT DEFAULT 'all',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 8. Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id),
  receiver_id UUID REFERENCES profiles(id),
  subject TEXT,
  content TEXT NOT NULL,
  attachments JSONB,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 9. Gamification
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  criteria JSONB NOT NULL,
  points INTEGER DEFAULT 0,
  institute_id UUID REFERENCES institutes(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE student_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  badge_id UUID REFERENCES badges(id),
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, badge_id)
);

-- 10. Analytics Events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
-- ... (enable for all tables)

-- Institute Owner Policies
CREATE POLICY "Institute owners have full access to their institute"
  ON institutes FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM profiles 
    WHERE role = 'institute_owner' 
    AND institute_id = institutes.id
  ));

-- Teacher Policies  
CREATE POLICY "Teachers can view their assigned students"
  ON students FOR SELECT
  USING (auth.uid() IN (
    SELECT teacher_id FROM batches 
    WHERE id = students.batch_id
  ));

-- Student Policies
CREATE POLICY "Students can view own data"
  ON students FOR SELECT
  USING (profile_id = auth.uid());

-- Parent Policies
CREATE POLICY "Parents can view their children's data"
  ON students FOR SELECT
  USING (parent_id = auth.uid());
```

---

## 🎨 Complete UI Component Library

### Design System Configuration

```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#E8F5FF',
          100: '#C3E7FF',
          200: '#8AD1FF',
          300: '#4DB8FF',
          400: '#1A9FFF',
          500: '#0084FF', // Primary brand color
          600: '#0066CC',
          700: '#004A99',
          800: '#003166',
          900: '#001933',
        },
        success: {
          light: '#D4EDDA',
          DEFAULT: '#28A745',
          dark: '#1E7E34',
        },
        warning: {
          light: '#FFF3CD',
          DEFAULT: '#FFC107',
          dark: '#D39E00',
        },
        danger: {
          light: '#F8D7DA',
          DEFAULT: '#DC3545',
          dark: '#BD2130',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      }
    }
  }
}
```

### Component Library Structure

```typescript
// 1. Base Components (Atoms)
components/ui/
├── Button.tsx
├── Input.tsx
├── Select.tsx
├── Checkbox.tsx
├── Radio.tsx
├── Card.tsx
├── Badge.tsx
├── Avatar.tsx
├── Spinner.tsx
├── Typography/
│   ├── Heading.tsx
│   ├── Text.tsx
│   └── Label.tsx

// 2. Composite Components (Molecules)
components/composite/
├── FormField.tsx
├── DataTable.tsx
├── StatCard.tsx
├── NotificationBadge.tsx
├── SearchBar.tsx
├── DatePicker.tsx
├── TimePicker.tsx
├── FileUpload.tsx

// 3. Layout Components (Organisms)
components/layout/
├── Navbar.tsx
├── Sidebar.tsx
├── DashboardLayout.tsx
├── AuthLayout.tsx
├── Modal.tsx
├── Drawer.tsx
├── Toast.tsx

// 4. Feature Components
components/features/
├── StudentCard.tsx
├── TestCard.tsx
├── BatchSelector.tsx
├── ResourceViewer.tsx
├── ChatInterface.tsx
├── LeaderboardTable.tsx
├── AnalyticsChart.tsx
├── QuestionBuilder.tsx
├── PaymentForm.tsx
```

---

## 📁 Complete Project Structure

```
neetai-coach/
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (auth)/                  # Authentication routes
│   │   │   ├── login/
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/              # Protected routes
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── students/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── edit/page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   ├── batches/
│   │   │   ├── tests/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── create/
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── attempt/page.tsx
│   │   │   │       └── results/page.tsx
│   │   │   ├── analytics/
│   │   │   ├── resources/
│   │   │   ├── messages/
│   │   │   ├── settings/
│   │   │   └── billing/
│   │   ├── api/
│   │   │   ├── auth/[...supabase]/route.ts
│   │   │   ├── webhooks/
│   │   │   │   ├── stripe/route.ts
│   │   │   │   └── supabase/route.ts
│   │   │   └── cron/route.ts
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                      # Base components
│   │   ├── composite/               # Composite components
│   │   ├── layout/                  # Layout components
│   │   └── features/                # Feature-specific
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── api/
│   │   │   ├── students.ts
│   │   │   ├── tests.ts
│   │   │   └── analytics.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useSupabase.ts
│   │   │   └── useRealtime.ts
│   │   ├── stores/
│   │   │   ├── authStore.ts
│   │   │   ├── uiStore.ts
│   │   │   └── instituteStore.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── constants.ts
│   │   └── schemas/                 # Zod schemas
│   │       ├── auth.ts
│   │       ├── student.ts
│   │       └── test.ts
│   ├── types/
│   │   ├── database.ts
│   │   ├── supabase.ts
│   │   └── index.ts
│   └── middleware.ts
├── public/
│   ├── manifest.json
│   ├── sw.js
│   └── icons/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── config files...
```

---

## 🔧 Implementation Guide for v0

### Phase 1: Foundation Setup (Days 1-3)

#### Step 1: Initialize Project
```bash
# In v0, start with this prompt:
"Create a Next.js 15 app with TypeScript, Tailwind CSS, and Supabase integration for a NEET coaching portal"
```

#### Step 2: Setup Authentication
```typescript
// Implement complete auth flow
- Login page with email/password
- Registration with role selection
- Password recovery flow
- Email verification
- Social login buttons
- Protected route middleware
```

#### Step 3: Database Configuration
```sql
-- Provide this schema to v0:
"Create Supabase tables for user profiles, institutes, students, tests, and implement RLS policies for role-based access"
```

### Phase 2: Core Dashboard (Days 4-7)

#### Step 4: Dashboard Layouts
```typescript
// Role-based dashboards
- Institute owner dashboard with metrics
- Teacher dashboard with class management
- Student dashboard with learning path
- Parent dashboard with progress tracking
```

#### Step 5: Navigation System
```typescript
// Implement responsive navigation
- Collapsible sidebar
- Role-based menu items
- Breadcrumb navigation
- Mobile-responsive drawer
```

### Phase 3: Student Management (Days 8-11)

#### Step 6: Student CRUD Operations
```typescript
// Complete student management
- Student list with search/filter
- Add/Edit student forms
- Batch assignment
- Parent linking
- Bulk import from CSV
```

#### Step 7: Performance Tracking
```typescript
// Analytics implementation
- Individual student analytics
- Batch comparison charts
- Subject-wise analysis
- Progress timeline
```

### Phase 4: Test System (Days 12-16)

#### Step 8: Test Creation
```typescript
// Test builder interface
- Question creation (MCQ, Numerical)
- Question bank integration
- Test configuration
- Scheduling system
```

#### Step 9: Test Attempt Interface
```typescript
// Student test interface
- Timer implementation
- Question navigation
- Auto-save answers
- Submit with confirmation
- Result display
```

### Phase 5: Advanced Features (Days 17-21)

#### Step 10: Real-time Features
```typescript
// Supabase realtime
- Live notifications
- Chat messaging
- Online presence
- Live test monitoring
```

#### Step 11: Gamification
```typescript
// Engagement features
- Badge system
- Leaderboards
- Points calculation
- Achievement notifications
```

### Phase 6: Analytics & Reports (Days 22-25)

#### Step 12: Analytics Dashboard
```typescript
// Comprehensive analytics
- Performance trends
- Predictive scoring
- Custom reports
- Export functionality
```

### Phase 7: Final Polish (Days 26-30)

#### Step 13: PWA Conversion
```typescript
// Progressive Web App
- Service worker
- Offline functionality
- Push notifications
- App manifest
```

#### Step 14: Security & Optimization
```typescript
// Production readiness
- Security headers
- Performance optimization
- Error boundaries
- Loading states
```

---

## 🚀 v0 Prompts for Each Component

### Authentication System
```
Create a complete authentication system with:
- Login page with email/password and social login options
- Registration page with role selection (institute_owner, teacher, student, parent)
- Password recovery flow with email verification
- Protected routes using Supabase auth
- Middleware for role-based access control
```

### Dashboard Components
```
Build a role-based dashboard system:
- Institute owner: metrics cards, revenue chart, teacher performance
- Teacher: class schedule, student list, test management
- Student: learning progress, upcoming tests, achievements
- Parent: child's performance, fee status, communication
Use Recharts for visualizations and Tailwind for responsive design
```

### Student Management
```
Create a student management system with:
- DataTable component with search, sort, and filter
- Add/Edit student form with validation using React Hook Form and Zod
- Batch assignment dropdown
- Parent account linking
- Bulk import from CSV with preview
- Student profile page with tabs for info, performance, attendance
```

### Test Creation Interface
```
Build a comprehensive test creation system:
- Question builder supporting MCQ and numerical questions
- Rich text editor for question content
- Image upload for questions
- Difficulty level selector
- Topic tagging system
- Test configuration (duration, marks, negative marking)
- Preview mode before publishing
```

### Analytics Dashboard
```
Implement analytics dashboard with:
- Line chart for performance trends over time
- Radar chart for subject-wise analysis
- Bar chart for batch comparisons
- Heatmap for topic-wise performance
- Predictive NEET score calculation
- Export to PDF/Excel functionality
```

### Real-time Chat
```
Create a real-time messaging system using Supabase:
- Chat interface with message list
- Typing indicators
- Read receipts
- File attachments
- Parent-teacher communication
- Announcement broadcasting
```

### Gamification Components
```
Build gamification features:
- Badge showcase grid
- Animated leaderboard with rank changes
- Points counter with animations
- Achievement notifications
- Progress bars for goals
- Streak calendar component
```

### PWA Implementation
```
Convert the app to PWA:
- Service worker for offline caching
- App manifest with icons
- Install prompt component
- Push notification handler
- Background sync for data
- Update notification banner
```

---

## 🔐 Security Implementation

### Authentication Security
```typescript
// Implement these security measures:
1. JWT token rotation
2. Session timeout management
3. Rate limiting on auth endpoints
4. CAPTCHA for registration
5. Email verification requirement
6. Strong password validation
```

### Data Protection
```typescript
// Data security features:
1. Field-level encryption for PII
2. HTTPS enforcement via middleware
3. Content Security Policy headers
4. XSS protection with sanitization
5. SQL injection prevention
6. CORS configuration
```

---

## 📊 Performance Optimization

### Code Optimization
```typescript
// Performance improvements:
1. Dynamic imports for code splitting
2. Image optimization with next/image
3. Lazy loading for components
4. Memoization for expensive computations
5. Virtual scrolling for long lists
6. Debouncing for search inputs
```

### Caching Strategy
```typescript
// Implement caching:
1. Static page generation where possible
2. API response caching
3. Browser cache headers
4. Service worker caching
5. Supabase query caching
```

---

## 🧪 Testing Requirements

### Unit Tests
```typescript
// Test coverage requirements:
- Component rendering tests
- Hook functionality tests
- Utility function tests
- Schema validation tests
- Store action tests
```

### Integration Tests
```typescript
// Integration testing:
- Auth flow testing
- API endpoint testing
- Database operation tests
- Real-time subscription tests
```

### E2E Tests
```typescript
// End-to-end scenarios:
- Complete user registration flow
- Student management workflow
- Test creation and attempt
- Payment processing
- Report generation
```

---

## 📝 Environment Variables

```bash
# .env.local configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe Integration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email Service
SENDGRID_API_KEY=your-sendgrid-key
EMAIL_FROM=noreply@neetai.com

# SMS Service
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Application URLs
NEXT_PUBLIC_APP_URL=https://coach.neetai.com
NEXT_PUBLIC_MAIN_APP_URL=https://app.neetai.com

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

## 🚢 Deployment Configuration

### Vercel Deployment
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["bom1"],
  "functions": {
    "app/api/webhooks/stripe/route.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 📚 Additional Resources

### Supabase Setup Commands
```sql
-- Run these in Supabase SQL editor:
1. Create all tables from schema
2. Enable RLS on all tables
3. Create RLS policies
4. Create database functions
5. Setup auth triggers
```

### Required npm Packages
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.38.4",
    "@supabase/auth-helpers-nextjs": "^0.8.7",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@tanstack/react-query": "^5.8.4",
    "@tanstack/react-table": "^8.10.7",
    "react-hook-form": "^7.48.2",
    "@hookform/resolvers": "^3.3.2",
    "zod": "^3.22.4",
    "zustand": "^4.4.7",
    "recharts": "^2.8.0",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.294.0",
    "framer-motion": "^10.16.4",
    "class-variance-authority": "^0.7.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

---

## ✅ Development Checklist

### Week 1: Foundation
- [ ] Project setup with v0
- [ ] Supabase configuration
- [ ] Authentication implementation
- [ ] Basic routing structure
- [ ] Component library setup

### Week 2: Core Features
- [ ] Dashboard implementations
- [ ] Student management CRUD
- [ ] Batch organization
- [ ] Basic analytics

### Week 3: Advanced Features
- [ ] Test creation system
- [ ] Test attempt interface
- [ ] Resource management
- [ ] Messaging system

### Week 4: Enhancement
- [ ] Gamification features
- [ ] Real-time updates
- [ ] PWA conversion
- [ ] Performance optimization

### Week 5: Production
- [ ] Security hardening
- [ ] Testing implementation
- [ ] Documentation
- [ ] Deployment setup
- [ ] Launch preparation

---

## 🎯 Success Metrics

### Performance Targets
- Lighthouse Score: 90+
- First Contentful Paint: <1.5s
- Time to Interactive: <3.5s
- Bundle Size: <500KB initial

### User Experience Goals
- Mobile Responsive: 100%
- Accessibility: WCAG 2.1 AA
- Browser Support: Chrome 90+, Firefox 90+, Safari 14+
- Offline Capability: Core features available

### Business Metrics
- User Onboarding: <5 minutes
- Test Creation: <10 minutes
- Report Generation: <30 seconds
- Support Ticket Resolution: <24 hours

---

## 📞 Support & Documentation

### Development Support
- BMAD Methodology Documentation
- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
- v0 Documentation: https://v0.dev/docs

### Contact Information
- Technical Lead: Available via project repository
- Design System: Refer to Figma designs (if available)
- API Documentation: Integrated Swagger/OpenAPI specs

---

**This comprehensive plan provides everything needed to build the complete NEETAI Coach Portal frontend in v0 Vercel. Follow the phases sequentially for best results.**