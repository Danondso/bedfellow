# Product Requirements Document: Native Widget Feature

## Introduction/Overview

The Native Widget Feature enables users to view and interact with currently playing tracks and their samples directly from their device home screen through native iOS/Android widgets. The widget provides a swipeable interface showing the current track on the first view and discovered samples on subsequent views, with the ability to queue samples directly from the widget. This feature enhances the Bedfellow experience by making sample discovery and queuing accessible without opening the main app.

## Goals

1. Provide instant access to current track and sample information from the home screen
2. Enable quick sample queuing without launching the full application
3. Create a contextually relevant widget that only appears when music is playing
4. Support multiple widget sizes for user customization
5. Ensure cross-platform compatibility (iOS first, then Android)

## User Stories

1. **As a music listener**, I want to see what samples are in my current track from my home screen, so that I can discover music connections without opening the app.

2. **As a Bedfellow user**, I want to queue interesting samples directly from the widget, so that I can quickly add them to my listening queue while multitasking.

3. **As a home screen organizer**, I want the widget to only appear when music is playing, so that my home screen remains uncluttered when not listening to music.

4. **As a visual user**, I want the widget to match my device theme and show album artwork colors, so that it integrates seamlessly with my device aesthetic.

5. **As a power user**, I want multiple widget size options, so that I can choose the best fit for my home screen layout.

## Functional Requirements

1. **Widget Availability**
   - The system must support iOS widgets (WidgetKit) as the initial implementation
   - The system must ensure the chosen architecture supports Android widgets for future implementation
   - The widget must be available in multiple sizes (small 2x2, medium 4x2, large 4x4)

2. **Display States**
   - The widget must hide all content when no track is playing
   - The widget must show the current track information on the primary view
   - The widget must display album artwork, track title, and artist name for the current track

3. **Sample Display**
   - The widget must support horizontal swiping to navigate between current track and samples
   - The widget must display all available samples for the current track
   - Each sample must show: thumbnail, track title, artist, and year
   - The widget must indicate if there are more samples available via pagination dots or indicators

4. **Queue Functionality**
   - Each sample view must include a plus (+) button for queuing
   - The system must queue samples to Spotify when the plus button is tapped
   - The widget must provide visual feedback when a sample is successfully queued
   - The widget must indicate if a sample is already in the queue or has been queued

5. **Navigation**
   - Tapping anywhere on the widget (except interactive buttons) must open the app to the current track screen
   - The app must open in the correct state showing the same track displayed in the widget

6. **Real-time Updates**
   - The widget must update immediately when the track changes
   - The widget must refresh sample data when a new track starts playing
   - The widget must clear content when playback stops

7. **Visual Design**
   - The widget must extract and use colors from album artwork (matching app behavior)
   - The widget must support both light and dark mode based on system settings
   - The widget must use brand colors (teal, sage, sand) as accent colors
   - The widget must maintain visual consistency with the main app design

8. **Data Management**
   - The widget must use cached data with real-time updates when available
   - The widget must share data with the main app to avoid duplicate API calls
   - The widget must handle data efficiently to minimize battery impact

9. **Authentication**
   - The widget must hide all content when Spotify authentication expires
   - The widget must not display any user data when logged out
   - The widget must restore functionality automatically when the app re-authenticates

## Non-Goals (Out of Scope)

1. Playback controls (play, pause, skip) within the widget
2. Full sample details or descriptions in the widget
3. Widget configuration options beyond size selection
4. Standalone widget functionality without the main app installed
5. Sample preview playback from the widget
6. Social sharing features from the widget
7. Search or filtering capabilities within the widget
8. Custom widget layouts or user-defined views

## Design Considerations

- **Size Constraints**:
  - Small widget: Show current track only with mini album art
  - Medium widget: Current track with 1-2 sample previews visible
  - Large widget: Current track with 3-4 sample previews visible

- **Swipe Gesture**: Smooth horizontal pagination between views
- **Loading States**: Subtle skeleton screens while fetching sample data
- **Error States**: Graceful degradation when samples unavailable
- **Typography**: Scaled appropriately for widget size with proper truncation
- **Touch Targets**: Minimum 44pt for iOS, 48dp for Android

## Technical Considerations

1. **iOS Implementation**:
   - Use WidgetKit framework with SwiftUI views
   - Implement Timeline Provider for update scheduling
   - Use App Groups for data sharing between app and widget
   - Leverage existing Spotify token from main app

2. **Android Compatibility**:
   - Design data layer to support Android App Widgets
   - Consider using Glance (Jetpack Compose for widgets) for future Android implementation
   - Ensure shared business logic can be reused

3. **Data Architecture**:
   - Implement shared data container accessible by both app and widget
   - Use background refresh wisely to minimize battery drain
   - Cache sample data with appropriate TTL
   - Handle Spotify rate limiting gracefully

4. **Performance**:
   - Widget memory limit: ~30MB on iOS
   - Optimize image loading and caching
   - Minimize network requests through intelligent caching

## Success Metrics

Since this is a personal project, success will be measured by:

1. **Personal Satisfaction**: The widget feels delightful and useful in daily music listening
2. **Convenience**: Reduced friction in discovering and queuing samples
3. **Visual Polish**: The widget looks native and professionally integrated
4. **Reliability**: The widget updates consistently and accurately
5. **Battery Efficiency**: No noticeable battery drain from widget usage

## Open Questions

1. Should we implement a "recently queued" indicator that persists across sessions?
2. How should we handle very long sample lists (20+ samples) in the widget interface?
3. Should the widget support deep linking to specific samples in the main app?
4. Do we need a manual refresh option if real-time updates fail?
5. Should we add haptic feedback for successful queue actions on iOS?
6. How should the widget behave during offline/airplane mode?
7. Should we cache the last played track for quick widget rendering on device unlock?
