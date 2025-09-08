# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NEET Prep AI Platform is India's most comprehensive and intelligent NEET preparation platform, built using a Turbo monorepo architecture. The platform combines 30+ years of historical question data with cutting-edge AI technology to deliver personalized, engaging, and effective learning experiences.

**Key Business Goals:**
- Capture 10% of Indian NEET prep market (230,000+ active users) within 24 months
- Achieve ₹15 crores ARR by Year 2 through freemium subscriptions and B2B partnerships
- Improve average student scores by 30-50% compared to traditional prep methods

## Architecture

### Monorepo Structure
```
├── apps/
│   ├── web/         # Main Next.js 15 student-facing application (port 3001)
│   ├── admin/       # Admin dashboard
│   └── coach/       # Coach portal
├── packages/
│   ├── ui/          # Shared UI components with Tailwind CSS v4 + Radix UI
│   ├── database/    # Supabase client, types & queries
│   ├── ai/          # AI services & prompt management
│   ├── auth/        # Authentication logic & hooks
│   ├── analytics/   # Tracking, metrics & observability
│   ├── config/      # Shared configurations & constants
│   ├── utils/       # Common utilities & helpers
│   └── types/       # Shared TypeScript types
```

## Technology Stack

- **Framework:** Next.js 15 (App Router, Turbopack, Server Components)
- **Language:** TypeScript 5.9.2 (strict mode)
- **Styling:** Tailwind CSS v4 + Radix UI + Framer Motion
- **Database:** Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Monorepo:** Turborepo
- **Package Manager:** npm workspaces
- **State Management:** Zustand + TanStack Query v5
- **Forms:** React Hook Form + Zod validation
- **AI:** OpenAI GPT-4o, Vercel AI SDK, @ai-sdk/openai
- **Infrastructure:** Vercel (Analytics, KV, Speed Insights, Blob)

## Development Commands

### Root Level Commands
```bash
# Start all apps in development mode
npm run dev

# Build all apps and packages
npm run build

# Lint all packages (with max warnings = 0)
npm run lint

# Type check all packages
npm run check-types

# Format code with Prettier
npm run format
```

### Workspace-Specific Commands
```bash
# Start specific app (web app runs on port 3001 with Turbopack)
npm run dev --filter=web
npm run dev --filter=admin
npm run dev --filter=coach

# Build specific app
npm run build --filter=web

# Type check specific package
npm run check-types --filter=@neet/auth
```

### Important Build Pipeline
The Turborepo pipeline in `turbo.json` ensures:
- Dependencies build before dependents (`"dependsOn": ["^build"]`)
- Environment variables are included in cache keys
- Build outputs are cached (`.next/**`, `dist/**`)
- Dev mode runs persistently without caching

## Code Architecture & Patterns

### Package Dependencies
All packages use workspace dependencies with `*` version:
- `@neet/ui`, `@neet/database`, `@neet/auth`, `@neet/config`, `@neet/ai`
- Shared configurations: `@repo/eslint-config`, `@repo/tailwind-config`, `@repo/typescript-config`

### TypeScript Configuration
- Extends shared config from `@repo/typescript-config/nextjs.json`
- Strict mode enabled across all packages
- Next.js plugin integration for App Router
- Consistent export patterns: main exports via `index.ts`, sub-exports via individual files

### Database Layer
- Supabase client in `@neet/database` package
- Typed exports: `./types`, `./client`
- Schema files organized in `packages/database/schema/`

### AI Integration
- Dedicated `@neet/ai` package for AI services
- OpenAI GPT-4o integration via `@ai-sdk/openai` and `ai` library
- Vercel AI SDK for streaming and optimized AI interactions

## Development Guidelines

### File Organization
- Components: One per file, PascalCase naming
- Utilities: camelCase, organized by feature
- Types: Shared in `@neet/types` package
- Configuration: Centralized in `@neet/config`

### Authentication
- Supabase Auth integration via `@neet/auth` package
- Custom hooks and providers for auth state management
- Row Level Security (RLS) policies in database

### Styling
- Tailwind CSS v4 with PostCSS
- Shared configuration in `@repo/tailwind-config`
- Radix UI for accessible components
- Framer Motion for animations

### Performance
- Next.js 15 App Router with Server Components
- Turbopack for fast development builds
- Vercel KV for caching
- TanStack Query for data fetching and caching

## Environment Setup

### Required Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# Vercel Services
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

### Prerequisites
- Node.js 18+ (specified in package.json engines)
- npm 10.8.2 (specified as packageManager)
- Supabase account and project
- OpenAI API key
- Vercel account for deployment

## Testing & Quality

### Type Checking
- Run `npm run check-types` before commits
- TypeScript strict mode enforced
- No `any` types allowed - use proper typing

### Linting
- ESLint with Next.js rules
- Max warnings set to 0 (build will fail on warnings)
- Prettier for code formatting

### Build Verification
- Always run `npm run build` to verify production builds
- Turborepo caching speeds up subsequent builds
- Check all apps build successfully

## Target Users & Use Cases

### Primary User: Arjun (17, Class 12, Tier-2 city)
- Goal: Score 650+ in NEET for government medical college
- Budget: ₹3,000-8,000/month for digital learning
- Primary device: Android smartphone with 4G/5G

### Secondary User: Priya (19, gap year, second attempt)
- Goal: Improve from 480 to 620+ score
- Budget: ₹2,000-5,000/month

### B2B User: Coach Sharma (Coaching institute owner)
- Goal: Improve student success rates
- Budget: ₹50,000-2,00,000 annually for institutional solutions

## Deployment

- **Platform:** Vercel
- **Main App:** `apps/web` - Student-facing application
- **Staging:** Auto-deploy from develop branch
- **Production:** Manual deploy from main branch
- **Preview:** Auto-deploy for all PRs

## Key Features Being Built

1. **Historical Intelligence:** 50,000+ NEET questions from 1988-2025
2. **Hyperpersonalized AI:** GPT-4o with subject-specialized models
3. **Voice AI Tutor:** Supporting 8 Indian languages
4. **AR Scanner:** OCR-based question scanning with gamification
5. **Predictive Analytics:** AI forecasts NEET scores with 90%+ accuracy
6. **Social Learning:** AI-powered study groups and peer collaboration

Remember: This is an EdTech platform focused on transforming traditional rote learning into an interactive, AI-powered experience for NEET preparation in India.