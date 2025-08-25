# Product Requirements Document: Aesthetic Redesign

## Introduction/Overview

This PRD outlines the complete visual redesign of the Bedfellow music discovery app to adopt a warm, nostalgic aesthetic inspired by classic Apple design language. The redesign will transform the app from its current modern look to a softer, more playful visual style featuring sand/sage/teal tones, rounded UI elements, and subtle owl branding. This change aims to create a unique, memorable user experience that stands out in the music app landscape while maintaining a sense of warmth and approachability.

## Goals

1. Transform the entire app's visual language to match the warm, muted aesthetic with sand, sage, and teal color palette
2. Implement a nostalgic typography system using serif fonts reminiscent of early Macintosh systems for headers
3. Create a cohesive, playful yet professional design system across all screens and components
4. Establish a unique brand identity that differentiates Bedfellow from typical music apps
5. Maintain accessibility standards while introducing the new aesthetic

## User Stories

1. **As a user**, I want to experience a warm, inviting interface when I open the app, so that I feel comfortable and engaged while discovering music
2. **As a user**, I want consistent visual elements throughout the app, so that I can navigate intuitively without confusion
3. **As a user**, I want readable, aesthetically pleasing typography, so that I can easily consume information about tracks and samples
4. **As a new user**, I want to be subtly introduced to the owl mascot/brand, so that I remember and recognize the Bedfellow brand
5. **As a returning user**, I want the redesigned interface to maintain familiar functionality, so that I don't need to relearn how to use the app

## Functional Requirements

### Color System

1. The system must integrate the existing brand colors with the new warm palette (sand, sage, teal tones)
2. The system must provide a complete color scale (50-900) for each primary color
3. The system must maintain WCAG AA accessibility standards for text contrast
4. The system must define semantic colors for success, warning, error, and info states using the new palette

### Typography

5. The system must implement a serif font for all headers (similar to Chicago or other classic Mac fonts)
6. The system must use a clean sans-serif font for body text and secondary content
7. The system must define a consistent type scale for headers, body, captions, and labels
8. The system must ensure all text remains legible against the new color backgrounds

### Component Styling

9. All buttons must have fully rounded corners matching the reference aesthetic
10. All cards and containers must use soft, rounded corners with subtle shadows
11. Interactive elements must have gentle hover/press states using the new color palette
12. Form inputs must adopt the rounded, minimal style with muted borders

### Brand Elements

13. The owl mascot must be incorporated subtly in select locations (splash screen, empty states, about section)
14. The app icon must be updated to reflect the new aesthetic while maintaining recognizability
15. Loading states and skeletons must use the new color palette

### Screen Updates

16. The Login screen must adopt the warm welcome aesthetic with rounded buttons
17. The CurrentTrack screen must use the new card styles for track information
18. The Settings screen must implement the new form styling and color system
19. All navigation elements must be updated to match the new aesthetic
20. The sample list must use rounded cards with the new color scheme

### Animations and Transitions

21. The system must implement smooth, subtle fade transitions between screens
22. Button interactions must include playful but professional micro-animations
23. Color transitions when album art changes must blend smoothly with the new palette
24. Loading animations must feel organic and match the soft aesthetic

## Non-Goals (Out of Scope)

1. Complete rewrite of navigation structure or user flows
2. Implementation of complex animated illustrations or heavy graphical elements
3. Dark mode color adjustments (will be handled in a future iteration)
4. Major functionality changes beyond what's necessary for the aesthetic update
5. Backend or API modifications
6. Performance optimizations unrelated to the visual updates

## Design Considerations

### Visual Hierarchy

- Headers should be prominent with the serif font, creating clear content sections
- Use color weight rather than stark contrasts to establish hierarchy
- Maintain generous whitespace to let the design breathe

### Color Application

- Primary actions: Sage or teal depending on context
- Backgrounds: Various sand tones (50, 100, 200)
- Text: Darker slate tones for optimal readability
- Accents: Selective use of rust/coral for important callouts

### Component Library Updates

- Update all themed components (ThemedView, ThemedText, ThemedButton, etc.)
- Ensure consistent border radius (12-16px for cards, full radius for buttons)
- Implement subtle box shadows using rgba values of the slate color

## Technical Considerations

1. **Theme System**: Leverage the existing ThemeContext to implement the new aesthetic
2. **Font Loading**: Implement proper font loading for the serif typeface (consider using a system font fallback)
3. **Color Migration**: Update the existing color scales in the theme files
4. **Component Updates**: Modify styled components to use the new design tokens
5. **Image Assets**: Update any hardcoded images or icons to match the new aesthetic
6. **Gradients**: Implement subtle gradients using the new color palette for depth
7. **Performance**: Ensure new fonts and styles don't significantly impact app performance

## Success Metrics

Since this is a local/personal project, success will be measured by:

1. Personal satisfaction with the visual cohesion and aesthetic appeal
2. Smooth implementation without breaking existing functionality
3. Successful integration of all design elements into a cohesive system
4. The app feeling unique and memorable compared to typical music apps
5. Maintaining or improving the overall user experience flow

## Open Questions

1. Should we create custom icons to match the rounded, soft aesthetic, or adapt existing icon sets?
2. How should we handle the transition of the dynamic color extraction to work with the new base palette?
3. Should error states and alerts maintain some visual urgency, or fully embrace the soft aesthetic?
4. What specific serif font would best capture the classic Macintosh feeling while remaining modern?
5. Should we implement a subtle paper texture or grain to enhance the warm, vintage feeling?
6. How can we best balance the playful owl branding without making the app feel childish?
7. Should certain screens (like Settings) maintain a more utilitarian design, or fully embrace the aesthetic?

## Implementation Priority

1. **Phase 1**: Update color system and base theme
2. **Phase 2**: Implement typography changes
3. **Phase 3**: Update core components (buttons, cards, inputs)
4. **Phase 4**: Restyle main screens (Login, CurrentTrack, Settings)
5. **Phase 5**: Add brand elements and polish animations
6. **Phase 6**: Fine-tune and ensure consistency across all screens

---

_Note: This redesign prioritizes creating a unique, warm, and inviting aesthetic that sets Bedfellow apart from typical music discovery apps. The implementation should be iterative, allowing for adjustments as the new design system takes shape._
