# NEET Prep AI Platform

🚀 **India's most comprehensive and intelligent NEET preparation platform** that combines 30+ years of historical question data with cutting-edge AI technology.

## 📋 Overview

Building India's leading AI-powered NEET preparation platform that transforms traditional rote learning into an interactive, social, and data-driven journey. Our platform delivers personalized learning experiences, adaptive quizzes, voice AI tutoring in 8 Indian languages, AR question scanning, and collaborative study features.

### 🎯 Business Objectives (PRD v3)
- **Market Leadership**: Capture 10% of Indian NEET prep market (230,000+ active users) within 24 months
- **Revenue Target**: Achieve ₹15 crores ARR by Year 2 through freemium subscriptions and B2B partnerships
- **Student Impact**: Improve average student scores by 30-50% compared to traditional prep methods
- **Innovation**: Pioneer multimodal AI (voice, vision, AR) in Indian EdTech with mobile-first approach

## 🏗️ Architecture

This project uses a **Turbo monorepo** structure with shared packages and multiple applications:

```
neet-prep-platform/
├── apps/
│   ├── web/         # Main Next.js 14 web application
│   ├── admin/       # Admin dashboard
│   └── coach/       # Coach portal
├── packages/
│   ├── ui/          # Shared UI components
│   ├── database/    # Supabase client & types
│   ├── ai/          # AI services
│   ├── auth/        # Authentication logic
│   ├── config/      # Shared configurations
│   └── ...
```

## ✨ Features

### 🎓 Core Learning Features (Enhanced per PRD v3)
- 📚 **Historical Intelligence** - 50,000+ NEET questions from 1988-2025 with AI-powered insights
- 🧠 **Hyperpersonalized AI** - GPT-4o-2024-11-20 with subject-specialized fine-tuned models
- 📊 **Predictive Analytics** - AI forecasts final NEET score with 90%+ accuracy
- 🎯 **Adaptive Quiz Engine** - IRT-based with real-time emotional intelligence adaptation
- 🗣️ **"NEET Buddy 3.0"** - Voice AI tutor supporting 8 Indian languages with cultural context

### 🚀 Advanced Features
- 📱 **AR Scanner + Battle Mode** - Gamified competitive problem-solving with OCR
- 👥 **AI-Powered Study Groups** - Smart matchmaking based on learning styles and performance
- 📈 **Multi-dimensional Analytics** - Student, parent, and educator dashboards with predictive insights
- 🎮 **Social Learning Network** - Peer tutoring, competitions, and knowledge sharing
- 🧘 **Wellness Integration** - Stress detection, break recommendations, and biometric tracking

### Technical Features
- ⚡ **Real-time Sync** - Live collaboration features
- 🔐 **Secure Authentication** - Supabase Auth with RLS
- 💳 **Payment Integration** - Stripe subscription management
- 📱 **Mobile Ready** - Responsive design (React Native app coming soon)

## 🛠️ Tech Stack

### 💻 Frontend Stack (Updated per PRD v3)
- **Framework:** Next.js 15 (App Router, Edge Runtime, Server Components)
- **Language:** TypeScript 5.2+ (strict mode)
- **Styling:** Tailwind CSS v4 + Radix UI + Framer Motion
- **Mobile:** React Native 0.74 + Expo SDK 51
- **State:** Zustand + TanStack Query v5
- **Forms:** React Hook Form + Zod validation

### 🔧 Backend & AI Stack
- **Database:** Supabase (PostgreSQL 15 + Realtime + Storage)
- **Primary AI:** OpenAI GPT-4o-2024-11-20
- **Specialized Models:** Fine-tuned Physics, Chemistry, Biology experts
- **Voice AI:** Whisper-v3 + ElevenLabs Pro
- **Vision AI:** GPT-4o Vision + Google Vision API
- **ML Platform:** Hugging Face + Custom PyTorch models
- **Vector DB:** Pinecone for semantic search
- **Cache:** Vercel KV (Redis)
- **Search:** Typesense

### Infrastructure
- **Hosting:** Vercel
- **Monorepo:** Turborepo
- **Package Manager:** npm workspaces

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm 8+
- Supabase account
- OpenAI API key
- Vercel account (optional for deployment)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/neet-prep-ai.git
cd neet-prep-ai
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
# ... other variables
```

4. **Set up the database:**
```bash
# Run Supabase migrations
npm run db:migrate

