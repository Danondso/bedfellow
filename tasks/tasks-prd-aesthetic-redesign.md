# Task List: Aesthetic Redesign

## Relevant Files

- `src/theme/scales/index.ts` - Typography scale with serif fonts and border radius definitions (modified)
- `src/theme/fonts.ts` - Font family configuration for serif headers and sans-serif body (created)
- `src/theme/scales/typography.test.ts` - Typography scale tests (to be created)
- `src/theme/themes/brand.ts` - Brand theme with warm aesthetic colors (modified)
- `src/theme/colors/brandColors.ts` - Brand color definitions with warm palette (modified)
- `src/theme/COLOR_GUIDELINES.md` - Color usage guidelines documentation (created)
- `src/theme/themes/brand.test.ts` - Brand theme tests (to be created)
- `src/components/themed/ThemedButton.tsx` - Button component with full border radius (modified)
- `src/components/themed/ThemedButton.test.tsx` - Button component tests
- `src/components/themed/ThemedCard.tsx` - Card component with soft rounded corners (modified)
- `src/components/themed/ThemedInput.tsx` - Input component with rounded borders and minimal style (created)
- `src/components/themed/ThemedChip.tsx` - Chip component with pill-shaped styling (created)
- `src/components/themed/ThemedBadge.tsx` - Badge component using rust for important callouts (created)
- `src/components/themed/ThemedCallout.tsx` - Callout component with rust accent for important messages (created)
- `src/screens/Login/index.tsx` - Login screen with warm welcome aesthetic (modified)
- `src/screens/Login/Login.themed.styles.ts` - Login screen styles with warm colors (modified)
- `src/screens/CurrentTrack/index.tsx` - Current track screen for card updates
- `src/screens/CurrentTrack/TrackList/Skeleton/index.tsx` - Track list skeleton with rounded corners (modified)
- `src/screens/CurrentTrack/CurrentSongHeader/Skeleton/index.tsx` - Song header skeleton with rounded corners (modified)
- `src/screens/CurrentTrack/TrackList/SampleCard/index.tsx` - Sample card with warm aesthetic colors (modified)
- `src/screens/Settings/index.tsx` - Settings screen for form styling
- `src/assets/images/owl-mascot.svg` - Owl mascot asset (to be created)
- `src/components/BrandMascot.tsx` - Owl mascot component (to be created)
- `src/components/LoadingAnimation.tsx` - Loading animation component (to be created)
- `ios/bedfellow/Info.plist` - iOS font configuration
- `android/app/src/main/assets/fonts/` - Android font directory

### Notes

- Unit tests should typically be placed alongside the code files they are testing
- Use `yarn test [optional/path/to/test/file]` to run tests
- The existing brand color system provides the foundation for the warm palette
- Theme updates should leverage the existing ThemeContext infrastructure

## Tasks

- [ ] 1.0 Implement Typography System with Serif Headers
  - [x] 1.1 Research and select appropriate serif font (Georgia fallback selected)
  - [x] 1.2 Add serif font files to iOS bundle (using system Georgia font, no files needed)
  - [x] 1.3 Configure serif font for Android (using system serif font, no files needed)
  - [x] 1.4 Create fontLoader utility to handle font loading and fallbacks
  - [x] 1.5 Update typography scale in src/theme/scales/index.ts with serif for headers
  - [x] 1.6 Create fontFamily constants for serif headers and sans-serif body
  - [x] 1.7 Update ThemedText component to apply serif font to header variants (already using typography scale)
  - [ ] 1.8 Test font rendering on both iOS and Android platforms (requires device testing)
  - [x] 1.9 Create typography documentation with usage examples

