# Task List: Last.fm Authentication Integration

## Relevant Files

### Backend Files
- `server/bedfellow-api/src/lastfm/lastfm_controller.rs` - Rust controller handling last.fm OAuth token exchange and authentication
- `server/bedfellow-api/src/lastfm/mod.rs` - Module export for last.fm functionality
- `server/bedfellow-api/src/main.rs` - Main server file (needs update to register last.fm routes)

### Context & Types
- `src/context/LastFmAuthContext/index.tsx` - Context provider managing last.fm authentication state (similar to SpotifyAuthContext)
- `src/context/LastFmAuthContext/types.ts` - TypeScript types for last.fm auth state and tokens
- `src/context/index.ts` - Export file for context providers (needs LastFmAuthContext export)

### UI Components
- `src/components/brand/LastFmLogo.tsx` - last.fm brand logo component (similar to SpotifyLogo)
- `src/components/themed/ThemedButton.tsx` - Button component (already exists, needs last.fm variant support)
- `src/screens/Login/index.tsx` - Login screen (needs last.fm button added)
- `src/screens/Settings/index.tsx` - Settings screen (needs last.fm disconnect button and connection status)

### Services & Hooks
- `src/services/lastfm/lastfm.api.service.ts` - Wrapper for last.fm API calls
- `src/services/lastfm/lastfm-scrobble.service.ts` - Service handling scrobbling logic and offline queue
- `src/services/lastfm/utilities/utilities.ts` - Utility functions for last.fm API (signatures, etc.)
- `src/hooks/lastfm/useRecentTracks.ts` - Hook for fetching recent scrobbles
- `src/hooks/lastfm/useNowPlaying.ts` - Hook for fetching current now-playing status
- `src/hooks/lastfm/useLastFmStats.ts` - Hook for fetching user statistics

### Screens
- `src/screens/LastFmHistory/index.tsx` - Screen displaying user's listening history
- `src/screens/LastFmHistory/LastFmHistory.themed.styles.ts` - Styled components for listening history
- `src/screens/LastFmStats/index.tsx` - Stats page showing listening statistics
- `src/screens/LastFmStats/LastFmStats.themed.styles.ts` - Styled components for stats page

### Navigation & Types
- `src/screens/constants/Screens.ts` - Screen constant definitions (needs LastFmHistory and LastFmStats screens added)
- `src/types/index.ts` - Type definitions (needs LastFmAuthToken and related types)

### Integration Files
- `App.tsx` - Main app file (needs LastFmAuthContextProvider wrapper)
- `.env.example` or environment config - Needs last.fm API key and secret

### Test Files
- `__tests__/context/LastFmAuthContext.test.tsx` - Unit tests for LastFmAuthContext
- `__tests__/services/lastfm/lastfm.api.service.test.ts` - Unit tests for last.fm API service
- `__tests__/services/lastfm/lastfm-scrobble.service.test.ts` - Unit tests for scrobbling service
- `__tests__/hooks/lastfm/useRecentTracks.test.ts` - Unit tests for useRecentTracks hook
- `__tests__/hooks/lastfm/useNowPlaying.test.ts` - Unit tests for useNowPlaying hook
- `__tests__/hooks/lastfm/useLastFmStats.test.ts` - Unit tests for useLastFmStats hook
- `src/components/brand/__tests__/LastFmLogo.test.tsx` - Unit tests for LastFmLogo component
- `server/bedfellow-api/src/lastfm/tests/lastfm_controller_test.rs` - Integration tests for last.fm backend endpoints

### Notes
- Unit tests should follow existing Jest configuration and be placed alongside source files where appropriate
- Use `npm test` or `npm run test` to run all tests, or `npm test -- <file_path>` to run specific tests
- Backend Rust tests should follow existing patterns in `spotify_controller.rs`

## Tasks

- [x] 1.0 Setup Backend last.fm Authentication Infrastructure (TDD) ✅ COMMITTED
  - [x] 1.1 Write failing test for last.fm auth endpoint that accepts session key and returns token
  - [x] 1.2 Create `server/bedfellow-api/src/lastfm/mod.rs` module file
  - [x] 1.3 Create `server/bedfellow-api/src/lastfm/lastfm_controller.rs` with POST `/lastfm/auth` endpoint (implement to make test pass)
  - [x] 1.4 Write failing test for last.fm session validation endpoint
  - [x] 1.5 Implement POST `/lastfm/validate` endpoint for session key validation
  - [x] 1.6 Update `server/bedfellow-api/src/main.rs` to register last.fm routes
  - [x] 1.7 Add environment variables for LASTFM_API_KEY and LASTFM_API_SECRET to server configuration
  - [x] 1.8 Test backend endpoints with integration test file

