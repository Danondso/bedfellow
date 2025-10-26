# PRD: Last.fm Authentication Integration

## Introduction/Overview

Bedfellow currently authenticates users with Spotify to access their music library and playback state. However, Spotify only tracks listening activity that happens through Spotify itself. To provide users with a more comprehensive view of their music listening history across all platforms and devices (iPod, Apple Music, Spotify, YouTube, etc.), we need to integrate with last.fm.

last.fm is a platform-agnostic music tracking service that aggregates listening data from multiple sources. By adding last.fm authentication, Bedfellow can access a user's complete listening history without needing separate authentication integrations with every possible music platform. This enhancement will expand the app's capabilities to show richer music insights and allow users to scrobble their Bedfellow listening activity.

**Goal:** Implement last.fm authentication as a first-class login option alongside Spotify, enabling users to access their aggregated listening history and scrobble tracks played in Bedfellow.

## Goals

1. **Add last.fm as a primary authentication method** - Provide a login button equivalent in prominence to the existing "Login with Spotify" button
2. **Implement secure token management** - Store last.fm session tokens securely and handle token refresh/expiration
3. **Display user's listening history** - Show recent scrobbles and now-playing status immediately after authentication
4. **Enable real-time scrobbling (MVP)** - Allow Bedfellow to scrobble tracks played in the app to the user's last.fm account
5. **Graceful error handling** - Handle authentication failures and network issues without disrupting the user experience
6. **Independent authentication sessions** - Allow users to connect/disconnect last.fm and Spotify independently, but clearing Bedfellow session also clears last.fm tokens

## User Stories

1. **As a user**, I want to login with my last.fm account so that I can see my complete listening history from all my music platforms in Bedfellow.
2. **As a user**, I want to connect last.fm alongside Spotify so that I have access to music I've listened to on other platforms.
3. **As a user**, I want to view my recent scrobbles and now-playing status so that I can see my recent music activity at a glance.
4. **As a user**, I want tracks I play in Bedfellow to be scrobbled to my last.fm account automatically so that my listening history is complete.
5. **As a user**, I want to see my listening statistics in a dedicated stats page so that I can understand my music patterns.
6. **As a user**, I want to disconnect last.fm without affecting my Spotify session so that I have control over my connected services.

## Functional Requirements

### Authentication

1. Add a "Continue with last.fm" button on the login screen, positioned with equal prominence to the "Continue with Spotify" button
2. Implement OAuth 2.0 authentication flow using last.fm's API (similar to existing Spotify implementation)
3. Store last.fm session tokens (API key and session key) securely using AsyncStorage with key `@bedfellow/lastfm_auth`
4. Handle last.fm API authentication errors and display appropriate error messages to the user
5. Implement token validation on app startup to verify session is still valid
6. Provide ability to disconnect last.fm account independently from Spotify in Settings
7. When user logs out of Bedfellow, clear all authentication tokens including last.fm
8. Allow users to connect both Spotify and last.fm simultaneously

### Data Display

9. Fetch and display user's recent scrobbles (last 10-20 tracks) immediately after authentication
10. Fetch and display user's current now-playing status
11. Show listening statistics on a dedicated Stats page, including:
    - Total number of scrobbles
    - Top artists
    - Top tracks
    - Overall listening patterns
12. Display recent scrobbles in a format consistent with existing app design patterns
13. Show last.fm connection status in the user's profile or settings section

### Scrobbling

14. Implement "Now Playing" update functionality to notify last.fm when a track starts playing
15. Implement "Scrobble" functionality to record fully-played tracks to user's last.fm account
16. Scrobble tracks automatically when they're played in Bedfellow (when last.fm is connected)
17. Handle scrobbling failures gracefully - do not show errors to user unless critical
18. Maintain a queue of pending scrobbles for offline scenarios and batch send when connectivity is restored

### Error Handling

19. Only show error alerts for authentication failures that prevent login
20. Gracefully degrade features when last.fm API is unavailable - disable scrobbling but allow other app functionality
21. Display subtle indicators when last.fm features are unavailable (e.g., temporary network issues)
22. Handle last.fm API rate limits appropriately without disrupting user experience

### Playback Controls (Future)

23. **Note:** Playback control integration is intentionally disabled for MVP to be implemented more gracefully in a future update
24. Preparation for future playback controls integration should be considered in the API design

## Non-Goals (Out of Scope)

