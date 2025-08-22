# Product Requirements Document: Enhanced Theming System

## Executive Summary

Implement a comprehensive theming system for the Bedfellow app that provides better color schemes, supports light/dark modes, and improves the overall visual experience while maintaining the dynamic album-based theming capability.

## Problem Statement

The current theming implementation has limitations:

- Limited to a single default color palette with basic colors
- Dynamic theming from album artwork sometimes produces poor contrast or unappealing color combinations
- No dark mode support despite being a music app often used in low-light environments
- Color palette extraction is platform-dependent (Android vs iOS) leading to inconsistent experiences
- No user preferences for theme customization
- Hard-coded color values scattered throughout components

## Goals

1. **Improve Visual Appeal**: Create more sophisticated and visually pleasing color schemes
2. **Support Multiple Themes**: Implement light, dark, and auto theme modes
3. **Better Dynamic Theming**: Enhance album-based color extraction with better algorithms and fallbacks
4. **User Customization**: Allow users to choose their preferred theme mode and customize colors
5. **Consistency**: Ensure consistent theming across iOS and Android platforms
6. **Accessibility**: Ensure all themes meet WCAG contrast requirements

## User Stories

### As a user:

- I want to switch between light and dark modes based on my preference
- I want the app to automatically match my system's theme preference
- I want the dynamic album colors to look good and be readable
- I want to disable dynamic theming if I prefer a consistent look
- I want the app to remember my theme preferences

### As a developer:

- I want a centralized theme system that's easy to maintain
- I want type-safe theme values throughout the application
- I want to easily add new theme variants
- I want consistent color extraction across platforms

## Functional Requirements

### 1. Theme Modes

- **Light Theme**: Optimized for bright environments
- **Dark Theme**: Optimized for low-light environments
- **Auto Mode**: Follows system theme preference
- **Dynamic Mode**: Album artwork-based theming (current feature, enhanced)

### 2. Color System

- **Semantic Colors**: Define colors by purpose (primary, secondary, background, surface, error, warning, success)
- **Color Scales**: Each semantic color should have multiple shades (100-900)
- **Contrast Ratios**: Ensure text/background combinations meet WCAG AA standards minimum

### 3. Theme Persistence

- Save user's theme preference using AsyncStorage
- Apply saved theme on app launch
- Sync with system theme when in auto mode

### 4. Dynamic Theming Enhancement

- Improved color extraction algorithm
- Contrast checking and automatic adjustment
- Smooth transitions between theme changes
- Fallback to user's selected theme if extraction fails

### 5. Theme Customization

- Settings screen for theme management
- Preview how themes look
- Toggle for enabling/disabling dynamic album theming
- Custom accent color picker (future enhancement)

## Technical Requirements

### 1. Architecture

```typescript
interface Theme {
  mode: 'light' | 'dark' | 'auto' | 'dynamic';
  colors: {
    // Backgrounds
    background: ColorScale;
    surface: ColorScale;

    // Content
    text: ColorScale;

    // Interactive
    primary: ColorScale;
    secondary: ColorScale;
    accent: ColorScale;

    // Feedback
    error: ColorScale;
    warning: ColorScale;
    success: ColorScale;
    info: ColorScale;

    // Borders & Dividers
    border: ColorScale;
    divider: ColorScale;

    // Special
    shadow: string;
    overlay: string;
  };
  spacing: SpacingScale;
  typography: TypographyScale;
  borderRadius: BorderRadiusScale;
  shadows: ShadowScale;
}

interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string; // Base color
  600: string;
  700: string;
  800: string;
  900: string;
}
```

### 2. Theme Provider Enhancement

- Extend current ImagePaletteContext to become a full ThemeContext
- Provide theme values throughout component tree
- Handle theme switching and persistence
- Integrate with React Navigation for navigation bar theming

### 3. Color Extraction Improvement

- Use consistent color extraction library across platforms
- Implement color harmony algorithms
- Add contrast checking and adjustment
- Cache extracted palettes for performance

### 4. Components Updates

- Create themed component variants (ThemedText, ThemedView, etc.)
- Update existing components to use theme values
- Remove hard-coded color values
- Add theme-aware animations

