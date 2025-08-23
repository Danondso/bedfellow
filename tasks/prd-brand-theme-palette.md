# Product Requirements Document: Brand Theme Palette Implementation

## Introduction/Overview

This feature replaces the existing default theme with a new brand color palette that reflects a warm, natural aesthetic with sand, teal, sage, and rust colors. The implementation will maintain all existing theme functionality including light/dark mode switching and dynamic album color extraction, while providing a more cohesive and distinctive brand identity throughout the application.

## Goals

1. Replace the current default theme colors with the brand palette across all screens and components
2. Maintain full compatibility with existing theme features (light/dark modes, dynamic colors)
3. Ensure visual consistency and accessibility standards with the new color scheme
4. Preserve user experience continuity while enhancing brand identity
5. Apply brand gradient as a subtle accent throughout the application

## User Stories

1. **As a user**, I want to see a cohesive brand color scheme throughout the app so that I have a consistent and pleasant visual experience.

2. **As a user**, I want to maintain the ability to switch between light and dark modes so that I can use the app comfortably in different lighting conditions.

3. **As a user**, I want the dynamic album color feature to work harmoniously with the brand palette so that I can enjoy personalized theming without losing brand consistency.

4. **As a returning user**, I want the app to feel familiar despite the color changes so that I can continue using it without confusion.

5. **As a user with accessibility needs**, I want sufficient color contrast and readable text so that I can use the app effectively.

## Functional Requirements

1. **Color System Implementation**

   1. The system must generate full color scales (100-900) for each brand color:
      - Sand (base: #FEF9E0, #FBF2C4, #E5C185)
      - Teal (primary: #008585)
      - Sage (secondary: #74A892)
      - Rust (accent: #C7522A)
      - Slate (text: #343941, #535A63)
      - Info (#64748B)
      - Obsidian (#000000)

2. **Theme Structure Updates** 2. The system must replace the dark theme colors in `/src/theme/themes/dark.ts` with the brand palette 3. The system must maintain the existing theme structure and type definitions 4. The system must preserve all theme properties (spacing, typography, shadows, etc.)

3. **Semantic Color Mapping** 5. The system must map semantic colors as follows:

   - Success → Sage 500 (#74A892)
   - Warning → Sand 300 (#E5C185) with dark text
   - Info → Info 600 (#64748B)
   - Danger → Rust 600 (#C7522A)
   - Primary → Teal 600 (#008585)
   - Secondary → Sage 500 (#74A892)
   - Accent → Rust 600 (#C7522A)

4. **Text Color Contrast** 6. The system must apply appropriate text colors for readability:

   - On Teal 600 → #FEF9E0 (Sand 50)
   - On Sage 500 → #343941 (Slate 900)
   - On Rust → #FEF9E0 (Sand 50)
   - On Sand surfaces → #343941 (Slate 900)

5. **Gradient Implementation** 7. The system must implement the brand gradient: `linear-gradient(90deg, #74A892 0%, #008585 100%)` 8. The gradient must be available as a theme property for use throughout the app 9. The gradient should be subtly applied as accents in:

   - Button hover states
   - Active navigation indicators
   - Progress bars
   - Loading states
   - Selected items highlights

6. **Shadow and Border Styling** 10. The system must apply new shadow styles globally: - Soft strokes: #343941 at 12-20% opacity - Card shadows: `rgba(52,57,65,0.14) 0 4px 14px` 11. The system must update all shadow utilities in the theme configuration

7. **Component Compatibility** 12. All themed components must automatically adapt to the new color palette 13. The system must maintain existing component APIs and props 14. The system must ensure no breaking changes to component functionality

8. **Dynamic Theme Integration** 15. The dynamic album color extraction must blend harmoniously with brand colors 16. The system must ensure extracted colors don't override critical brand elements 17. Primary brand colors (teal, sage) should remain visible even with dynamic themes

9. **Mode Switching** 18. The light/dark mode toggle must continue to function 19. The dark mode must use the brand palette as its base 20. The system must maintain smooth transitions between modes

10. **Accessibility** 21. All color combinations must meet WCAG AA contrast standards 22. The system must maintain the existing accessibility validation tools 23. The theme must pass the built-in accessibility checks

## Non-Goals (Out of Scope)

1. Creating new UI components or redesigning existing component structures
2. Implementing A/B testing or gradual rollout mechanisms
3. Adding user preferences to switch back to the old theme
4. Modifying the theme system architecture or API
5. Creating a separate light mode variant of the brand palette
6. Removing or disabling existing theme features
7. Changing typography, spacing, or layout systems

## Design Considerations

1. **Color Scale Generation**: Use a consistent algorithm to generate intermediate values (200, 400, 500, 600, 700, 800) for each brand color while preserving the specified key values

2. **Gradient Usage**: Apply gradients subtly to avoid overwhelming the interface; consider using them for:

   - Interactive element states (hover, focus)
   - Progress indicators
   - Decorative accents
   - Brand moments (splash screen, headers)

3. **Visual Hierarchy**: Maintain clear hierarchy with:
   - Sand 50 as the base background
   - Sand 100 for subtle sections
   - Sand 300 for prominent surfaces
   - Teal 600 for primary actions
   - Appropriate contrast ratios for all text

## Technical Considerations

1. **File Modifications**:

   - Primary: `/src/theme/themes/dark.ts`
   - Update: `/src/theme/colors/semanticColors.ts` if needed
   - Extend: Theme type definitions if gradient property is added

2. **Color Utilities**: Leverage existing color manipulation utilities in `/src/services/theme/colorExtraction.ts` for generating color scales

3. **Testing**: Utilize existing theme testing infrastructure to validate:

   - Color contrast ratios
   - Theme switching functionality
   - Dynamic theme compatibility

4. **Performance**: Ensure color calculations are cached appropriately to maintain smooth theme transitions

5. **Backwards Compatibility**: Maintain all existing theme context APIs and hooks

## Success Metrics

1. **Visual Consistency**:

   - 100% of screens display the brand palette correctly
   - All components render with appropriate brand colors
   - No visual breakages or unstyled elements

2. **Functionality Preservation**:

   - Light/dark mode switching works without errors
   - Dynamic album colors blend properly with brand palette
   - All themed components adapt automatically

3. **Accessibility Compliance**:

   - All color combinations pass WCAG AA standards
   - Theme validation tests pass successfully
   - No reduction in accessibility scores

4. **Technical Quality**:
   - No console errors related to theme
   - Theme transitions remain smooth (<300ms)
   - No increase in bundle size beyond 5KB

## Open Questions

1. Should the brand gradient be animated in any contexts (e.g., loading states)?

2. How should the gradient interact with the dynamic album color feature - should it be overridden or blend?

3. Are there specific components where the gradient should be more prominent vs. subtle?

4. Should we add a "brand" badge or indicator when the new theme is active?

5. Do we need to update app icons or splash screens to match the new brand palette?

6. Should the Settings screen have a theme preview showing the brand colors?

7. How should semi-transparent overlays work with the sand-based backgrounds?
