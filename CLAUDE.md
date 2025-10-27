# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Management

- Use `yarn` for all package management operations (not npm)
- When adding path aliases, update all three configs: `babel.config.js`, `metro.config.js`, and `tsconfig.json`

## Development Commands

### Frontend (React Native)

```bash
# Development
yarn ios                  # Run iOS in development mode
yarn android              # Run Android in development mode
yarn start                # Start Metro bundler

# Dependencies
yarn install              # Install dependencies
yarn pods                 # Install iOS CocoaPods (after native deps)

# Build & Quality
yarn test                 # Run full test suite
yarn test-debug           # Run tests with debug flags
yarn tsc                  # TypeScript type checking
yarn lint                 # ESLint
yarn ios-build-prod       # Production iOS build
yarn android-build-prod   # Production Android build
```

### Backend (Rust)

```bash
# Start all services via Docker
yarn server-start         # Starts MySQL, OAuth API, and DB API

# Individual services (in respective server/ subdirectories)
cargo build && cargo run  # Build and run service
cargo test                # Run tests
cargo build --release     # Production build
```

## Running Tests

```bash
# Frontend
yarn test                                         # Run all tests
yarn test path/to/file.test.tsx                   # Single test file
yarn test -- --coverage                           # With coverage

# Backend (run in server/bedfellow-api or server/bedfellow-db-api)
cargo test                                        # All tests
cargo test test_name                              # Specific test
```

## Architecture Overview

### Multi-Provider Music System

The app is built on a **provider-agnostic architecture** that supports multiple music streaming services:

- **Music Provider Registry** ([src/services/music-providers/registry.ts](src/services/music-providers/registry.ts)): Central registry for all music providers
- **Provider Adapters** ([src/services/music-providers/adapters/](src/services/music-providers/adapters/)): Service-specific implementations
- **Capability System**: Providers declare capabilities (playback, queue, search, profile)
- **MusicProviderContext** ([src/context/MusicProviderContext/](src/context/MusicProviderContext/)): Unified API across providers

Current providers: Spotify (full support), YouTube Music (in progress)

### Authentication Architecture

Authentication is provider-specific but follows a common pattern:

- **SpotifyAuthContext** ([src/context/SpotifyAuthContext/](src/context/SpotifyAuthContext/)): OAuth 2.0 flow with token refresh
- **Backend OAuth Handler** ([server/bedfellow-api/](server/bedfellow-api/)): Rust service handling Spotify OAuth
- Token management includes automatic refresh with 5-minute buffer before expiration
- Singleton refresh promise prevents concurrent refresh attempts

### Sample Data Architecture

The app discovers music samples through a multi-layer caching system:

1. **WhoSampled Scraper** ([src/services/whosampled/](src/services/whosampled/)): Web scraping service using Cheerio
2. **Database API** ([server/bedfellow-db-api/](server/bedfellow-db-api/)): Rust + MySQL cache layer
   - API Documentation: [server/bedfellow-db-api/API_DOCS.md](server/bedfellow-db-api/API_DOCS.md)
   - Paginated search with cursor-based pagination
   - SQLx for database operations
3. **Bedfellow DB API Client** ([src/services/bedfellow-db-api/](src/services/bedfellow-db-api/)): TypeScript service layer

Data flow: Check DB cache → If miss, scrape WhoSampled → Store in DB → Return to app

### Theme System

Sophisticated brand color system with dynamic color extraction:

