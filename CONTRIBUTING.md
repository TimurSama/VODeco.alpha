# Contributing to VODeco MVP

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Initialize database: `npm run db:push && npm run db:seed`
5. Start development server: `npm run dev`

## Code Style

- Use TypeScript for all new files
- Follow Next.js App Router conventions
- Use functional components with hooks
- Use Tailwind CSS for styling
- Follow the existing component structure

## Adding New Features

1. Create feature branch from `main`
2. Implement feature with tests if applicable
3. Update translations in `src/lib/i18n/translations.ts`
4. Update documentation if needed
5. Submit pull request

## API Integration

When adding new API integrations:
- Add client in `src/lib/api/`
- Create API route in `app/api/`
- Add error handling and caching
- Document in code comments

## Database Changes

1. Update `prisma/schema.prisma`
2. Run `npm run db:push`
3. Update seed data if needed
4. Update TypeScript types if needed
