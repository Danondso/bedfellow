# Product Requirements Document: YouTube Music Integration

## Introduction/Overview

Bedfellow currently operates exclusively with Spotify as its music provider. This PRD outlines the integration of YouTube Music as an additional music provider, along with a re-engineered authentication system that will support multiple music streaming services. This feature will expand Bedfellow's user base to YouTube Music subscribers while maintaining the same sample discovery experience. The implementation will be phased, starting with refactoring the login architecture to support multiple providers, followed by full YouTube Music integration, and finally enabling future provider additions (Apple Music, Deezer, etc.).

## Goals

1. Enable YouTube Music users to use Bedfellow with full feature parity to the current Spotify experience
2. Re-architect the authentication system to support multiple music provider integrations
3. Maintain consistent sample discovery functionality across all music providers
4. Create a scalable foundation for adding additional music services in the future
5. Provide seamless provider switching and account management within the app
6. Ensure all music provider data syncs correctly with the Bedfellow database

## User Stories

1. **As a YouTube Music subscriber**, I want to use Bedfellow to discover samples in my music, so that I can explore the musical connections in my library without needing a Spotify subscription.

2. **As a user with multiple streaming services**, I want to link both my Spotify and YouTube Music accounts, so that I can use Bedfellow regardless of which service I'm currently using.

3. **As a returning user**, I want my sample discovery history to be preserved across providers, so that I don't lose my saved data when switching between services.

4. **As a YouTube Music user**, I want to control playback, manage queues, and create playlists directly from Bedfellow, so that I have the same functionality as Spotify users.

5. **As a user switching providers**, I want to easily change my active music service from settings, so that I can use whichever service I prefer at any moment.

## Functional Requirements

### Phase 1: Authentication System Refactor

1. The system must implement a provider-agnostic authentication layer that supports multiple music services
2. The system must present a provider selection screen at login showing available music services (initially Spotify and YouTube Music)
3. The system must store provider-specific authentication tokens separately and securely
4. The system must track the user's currently active provider in app state and persistent storage
5. The system must maintain backward compatibility with existing Spotify-only users
6. The backend services must be updated to handle provider-specific authentication flows

### Phase 2: YouTube Music Integration

7. The system must implement YouTube Music OAuth 2.0 authentication flow for both iOS and Android
8. The system must provide complete playback control for YouTube Music (play, pause, skip, seek, volume)
9. The system must support queue management (view queue, add to queue, remove from queue, reorder)
10. The system must enable playlist creation and management within YouTube Music
11. The system must fetch currently playing track information from YouTube Music
12. The system must search YouTube Music library and catalog
13. The system must retrieve album artwork and track metadata from YouTube Music
14. The system must handle YouTube Music-specific track identifiers and convert them for sample matching

### Phase 3: Multi-Provider Features

15. The system must provide a "Link Accounts" section in settings showing connected and available providers
16. The system must allow users to connect multiple music service accounts
17. The system must provide a toggle in settings to switch between connected providers
18. The system must persist the selected provider choice across app sessions
19. The system must handle provider unavailability gracefully by showing cached data without playback controls
20. The system must sync all sample discovery data to the Bedfellow database regardless of provider

### Sample Discovery Integration

21. The system must extract artist and track names from YouTube Music's now playing data
22. The system must use fuzzy matching to find samples via the existing WhoSampled service
23. The system must follow the same sample discovery flow as the current Spotify implementation
24. The system must post discovered samples to the Bedfellow database API with provider-agnostic identifiers
25. The system must retrieve and display historical sample data regardless of which provider was active when discovered

### Data Management

26. The system must share favorites and discovery history across all connected providers
27. The system must use provider-agnostic identifiers in the database (track name, artist, ISRC when available)
28. The system must maintain separate playback sessions for each provider
29. The system must handle provider-specific features gracefully (e.g., features available in one service but not another)

## Non-Goals (Out of Scope)

1. This feature will NOT implement a custom music playback engine (will rely on provider APIs)
2. This feature will NOT provide cross-provider playback (cannot play Spotify tracks through YouTube Music or vice versa)
3. This feature will NOT sync playlists between different music providers
4. This feature will NOT implement Apple Music or Deezer in the initial phases
5. This feature will NOT create a web version of the application
6. This feature will NOT implement offline sample discovery
7. This feature will NOT bypass any provider's authentication requirements
8. This feature will NOT store or cache actual music files

