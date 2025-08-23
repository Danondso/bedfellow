# Tasks for Brand Theme Palette Implementation

## Relevant Files

- `src/theme/themes/dark.ts` - Dark theme configuration that will be replaced with brand palette
- `src/theme/themes/dark.test.ts` - Unit tests for dark theme
- `src/theme/colors/semanticColors.ts` - Contains color definitions and helper functions for creating color scales
- `src/theme/colors/semanticColors.test.ts` - Unit tests for semantic colors
- `src/theme/colors/brandColors.ts` - New file to define brand color constants and scales
- `src/theme/scales/index.ts` - Contains shadow definitions that need updating with brand shadow styles
- `src/theme/types/index.ts` - Theme type definitions that may need gradient property extension
- `src/services/theme/colorExtraction.ts` - Color manipulation utilities for generating color scales
- `src/theme/utils/colorGenerator.ts` - New utility file for generating intermediate color values
- `src/theme/utils/colorGenerator.test.ts` - Unit tests for color generation
- `src/context/ThemeContext/index.tsx` - Theme context that manages theme state
- `src/components/themed/ThemedButton.tsx` - Button component that will showcase gradient accents
- `src/theme/gradients.ts` - New file to define gradient utilities
- `src/services/theme/ThemeService.ts` - Theme service that handles theme persistence and validation

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [x] 1.0 Create Brand Color System Foundation

  - [x] 1.1 Create `src/theme/colors/brandColors.ts` with brand color constants (#FEF9E0, #FBF2C4, #E5C185, #008585, #74A892, #C7522A, #343941, #535A63, #64748B, #000000)
  - [x] 1.2 Define interfaces for brand color mappings and gradients in the file
  - [x] 1.3 Export base brand colors object with named colors (sand50, sand100, sand300, teal600, sage500, rust600, slate900, slate600, info600, obsidian)
  - [x] 1.4 Create type definitions for BrandColors and BrandGradient interfaces
  - [x] 1.5 Add JSDoc comments documenting each color's purpose and usage

- [ ] 2.0 Generate Full Color Scales for Brand Colors

  - [x] 2.1 Create `src/theme/utils/colorGenerator.ts` with color interpolation functions
  - [x] 2.2 Implement `generateColorScale(baseColor: string, keyPoints?: {[key: number]: string}): ColorScale` function that preserves specified values while interpolating missing ones
  - [x] 2.3 Generate sand scale preserving #FEF9E0 (50), #FBF2C4 (100), #E5C185 (300) and interpolating other values
  - [x] 2.4 Generate teal scale with #008585 as 600 value and calculate lighter/darker variants
  - [x] 2.5 Generate sage scale with #74A892 as 500 value
  - [ ] 2.6 Generate rust scale with #C7522A as 600 value
  - [ ] 2.7 Generate slate scale preserving #343941 (900) and #535A63 (600)
  - [ ] 2.8 Generate info scale with #64748B as 600 value
  - [ ] 2.9 Create unit tests in `colorGenerator.test.ts` verifying scale generation and color preservation

- [ ] 3.0 Update Dark Theme with Brand Palette

  - [ ] 3.1 Create `darkSemanticBrandColors` object in `src/theme/colors/semanticColors.ts` with brand color mappings
  - [ ] 3.2 Map background colors to sand scale (50-300 for dark surfaces)
  - [ ] 3.3 Map surface colors to sand scale (100-300 for elevated surfaces)
  - [ ] 3.4 Map text colors to slate scale (900 for primary text, 600 for muted)
  - [ ] 3.5 Map primary colors to teal scale with 600 as base
  - [ ] 3.6 Map secondary colors to sage scale with 500 as base
  - [ ] 3.7 Map accent colors to rust scale with 600 as base
  - [ ] 3.8 Map semantic colors (success: sage500, warning: sand300, info: info600, danger: rust600)
  - [ ] 3.9 Update border colors to use slate scale with appropriate opacity
  - [ ] 3.10 Update divider colors to lighter slate values
  - [ ] 3.11 Update `src/theme/themes/dark.ts` to import and use `darkSemanticBrandColors`

- [ ] 4.0 Implement Brand Gradient System

  - [ ] 4.1 Create `src/theme/gradients.ts` with gradient utility functions
  - [ ] 4.2 Define `brandGradient` constant with value `linear-gradient(90deg, #74A892 0%, #008585 100%)`
  - [ ] 4.3 Create `createGradient(colors: string[], angle?: number)` utility function
  - [ ] 4.4 Add `gradient?: { brand: string; [key: string]: string }` property to Theme interface in `src/theme/types/index.ts`
  - [ ] 4.5 Export gradient presets for different use cases (button, header, accent, overlay)
  - [ ] 4.6 Create React Native compatible gradient helper that returns array format for LinearGradient component
  - [ ] 4.7 Add gradient to dark theme configuration

- [ ] 5.0 Update Shadow and Border Styles

  - [ ] 5.1 Update `shadowScale` in `src/theme/scales/index.ts` to use #343941 as shadowColor
  - [ ] 5.2 Modify shadow opacity values to use 12-20% range (0.12 for sm, 0.14 for base, 0.16 for md, 0.18 for lg, 0.20 for xl)
  - [ ] 5.3 Update card shadow specifically to match `rgba(52,57,65,0.14) 0 4px 14px`
  - [ ] 5.4 Create `softStroke` utility with #343941 at 12% opacity
  - [ ] 5.5 Update `specialColors` in `src/theme/colors/semanticColors.ts` to use brand shadow color
  - [ ] 5.6 Test shadow rendering on both iOS and Android platforms

- [ ] 6.0 Integrate Brand Theme with Dynamic Color System

  - [ ] 6.1 Update `src/services/theme/colorExtraction.ts` to blend extracted colors with brand palette
  - [ ] 6.2 Implement `blendWithBrandColors(extractedPalette: DynamicPalette)` function that preserves teal and sage prominence
  - [ ] 6.3 Add brand color constraints to ensure primary (#008585) and secondary (#74A892) remain visible
  - [ ] 6.4 Update dynamic theme generation to use brand colors as fallbacks
  - [ ] 6.5 Test dynamic theme with various album artworks to ensure brand consistency
  - [ ] 6.6 Add configuration option to control brand color influence strength (0-100%)

- [ ] 7.0 Validate Accessibility and Contrast Standards

  - [ ] 7.1 Run contrast validation for text on sand backgrounds (#343941 on #FEF9E0, #FBF2C4, #E5C185)
  - [ ] 7.2 Validate text on colored surfaces (#FEF9E0 on #008585, #343941 on #74A892, #FEF9E0 on #C7522A)
  - [ ] 7.3 Use existing `validateAccessibility()` function from ThemeService to check WCAG AA compliance
  - [ ] 7.4 Document any contrast ratio adjustments needed for edge cases
  - [ ] 7.5 Create accessibility test suite in `src/theme/themes/dark.test.ts` for brand colors
  - [ ] 7.6 Ensure all interactive elements meet minimum touch target sizes with new colors

- [ ] 8.0 Test Theme Integration and Transitions

  - [ ] 8.1 Test theme switching between light and brand-dark modes
  - [ ] 8.2 Verify all themed components render correctly with brand colors
  - [ ] 8.3 Test gradient rendering in ThemedButton component hover states
  - [ ] 8.4 Verify CurrentTrack screen displays properly with brand theme
  - [ ] 8.5 Test Settings screen theme preview with brand colors
  - [ ] 8.6 Validate theme persistence after app restart
  - [ ] 8.7 Test performance of theme transitions (should be <300ms)
  - [ ] 8.8 Run existing theme test suite and fix any failures
  - [ ] 8.9 Test on both iOS and Android devices/simulators

- [ ] 9.0 Update Documentation and Clean Up
  - [ ] 9.1 Update theme documentation to include brand color system
  - [ ] 9.2 Add code comments explaining brand color choices and mappings
  - [ ] 9.3 Remove any unused color definitions from old theme
  - [ ] 9.4 Update CLAUDE.local.md with brand theme information
  - [ ] 9.5 Create migration notes for developers about theme changes
  - [ ] 9.6 Run final linting and fix any style issues
  - [ ] 9.7 Verify bundle size increase is under 5KB limit
