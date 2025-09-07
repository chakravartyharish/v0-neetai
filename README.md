# NEET Prep AI Platform

🚀 **AI-powered NEET preparation platform** built with Next.js 14, TypeScript, Supabase, and the Vercel ecosystem.

## 📋 Overview

NEET Prep AI is a comprehensive medical entrance exam preparation platform that leverages artificial intelligence to provide personalized learning experiences, adaptive quizzes, voice AI tutoring, and social study features.

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

### Core Learning Features
- 📚 **Comprehensive Question Bank** - 20,000+ NEET questions from past 10 years
- 🧠 **AI-Powered Explanations** - Detailed explanations using GPT-4
- 📊 **Adaptive Learning** - IRT-based question selection
- 🎯 **Smart Quiz Engine** - Practice, mock tests, and topic-wise quizzes

### Advanced Features
- 🎙️ **Voice AI Tutor** - Natural conversation-based learning
- 📸 **AR Question Scanner** - Scan and solve physical questions
- 👥 **Study Groups** - Collaborative learning with peers
- 📈 **Analytics Dashboard** - Track progress and performance

### Technical Features
- ⚡ **Real-time Sync** - Live collaboration features
- 🔐 **Secure Authentication** - Supabase Auth with RLS
- 💳 **Payment Integration** - Stripe subscription management
- 📱 **Mobile Ready** - Responsive design (React Native app coming soon)

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand + TanStack Query
- **Animation:** Framer Motion

### Backend
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **AI:** OpenAI GPT-4
- **Cache:** Vercel KV
- **Storage:** Vercel Blob + Supabase Storage

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

## 📊 Development Phases

- ✅ **Phase 1:** Foundation & Setup (Complete)
- 🚧 **Phase 2:** Core Learning Features (In Progress)
- 📅 **Phase 3:** Advanced Features
- 📅 **Phase 4:** Enterprise & Analytics
- 📅 **Phase 5:** Optimization & Scaling
- 📅 **Phase 6:** Production Launch

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