# Generate TypeScript types
npm run db:generate
```

### Development

**Start all apps in development mode:**
```bash
npm run dev
```

**Start specific app:**
```bash
npm run dev --filter=web
```

**Build all packages:**
```bash
npm run build
```

**Run tests:**
```bash
npm run test
```

**Lint code:**
```bash
npm run lint
```

## 📦 Package Scripts

### Root Commands
- `npm run dev` - Start all apps in development mode
- `npm run build` - Build all apps and packages
- `npm run lint` - Lint all packages
- `npm run test` - Run all tests
- `npm run db:generate` - Generate Supabase types
- `npm run db:migrate` - Run database migrations

### App-specific Commands
- `npm run dev --filter=web` - Start web app only
- `npm run build --filter=admin` - Build admin app only

## 🗂️ Project Structure

```
.
├── apps/
│   ├── web/              # Main student-facing web app
│   │   ├── app/          # Next.js App Router
│   │   ├── components/   # App-specific components
│   │   └── public/       # Static assets
│   ├── admin/            # Admin dashboard
│   └── coach/            # Coach portal
├── packages/
│   ├── ui/               # Shared UI components
│   ├── database/         # Database client & types
│   ├── auth/             # Authentication logic
│   ├── ai/               # AI services
│   ├── config/           # Shared configuration
│   ├── analytics/        # Analytics tracking
│   └── utils/            # Utility functions
├── .env.example          # Environment variables template
├── .warp.md              # Project rules & guidelines
├── turbo.json            # Turborepo configuration
└── package.json          # Root package.json
```

## 🔧 Configuration

### Turbo Pipeline

The build pipeline is configured in `turbo.json`:
- Packages build in dependency order
- Caching enabled for faster builds
- Environment variables properly scoped

### TypeScript

Strict mode enabled across all packages:
- No implicit any
- Strict null checks
- Consistent type imports

## 🚢 Deployment

### Vercel Deployment

1. **Connect to Vercel:**
```bash
npx vercel link
```

2. **Deploy to staging:**
```bash
npx vercel
```

3. **Deploy to production:**
```bash
npx vercel --prod
```

### Environment Variables

Set the following in Vercel dashboard:
- All variables from `.env.example`
- Different values for staging/production

## 👥 Target Users (PRD v3)

### Primary: Arjun - The Determined Aspirant
- **Profile**: 17-year-old Class 12 student from Tier-2 city
- **Goal**: Score 650+ in NEET, admission to government medical college
- **Budget**: ₹3,000-8,000/month for digital learning tools
- **Tech**: Primary smartphone user (Android) with 4G/5G

### Secondary: Priya - The Working Student
- **Profile**: 19-year-old gap year student, second NEET attempt
- **Goal**: Improve from 480 to 620+ score
- **Budget**: ₹2,000-5,000/month for comprehensive prep tools

### Tertiary: Coach Sharma - The Modern Educator
- **Profile**: 42-year-old coaching institute owner in Tier-2 city
- **Goal**: Improve student success rates and differentiate institute
- **Budget**: ₹50,000-2,00,000 annually for institutional solutions

## 💰 Monetization Strategy (PRD v3)

### Freemium Tiers
- **Free**: 100 questions/day, 2 mock tests/month, 10 AI explanations/day
- **Premium (₹199/month)**: Unlimited questions, advanced voice AI, AR features, parent dashboard
- **Premium Plus (₹399/month)**: One-on-one mentorship, expert doubt clearing, career guidance

### Revenue Projections
- **Year 1**: ₹3.4 crores (50K users, 20% conversion)
- **Year 2**: ₹11.3 crores (150K users, 25% conversion)
- **Year 3**: ₹25.5 crores (300K users, 30% conversion)

### B2B Revenue
- **Coaching Institutes**: ₹5L setup + ₹99/student/month
- **Schools**: ₹2L annual license for unlimited students
- **API Licensing**: ₹50K/month for question bank and AI APIs

## 🎯 Success Metrics (PRD v3)

### Educational Impact
- **Score Improvement**: 40% average improvement in mock tests within 3 months
- **NEET Prediction Accuracy**: 90% accuracy within ±25 points
- **Student Engagement**: 75+ minutes average session time
- **Retention**: 90% monthly retention for premium users

### Technical Performance
- **API Latency**: <100ms (95th percentile)
- **Page Load**: <1.5s (First Contentful Paint)
- **Uptime**: 99.99% availability
- **Scale**: Support 100,000+ concurrent users

## 📊 Development Phases (PRD v3 Updated)

### Phase 1: Foundation (Months 1-3) ✅ Complete
- Enhanced monorepo with 15,000 questions
- Basic AI integration (GPT-4o explanations)
- Mobile-first PWA with offline capabilities

### Phase 2: AI Enhancement (Months 4-6) 🚧 In Progress  
- Voice AI tutor with 8 language support
- AR question scanner with battle mode
- Predictive analytics (85%+ accuracy)
- Advanced study group formation

### Phase 3: Market Expansion (Months 7-9)
- B2B features and white-labeling
- Regional language UI/UX (8 Indian languages)
- Biometric integration and wellness tracking
- Local payment methods (UPI, wallets)

### Phase 4: Scale & Optimization (Months 10-12)
- 100,000+ concurrent user support
- Sub-100ms API response times
- VR learning modules
- International expansion (Southeast Asia)

## 🤝 Contributing

Please read our [Contributing Guide](./.warp.md) for details on our code of conduct and development process.

### Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes following our coding standards
3. Write/update tests as needed
4. Commit with conventional commits: `git commit -m "feat: add new feature"`
5. Push and create a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🙋 Support

For questions and support:
- Create an issue in the repository
- Contact the development team

## 🔗 Links

- [Design Document](./NEET%20Prep%20AI%20Platform%20-%20Comprehensive%20System%20Design.md)
- [Project Rules](./.warp.md)
- [Turbo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)

---

**Built with ❤️ for NEET aspirants**