- **Playback controls integration** - Full last.fm playback controls will be implemented in a future release
- **Manual scrobbling entry** - Users cannot manually add tracks to their last.fm account through Bedfellow
- **Scrobbling tracks from other platforms** - Only tracks played within Bedfellow will be scrobbled
- **last.fm social features** - Friends, groups, and community features are out of scope
- **last.fm charts and recommendations** - Integration with last.fm's recommendation engine is out of scope
- **Export/backup functionality** - Exporting scrobble data is not included
- **Offline scrobbling persistence** - While queuing is included, long-term persistence across app restarts is not MVP

## Design Considerations

### UI Components

- **Login Button:** Create a last.fm-branded button component similar to the existing Spotify button
  - Use last.fm's brand color (#D51007)
  - Pill-shaped button matching Spotify's styling
  - Include last.fm logo/icon on the left side
  - Same size and prominence as Spotify button

- **Listening History Display:** 
  - Use existing card/list components from the app's design system
  - Display recent scrobbles with album art, track name, artist name, and timestamp
  - Follow existing theming system (use themed components)

- **Stats Page:**
  - Create new screen accessible from navigation
  - Display statistics in card-based layout
  - Use charts/graphs for visual representation of listening patterns
  - Integrate with existing theme system

- **Connection Status Indicator:**
  - Show connection status in Settings screen
  - Optional: Light indicator in navigation or profile area

### User Flow

1. User opens app and sees login screen with two buttons: "Continue with Spotify" and "Continue with last.fm"
2. User taps "Continue with last.fm" and is redirected to last.fm authorization page
3. User authorizes and returns to app
4. User is immediately shown their recent listening history from last.fm
5. As user listens to tracks in the app, scrobbles are sent to last.fm
6. User can view stats and manage connection in Settings

## Technical Considerations

### Authentication

- **OAuth Flow:** Implement using last.fm's Mobile Session API which provides a token-based auth flow suitable for mobile apps
- **Token Storage:** Follow the same pattern as `SpotifyAuthContext` using AsyncStorage
- **API Endpoints:** Create backend proxy endpoints similar to `/token` for Spotify:
  - `/lastfm/auth` - Handle initial authentication
  - `/lastfm/refresh` - Handle session key validation/refresh

### API Integration

- **last.fm API Key:** Store in environment variables (similar to Spotify credentials)
- **API Library:** Use Axios for HTTP requests (consistent with existing codebase)
- **Rate Limiting:** Implement retry logic with exponential backoff for last.fm's rate limits
- **Error Handling:** Map last.fm API errors to user-friendly messages

### Context Pattern

- **Create `LastFmAuthContext`:** Similar to `SpotifyAuthContext` structure:
  - Store auth state (token, isLoading, isRefreshing, error)
  - Provide methods: `setAuthToken`, `logout`, `isAuthenticated`
  - Handle token persistence and validation
- **Create `LastFmAPIContext`:** For managing API calls and scrobbling:
  - Fetch listening history
  - Update now playing status
  - Scrobble tracks
  - Handle offline queue

### Scrobbling Implementation

- **Now Playing API:** Update last.fm when track starts (user endpoint: `track.updateNowPlaying`)
- **Scrobble API:** Submit completed tracks (user endpoint: `track.scrobble`)
- **Queue Management:** Store failed scrobbles in a local queue and retry periodically
- **Signature Handling:** last.fm requires API signatures for write operations (scrobbling)

### Services Architecture

Create service files following existing patterns:
- `src/services/lastfm/lastfm.api.service.ts` - Wrapper for last.fm API calls
- `src/services/lastfm/lastfm-scrobble.service.ts` - Handle scrobbling logic and queue
- `src/hooks/lastfm/` - Custom hooks for consuming last.fm data

### Backend Requirements

Add Rust endpoints in `bedfellow-api` (server/bedfellow-api/src/):
- Create `lastfm/` directory with authentication handlers
- Implement endpoints for token exchange and session validation
- Follow existing patterns from `spotify/spotify_controller.rs`

## Success Metrics

As this is a personal project, traditional success metrics are not required. However, the feature will be considered successful if:

1. Users can successfully authenticate with last.fm
2. Authentication state persists across app restarts
3. Listening history displays correctly after authentication
4. Scrobbling works reliably for tracks played in the app
5. Error handling does not disrupt user experience
6. The feature integrates seamlessly with existing Spotify authentication

## Open Questions

1. **Scrobbling threshold:** What percentage of a track must be played before it counts as a scrobble? (last.fm defaults to 50% or 240 seconds)
2. **Offline queue retention:** How long should pending scrobbles be retained if the user is offline?
3. **Batch scrobbling limits:** last.fm allows batches of 50 scrobbles per request - should we implement batching or send individual requests?
4. **API call frequency:** How often should we fetch recent scrobbles and update now playing status without hitting rate limits?
5. **Stats page content:** What specific statistics provide the most value to users in the MVP?

