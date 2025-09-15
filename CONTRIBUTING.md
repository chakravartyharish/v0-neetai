# Contributing to NEETAI 🚀

Thank you for your interest in contributing to NEETAI! This document provides comprehensive guidelines for contributing to our AI-powered NEET preparation platform.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Security Guidelines](#security-guidelines)
- [Performance Guidelines](#performance-guidelines)
- [Documentation](#documentation)
- [Getting Help](#getting-help)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful**: Treat everyone with respect and kindness
- **Be inclusive**: Welcome contributors from all backgrounds
- **Be constructive**: Provide helpful feedback and suggestions
- **Be patient**: Remember that everyone has different skill levels
- **Focus on learning**: Help others learn and grow

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (comes with Node.js)
- **Git** >= 2.25.0
- **GitHub account** with SSH keys configured

### First Contribution Checklist

- [ ] Fork the repository
- [ ] Clone your fork locally
- [ ] Set up the development environment
- [ ] Read this contributing guide completely
- [ ] Look for "good first issue" labels
- [ ] Join our community discussions

## 💻 Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone git@github.com:YOUR-USERNAME/NEETAI.git
cd NEETAI

# Add the original repository as upstream
git remote add upstream git@github.com:chakravartyharish/NEETAI.git
```

### 2. Install Dependencies

```bash
# Install all dependencies for the monorepo
npm install

# Verify installation
npm run build
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Configure your environment variables
# See .env.example for required variables
```

### 4. Database Setup (if applicable)

```bash
# Start Supabase locally (if using)
npx supabase start

# Run database migrations
npm run db:migrate

# Seed development data
npm run db:seed
```

### 5. Verify Setup

```bash
# Run development server
npm run dev

# Run tests
npm run test

# Run linting
npm run lint
```

## 📁 Project Structure

```
NEETAI/
├── apps/                    # Applications
│   ├── web/                # Next.js web application
│   ├── mobile/             # React Native app (future)
│   └── docs/               # Documentation site (future)
├── packages/               # Shared packages
│   ├── auth/              # Authentication utilities
│   ├── database/          # Database schemas and utilities
│   ├── ui/                # Shared UI components
│   ├── config/            # Configuration utilities
│   ├── ai/                # AI/ML utilities
│   ├── analytics/         # Analytics utilities
│   ├── utils/             # Common utilities
│   └── types/             # TypeScript type definitions
├── docs/                   # Documentation
├── .github/               # GitHub workflows and templates
├── supabase/              # Supabase configuration
├── .bmad-core/            # BMAD framework
└── agents/                # AI agents and workflows
```

## 🔄 Development Workflow

### Branch Strategy

We use **Git Flow** with the following branches:

- **`main`**: Production-ready code
- **`develop`**: Integration branch for features
- **`feature/*`**: Feature development
- **`hotfix/*`**: Critical production fixes
- **`release/*`**: Release preparation

### Feature Development Process

```bash
# 1. Sync with upstream
git checkout develop
git pull upstream develop

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes and commit
git add .
git commit -m "feat: add your feature description"

# 4. Push to your fork
git push origin feature/your-feature-name

# 5. Create pull request on GitHub
```

### Keeping Your Fork Updated

```bash
# Regularly sync with upstream
git checkout develop
git pull upstream develop
git push origin develop

# Update feature branch
git checkout feature/your-feature-name
git rebase develop
```

## 📝 Coding Standards

### TypeScript Guidelines

- **Use TypeScript** for all new code
- **Strict mode enabled** - no `any` types
- **Explicit return types** for functions
- **Interface over type** for object shapes
- **Consistent naming**: PascalCase for components, camelCase for functions

```typescript
// ✅ Good
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

const getUserProfile = async (userId: string): Promise<UserProfile> => {
  // Implementation
};

// ❌ Bad
const getUserProfile = async (userId: any) => {
  // Implementation
};
```

### React Guidelines

- **Functional components** with hooks
- **Custom hooks** for reusable logic
- **Props interface** for all components
- **Error boundaries** for error handling
- **Memoization** for expensive computations

```tsx
// ✅ Good
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false 
}) => {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
};
```

### CSS/Styling Guidelines

- **Tailwind CSS** for styling
- **CSS modules** for component-specific styles
- **Responsive design** mobile-first approach
- **Dark mode support** using Tailwind's dark: prefix
- **Consistent spacing** using Tailwind's scale

### File Naming Conventions

```
components/       # PascalCase for React components
  Button.tsx
  UserProfile.tsx

utils/           # camelCase for utilities
  formatDate.ts
  apiClient.ts

hooks/           # camelCase with 'use' prefix
  useAuth.ts
  useLocalStorage.ts

types/           # PascalCase for types
  User.ts
  ApiResponse.ts

constants/       # UPPER_SNAKE_CASE for constants
  API_ENDPOINTS.ts
  APP_CONFIG.ts
```

## 🧪 Testing Guidelines

### Testing Strategy

- **Unit tests**: For utilities and pure functions
- **Component tests**: For React components
- **Integration tests**: For API endpoints and workflows
- **E2E tests**: For critical user journeys

### Writing Tests

```typescript
// Unit test example
import { formatDate } from '@/utils/formatDate';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('January 15, 2024');
  });

  it('should handle invalid dates', () => {
    expect(formatDate(null)).toBe('Invalid date');
  });
});

// Component test example
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/Button';

describe('Button', () => {
  it('should render children correctly', () => {
    render(<Button onClick={jest.fn()}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const mockClick = jest.fn();
    render(<Button onClick={mockClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test Commands

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📝 Commit Convention

We use **Conventional Commits** for consistent commit messages:

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes
- **perf**: Performance improvements
- **ci**: CI/CD changes
- **security**: Security improvements

### Examples

```bash
# Feature
git commit -m "feat(auth): add OAuth login support"

# Bug fix
git commit -m "fix(quiz): resolve question loading issue"

# Documentation
git commit -m "docs: update contributing guidelines"

# Breaking change
git commit -m "feat(api): redesign user endpoints

BREAKING CHANGE: User API endpoints have been restructured"
```

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows project standards
- [ ] Tests pass locally
- [ ] No linting errors
- [ ] Documentation updated (if needed)
- [ ] Self-review completed
- [ ] Feature branch is up-to-date with develop

### PR Guidelines

1. **Clear title**: Use conventional commit format
2. **Detailed description**: Use the PR template
3. **Link issues**: Reference related issues
4. **Screenshots**: Include for UI changes
5. **Test plan**: Describe how you tested the changes
6. **Breaking changes**: Highlight any breaking changes

### Review Process

- **Automatic checks**: CI/CD must pass
- **Code review**: At least one approval required
- **Manual testing**: Complex changes may need manual testing
- **Security review**: Required for security-related changes

### After Approval

- **Squash and merge**: Preferred for feature branches
- **Merge commit**: For complex multi-commit features
- **Rebase and merge**: For simple changes

## 🐛 Issue Guidelines

### Before Creating Issues

1. **Search existing issues**: Avoid duplicates
2. **Check documentation**: Issue might be addressed
3. **Reproduce the problem**: Ensure it's reproducible
4. **Gather information**: Collect relevant details

### Issue Types

#### Bug Reports
- Use the bug report template
- Include reproduction steps
- Provide system information
- Add screenshots/videos if applicable

#### Feature Requests
- Use the feature request template
- Explain the use case
- Describe the proposed solution
- Consider alternative approaches

#### Documentation Issues
- Specify what's unclear or missing
- Suggest improvements
- Provide context for the documentation need

## 🔒 Security Guidelines

### Security Best Practices

- **No secrets in code**: Use environment variables
- **Input validation**: Validate all user inputs
- **SQL injection prevention**: Use parameterized queries
- **XSS prevention**: Sanitize user content
- **CSRF protection**: Implement CSRF tokens
- **Authentication**: Secure authentication flows
- **Authorization**: Proper access controls

### Reporting Security Issues

**DO NOT** create public issues for security vulnerabilities.

Instead:
1. Email: [security@neetai.com] (if available)
2. Use GitHub's private vulnerability reporting
3. Provide detailed information about the vulnerability
4. Allow time for fixing before public disclosure

## ⚡ Performance Guidelines

### Frontend Performance

- **Code splitting**: Use dynamic imports
- **Image optimization**: Use Next.js Image component
- **Bundle analysis**: Regular bundle size monitoring
- **Lazy loading**: Load content when needed
- **Memoization**: Use React.memo and useMemo appropriately

### Backend Performance

- **Database queries**: Optimize database queries
- **Caching**: Implement appropriate caching strategies
- **API responses**: Keep API responses minimal
- **Rate limiting**: Implement rate limiting for APIs

### Monitoring

- **Core Web Vitals**: Monitor performance metrics
- **Error tracking**: Use error monitoring tools
- **Performance budgets**: Set and maintain performance budgets

## 📚 Documentation

### Code Documentation

- **JSDoc comments**: For complex functions
- **README files**: For packages and major features
- **Type definitions**: Self-documenting code with TypeScript
- **API documentation**: Document all API endpoints

### Examples

```typescript
/**
 * Calculates the user's quiz score based on correct answers
 * @param totalQuestions - The total number of questions in the quiz
 * @param correctAnswers - The number of questions answered correctly
 * @param timeBonus - Optional time bonus multiplier (default: 1.0)
 * @returns The calculated score as a percentage
 */
function calculateQuizScore(
  totalQuestions: number,
  correctAnswers: number,
  timeBonus: number = 1.0
): number {
  if (totalQuestions <= 0) {
    throw new Error('Total questions must be greater than 0');
  }
  
  const baseScore = (correctAnswers / totalQuestions) * 100;
  return Math.round(baseScore * timeBonus);
}
```

## 🤝 Getting Help

### Community Resources

- **GitHub Discussions**: Ask questions and share ideas
- **Discord/Slack**: Real-time community chat (if available)
- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check the docs first

### Mentorship

- Look for "good first issue" labels
- Ask for guidance in issue comments
- Request code review feedback
- Join community mentorship programs

### Response Times

- **Bug reports**: 2-3 business days
- **Feature requests**: 1 week
- **Pull requests**: 3-5 business days
- **Security issues**: Within 24 hours

## 📞 Contact

- **Maintainer**: @chakravartyharish
- **Email**: [contact@neetai.com] (if available)
- **GitHub**: [NEETAI Repository](https://github.com/chakravartyharish/NEETAI)

---

## 🙏 Thank You

Your contributions make NEETAI better for thousands of students preparing for NEET. Every bug fix, feature addition, documentation improvement, and community interaction helps build a stronger platform for education.

**Happy contributing! 🚀**