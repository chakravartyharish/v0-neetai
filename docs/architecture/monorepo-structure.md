# Monorepo Structure

```
neet-prep-platform/
├── apps/
│   ├── web/                    # Main Next.js 14 web application
│   ├── mobile/                 # React Native + Expo mobile app
│   ├── admin/                  # Admin dashboard (Next.js)
│   └── coach/                  # Coach portal (Next.js)
├── packages/
│   ├── ui/                     # Shared UI components & design system
│   ├── database/               # Supabase client, types & queries
│   ├── ai/                     # AI services & prompt management
│   ├── auth/                   # Authentication logic & hooks
│   ├── analytics/              # Tracking, metrics & observability
│   ├── config/                 # Shared configurations & constants
│   ├── utils/                  # Common utilities & helpers
│   └── types/                  # Shared TypeScript types
├── tools/
│   ├── eslint-config/          # Shared ESLint configurations
│   └── tailwind-config/        # Shared Tailwind CSS config
└── docs/                       # Documentation & guides
```

