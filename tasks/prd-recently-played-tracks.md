# Product Requirements Document: Recently Played Tracks with Samples

## Introduction/Overview

This feature introduces a Recently Played Tracks screen that displays the user's Spotify listening history enriched with sample information from WhoSampled. Users can access their recent listening history through a history button on the floating player, allowing them to rediscover samples from tracks they've already heard and gain deeper insights into their music consumption patterns. This solves the problem of users missing sample information during playback and provides a comprehensive view of their listening history with musical connections.

## Goals

1. Enable users to review their Spotify listening history with integrated sample information
2. Allow retroactive discovery of samples from previously played tracks
3. Provide quick access to playback controls and sample exploration from history view
4. Reduce the friction of discovering samples by making historical data easily accessible
5. Enhance user engagement by revealing patterns and connections in their listening habits

## User Stories

1. As a music enthusiast, I want to see what tracks I've recently played so that I can discover samples I might have missed
2. As a Bedfellow user, I want to quickly play any track from my history so that I can re-experience songs with their samples
3. As a curious listener, I want to see which of my recently played tracks contain samples so that I can explore musical connections
4. As a power user, I want to configure how many tracks appear in my history so that I can see more or less of my listening patterns
5. As a user, I want to add interesting samples to my queue directly from the history view so that I can build a playlist of discoveries

## Functional Requirements

1. **History Access Button**: The floating player must display a history icon button that navigates to the Recently Played Tracks screen
2. **Track List Display**: The system must show recently played tracks in a grid view with album artwork
3. **Configurable Track Count**: Users must be able to configure the number of tracks displayed (options: 20, 50, 100, or custom)
4. **Sample Indicator**: Each track must clearly indicate whether samples are available, showing "No samples found" for tracks without samples
5. **Tap to Play**: Tapping a track must immediately start playback in Spotify
6. **Long Press to Queue**: Long-pressing a track must add it to the Spotify queue
7. **Three-Dot Menu**: Each track must have a menu with options to:
   - View track details and samples (navigate to CurrentTrack screen)
   - Add samples to queue
   - View on Spotify
   - Share track
   - Copy track link
8. **Search Functionality**: The screen must include a search bar to filter tracks by title, artist, or album
9. **Filter Options**: Users must be able to filter to show only tracks with samples
10. **Manual Refresh**: A pull-to-refresh gesture must update the recently played list
11. **Lazy Loading**: Sample data must be fetched only for visible tracks to optimize performance
12. **Empty State**: Display a meaningful message when no recently played tracks are available
13. **Error Handling**: Show appropriate error messages when Spotify API is unavailable
14. **Loading States**: Display skeleton loaders while fetching track and sample data
15. **Track Metadata**: Each track card must show:
    - Album artwork
    - Track title (truncated if needed)
    - Artist name
    - Sample count badge (if samples exist)
    - Played timestamp (e.g., "2 hours ago")

## Non-Goals (Out of Scope)

1. Spotify session expiration handling (separate work item)
2. Infinite scroll pagination beyond configured limit
3. Editing or reordering history
4. Deleting items from history
5. Syncing history across multiple devices
6. Offline mode support
7. Creating playlists from history
8. Social sharing features beyond basic track sharing
9. Analytics or listening statistics
10. Integration with other music services

## Design Considerations

1. **Grid Layout**: Use a responsive grid that adapts to screen size (2-3 columns on phones, 4-5 on tablets)
2. **Visual Hierarchy**: Album art should be prominent with track info overlaid or below
3. **Brand Colors**: Integrate Bedfellow's teal, sage, and sand color palette
4. **Smooth Animations**: Implement smooth transitions when navigating from floating player
5. **Touch Targets**: Ensure all interactive elements meet minimum 44x44pt touch target size
6. **Loading Skeletons**: Match the exact layout of track cards to prevent layout shift
7. **Sample Badge**: Use sage color for sample count badges to maintain brand consistency
8. **Floating Player Integration**: History button should feel naturally integrated with existing player controls

## Technical Considerations

1. **Spotify API Integration**: Leverage existing SpotifyAPI.service.ts, add method for fetching recently played
2. **Caching Strategy**: Store recently played data in Context to prevent redundant API calls
3. **Sample Data Fetching**: Extend WhoSampled.service.ts to handle batch sample lookups
4. **Navigation**: Add new screen to React Navigation stack, accessible from floating player
5. **State Management**: Create new Context for managing recently played tracks state
6. **Performance**: Implement virtualized list for large track counts (use FlatList or similar)
7. **Configuration Storage**: Save user's track count preference in AsyncStorage
8. **Error Boundaries**: Implement error boundaries to handle component-level failures gracefully
9. **TypeScript Types**: Extend existing Spotify types to include recently played timestamp

## Success Metrics

Primary success metric: "It works and I enjoy using it"

Supporting metrics to validate success:

1. Feature adoption rate (% of users accessing recently played screen)
2. Average time spent on recently played screen per session
3. Number of tracks played from history vs. current track screen
4. Sample discovery rate from historical tracks
5. User retention improvements after feature launch
6. Frequency of manual refresh actions (indicates engagement)
7. Search/filter usage rates
8. Queue additions from history screen

## Open Questions

1. Should we persist recently played data locally for offline viewing (without playback)?
2. How should we handle duplicate tracks in history (same track played multiple times)?
3. Should the history button on floating player show a badge with new track count?
4. What's the maximum reasonable limit for track count configuration?
5. Should we pre-fetch sample data during quiet periods to improve perceived performance?
6. How do we handle tracks that have been removed from Spotify since they were played?
7. Should long track/artist names use marquee scrolling or truncation with ellipsis?
8. Do we need a "Mark as seen" feature to track which history items are new?
9. Should the grid view be customizable (list view option)?
10. How should we handle explicit content indicators in the history view?
