# Project Source Tree

## Root Structure
```
NEETAI/
├── apps/                          # Applications
│   ├── web/                      # Main web application (Next.js)
│   ├── mobile/                   # React Native mobile app
│   └── coach/                    # Separate coach dashboard app
├── packages/                     # Shared packages
│   ├── ui/                      # Shared UI components
│   ├── auth/                    # Authentication utilities
│   ├── database/                # Database utilities and types
│   ├── ai/                      # AI service integrations
│   ├── analytics/               # Analytics utilities
│   └── utils/                   # General utilities
├── docs/                        # Documentation
│   ├── prd/                     # Product requirements (sharded)
│   ├── architecture/            # Technical architecture docs
│   ├── stories/                 # Development user stories
│   └── qa/                      # QA documentation
├── .bmad-core/                  # BMAD Method configuration
└── config files (package.json, etc.)
```

## App Structure - Web Application
```
apps/web/
├── app/                         # Next.js App Router
│   ├── (auth)/                  # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/               # Student dashboard
│   ├── quiz/                    # Quiz interface
│   ├── practice/                # Practice sessions
│   ├── analytics/               # Performance analytics
│   ├── api/                     # API routes
│   │   ├── auth/
│   │   ├── quiz/
│   │   ├── ai/
│   │   └── analytics/
│   └── globals.css
├── components/                  # App-specific components
├── lib/                        # App utilities
└── public/                     # Static assets
```

## Package Structure - Shared Code
```
packages/
├── ui/                         # Shared UI Components
│   ├── components/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── quiz-components/
│   ├── hooks/
│   └── utils/
├── auth/                       # Authentication
│   ├── providers/
│   ├── hooks/
│   └── types/
├── database/                   # Database Layer
│   ├── schema/
│   ├── queries/
│   ├── mutations/
│   └── types/
├── ai/                         # AI Services
│   ├── openai/
│   ├── claude/
│   ├── prompts/
│   └── types/
└── analytics/                  # Analytics
    ├── tracking/
    ├── reports/
    └── types/
```

## Key Directories

### Source Code Locations
- **Web App**: `apps/web/app/` (Next.js App Router)
- **Mobile App**: `apps/mobile/src/`
- **Shared Components**: `packages/ui/components/`
- **Database Queries**: `packages/database/queries/`
- **AI Integrations**: `packages/ai/`

### Configuration Files
- **Root Package.json**: `/package.json`
- **Turbo Config**: `/turbo.json`
- **Environment**: `/.env.example`
- **BMAD Config**: `/.bmad-core/core-config.yaml`

### Documentation
- **User Stories**: `/docs/stories/`
- **Architecture**: `/docs/architecture/`
- **PRD Epics**: `/docs/prd/`
