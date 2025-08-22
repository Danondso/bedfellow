## Relevant Files

- `src/theme/types/index.ts` - New file for theme type definitions and interfaces
- `src/theme/themes/light.ts` - Light theme configuration
- `src/theme/themes/dark.ts` - Dark theme configuration
- `src/theme/themes/index.ts` - Theme registry and exports
- `src/context/ThemeContext/index.tsx` - Enhanced theme context replacing ImagePaletteContext
- `src/context/ThemeContext/ThemeContext.test.tsx` - Unit tests for theme context
- `src/hooks/useTheme/index.tsx` - Hook for accessing and managing theme
- `src/hooks/useTheme/useTheme.test.tsx` - Unit tests for useTheme hook
- `src/services/theme/ThemeService.ts` - Theme persistence and system integration service
- `src/services/theme/ThemeService.test.ts` - Unit tests for theme service
- `src/services/theme/colorExtraction.ts` - Enhanced color extraction utilities
- `src/services/theme/colorExtraction.test.ts` - Unit tests for color extraction
- `src/components/themed/ThemedView.tsx` - Theme-aware View component
- `src/components/themed/ThemedText.tsx` - Theme-aware Text component
- `src/components/themed/index.ts` - Themed components exports
- `src/screens/Settings/index.tsx` - New settings screen with theme preferences
- `src/screens/Settings/Settings.styles.ts` - Settings screen styles
- `src/screens/Settings/Settings.test.tsx` - Settings screen tests
- `src/navigation/index.tsx` - Update navigation to include settings
- `src/theme/styles/index.ts` - Update existing palette (backwards compatibility)
- `src/context/ImagePaletteContext/index.tsx` - Migrate to ThemeContext
- `src/hooks/useImagePalette/useImagePalette.tsx` - Update to use new theme system

### Notes

- Unit tests should typically be placed alongside the code files they are testing
- Use `yarn test` to run the test suite
- Existing ImagePaletteContext will be migrated to ThemeContext with backwards compatibility
- Color extraction will be enhanced to work consistently across platforms

## Tasks

- [x] 1.0 Create Core Theme System Architecture
  - [x] 1.1 Create theme type definitions in `src/theme/types/index.ts` (Theme interface, ColorScale, ThemeMode enum)
  - [x] 1.2 Define semantic color structure with scales (background, text, primary, secondary, accent, error, warning, success)
  - [x] 1.3 Create spacing, typography, borderRadius, and shadow scale types
  - [x] 1.4 Add theme utility types for component props and style helpers
- [x] 2.0 Implement Theme Variants (Light and Dark)
  - [x] 2.1 Create light theme configuration in `src/theme/themes/light.ts` with full color scales
  - [x] 2.2 Create dark theme configuration in `src/theme/themes/dark.ts` with full color scales
  - [x] 2.3 Implement theme registry in `src/theme/themes/index.ts` for theme lookup
  - [x] 2.4 Create default/fallback theme configuration
- [x] 3.0 Build Theme Context and Provider
  - [x] 3.1 Create ThemeContext in `src/context/ThemeContext/index.tsx` with theme state and mode management
  - [x] 3.2 Implement theme switching logic with smooth transitions
  - [x] 3.3 Add system theme detection using Appearance API
  - [x] 3.4 Integrate dynamic album-based theming into context
  - [x] 3.5 Create migration path from ImagePaletteContext to ThemeContext
- [x] 4.0 Create Themed Components
  - [x] 4.1 Create ThemedView component with theme-aware styles
  - [x] 4.2 Create ThemedText component with typography scales
  - [x] 4.3 Create ThemedButton component with interactive states
  - [x] 4.4 Create ThemedCard component with surface styles
  - [x] 4.5 Add theme-aware SafeAreaView wrapper
- [x] 5.0 Implement Theme Persistence and System Integration

  - [x] 5.1 Create ThemeService for AsyncStorage persistence
  - [x] 5.2 Implement theme preference loading on app launch
  - [x] 5.3 Add system theme change listeners
  - [x] 5.4 Implement theme mode switching (light/dark/auto/dynamic)
  - [x] 5.5 Create theme transition animations

- [x] 6.0 Enhance Dynamic Color Extraction

  - [x] 6.1 Research and implement better color extraction library
  - [x] 6.2 Create color harmony algorithms for better palette generation
  - [x] 6.3 Implement contrast checking and automatic adjustment
  - [x] 6.4 Add platform-consistent color extraction
  - [x] 6.5 Implement palette caching for performance

- [x] 7.0 Create Settings Screen for Theme Management

  - [x] 7.1 Create Settings screen component and add to navigation
  - [x] 7.2 Build theme mode selector (light/dark/auto/dynamic)
  - [x] 7.3 Add theme preview component showing current theme
  - [x] 7.4 Implement dynamic theming toggle
  - [x] 7.5 Add theme reset to defaults option

- [x] 8.0 Migrate Existing Components to Theme System

  - [x] 8.1 Update CurrentTrack screen to use themed components
  - [x] 8.2 Migrate Login screen to theme system
  - [x] 8.3 Update all style files to use theme values instead of hard-coded colors
  - [x] 8.4 Update navigation bar and status bar theming
  - [x] 8.5 Migrate existing useImagePalette hook to use new theme system

- [x] 9.0 Testing and Documentation
  - [x] 9.1 Write unit tests for theme context and provider
  - [x] 9.2 Write unit tests for theme service and persistence
  - [x] 9.3 Write unit tests for color extraction and adjustment
  - [x] 9.4 Create snapshot tests for themed components
  - [x] 9.5 Update documentation with theme system usage guide