## Design Considerations

1. **Provider Selection Screen**: Clean, branded interface showing available music service logos with clear selection states
2. **Settings Integration**: New "Music Providers" or "Link Accounts" section in settings with:
   - List of available providers with connection status
   - Active provider toggle/selector
   - Connect/disconnect buttons for each provider
3. **UI Adaptation**: Minor UI elements may need to adapt based on active provider (e.g., "Add to Spotify Queue" becomes "Add to YouTube Music Queue")
4. **Error States**: Clear messaging when provider is unavailable or authentication fails
5. **Branding**: Maintain Bedfellow's brand identity while respecting provider brand guidelines for logos/icons

## Technical Considerations

### Frontend Architecture

1. Create abstraction layer for music provider services (MusicProviderInterface)
2. Implement provider-specific services that conform to the interface (SpotifyService, YouTubeMusicService)
3. Update Context providers to handle multi-provider state
4. Refactor existing Spotify-specific code to use the abstraction layer

### Authentication Flow

1. Implement provider factory pattern for authentication handlers
2. Store provider tokens in secure storage with provider-specific keys
3. Update token refresh logic to handle multiple providers

### Backend Updates

1. Update bedfellow-api to handle multiple OAuth providers
2. Add provider field to database schema for tracking data source
3. Implement provider-agnostic track identification system
4. Update API endpoints to accept provider parameter

### YouTube Music API Research Needs

1. Investigate official YouTube Music API availability and limitations
2. Research third-party libraries for React Native (e.g., react-native-youtube-music)
3. Evaluate web scraping alternatives if official API is insufficient
4. Test OAuth flow on both iOS and Android platforms

### Database Schema Updates

```sql
ALTER TABLE samples ADD COLUMN provider VARCHAR(50) DEFAULT 'spotify';
ALTER TABLE user_sessions ADD COLUMN active_provider VARCHAR(50) DEFAULT 'spotify';
CREATE TABLE user_provider_accounts (
    user_id INT,
    provider VARCHAR(50),
    token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    PRIMARY KEY (user_id, provider)
);
```

## Success Metrics

Given this is a personal project, success is defined by functional parity with the Spotify experience:

1. **Feature Completeness**: All Spotify features work identically with YouTube Music
2. **Seamless Switching**: Can switch between providers without app restart
3. **Data Continuity**: Sample discovery history is maintained across providers
4. **Performance**: No noticeable performance degradation with multi-provider support
5. **Stability**: No increase in crash rate or error frequency
6. **User Experience**: The integration feels native and intuitive

## Open Questions

1. **YouTube Music API Access**: Is there an official API available, or will we need to use unofficial solutions?
2. **Track Matching Accuracy**: How accurate will fuzzy matching be for sample discovery without direct track IDs?
3. **iOS App Store Approval**: Will Apple approve an app using unofficial YouTube Music APIs if needed?
4. **Rate Limiting**: What are the rate limits for YouTube Music API calls?
5. **Playback Sync**: Can we sync playback state between the Bedfellow app and the native YouTube Music app?
6. **Provider Feature Gaps**: How do we handle features that exist in one provider but not another?
7. **Token Management**: What's the token expiration and refresh strategy for YouTube Music?
8. **ISRC Availability**: Does YouTube Music provide ISRC codes for better track matching?
9. **Queue Persistence**: Does YouTube Music API support persistent queue management across sessions?
10. **Playlist Limitations**: Are there limitations on playlist creation via the YouTube Music API?

## Implementation Phases

### Phase 1: Authentication Refactor (2-3 weeks)

- Design and implement provider abstraction layer
- Refactor existing Spotify code to use new architecture
- Update backend OAuth handling
- Implement provider selection UI
- Add provider management to settings

### Phase 2: YouTube Music Core Integration (3-4 weeks)

- Research and implement YouTube Music authentication
- Implement playback controls
- Add track metadata retrieval
- Integrate sample discovery with fuzzy matching
- Update database sync logic

### Phase 3: YouTube Music Advanced Features (2-3 weeks)

- Implement queue management
- Add playlist creation functionality
- Polish provider switching experience
- Handle edge cases and error states
- Complete testing on both platforms

### Phase 4: Future Provider Preparation (1 week)

- Document provider integration patterns
- Create provider integration template
- Prepare for Apple Music/Deezer additions