- **Brand Colors**: Teal (#008585), Sage (#74A892), Rust (#C7522A), Sand/Slate scales
- **Dynamic Theming**: Extracts colors from album artwork, blends with brand (30% influence)
- **Accessibility**: WCAG AA compliant contrast ratios
- **ThemeContext** ([src/context/ThemeContext/](src/context/ThemeContext/)): Provides theme to all components
- Full documentation: [src/theme/README.md](src/theme/README.md)
- Color usage guidelines: [src/theme/COLOR_GUIDELINES.md](src/theme/COLOR_GUIDELINES.md)

### Navigation & Screens

Stack-based navigation using React Navigation:

- **Main Screens**:
  - [Login](src/screens/Login/index.tsx): OAuth authentication
  - [CurrentTrack](src/screens/CurrentTrack/index.tsx): Currently playing track + samples list
  - [Search](src/screens/Search/index.tsx): Search functionality
  - [Settings](src/screens/Settings/index.tsx): App settings

### Path Aliases

The codebase uses TypeScript path aliases configured in three places:

```typescript
@screens/*     → src/screens/*
@services/*    → src/services/*
@components/*  → src/components/*
@context/*     → src/context/*
@theme/*       → src/theme/*
@types/*       → src/types/*
```

## Backend Services

### Docker Compose Setup

The [server/docker-compose.yml](server/docker-compose.yml) orchestrates three services:

1. **MySQL Database** (port 3306): Sample data storage
2. **bedfellow-db-api** (port 8000): REST API for sample CRUD operations
3. **bedfellow-api** (port 8085): Spotify OAuth handler

### Environment Configuration

**Backend** (export in shell profile):

```bash
SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET
SPOTIFY_CLIENT_CALLBACK_IOS
SPOTIFY_CLIENT_CALLBACK_ANDROID
DATABASE_URL
```

**Frontend** (.env files):

```bash
BEDFELLOW_API_BASE_URL          # OAuth service URL
BEDFELLOW_DB_API_BASE_URL       # Database API URL
SPOTIFY_CLIENT_ID
SPOTIFY_REDIRECT_URI_ANDROID
SPOTIFY_REDIRECT_URI
```

## Code Organization Patterns

### Context Providers

All React Context providers are in [src/context/](src/context/):

- Export from [src/context/index.tsx](src/context/index.tsx) for centralized access
- Combine providers in App.tsx wrapper

### Services

Service layer in [src/services/](src/services/) follows domain-driven structure:

- Each service exports a singleton or factory function
- TypeScript types in corresponding `@types/*` directory
- Services should be provider-agnostic where possible

### Component Structure

- Components co-locate styles: `ComponentName/index.tsx` + `ComponentName/index.styles.ts`
- Use `StyleSheet.create` for styles
- Themed components in [src/components/themed/](src/components/themed/)

### Testing

- Tests mirror source structure in `__tests__/`
- Use React Native Testing Library for component tests
- Mock Spotify API responses in `__tests__/fixtures/`
- Test helpers in `__tests__/helpers/`

## AI Development Workflow

Structured feature development using PRDs (Product Requirements Documents):

- [ai-dev-tasks/create-prd.md](ai-dev-tasks/create-prd.md): PRD creation template
- [ai-dev-tasks/generate-tasks.md](ai-dev-tasks/generate-tasks.md): Break PRDs into tasks
- [ai-dev-tasks/process-task-list.md](ai-dev-tasks/process-task-list.md): Task implementation workflow
- [ai-dev-tasks/pr-comments-to-tasks.md](ai-dev-tasks/pr-comments-to-tasks.md): Convert PR feedback to tasks

PRDs and task lists are stored in `/tasks` directory.

## Platform-Specific Notes

### iOS

- Run builds through Xcode for development
- Run `yarn pods` after adding native dependencies
- Requires macOS and Xcode

### Android

- Requires HTTPS endpoints for external services in production
- Use tunneling service (e.g., tunnelto.dev) for local development testing
- Ensure `android/local.properties` points to correct Android SDK

## Important Implementation Details

### Token Refresh Strategy

[src/context/SpotifyAuthContext/index.tsx:28-29](src/context/SpotifyAuthContext/index.tsx#L28-L29) implements singleton refresh pattern:

- Single active refresh promise prevents race conditions
- 5-minute buffer before expiration triggers proactive refresh
- All API calls check token validity before execution

### Database Schema

MySQL schema in [server/bedfellow-db-api/db/init.sql](server/bedfellow-db-api/db/init.sql):

- When modifying schema, update Rust models in `server/bedfellow-db-api/src/models.rs`
- Update TypeScript types in `src/types/bedfellow-api.ts`
- Rebuild Docker containers after schema changes

### Web Scraping Fragility

WhoSampled scraper ([src/services/whosampled/WhoSampled.service.ts](src/services/whosampled/WhoSampled.service.ts)) is brittle:

- Breaks if WhoSampled changes HTML structure
- Error handling should gracefully degrade
- Database cache mitigates scraping failures