### 5. Testing Requirements

- Unit tests for theme switching logic
- Unit tests for color extraction and adjustment
- Snapshot tests for themed components
- Manual testing on both iOS and Android

## Design Specifications

### Light Theme Colors

```javascript
{
  background: {
    50: '#FEFEFE',
    100: '#FAFAFA',
    500: '#F5F5F5',
    900: '#E0E0E0'
  },
  text: {
    50: '#F5F5F5',
    100: '#E0E0E0',
    500: '#424242',
    900: '#121212'
  },
  primary: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    500: '#4CAF50',
    900: '#1B5E20'
  },
  accent: {
    50: '#E0F2F1',
    100: '#B2DFDB',
    500: '#009688',
    900: '#004D40'
  }
}
```

### Dark Theme Colors

```javascript
{
  background: {
    50: '#303030',
    100: '#212121',
    500: '#121212',
    900: '#000000'
  },
  text: {
    50: '#424242',
    100: '#616161',
    500: '#E0E0E0',
    900: '#FFFFFF'
  },
  primary: {
    50: '#1B5E20',
    100: '#2E7D32',
    500: '#66BB6A',
    900: '#A5D6A7'
  },
  accent: {
    50: '#004D40',
    100: '#00695C',
    500: '#26A69A',
    900: '#80CBC4'
  }
}
```

## Implementation Phases

### Phase 1: Core Theme System (Week 1)

- Create new theme types and interfaces
- Build enhanced ThemeProvider
- Implement light and dark themes
- Create themed base components

### Phase 2: Theme Switching (Week 2)

- Add theme mode switching logic
- Implement AsyncStorage persistence
- Create settings screen UI
- Add system theme detection

### Phase 3: Dynamic Theme Enhancement (Week 3)

- Improve color extraction algorithm
- Add contrast checking
- Implement smooth transitions
- Platform consistency improvements

### Phase 4: Polish & Testing (Week 4)

- Update all components to use theme system
- Comprehensive testing
- Performance optimization
- Documentation

## Success Metrics

- All color combinations meet WCAG AA contrast standards
- Theme switching happens in < 100ms
- User satisfaction with visual appearance increases
- No regression in app performance
- Cross-platform visual consistency achieved

## Non-Functional Requirements

- Theme changes should be instant with smooth transitions
- Theme system should add < 50KB to bundle size
- Should work offline (no external dependencies)
- Must maintain 60fps during theme transitions

## Future Enhancements

- Custom theme creator
- Theme sharing between users
- Seasonal/holiday themes
- Animation preferences (reduced motion support)
- Font size preferences
- High contrast mode for accessibility

## Dependencies

- react-native-appearance (or Appearance API)
- Enhanced color extraction library (consider replacing react-native-image-colors)
- AsyncStorage for persistence
- Color manipulation library (for contrast checking)

## Risks and Mitigations

| Risk                                    | Mitigation                                       |
| --------------------------------------- | ------------------------------------------------ |
| Performance impact from theme switching | Implement efficient memoization and lazy loading |
| Breaking existing UI                    | Gradual migration with backwards compatibility   |
| Cross-platform inconsistencies          | Extensive testing on both platforms              |
| Poor dynamic color combinations         | Implement strict contrast checking and fallbacks |

## Acceptance Criteria

- [ ] Users can switch between light, dark, and auto themes
- [ ] Theme preference persists across app sessions
- [ ] All text meets WCAG AA contrast requirements
- [ ] Dynamic theming produces visually appealing results
- [ ] No performance regression from current implementation
- [ ] Works consistently on iOS and Android
- [ ] Theme switching has smooth transitions
- [ ] Developer documentation is complete

## Appendix

### References

- [Material Design Color System](https://material.io/design/color)
- [Apple Human Interface Guidelines - Color](https://developer.apple.com/design/human-interface-guidelines/color)
- [WCAG Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

### Current Implementation Files

- `/src/theme/styles/index.ts` - Current color palette
- `/src/context/ImagePaletteContext/index.tsx` - Current palette context
- `/src/hooks/useImagePalette/useImagePalette.tsx` - Album color extraction
- Various component style files using hard-coded colors
