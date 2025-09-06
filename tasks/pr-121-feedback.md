# PR #121 Feedback Tasks

**PR Title:** feat: premium indicator  
**URL:** https://github.com/Danondso/bedfellow/pull/121  
**Status:** OPEN

## Summary

Copilot reviewed the PR that adds a premium status indicator to the Settings screen. The feedback includes improving error messages and fixing React hook dependencies.

## Code Quality Issues

### 1. Improve error message clarity

**Priority:** Quality (Should Fix)  
**Location:** src/hooks/spotify/useProfile.ts line 18  
**Comment:** "The error message should be more descriptive and provide guidance on how to resolve the issue"

- [ ] 1.0 Make error message more descriptive
  - [ ] 1.1 Update error message to: 'Authentication token is required to fetch user profile. Please ensure you are logged in to Spotify.'
  - [ ] 1.2 Test error handling with updated message

### 2. Fix useEffect missing dependency

**Priority:** Quality (Should Fix)  
**Location:** src/hooks/spotify/useProfile.ts lines 33-37  
**Comment:** "The useEffect has a missing dependency. The `getData` function should be included in the dependency array or wrapped with useCallback to prevent potential stale closure issues."

- [ ] 2.0 Fix React hook dependency issue
  - [ ] 2.1 Wrap getData function with useCallback
  - [ ] 2.2 Add getData to useEffect dependency array
  - [ ] 2.3 Test that profile fetching still works correctly
  - [ ] 2.4 Ensure no infinite re-renders occur

## Implementation Plan

### Task 1: Improve Error Message

The current error message "No access token available" is too generic. Should provide more context about authentication requirements.

**File to modify:**

- `src/hooks/spotify/useProfile.ts`

### Task 2: Fix React Hook Dependencies

The getData function is being called in useEffect but not included in dependencies, which could lead to stale closures.

**File to modify:**

- `src/hooks/spotify/useProfile.ts`

## Notes

- All comments are from Copilot's automated review
- No critical/blocking issues found
- Focus is on improving code quality and preventing potential React issues
