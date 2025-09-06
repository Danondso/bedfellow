# PR #118 Feedback Tasks

**PR Title:** tech: spotify domain hook  
**Date:** 2025-09-04  
**Status:** OPEN

## Summary of Feedback

PR refactors Spotify integration with new domain-specific `useSpotify` hook. Copilot provided 4 code improvement suggestions, and reviewer noted 1 optimization opportunity.

## Critical Issues (Must Fix)

_No critical issues found - build is passing_

## Code Quality Improvements (Should Fix)

### 1. Replace @ts-ignore with proper type assertion

- **File:** `src/screens/CurrentTrack/index.tsx` (line 60)
- **Issue:** Using `@ts-ignore` suppresses TypeScript type checking
- **Suggestion:** Use type assertion with `as SpotifyApi.TrackObjectFull`
- [ ] 1.1 Review the type issue in CurrentTrack/index.tsx
- [ ] 1.2 Replace @ts-ignore with proper type assertion
- [ ] 1.3 Verify TypeScript compilation passes

### 2. Add strict typing for playback actions

- **File:** `src/hooks/spotify/usePlayer.ts` (line 40)
- **Issue:** Action parameter typed as generic `string`
- **Suggestion:** Create union type `'play' | 'pause' | 'forward' | 'backward'`
- [ ] 2.1 Create PlaybackAction type union
- [ ] 2.2 Update playbackWrapper function signature
- [ ] 2.3 Update all action calls to use the new type
- [ ] 2.4 Verify type safety throughout

### 3. Fix optimistic state updates in play/pause

- **File:** `src/hooks/spotify/usePlayer.ts` (lines 45-51)
- **Issue:** `isPaused` state set before API call completes - inconsistent if fails
- **Suggestion:** Set state after API success or handle errors properly
- [ ] 3.1 Review current pause/play implementation
- [ ] 3.2 Implement try-catch with proper error handling
- [ ] 3.3 Update state only after successful API call
- [ ] 3.4 Test error scenarios

### 4. URL encode search query parameter

- **File:** `src/hooks/spotify/useGetSearch.ts` (line 29)
- **Issue:** Query parameter not URL-encoded - could cause malformed URLs
- **Suggestion:** Use `encodeURIComponent(query)`
- [ ] 4.1 Add encodeURIComponent to search query
- [ ] 4.2 Test with special characters in search
- [ ] 4.3 Verify search still works correctly

## Enhancements (Nice to Have)

### 5. Remove unnecessary refreshTrack prop

- **File:** `src/components/player/FloatingPlayer.tsx` (line 8)
- **Issue:** Component accepts refreshTrack prop but uses hook internally
- **Suggestion:** Remove the prop since it's not needed
- [ ] 5.1 Remove refreshTrack prop from interface
- [ ] 5.2 Remove prop from component signature
- [ ] 5.3 Update all FloatingPlayer usages
- [ ] 5.4 Verify player still functions correctly

## Testing Checklist

- [ ] Run TypeScript compilation: `yarn tsc`
- [ ] Run lint checks: `yarn lint`
- [ ] Run tests: `yarn test`
- [ ] Manual test: Spotify playback controls
- [ ] Manual test: Search functionality with special characters
- [ ] Manual test: Error handling scenarios

## Notes

- All suggestions from Copilot focus on type safety and error handling
- No breaking changes or security issues identified
- PR is mostly ready to merge after addressing type improvements