- [x] 2.0 Create last.fm Authentication Context and Types (TDD) ✅ COMMITTED
  - [x] 2.1 Create `src/context/LastFmAuthContext/types.ts` with LastFmAuthToken, LastFmAuthState, and LastFmAuthContextData types
  - [x] 2.2 Write failing test for LastFmAuthContext provider initialization
  - [x] 2.3 Create `src/context/LastFmAuthContext/index.tsx` with LastFmAuthContextProvider
  - [x] 2.4 Write failing test for setAuthToken function that stores session in AsyncStorage
  - [x] 2.5 Implement setAuthToken function with AsyncStorage persistence
  - [x] 2.6 Write failing test for logout function that clears AsyncStorage
  - [x] 2.7 Implement logout function
  - [x] 2.8 Write failing test for isAuthenticated computed property
  - [x] 2.9 Implement isAuthenticated logic
  - [x] 2.10 Add error handling and loading states to LastFmAuthContext
  - [x] 2.11 Update `src/context/index.ts` to export LastFmAuthContext and LastFmAuthContextProvider
  - [x] 2.12 Write comprehensive test suite for all LastFmAuthContext methods

- [ ] 3.0 Implement last.fm Login UI Integration (TDD)
  - [x] 3.1 Write failing test for LastFmLogo component rendering
  - [x] 3.2 Create `src/components/brand/LastFmLogo.tsx` component (red brand color #D51007)
  - [x] 3.3 Write failing test for last.fm button variant in ThemedButton
  - [x] 3.4 Add 'lastfm' variant to ThemedButton in `src/components/themed/ThemedButton.tsx` (use last.fm red #D51007)
  - [x] 3.5 Write failing test for last.fm button appearing on Login screen
  - [x] 3.6 Update `src/screens/Login/index.tsx` to add last.fm login button with equal prominence to Spotify button
  - [x] 3.7 Implement last.fm authentication handler function in Login screen
  - [ ] 3.8 Write failing test for last.fm OAuth flow integration
  - [ ] 3.9 Implement OAuth authentication flow using last.fm Mobile Session API
  - [ ] 3.10 Write failing test for navigation after successful last.fm authentication
  - [ ] 3.11 Implement navigation to listening history screen after successful auth
  - [ ] 3.12 Add error handling for last.fm authentication failures

- [ ] 4.0 Build last.fm API Service Layer (TDD)
  - [ ] 4.1 Create `src/services/lastfm/utilities/utilities.ts` with API signature generation functions
  - [ ] 4.2 Write failing test for generateApiSignature utility function
  - [ ] 4.3 Implement generateApiSignature and MD5 hashing for last.fm API signatures
  - [ ] 4.4 Write failing test for last.fm API service GET request
  - [ ] 4.5 Create `src/services/lastfm/lastfm.api.service.ts` with base API functions
  - [ ] 4.6 Write failing test for fetchRecentTracks API call
  - [ ] 4.7 Implement fetchRecentTracks function to call last.fm API
  - [ ] 4.8 Write failing test for fetchNowPlaying API call
  - [ ] 4.9 Implement fetchNowPlaying function
  - [ ] 4.10 Write failing test for fetchUserInfo API call
  - [ ] 4.11 Implement fetchUserInfo function
  - [ ] 4.12 Add error handling and rate limiting logic to API service
  - [ ] 4.13 Write comprehensive test suite for all API service functions

- [ ] 5.0 Create last.fm Listening History Display Screen (TDD)
  - [ ] 5.1 Write failing test for LastFmHistory screen component rendering
  - [ ] 5.2 Create `src/hooks/lastfm/useRecentTracks.ts` hook for fetching recent scrobbles
  - [ ] 5.3 Write failing test for useRecentTracks hook data fetching
  - [ ] 5.4 Implement useRecentTracks hook with loading and error states
  - [ ] 5.5 Write failing test for LastFmHistory screen displaying recent tracks
  - [ ] 5.6 Create `src/screens/LastFmHistory/index.tsx` screen component
  - [ ] 5.7 Create `src/screens/LastFmHistory/LastFmHistory.themed.styles.ts` with styled components
  - [ ] 5.8 Implement recent tracks display with track name, artist, timestamp, and album art
  - [ ] 5.9 Add loading and empty states to LastFmHistory screen
  - [ ] 5.10 Update `src/screens/constants/Screens.ts` to add LASTFM_HISTORY screen
  - [ ] 5.11 Add navigation routing for LastFmHistory screen
  - [ ] 5.12 Write test for useRecentTracks hook mock data handling

- [ ] 6.0 Implement Real-Time Scrobbling Functionality (TDD)
  - [ ] 6.1 Write failing test for scrobble service storing track in queue
  - [ ] 6.2 Create `src/services/lastfm/lastfm-scrobble.service.ts` with scrobble queue
  - [ ] 6.3 Write failing test for updateNowPlaying API call
  - [ ] 6.4 Implement updateNowPlaying function to call last.fm API
  - [ ] 6.5 Write failing test for scrobbleTrack API call
  - [ ] 6.6 Implement scrobbleTrack function with API signature
  - [ ] 6.7 Write failing test for offline queue persistence
  - [ ] 6.8 Implement AsyncStorage queue for offline scrobbles
  - [ ] 6.9 Write failing test for retry mechanism for failed scrobbles
  - [ ] 6.10 Implement automatic retry for failed scrobbles
  - [ ] 6.11 Create `src/hooks/lastfm/useScrobble.ts` hook for easy scrobble integration
  - [ ] 6.12 Integrate scrobbling with CurrentTrack/Player component (when track plays >50%)
  - [ ] 6.13 Write comprehensive test suite for scrobbling functionality

- [ ] 7.0 Build last.fm Statistics Page (TDD)
  - [ ] 7.1 Write failing test for useLastFmStats hook data fetching
  - [ ] 7.2 Create `src/hooks/lastfm/useLastFmStats.ts` hook
  - [ ] 7.3 Write failing test for fetching top artists from last.fm
  - [ ] 7.4 Implement fetchTopArtists in useLastFmStats hook
  - [ ] 7.5 Write failing test for fetching top tracks from last.fm
  - [ ] 7.6 Implement fetchTopTracks in useLastFmStats hook
  - [ ] 7.7 Write failing test for fetching total scrobble count
  - [ ] 7.8 Implement fetchScrobbleCount in useLastFmStats hook
  - [ ] 7.9 Write failing test for LastFmStats screen rendering
  - [ ] 7.10 Create `src/screens/LastFmStats/index.tsx` screen component
  - [ ] 7.11 Create `src/screens/LastFmStats/LastFmStats.themed.styles.ts` with styled components
  - [ ] 7.12 Implement stats display with cards showing top artists, tracks, and listening patterns
  - [ ] 7.13 Update `src/screens/constants/Screens.ts` to add LASTFM_STATS screen
  - [ ] 7.14 Add navigation routing for LastFmStats screen
  - [ ] 7.15 Add link/button in relevant screens to access Stats page

- [ ] 8.0 Integrate last.fm into Settings and Update App Provider (TDD)
  - [ ] 8.1 Write failing test for last.fm connection status display in Settings
  - [ ] 8.2 Update `src/screens/Settings/index.tsx` to show last.fm connection status
  - [ ] 8.3 Write failing test for last.fm disconnect button in Settings
  - [ ] 8.4 Implement disconnect functionality in Settings screen
  - [ ] 8.5 Write failing test for LastFmAuthContextProvider wrapping app
  - [ ] 8.6 Update `App.tsx` to include LastFmAuthContextProvider wrapper alongside SpotifyAuthContextProvider
  - [ ] 8.7 Write failing test for logout clearing last.fm tokens when logging out of Bedfellow
  - [ ] 8.8 Update logout logic to clear all authentication tokens (both Spotify and last.fm)
  - [ ] 8.9 Update `__tests__/helpers/render.tsx` to include LastFmAuthContext mock
  - [ ] 8.10 Write integration test for Settings screen with both auth contexts
  - [ ] 8.11 Test end-to-end authentication flow from login to logout

