# Product Requirements Document: Tech Debt Reduction & Code Consolidation

## Introduction/Overview

This PRD outlines a systematic approach to reduce technical debt and redundancy in the Bedfellow mobile application. Analysis reveals approximately 12,500 lines of TypeScript code with significant redundancy, particularly in the theme system (8,554 lines dedicated to theming alone). The goal is to reduce codebase complexity, improve maintainability, and eliminate 1,500-2,000 lines of redundant code.

## Goals

1. **Reduce codebase by 15-20%** through consolidation and removal of redundant code
2. **Eliminate duplicate implementations** of color systems, spacing systems, and utility functions
3. **Consolidate overlapping context systems** to simplify state management
4. **Remove unused exports and dead code** (50+ unused exports identified)
5. **Standardize development patterns** to prevent future tech debt accumulation

## Tech Debt Analysis Summary

### Current State

- **Total TypeScript files:** 84
- **Total lines of code:** ~12,500
- **Theme-related code:** 8,554 lines (68% of codebase!)
- **Unused exports:** 50+ functions/types
- **Console statements:** 75 occurrences (should be removed/replaced)
- **Circular dependencies:** 0 (✅ Good!)

### Major Issues Identified

#### 1. Theme System Redundancy (Critical - 1,300-1,800 lines removable)

- **Duplicate color systems:** Old palette vs new brand colors
- **Multiple spacing systems:** BASE_PADDING vs SpacingScale
- **Overlapping contexts:** ImagePaletteContext vs ThemeContext
- **Duplicate utilities:** Multiple color scale generators

#### 2. Unused Type Exports (Medium - 500+ lines)

- **Spotify API types:** 30+ unused response types
- **Navigation types:** Unused screen props
- **Theme types:** Duplicate interface definitions

#### 3. Development Artifacts (Low - 100+ lines)

- **Console statements:** 75 instances across 12 files
- **Example files:** App.theme.example.tsx
- **Test utilities:** Unused hooks and helpers

## Functional Requirements

### Phase 1: Theme System Consolidation (Highest Impact)

1. **Consolidate Color Systems**
   - Remove old palette system from `src/theme/styles/index.ts`
   - Migrate all color references to use brand color system
   - Merge duplicate color scale generation functions
   - Standardize on single color definition source

2. **Unify Spacing Systems**
   - Remove BASE_PADDING multiplication system
   - Migrate all components to use SpacingScale
   - Create migration map for old → new values
   - Update all hardcoded spacing values

3. **Merge Image Palette Systems**
   - Consolidate ImagePaletteContext into ThemeContext
   - Unify DynamicPalette and ImagePalette types
   - Remove duplicate color extraction logic
   - Simplify hook interfaces

### Phase 2: Dead Code Removal

4. **Remove Unused Exports**
   - Delete unused Spotify API type definitions
   - Remove unused navigation types
   - Clean up unused utility functions
   - Remove example and demo files

5. **Clean Development Artifacts**
   - Replace console.log with proper logging service
   - Remove console.warn/error statements
   - Delete commented-out code blocks
   - Remove TODO comments that are obsolete

### Phase 3: Component Simplification

6. **Consolidate Themed Components**
   - Review 8 themed components for overlap
   - Merge similar styling patterns
   - Create shared base component utilities
   - Reduce component file sizes

7. **Simplify Hook Architecture**
   - Reduce complexity in useThemeMode (236 lines)
   - Remove rarely-used hook utilities
   - Consolidate theme preference management

## Non-Goals (Out of Scope)

- Adding new features or functionality
- Changing the visual design or UX
- Modifying business logic
- Refactoring non-theme related services
- Updating dependencies or packages
- Performance optimizations beyond code reduction

## Technical Considerations

### Migration Strategy

- Create compatibility layer for gradual migration
- Use TypeScript compiler to identify breaking changes
- Maintain backwards compatibility during transition
- Document all breaking changes

### Testing Requirements

- Ensure all existing tests pass after each phase
- Add migration tests for critical paths
- Visual regression testing for themed components
- No reduction in test coverage

### Risk Mitigation

- Create feature flags for major changes
- Implement changes incrementally
- Keep old implementations until new ones are verified
- Document migration path for each consolidation

## Success Metrics

1. **Code Reduction**
   - Target: 1,500-2,000 lines removed
   - Measure: Lines of code before vs after
   - Tool: cloc or similar

2. **File Count Reduction**
   - Target: 10-15 files removed/consolidated
   - Measure: File count in src directory

3. **Build Performance**
   - Target: 10-15% faster build times
   - Measure: Average build time over 10 runs

4. **Developer Experience**
   - Target: Reduced confusion about which system to use
   - Measure: Developer survey/feedback

5. **Type Safety**
   - Target: No increase in TypeScript errors
   - Measure: tsc --noEmit output

## Implementation Priority

### Immediate (Week 1)

1. Theme color system consolidation
2. Spacing system unification
3. Remove unused Spotify API types

### Short-term (Week 2)

4. Merge image palette systems
5. Clean up console statements
6. Remove unused exports

### Medium-term (Week 3)

7. Simplify themed components
8. Consolidate hook architecture
9. Final cleanup and documentation

## Specific File Actions

### Files to Delete Completely

- `src/theme/styles/index.ts` (32 lines)
- `src/context/ImagePaletteContext/index.tsx` (43 lines)
- `App.theme.example.tsx`
- Unused test utilities

### Files to Significantly Reduce

- `src/types/spotify-api.ts` (1,747 lines → ~800 lines)
- `src/theme/colors/semanticColors.ts` (539 lines → ~300 lines)
- `src/services/theme/colorExtraction.ts` (753 lines → ~500 lines)
- `src/hooks/useThemeMode.tsx` (236 lines → ~150 lines)

### Files to Merge

- Color scale generators → Single utility
- Image palette hooks → Theme context
- Spacing definitions → Single source

## Open Questions

1. Should we maintain any backwards compatibility for the old theme system?
2. Are there any external dependencies on the unused Spotify types?
3. Should console statements be replaced with a logging service or removed entirely?
4. Is there a preference for the migration timeline (aggressive vs conservative)?
5. Should we add automated checks to prevent future tech debt accumulation?

## Next Steps

1. Review and approve this PRD
2. Create detailed task list from requirements
3. Set up metrics baseline before starting
4. Begin Phase 1 implementation
5. Regular progress reviews after each phase

## Estimated Impact

- **Lines removed:** 1,500-2,000 (12-16% reduction)
- **Files removed:** 10-15
- **Build time improvement:** 10-15%
- **Maintenance effort:** 30-40% reduction for theme-related changes
- **Developer onboarding:** 50% faster for understanding theme system