- [ ] 2.0 Update Component Border Radius and Styling
  - [x] 2.1 Update borderRadiusScale in src/theme/scales/index.ts (already had 'full' option)
  - [x] 2.2 Modify ThemedButton to use full border radius (borderRadius: 9999)
  - [x] 2.3 Update ThemedCard with soft rounded corners (12-16px radius)
  - [x] 2.4 Update ThemedInput with rounded borders and minimal style
  - [x] 2.5 Create or update ThemedChip component with pill-shaped styling
  - [x] 2.6 Update shadow system to use subtle rgba values of slate color
  - [x] 2.7 Implement hover/press states with gentle scale and opacity transitions
  - [x] 2.8 Update Skeleton loader components with rounded corners
  - [ ] 2.9 Test component styling across different screen sizes

- [ ] 3.0 Refine Color System and Semantic Mappings
  - [x] 3.1 Audit current brand color implementation against PRD requirements
  - [x] 3.2 Adjust sand tone applications for backgrounds (50, 100, 200 levels)
  - [x] 3.3 Update primary action colors to use sage/teal contextually
  - [x] 3.4 Refine text colors using darker slate tones for readability
  - [x] 3.5 Implement rust/coral as accent color for important callouts
  - [x] 3.6 Update semantic colors (success, warning, error) to use warm palette
  - [x] 3.7 Create color usage guidelines documentation
  - [x] 3.8 Verify WCAG AA compliance for all text/background combinations
  - [x] 3.9 Update dark mode colors to maintain warm aesthetic

- [ ] 4.0 Update Main Screen Layouts and Visual Hierarchy
  - [x] 4.1 Redesign Login screen with warm welcome aesthetic and rounded buttons
  - [x] 4.2 Update Login screen background to use sand gradient or solid sand tone
  - [x] 4.3 Refactor CurrentTrack screen cards with new border radius and shadows
  - [ ] 4.4 Update track information hierarchy with serif headers
  - [ ] 4.5 Redesign Settings screen with new form styling and grouped sections
  - [ ] 4.6 Update navigation bar/header with softer styling
  - [ ] 4.7 Implement generous whitespace throughout all screens
  - [ ] 4.8 Update sample list cards with rounded corners and warm colors
  - [ ] 4.9 Create consistent spacing system using multiples of 4px/8px

- [ ] 5.0 Create and Integrate Brand Elements
  - [ ] 5.1 Design or source owl mascot SVG asset in warm, playful style
  - [ ] 5.2 Create BrandMascot component with size and color variants
  - [ ] 5.3 Integrate owl mascot in splash/launch screen
  - [ ] 5.4 Add owl to empty states (no tracks playing, no samples found)
  - [ ] 5.5 Create subtle owl integration for about/settings section
  - [ ] 5.6 Update app icon with new aesthetic (warm colors, rounded style)
  - [ ] 5.7 Design loading states using brand colors and smooth animations
  - [ ] 5.8 Create branded error state illustrations
  - [ ] 5.9 Ensure brand elements don't feel childish or overwhelming

- [ ] 6.0 Implement Animations and Micro-interactions
  - [ ] 6.1 Create smooth fade transitions between screens (200-300ms)
  - [x] 6.2 Implement button press animations (subtle scale: 0.98)
  - [ ] 6.3 Add gentle hover states for interactive elements
  - [ ] 6.4 Create smooth color transitions for dynamic theme changes
  - [ ] 6.5 Design organic loading spinner using brand colors
  - [ ] 6.6 Implement card entry animations (fade + subtle slide)
  - [ ] 6.7 Add playful but professional touch feedback
  - [ ] 6.8 Create smooth skeleton to content transitions
  - [ ] 6.9 Test animation performance on lower-end devices

- [ ] 7.0 Final Polish and Consistency Pass
  - [ ] 7.1 Audit all screens for visual consistency
  - [ ] 7.2 Ensure consistent use of serif headers throughout
  - [ ] 7.3 Verify all buttons have full border radius
  - [ ] 7.4 Check color usage matches established patterns
  - [ ] 7.5 Review and adjust spacing for visual rhythm
  - [ ] 7.6 Test on multiple device sizes and orientations
  - [ ] 7.7 Gather feedback and make refinements
  - [ ] 7.8 Update any remaining hardcoded colors or styles
  - [ ] 7.9 Document the new design system for future reference
