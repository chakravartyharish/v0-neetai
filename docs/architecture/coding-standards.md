# Coding Standards

## TypeScript/JavaScript Standards

### Code Style
- Use TypeScript for all new code
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for callbacks
- Implement strict type checking
- Use meaningful variable and function names

### Project Structure
- Follow monorepo structure with Turbo
- Use packages for shared code
- Apps contain specific applications (web, mobile, coach)
- Implement barrel exports (index.ts files)

### React/Next.js Standards
- Use functional components with hooks
- Implement proper error boundaries
- Use Next.js App Router (app directory)
- Implement proper SEO with metadata
- Use Server Components where possible

### Database & API Standards
- Use Supabase for authentication and database
- Implement proper error handling
- Use type-safe API routes
- Implement rate limiting
- Follow RESTful API conventions

### Testing Standards
- Unit tests for all utility functions
- Integration tests for API routes
- E2E tests for critical user flows
- Use Jest for unit testing
- Use Playwright for E2E testing

### Educational Content Standards
- All educational content must be NEET-compliant
- Validate accuracy with domain experts
- Support multiple languages (Hindi, English)
- Implement accessibility standards (WCAG 2.1 AA)
- Include proper citations and references

## File Naming Conventions
- Use kebab-case for files and directories
- Use PascalCase for React components
- Use camelCase for functions and variables
- Use UPPER_SNAKE_CASE for constants
